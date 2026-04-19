/* ══════════════════════════════════════════════════
   MINI MARKDOWN PARSER
══════════════════════════════════════════════════ */
function md2html(src) {
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const inl = s => {
    s = esc(s);
    return s
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/`(.+?)`/g,'<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
  };

  // tables
  src = src.replace(/((?:\|.+\|\n){2,})/g, blk => {
    const rows = blk.trim().split('\n').filter(r => !/^[\s|:-]+$/.test(r));
    if (rows.length < 2) return blk;
    const hd = rows[0].split('|').slice(1,-1).map(c=>`<th>${inl(c.trim())}</th>`).join('');
    const bd = rows.slice(1).map(r=>'<tr>'+r.split('|').slice(1,-1).map(c=>`<td>${inl(c.trim())}</td>`).join('')+'</tr>').join('');
    return `<div style="overflow-x:auto;margin:1.4rem 0"><table><thead><tr>${hd}</tr></thead><tbody>${bd}</tbody></table></div>`;
  });
  src = src.replace(/^---+$/gm,'<hr>');
  src = src.replace(/^#{4}\s+(.+)$/gm,(_,t)=>`<h4>${inl(t)}</h4>`);
  src = src.replace(/^#{3}\s+(.+)$/gm,(_,t)=>`<h3>${inl(t)}</h3>`);
  src = src.replace(/^#{2}\s+(.+)$/gm,(_,t)=>`<h2>${inl(t)}</h2>`);
  src = src.replace(/^#{1}\s+(.+)$/gm,(_,t)=>`<h1>${inl(t)}</h1>`);
  src = src.replace(/((?:^>.*\n?)+)/gm, blk => {
    return `<blockquote><p>${inl(blk.replace(/^>\s?/gm,'').trim())}</p></blockquote>\n`;
  });
  src = src.replace(/((?:^[-*+]\s.+\n?)+)/gm, blk => {
    return '<ul>'+blk.trim().split('\n').map(l=>`<li>${inl(l.replace(/^[-*+]\s/,''))}</li>`).join('')+'</ul>\n';
  });
  src = src.replace(/((?:^\d+\.\s.+\n?)+)/gm, blk => {
    return '<ol>'+blk.trim().split('\n').map(l=>`<li>${inl(l.replace(/^\d+\.\s/,''))}</li>`).join('')+'</ol>\n';
  });
  /* Normalizuje granice bloków HTML, żeby parser akapitów nie wyświetlał tagów jako tekstu. */
  src = src
    .replace(/([^\n])\n(<(?:h[1-4]|blockquote|ul|ol|pre|div|hr)\b[^>]*>)/g, '$1\n\n$2')
    .replace(/(<\/(?:h[1-4]|blockquote|ul|ol|pre|div)>|<hr>)\n?(?=\S)/g, '$1\n\n');
  src = src.split('\n\n').map(blk => {
    blk = blk.trim();
    if (!blk) return '';
    if (/^<[a-z]/.test(blk)) return blk;
    return `<p>${inl(blk.replace(/\n/g,' '))}</p>`;
  }).join('\n');
  return src;
}

/* ══════════════════════════════════════════════════
   PAGE MAP & ROUTING
══════════════════════════════════════════════════ */
var pageMap = new Map();
var mdCache = new Map();
var emptyArticles = new Set();   /* IDs of articles whose files są puste lub niedostępne. */
var testAnswers = [];
var testCurrentIndex = 0;
var testAttemptState = { started: false, completed: false };
var theoreticalTestState = null;
var current = null;
const MOBILE_BREAKPOINT = 900; /* matches CSS @media(max-width:900px) */
const SPECIALIZATION_TEST_COUNTER_KEY = 'psyhub-specialization-test-counter';
const RECENT_PAGES_KEY = 'psyhub-recent-pages';
const RECENT_PAGES_LIMIT = 5;

/* Zwraca klucz daty (YYYY-MM-DD) w lokalnej strefie użytkownika do licznika dziennego. */
function getTodayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* Odczytuje licznik z localStorage i zwraca bezpieczny obiekt z wartościami domyślnymi. */
function readSpecializationTestCounter() {
  try {
    const raw = localStorage.getItem(SPECIALIZATION_TEST_COUNTER_KEY);
    if (!raw) return { totalCompleted: 0, byDate: {} };
    const parsed = JSON.parse(raw);
    const totalCompleted = Number.isFinite(parsed?.totalCompleted) ? parsed.totalCompleted : 0;
    const byDate = (parsed && typeof parsed.byDate === 'object' && parsed.byDate) ? parsed.byDate : {};
    return { totalCompleted, byDate };
  } catch (_) {
    return { totalCompleted: 0, byDate: {} };
  }
}

/* Zapisuje zaktualizowany licznik wszystkich i dziennych ukończeń testu specjalizacji. */
function writeSpecializationTestCounter(counter) {
  localStorage.setItem(SPECIALIZATION_TEST_COUNTER_KEY, JSON.stringify(counter));
}

/* Rejestruje zakończone podejście dokładnie raz na jedno przejście testu. */
function registerCompletedSpecializationAttempt() {
  if (testAttemptState.completed) return;
  const counter = readSpecializationTestCounter();
  const todayKey = getTodayDateKey();
  counter.totalCompleted += 1;
  counter.byDate[todayKey] = (counter.byDate[todayKey] || 0) + 1;
  writeSpecializationTestCounter(counter);
  testAttemptState.completed = true;
}

/* Odczytuje listę ostatnio odwiedzonych stron i filtruje niepoprawne wpisy. */
function readRecentPages() {
  try {
    const raw = localStorage.getItem(RECENT_PAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(id => typeof id === 'string' && pageMap.has(id))
      .slice(0, RECENT_PAGES_LIMIT);
  } catch (_) {
    return [];
  }
}

/* Zapisuje listę ostatnio odwiedzonych stron w localStorage. */
function writeRecentPages(ids) {
  localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(ids.slice(0, RECENT_PAGES_LIMIT)));
}

/* Dodaje stronę do historii ostatnich wizyt, przenosząc ją na początek listy. */
function addRecentPage(id) {
  if (!id || !pageMap.has(id)) return;
  const deduped = [id, ...readRecentPages().filter(existingId => existingId !== id)];
  writeRecentPages(deduped);
}

/* Zwraca kolejną stronę w tym samym dziale jako proponowany „następny krok”. */
function getNextStepItem(id) {
  const activeId = id || SITE_CONFIG.defaultPage;
  const activeItem = pageMap.get(activeId);
  if (!activeItem) return null;
  const section = SITE_CONFIG.nav.find(sec => sec.section === activeItem.section);
  if (!section) return null;
  const idx = section.items.findIndex(item => item.id === activeId);
  if (idx < 0) return section.items[0] || null;
  return section.items[idx + 1] || null;
}

/* Aktualizuje skrót „następny krok” w topbarze zależnie od bieżącej strony. */
function updateTopbarNextStep(id) {
  const host = document.getElementById('topbarNextStep');
  if (!host) return;
  const nextItem = getNextStepItem(id);
  if (!nextItem) {
    host.innerHTML = `<button type="button" class="next-step-btn" onclick="navigate('students/testy_teoretyczne')">
      <span class="next-step-label">Następny krok</span>
      <span class="next-step-title">Sprawdź się testem</span>
    </button>`;
    return;
  }
  host.innerHTML = `<button type="button" class="next-step-btn" onclick="navigate('${q(nextItem.id)}')">
    <span class="next-step-label">Następny krok</span>
    <span class="next-step-title">${q(nextItem.label)}</span>
  </button>`;
}

function buildPageMap() {
  for (const sec of SITE_CONFIG.nav)
    for (const item of sec.items)
      pageMap.set(item.id, {
        ...item,
        section: sec.section,
        /* Jawny domainKey z konfiguracji ma pierwszeństwo; fallback utrzymuje kompatybilność starszych wpisów. */
        domainKey: item.domainKey || sec.domainKey || inferDomainKeyFromId(item.id),
      });
}

/* Wyznacza klucz dziedziny z identyfikatora strony jako mechanizm zgodności wstecznej. */
function inferDomainKeyFromId(id) {
  return typeof id === 'string' ? (id.split('/')[0] || '') : '';
}

/* Zwraca klucz dziedziny wpisu z preferencją dla jawnego domainKey. */
function getDomainKeyForItem(id, item) {
  return item?.domainKey || pageMap.get(id)?.domainKey || inferDomainKeyFromId(id);
}

/* Weryfikuje konfigurację nav i ostrzega o sekcjach bez jawnego domainKey. */
function warnAboutMissingDomainKeys() {
  if (!Array.isArray(SITE_CONFIG?.nav)) return;
  SITE_CONFIG.nav.forEach(section => {
    if (!section?.domainKey) {
      console.warn(`[PsyHub] Sekcja "${section?.section || 'bez nazwy'}" nie ma przypisanego domainKey.`);
    }
  });
}

/* ── Empty article indicator refresh ──────── */
const EMPTY_BANNER_HTML = `<div class="empty-banner"><span class="empty-banner-icon">⚠</span><div class="empty-banner-text">Artykuł jeszcze nie zawiera treści — zostanie uzupełniony wkrótce.</div></div>`;

function isBodyEmpty(text) {
  const h1m = text.match(/^#\s+(.+)$/m);
  const body = h1m ? text.slice(text.indexOf(h1m[0]) + h1m[0].length) : text;
  return !body.trim();
}

function updateEmptyIndicators() {
  emptyArticles.forEach(id => {
    document.querySelectorAll(`.art-card[data-artid="${id}"]`).forEach(el => {
      if (el.classList.contains('is-empty')) return;
      el.classList.remove('live','xlink','wiki','planned');
      el.classList.add('is-empty');
      const dot = el.querySelector('.art-dot');
      if (dot) dot.className = 'art-dot is-empty';
      const badge = el.querySelector('.art-badge');
      if (badge) { badge.className = 'art-badge is-empty'; badge.textContent = 'pusty'; }
    });
    document.querySelectorAll(`.plan-item[data-artid="${id}"]`).forEach(el => {
      if (el.classList.contains('is-empty')) return;
      el.classList.remove('live','planned');
      el.classList.add('is-empty');
      const dot = el.querySelector('.plan-dot');
      if (dot) dot.className = 'plan-dot is-empty';
      const badge = el.querySelector('.plan-badge');
      if (badge) { badge.className = 'plan-badge is-empty'; badge.textContent = 'pusty'; }
    });
  });
}

/* ── Sidebar rendering ─────────────────────── */
function renderSidebar() {
  const nav = document.getElementById('sidebarNav');
  const active = current || SITE_CONFIG.defaultPage;
  const activeItem = pageMap.get(active);
  const activeSec  = activeItem ? activeItem.section : null;
  let html = '';
  /* Buduje semantyczną strukturę nawigacji z poprawnymi atrybutami ARIA dla każdej grupy. */
  SITE_CONFIG.nav.forEach((sec, secIndex) => {
    const open = sec.section === activeSec;
    const panelId = `nav-group-panel-${secIndex}`;
    const triggerId = `nav-group-trigger-${secIndex}`;
    html += `<div class="nav-group${open?' open':''}" data-sec="${q(sec.section)}">`;
    html += `<button type="button" id="${triggerId}" class="nav-group-hdr" data-action="toggle-group" aria-expanded="${open ? 'true' : 'false'}" aria-controls="${panelId}">`;
    html += `<span class="ng-label">${sec.section}</span>`;
    html += `<svg class="ng-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;
    html += `</button><div class="nav-items" id="${panelId}" role="group" aria-labelledby="${triggerId}">`;
    for (const item of sec.items) {
      if (item.href) {
        html += `<a class="nav-item nav-item-external" href="${q(item.href)}" target="_blank" rel="noopener noreferrer">${item.label} ↗</a>`;
      } else {
        const cls = ['nav-item', item.wiki?'is-wiki':'', item.kind === 'test' ? 'nav-item-test' : '', item.id===active?'is-active':''].filter(Boolean).join(' ');
        html += `<button type="button" class="${cls} nav-item-btn" data-action="navigate" data-id="${item.id}">${item.label}</button>`;
      }
    }
    html += `</div></div>`;
  });
  nav.innerHTML = html;
}
function q(s){ return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;') }

function toggleGroup(group) {
  /* Przełącza jedną grupę i synchronizuje stan aria-expanded wszystkich nagłówków. */
  if (!group) return;
  const isOpen = group.classList.contains('open');
  document.querySelectorAll('.nav-group').forEach(g => {
    g.classList.remove('open');
    const btn = g.querySelector('.nav-group-hdr');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    group.classList.add('open');
    const btn = group.querySelector('.nav-group-hdr');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

function setActive(id) {
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('is-active', el.dataset.id === id)
  );
  const el = document.querySelector(`.nav-item[data-id="${id}"]`);
  if (el) {
    const group = el.closest('.nav-group');
    document.querySelectorAll('.nav-group').forEach(g => {
      g.classList.remove('open');
      const btn = g.querySelector('.nav-group-hdr');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    group?.classList.add('open');
    const btn = group?.querySelector('.nav-group-hdr');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    el.scrollIntoView({ block:'nearest', behavior:'smooth' });
  }
}

/* Obsługuje kliknięcia i skróty klawiaturowe dla elementów sidebaru przez delegację zdarzeń. */
function setupSidebarInteractions() {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  nav.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]');
    if (!control || !nav.contains(control)) return;

    if (control.dataset.action === 'toggle-group') {
      const group = control.closest('.nav-group');
      toggleGroup(group);
      return;
    }

    if (control.dataset.action === 'navigate') {
      navigate(control.dataset.id);
    }
  });

  nav.addEventListener('keydown', (event) => {
    const control = event.target.closest('[data-action], .nav-item-external');
    if (!control || !nav.contains(control)) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    if (control.dataset.action === 'toggle-group') {
      toggleGroup(control.closest('.nav-group'));
      return;
    }
    if (control.dataset.action === 'navigate') {
      navigate(control.dataset.id);
      return;
    }
    if (control.matches('.nav-item-external')) {
      control.click();
    }
  });
}

/* ── Navigate ──────────────────────────────── */
function navigate(id, replaceHistory) {
  if (!id) return;
  const item = pageMap.get(id);
  if (!item) return;
  current = id;
  addRecentPage(id);
  if (replaceHistory) history.replaceState({id},'','#'+id);
  else                history.pushState({id},'','#'+id);
  setActive(id);
  updateTopbarNextStep(id);
  closeSidebar();
  if (item.file)       loadMd(id, item);
  else if (item.custom === 'specialization_test') renderSpecializationTest(id, item);
  else if (item.custom === 'daily_psychology')    renderDailyPsychology(id, item);
  else if (item.custom === 'theoretical_test')    renderTheoreticalTest(id, item);
  else if (item.wiki)  renderWiki(id, item.wiki);
  else                 renderHome();
}

/* ── Load markdown ─────────────────────────── */
async function loadMd(id, item) {
  const area = document.getElementById('content');
  area.innerHTML = '<div class="loading"><div class="spinner"></div>Ładowanie…</div>';
  setBreadcrumb(item);
  if (mdCache.has(item.file)) { renderMd(mdCache.get(item.file), id, item); prefetch(id); return; }
  try {
    const r = await fetch(item.file);
    if (!r.ok) throw new Error('HTTP '+r.status);
    const t = await r.text();
    mdCache.set(item.file, t);
    if (isBodyEmpty(t)) { emptyArticles.add(id); updateEmptyIndicators(); }
    renderMd(t, id, item);
    prefetch(id);
  } catch(e) {
    /* file missing — treat as empty stub rather than hard error */
    emptyArticles.add(id);
    updateEmptyIndicators();
    const title = item.label;
    const {prev,next} = prevNext(id);
    const prevB = prev ? `<button class="pnav-btn" onclick="navigate('${prev.id}')"><span>← ${prev.label}</span></button>`
                       : `<button class="pnav-btn" disabled><span>←</span></button>`;
    const nextB = next ? `<button class="pnav-btn" onclick="navigate('${next.id}')"><span>${next.label} →</span></button>`
                       : `<button class="pnav-btn" disabled><span>→</span></button>`;
    const domainKey = getDomainKeyForItem(id, item);
    const planItems = (SITE_CONFIG.plans || {})[domainKey] || [];
    const plansHtml = planItems.length ? renderPlans(planItems, id) : '';
    const measurementToolsHtml = renderMeasurementTools(domainKey, id);
    area.innerHTML = `<div class="rendered">
      <div class="page-hero">
        <span class="chapter-lbl">${item.section||''}</span>
        <h1>${title}</h1>
      </div>
      ${EMPTY_BANNER_HTML}
      ${plansHtml}
      ${measurementToolsHtml}
      <div class="page-nav">${prevB}${nextB}</div>
    </div>`;
    window.scrollTo(0,0);
    animateContentIn();
  }
}

function renderMd(text, id, item) {
  const area = document.getElementById('content');
  // pull h1 out to hero
  const h1m   = text.match(/^#\s+(.+)$/m);
  const title = h1m ? h1m[1] : item.label;
  const body  = h1m ? text.slice(text.indexOf(h1m[0])+h1m[0].length) : text;
  const {prev,next} = prevNext(id);
  const prevB = prev ? `<button class="pnav-btn" onclick="navigate('${prev.id}')"><span>← ${prev.label}</span></button>`
                     : `<button class="pnav-btn" disabled><span>←</span></button>`;
  const nextB = next ? `<button class="pnav-btn" onclick="navigate('${next.id}')"><span>${next.label} →</span></button>`
                     : `<button class="pnav-btn" disabled><span>→</span></button>`;

  // domain plans block
  const domainKey = getDomainKeyForItem(id, item);
  const planItems = (SITE_CONFIG.plans || {})[domainKey] || [];
  const plansHtml = planItems.length ? renderPlans(planItems, id) : '';
  const measurementToolsHtml = renderMeasurementTools(domainKey, id);

  // empty content detection
  const isEmpty = isBodyEmpty(text);
  if (isEmpty) emptyArticles.add(id);
  const emptyBanner = isEmpty ? EMPTY_BANNER_HTML : '';

  area.innerHTML = `<div class="rendered">
    <div class="page-hero">
      <span class="chapter-lbl">${item.section||''}</span>
      <h1>${title}</h1>
    </div>
    ${emptyBanner}
    <div class="md">${md2html(body)}</div>
    ${plansHtml}
    ${measurementToolsHtml}
    <div class="page-nav">${prevB}${nextB}</div>
  </div>`;
  window.scrollTo(0,0);
  document.getElementById('progFill').style.width='0%';
  if (isEmpty) updateEmptyIndicators();
  addKeywordLinksToRenderedArticle(area.querySelector('.md'), id);
  animateContentIn();
}

const testsUI = window.PsyHubTestsUI || null;

function renderSpecializationTest(id, item) {
  if (!testsUI || typeof testsUI.renderSpecializationTest !== 'function') {
    const area = document.getElementById('content');
    area.innerHTML = '<div class="error-box"><h2>Błąd ładowania modułu</h2><p>Nie udało się wczytać interfejsu testów.</p></div>';
    return;
  }
  return testsUI.renderSpecializationTest(id, item);
}

/* ── Daily Psychology renderer ───────────────────── */
let dailySelectedDay = null; /* null = today */

function renderDailyPsychology(id, item) {
  const area = document.getElementById('content');
  setBreadcrumb(item);
  const data = window.DAILY_PSYCHOLOGY;
  if (!data) {
    area.innerHTML = '<div class="error-box"><h2>Błąd ładowania modułu</h2><p>Nie udało się wczytać danych psychologii codziennej.</p></div>';
    return;
  }
  /* Porządek tygodnia w UI zaczynamy od poniedziałku niezależnie od lokalizacji. */
  const WEEK_ORDER_MONDAY_FIRST = [1, 2, 3, 4, 5, 6, 0];
  const sortByMondayFirst = (entries) =>
    [...entries].sort((a, b) => WEEK_ORDER_MONDAY_FIRST.indexOf(a.day) - WEEK_ORDER_MONDAY_FIRST.indexOf(b.day));
  /* Stabilny wybór wariantu na podstawie aktualnej daty i numeru dnia. */
  const pickDailyVariant = (variants, dayNumber) => {
    if (!Array.isArray(variants) || variants.length === 0) return null;
    const dateKey = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seed = Number(dateKey) + (dayNumber * 37);
    return variants[Math.abs(seed) % variants.length];
  };

  const today = new Date().getDay(); /* 0=niedziela … 6=sobota */
  const orderedData = sortByMondayFirst(data);
  const displayDay = (dailySelectedDay !== null) ? dailySelectedDay : today;
  const entry = orderedData.find(e => e.day === displayDay) || orderedData[0];
  const curiosity = pickDailyVariant(entry.curiosityVariants, entry.day) || entry.curiosity;
  const exercise = pickDailyVariant(entry.exerciseVariants, entry.day) || entry.exercise;

  const typeLabels = {
    reflection: 'Refleksja', challenge: 'Wyzwanie', bodyscan: 'Skan ciała',
    writing: 'Pisanie', mindfulness: 'Uważność', social: 'Wyzwanie społeczne', creative: 'Kreatywność'
  };

  const navBtns = orderedData.map(e => {
    const isToday = e.day === today;
    const isActive = e.day === displayDay;
    const todayMark = isToday ? `<span class="daily-today-label">dziś</span>` : '';
    return `<button class="daily-day-btn${isActive ? ' is-active' : ''}" onclick="selectDailyDay(${e.day})">${e.emoji} ${e.dayName}${todayMark}</button>`;
  }).join('');

  const stepsHtml = exercise.steps.map((step, i) =>
    `<li><span class="daily-step-num">${i + 1}</span><span>${step}</span></li>`
  ).join('');

  const bodyParas = curiosity.body.map(p => `<p>${p}</p>`).join('');

  area.innerHTML = `<div class="rendered daily-wrap">
    <div class="page-hero">
      <span class="chapter-lbl">${item.section || ''}</span>
      <h1>Psychologia Codzienna</h1>
      <p class="lead">Codzienna dawka wiedzy psychologicznej i pracy nad sobą — zależnie od dnia tygodnia.</p>
    </div>
    <div class="daily-nav">${navBtns}</div>
    <div class="daily-day-badge">${entry.emoji} ${entry.dayName}</div>
    <div class="daily-theme">Temat dnia: <strong>${entry.theme}</strong></div>

    <div class="daily-card">
      <div class="daily-card-hdr">
        <span class="daily-card-icon">🧠</span>
        <span class="daily-card-label curiosity">Ciekawostka psychologiczna</span>
      </div>
      <div class="daily-card-title">${curiosity.title}</div>
      <div class="daily-card-lead">${curiosity.lead}</div>
      <div class="daily-card-body">${bodyParas}</div>
    </div>

    <div class="daily-card">
      <div class="daily-card-hdr">
        <span class="daily-card-icon">✏️</span>
        <span class="daily-card-label exercise">Praca nad sobą</span>
      </div>
      <div class="daily-card-title">${exercise.title}</div>
      <span class="daily-exercise-type ${exercise.type}">${typeLabels[exercise.type] || exercise.type}</span>
      <div class="daily-card-lead">${exercise.intro}</div>
      <ol class="daily-steps">${stepsHtml}</ol>
    </div>
  </div>`;
  window.scrollTo(0, 0);
  animateContentIn();
}

window.selectDailyDay = function(day) {
  dailySelectedDay = day;
  if (current === 'students/psychologia_codziennej') {
    renderDailyPsychology(current, pageMap.get(current));
  }
};

/* ── Theoretical Test renderer ──────────────────────── */

function renderTheoreticalTest(id, item) {
  if (!testsUI || typeof testsUI.renderTheoreticalTest !== 'function') {
    const area = document.getElementById('content');
    area.innerHTML = '<div class="error-box"><h2>Błąd ładowania modułu</h2><p>Nie udało się wczytać interfejsu testów.</p></div>';
    return;
  }
  return testsUI.renderTheoreticalTest(id, item);
}

/* plan list for a domain */
function renderPlans(items, currentId) {
  const rows = items.map(it => {
    const fileId = it.file ? it.file.replace('wiki/','').replace('.md','') : null;
    const isEmpty = fileId && emptyArticles.has(fileId);
    const effectiveStatus = isEmpty ? 'is-empty' : (it.status === 'planned' ? 'is-disabled' : it.status);
    const cls    = ['plan-item', effectiveStatus].join(' ');
    const navTo  = fileId ? `onclick="navigate('${fileId}')"` : '';
    const artid  = fileId ? `data-artid="${fileId}"` : '';
    const badge  = isEmpty ? 'pusty' : (it.status==='live' ? 'dostępny' : 'planowany');
    return `<div class="${cls}" ${artid} ${effectiveStatus==='live'||effectiveStatus==='is-empty' ? navTo : ''}>
      <div class="plan-dot ${effectiveStatus}"></div>
      <span class="plan-label">${it.label}</span>
      <span class="plan-badge ${effectiveStatus}">${badge}</span>
    </div>`;
  }).join('');
  return `<div class="plans-section">
    <h2>Artykuły w tym dziale</h2>
    <div class="plans-grid">${rows}</div>
  </div>`;
}

/* Renderuje sekcję narzędzi pomiarowych dla aktualnej dziedziny wraz ze stanem pustym. */
function renderMeasurementTools(domainKey, currentId) {
  const tools = (SITE_CONFIG.measurementToolsByDomain || {})[domainKey];
  if (!Array.isArray(tools) || tools.length === 0) {
    return `<div class="plans-section measurement-tools-section">
      <h2>Narzędzia pomiarowe</h2>
      <div class="plans-empty-state">Spis narzędzi w przygotowaniu</div>
    </div>`;
  }

  const rows = tools.map(tool => {
    const relatedLinks = Array.isArray(tool.articleLinks)
      ? tool.articleLinks.map(articleId => {
          const article = pageMap.get(articleId);
          const label = article?.label || articleId;
          const isCurrent = articleId === currentId;
          if (isCurrent) return `<span class="tool-link is-current">${q(label)}</span>`;
          if (!article) return `<span class="tool-link is-missing">${q(label)}</span>`;
          return `<button type="button" class="tool-link" onclick="navigate('${articleId}')">${q(label)}</button>`;
        }).join('')
      : '<span class="tool-link is-missing">Brak</span>';

    return `<article class="plan-item live measurement-tool-card">
      <div class="plan-dot live"></div>
      <div class="measurement-tool-body">
        <h3 class="measurement-tool-name">${q(tool.name || 'Narzędzie bez nazwy')}</h3>
        <div class="measurement-tool-meta"><strong>Typ:</strong> ${q(tool.type || '—')}</div>
        <div class="measurement-tool-meta"><strong>Mierzone konstrukty:</strong> ${q((tool.constructs || []).join(', ') || '—')}</div>
        <div class="measurement-tool-meta"><strong>Czas badania:</strong> ${q(tool.administrationTime || '—')}</div>
        <div class="measurement-tool-meta"><strong>Grupa docelowa:</strong> ${q(tool.population || '—')}</div>
        <div class="measurement-tool-meta"><strong>Status licencji:</strong> ${q(tool.license || '—')}</div>
        <div class="measurement-tool-links"><strong>Powiązane artykuły:</strong> ${relatedLinks}</div>
      </div>
    </article>`;
  }).join('');

  return `<div class="plans-section measurement-tools-section">
    <h2>Narzędzia pomiarowe</h2>
    <div class="plans-grid measurement-tools-grid">${rows}</div>
  </div>`;
}

function prevNext(id) {
  const all = SITE_CONFIG.nav.flatMap(s => s.items.filter(i => i.file));
  const idx = all.findIndex(i => i.id === id);
  return { prev: idx>0?all[idx-1]:null, next: idx<all.length-1?all[idx+1]:null };
}

function prefetch(id) {
  const {prev,next} = prevNext(id);
  for (const it of [prev,next]) {
    if (it?.file && !mdCache.has(it.file))
      fetch(it.file).then(r=>r.ok?r.text():Promise.reject()).then(t=>{
        mdCache.set(it.file,t);
        if (isBodyEmpty(t)) { emptyArticles.add(it.id); updateEmptyIndicators(); }
      }).catch(()=>{ emptyArticles.add(it.id); updateEmptyIndicators(); });
  }
}

/* ── Wiki index ────────────────────────────── */
function renderWiki(id, wikiKey) {
  const cfg  = SITE_CONFIG.wikis[wikiKey];
  const area = document.getElementById('content');
  if (!cfg) { area.innerHTML=`<div class="error-box"><h2>WIKI nieznana: ${wikiKey}</h2></div>`; return; }
  const item = pageMap.get(id);
  setBreadcrumb({...item, section:'Encyklopedie', label:cfg.title});

  const isGloss = cfg.sections.length===1 && cfg.sections[0].isGlossary;
  let body = isGloss ? renderGlossHTML(cfg.sections[0].entries) : cfg.sections.map(sec=>`
    <div class="wiki-sec">
      <div class="wiki-sec-title">${sec.title}</div>
      <div class="art-grid">${sec.articles.map(artCard).join('')}</div>
    </div>`).join('');

  area.innerHTML = `<div class="rendered">
    <div class="wiki-hdr">
      <span class="chapter-lbl">Encyklopedia</span>
      <h1>${cfg.title}</h1>
      <p class="intro">${cfg.intro}</p>
    </div>
    ${body}
  </div>`;
  window.scrollTo(0,0);
  updateEmptyIndicators();
  animateWikiIn();
}

function artCard(art) {
  const isEmpty = art.id && emptyArticles.has(art.id);
  const effectiveStatus = isEmpty ? 'is-empty' : (art.status === 'planned' ? 'is-disabled' : art.status);
  const lbl = {live:'dostępny','is-disabled':'planowany',wiki:'wiki',xlink:'wspólny ↗','is-empty':'pusty'};
  const clickable = (isEmpty || art.status==='live'||art.status==='wiki'||art.status==='xlink') && art.id;
  const click = clickable ? `onclick="navigate('${art.id}')"` : '';
  const artid = art.id ? `data-artid="${art.id}"` : '';
  const desc = art.desc ? `<div class="art-desc">${art.desc}</div>` : '';
  return `<div class="art-card ${effectiveStatus}" ${artid} ${click}>
    <div class="art-dot ${effectiveStatus}"></div>
    <div class="art-body"><div class="art-lbl">${art.label}</div>${desc}</div>
    <span class="art-badge ${effectiveStatus}">${lbl[effectiveStatus]||effectiveStatus}</span>
  </div>`;
}

/* ── Glossary ──────────────────────────────── */
function renderGlossHTML(entries) {
  const groups = {};
  for (const e of entries) { const l=e.term[0].toUpperCase(); (groups[l]=groups[l]||[]).push(e); }
  const letters = Object.keys(groups).sort();
  const btns = ['Wszystkie',...letters].map(l=>
    `<button class="gloss-btn${l==='Wszystkie'?' is-active':''}" onclick="filterGloss('${l}')">${l}</button>`
  ).join('');
  const content = letters.map(l=>`
    <div class="gloss-group" data-letter="${l}">
      <div class="gloss-letter">${l}</div>
      ${groups[l].map(e=>`
        <div class="gloss-entry">
          <div class="gloss-term">${e.term}${e.link?`<span class="gloss-go" onclick="navigate('${e.link}')">→ artykuł</span>`:''}</div>
          <div class="gloss-def">${e.def}</div>
        </div>`).join('')}
    </div>`).join('');
  return `<div class="gloss-filter">${btns}</div><div id="glossGroups">${content}</div>`;
}
window.filterGloss = function(l){
  document.querySelectorAll('.gloss-btn').forEach(b=>b.classList.toggle('is-active',b.textContent===l));
  document.querySelectorAll('.gloss-group').forEach(g=>{ g.style.display=(l==='Wszystkie'||g.dataset.letter===l)?'':'none'; });
};

/* ── Home ──────────────────────────────────── */
function renderHome() {
  const area = document.getElementById('content');
  setBreadcrumb(null);
  const totalMd   = SITE_CONFIG.nav.flatMap(s=>s.items).filter(i=>i.file).length;
  const totalWiki = Object.keys(SITE_CONFIG.wikis).length;
  const excludedSections = new Set(SITE_CONFIG.catalogExcludedSections || ['Encyklopedie', 'Referencje', 'Wprowadzenie']);
  const domains   = SITE_CONFIG.nav.filter(s => !excludedSections.has(s.section));
  const totalPlan = Object.values(SITE_CONFIG.plans||{}).flat().filter(p=>p.status==='planned').length;

  const icons = {'Neurobiologia':'🧬','Funkcje Poznawcze':'🧩','Zaburzenia Kliniczne':'⚕️',
    'Dla Studentów':'🎓',
    'Przypadki Kliniczne':'📋','Diagnostyka':'📊','Psychometria':'📏','Farmakologia':'💊',
    'Różnice Indywidualne':'👤','Temperament':'🌡️','Emocje i Motywacja':'❤️',
    'Biologiczne Podstawy':'🔬','Psychoterapia':'🛋️','Psychopatologia':'🔍',
    'Suicydologia':'🆘','Seksuologia':'💜','Arteterapia':'🎨','Animaloterapia':'🐾'};
  const cards = domains.map(sec=>{
    const cnt = sec.items.filter(i=>i.file).length;
    const navId = sec.items[0]?.id||'';
    return `<div class="domain-card" onclick="navigate('${navId}')">
      <div class="d-icon">${icons[sec.section]||'📖'}</div>
      <div class="d-name">${sec.section}</div>
      <span class="d-count">${cnt} art.</span>
    </div>`;
  }).join('');

  /* Karty scenariuszy kierujące od razu do konkretnych modułów z SITE_CONFIG.nav. */
  const startScenarios = [
    {
      title: 'Nauka od podstaw',
      id: 'intro/definicja',
      emoji: '📘',
      goal: 'Zacznij od fundamentów psychologii.',
      benefit: 'W 10 minut zbudujesz kontekst do dalszej nauki.'
    },
    {
      title: 'Sprawdź się testem',
      id: 'students/testy_teoretyczne',
      emoji: '🧪',
      goal: 'Zweryfikuj, co już pamiętasz.',
      benefit: 'Szybko zobaczysz luki i priorytety nauki.'
    },
    {
      title: 'Szybka powtórka',
      id: 'students/psychologia_codziennej',
      emoji: '⚡',
      goal: 'Powtórz jedną małą porcję wiedzy.',
      benefit: 'Utrzymasz regularność bez długiej sesji.'
    },
    {
      title: 'Przejrzyj Wiki',
      id: 'wiki-index/slownik',
      emoji: '🧭',
      goal: 'Znajdź temat lub termin w kilka sekund.',
      benefit: 'Skrócisz czas szukania potrzebnej informacji.'
    }
  ];
  const startCardsHtml = startScenarios
    .filter(scenario => pageMap.has(scenario.id))
    .map(scenario => `<button type="button" class="start-card" onclick="navigate('${scenario.id}')">
      <span class="start-card-icon">${scenario.emoji}</span>
      <span class="start-card-title">${scenario.title}</span>
      <span class="start-card-goal">${scenario.goal}</span>
      <span class="start-card-benefit">${scenario.benefit}</span>
    </button>`)
    .join('');

  /* Renderuje komponent „Ostatnio odwiedzane” na podstawie localStorage. */
  const recentItems = readRecentPages()
    .filter(id => id !== '__home__')
    .slice(0, RECENT_PAGES_LIMIT)
    .map(id => pageMap.get(id))
    .filter(Boolean);
  const recentHtml = recentItems.length
    ? `<div class="recent-list">${recentItems.map(item => `<button type="button" class="recent-link" onclick="navigate('${item.id}')">
        <span class="recent-section">${item.section || 'PsyHub'}</span>
        <span class="recent-title">${item.label}</span>
      </button>`).join('')}</div>`
    : `<p class="recent-empty">Tu pojawią się ostatnio otwierane strony. Zacznij od jednej karty „Start tutaj”.</p>`;

  area.innerHTML = `<div class="rendered">
    <div class="home-hero">
      <div class="home-eyebrow">Portal Wiedzy Psychologicznej</div>
      <h1>Witaj w <span>PsyHub</span></h1>
      <p>Wybierz ścieżkę i zacznij od razu. Krótkie kroki pomogą Ci uczyć się szybciej i z mniejszym stresem.</p>
      <div class="home-stats">
        <div><div class="stat-val">${totalMd}</div><div class="stat-lbl">Artykułów</div></div>
        <div><div class="stat-val">${totalPlan}</div><div class="stat-lbl">Zaplanowanych</div></div>
        <div><div class="stat-val">${totalWiki}</div><div class="stat-lbl">Encyklopedii</div></div>
        <div><div class="stat-val">${domains.length}</div><div class="stat-lbl">Działów</div></div>
      </div>
    </div>
    <section class="home-block">
      <div class="home-block-head">
        <h2>Start tutaj</h2>
        <p>Wybierz scenariusz dopasowany do celu na teraz.</p>
      </div>
      <div class="start-grid">${startCardsHtml}</div>
    </section>
    <section class="home-block">
      <div class="home-block-head">
        <h2>Ostatnio odwiedzane</h2>
        <p>Wróć do materiałów, które już przeglądałeś.</p>
      </div>
      ${recentHtml}
    </section>
    <div><div class="domains-h2">Działy tematyczne</div><div class="domain-grid">${cards}</div></div>
  </div>`;
  window.scrollTo(0,0);
  animateHomeCards();
}

/* ── Breadcrumb ────────────────────────────── */
function setBreadcrumb(item) {
  const bc = document.getElementById('breadcrumb');
  if (!item) {
    bc.innerHTML = `<a onclick="navigate(SITE_CONFIG.defaultPage)">PsyHub</a>`;
    updateTopbarNextStep(SITE_CONFIG.defaultPage);
    return;
  }
  const s  = item?.section||'';
  const l  = item?.label||'';
  let sHtml = '';
  if (s) {
    const sec = SITE_CONFIG.nav.find(n => n.section === s);
    const firstId = sec?.items?.[0]?.id;
    sHtml = firstId
      ? `<span class="bsep">/</span><a onclick="navigate('${firstId}')">${s}</a>`
      : `<span class="bsep">/</span><span>${s}</span>`;
  }
  bc.innerHTML = `<a onclick="navigate(SITE_CONFIG.defaultPage)">PsyHub</a>`
    + sHtml
    +(l?`<span class="bsep">/</span><span class="bcur">${l}</span>`:'');
  updateTopbarNextStep(item.id);
}

/* ── Search ────────────────────────────────── */
const SEARCH_UI_STATE_KEY = 'psyhub-search-ui-state';
let searchIndex = [];
let keywordLinkIndex = new Map();
const searchUiState = { query: '', filters: { tests: false, wiki: false, beginner: false } };

/* Standaryzuje tokeny tekstowe, żeby ranking działał stabilnie dla polskich znaków i wielkości liter. */
function normalizeSearchText(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Buduje indeks wyszukiwania oparty o metadane sekcji i elementu nawigacji. */
function rebuildSearchIndex() {
  searchIndex = SITE_CONFIG.nav.flatMap(sec => sec.items)
    .filter(item => !item.href)
    .map(item => ({
      ...item,
      section: item.section || pageMap.get(item.id)?.section || '',
      normalizedLabel: normalizeSearchText(item.label),
      normalizedSection: normalizeSearchText(item.section || pageMap.get(item.id)?.section || ''),
      normalizedKeywords: (item.keywords || []).map(normalizeSearchText),
      normalizedType: normalizeSearchText(item.type || ''),
      normalizedLevel: normalizeSearchText(item.level || ''),
    }));

  /* Tworzy indeks słów kluczowych -> ID artykułu dla szybkiego linkowania wewnątrz treści. */
  keywordLinkIndex = new Map();
  searchIndex.forEach(entry => {
    const phrases = [entry.label, ...(entry.keywords || [])]
      .map(value => String(value || '').trim())
      .filter(value => value.length >= 4);
    phrases.forEach(phrase => {
      const normalized = normalizeSearchText(phrase);
      if (!normalized || keywordLinkIndex.has(normalized)) return;
      keywordLinkIndex.set(normalized, entry.id);
    });
  });
}

/* Ocenia wynik na podstawie dopasowań tytułu, sekcji i tagów słów kluczowych. */
function scoreSearchItem(entry, queryTokens) {
  let score = 0;
  queryTokens.forEach(token => {
    if (!token) return;
    if (entry.normalizedLabel === token) score += 16;
    else if (entry.normalizedLabel.startsWith(token)) score += 11;
    else if (entry.normalizedLabel.includes(token)) score += 8;

    if (entry.normalizedSection.includes(token)) score += 4;
    if (entry.normalizedType.includes(token)) score += 3;
    if (entry.normalizedKeywords.some(keyword => keyword.includes(token))) score += 7;
  });
  return score;
}

/* Filtruje wyniki według aktywnych skrótów, zachowując stan UI między odświeżeniami. */
function matchesActiveFilters(entry) {
  if (searchUiState.filters.tests && entry.type !== 'test') return false;
  if (searchUiState.filters.wiki && entry.type !== 'wiki') return false;
  if (searchUiState.filters.beginner && entry.level !== 'beginner') return false;
  return true;
}

/* Renderuje etykiety kontekstowe przy wynikach, żeby użytkownik szybciej rozpoznał kontekst. */
function renderSearchMetaTags(entry) {
  const typeLabelMap = { article: 'artykuł', wiki: 'wiki', test: 'test' };
  const safeSection = q(entry.section || 'Inne');
  const safeType = q(typeLabelMap[entry.type] || entry.type || 'materiał');
  const typeCls = entry.type ? `type-${entry.type}` : '';
  return `<span class="s-search-item-meta">
    <span class="s-search-tag">${safeSection}</span>
    <span class="s-search-tag ${typeCls}">${safeType}</span>
  </span>`;
}

/* Podpowiada tematy powiązane, gdy nie znaleziono dopasowań do zapytania. */
function getRelatedSearchSuggestions(queryTokens) {
  if (!queryTokens.length) return [];
  const suggestions = searchIndex
    .map(entry => ({ entry, score: scoreSearchItem(entry, queryTokens) }))
    .filter(row => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(row => row.entry);
  return suggestions;
}

/* Odtwarza i zapisuje stan wyszukiwania w localStorage. */
function loadSearchUiState() {
  try {
    const raw = localStorage.getItem(SEARCH_UI_STATE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    searchUiState.query = typeof parsed.query === 'string' ? parsed.query : '';
    searchUiState.filters.tests = Boolean(parsed.filters?.tests);
    searchUiState.filters.wiki = Boolean(parsed.filters?.wiki);
    searchUiState.filters.beginner = Boolean(parsed.filters?.beginner);
  } catch (_) {}
}
function saveSearchUiState() {
  localStorage.setItem(SEARCH_UI_STATE_KEY, JSON.stringify(searchUiState));
}

/* Aktualizuje listę wyników i fallback "Nie znaleziono" wraz z podpowiedziami. */
function applySearchUi() {
  const input = document.getElementById('searchInput');
  const nav = document.getElementById('sidebarNav');
  const results = document.getElementById('searchResults');
  const query = normalizeSearchText(searchUiState.query);
  const queryTokens = query.split(' ').filter(Boolean);
  const hasActiveFilters = Object.values(searchUiState.filters).some(Boolean);
  const hasSearchContext = Boolean(queryTokens.length || hasActiveFilters);

  document.querySelectorAll('.s-filter-btn').forEach(btn => {
    btn.classList.toggle('is-active', searchUiState.filters[btn.dataset.filter]);
  });
  if (input && input.value !== searchUiState.query) input.value = searchUiState.query;

  if (!hasSearchContext) {
    results.classList.remove('is-visible');
    results.innerHTML = '';
    nav.style.display = '';
    renderSidebar();
    return;
  }

  nav.style.display = 'none';
  const ranked = searchIndex
    .filter(matchesActiveFilters)
    .map(entry => ({ entry, score: scoreSearchItem(entry, queryTokens) }))
    .filter(row => queryTokens.length ? row.score > 0 : true)
    .sort((a, b) => b.score - a.score || a.entry.label.localeCompare(b.entry.label, 'pl'));

  if (!ranked.length) {
    const suggestions = getRelatedSearchSuggestions(queryTokens);
    const suggestionHtml = suggestions.length
      ? `<div class="s-empty-suggestions">${suggestions.map(s => `<button type="button" data-id="${q(s.id)}">${q(s.label)}</button>`).join('')}</div>`
      : '';
    results.innerHTML = `<div class="s-search-empty">
      <strong>Nie znaleziono wyników.</strong>
      <div>Spróbuj innej frazy lub skorzystaj z tematów powiązanych:</div>
      ${suggestionHtml}
    </div>`;
    results.classList.add('is-visible');
    return;
  }

  results.innerHTML = ranked.slice(0, 25).map(({ entry }) => `
    <button type="button" class="nav-item nav-item-btn" data-id="${q(entry.id)}">
      <span>${q(entry.label)}</span>
      ${renderSearchMetaTags(entry)}
    </button>
  `).join('');
  results.classList.add('is-visible');
}

/* Podmienia słowa kluczowe na odnośniki do powiązanych artykułów w treści aktualnej strony. */
function addKeywordLinksToRenderedArticle(container, currentId) {
  const currentItem = pageMap.get(currentId);
  if (!currentItem || !container) return;
  const keywords = (currentItem.keywords || []).map(value => String(value || '').trim()).filter(Boolean);
  if (!keywords.length) return;

  const linkTargets = keywords
    .map(keyword => {
      const normalizedKeyword = normalizeSearchText(keyword);
      const targetId = keywordLinkIndex.get(normalizedKeyword);
      if (!targetId || targetId === currentId) return null;
      return { keyword, targetId };
    })
    .filter(Boolean)
    .sort((a, b) => b.keyword.length - a.keyword.length)
    .slice(0, 6);
  if (!linkTargets.length) return;

  /* Escapuje literały RegExp, aby bezpiecznie tworzyć wzorce dla fraz wielowyrazowych. */
  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parentTag = node.parentElement?.tagName;
      if (['A', 'CODE', 'PRE', 'H1', 'H2', 'H3', 'H4'].includes(parentTag)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  let linksLeft = 6;
  textNodes.forEach(textNode => {
    if (linksLeft <= 0) return;
    const original = textNode.nodeValue;
    let replaced = false;
    const fragment = document.createDocumentFragment();
    let remaining = original;

    linkTargets.forEach(({ keyword, targetId }) => {
      if (!remaining || linksLeft <= 0) return;
      const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRegExp(keyword)})(?=$|[^\\p{L}\\p{N}])`, 'iu');
      const match = remaining.match(pattern);
      if (!match) return;
      replaced = true;
      const idx = match.index || 0;
      const prefix = match[1] || '';
      const phrase = match[2] || '';
      fragment.appendChild(document.createTextNode(remaining.slice(0, idx) + prefix));
      const link = document.createElement('a');
      link.href = `#${targetId}`;
      link.textContent = phrase;
      fragment.appendChild(link);
      remaining = remaining.slice(idx + match[0].length);
      linksLeft -= 1;
    });
    if (replaced) {
      fragment.appendChild(document.createTextNode(remaining));
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  });
}

/* ── Sidebar mobile ────────────────────────── */
function openSidebar()  { document.getElementById('sidebar').classList.add('open');  document.getElementById('overlay').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }

/* Rejestruje globalne akcje UI bez inline handlerów, w tym skróty klawiaturowe. */
function setupGlobalInteractions() {
  const logo = document.getElementById('sidebarLogo');
  const overlay = document.getElementById('overlay');
  const menuBtn = document.getElementById('mobileMenuButton');

  logo?.addEventListener('click', () => navigate(SITE_CONFIG.defaultPage));
  menuBtn?.addEventListener('click', openSidebar);
  overlay?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
  });
}

/* Rejestruje obsługę wyszukiwania i skrótów filtrów, utrzymując stan w pamięci i localStorage. */
function setupSearchInteractions() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;

  input.addEventListener('input', (event) => {
    searchUiState.query = event.target.value || '';
    saveSearchUiState();
    applySearchUi();
  });

  document.getElementById('searchFilterShortcuts')?.addEventListener('click', (event) => {
    const btn = event.target.closest('.s-filter-btn');
    if (!btn) return;
    const key = btn.dataset.filter;
    searchUiState.filters[key] = !searchUiState.filters[key];
    saveSearchUiState();
    applySearchUi();
  });

  results.addEventListener('click', (event) => {
    const target = event.target.closest('[data-id]');
    if (!target) return;
    navigate(target.dataset.id);
  });
}

/* ── Progress bar ──────────────────────────── */
window.addEventListener('scroll',()=>{
  const h=document.body.scrollHeight-window.innerHeight;
  document.getElementById('progFill').style.width=(h>0?Math.min(100,window.scrollY/h*100):0)+'%';
});

/* ── Anime.js Animations ───────────────────── */
function animateContentIn() {
  anime({
    targets: '#content .rendered',
    opacity: [0, 1],
    translateY: [18, 0],
    duration: 380,
    easing: 'easeOutQuart'
  });
}

function animateHomeCards() {
  anime({
    targets: '.domain-card',
    opacity: [0, 1],
    translateY: [24, 0],
    delay: anime.stagger(60, { start: 120 }),
    duration: 420,
    easing: 'easeOutQuart'
  });
  anime({
    targets: '.home-hero',
    opacity: [0, 1],
    translateY: [14, 0],
    duration: 480,
    easing: 'easeOutQuart'
  });
  const statEls = document.querySelectorAll('.stat-val');
  statEls.forEach(el => {
    const target = parseInt(el.textContent, 10) || 0;
    el.textContent = '0';
    anime({
      targets: el,
      innerHTML: [0, target],
      round: 1,
      duration: 900,
      delay: 180,
      easing: 'easeOutQuart',
      update() { el.textContent = Math.round(parseFloat(el.textContent)); }
    });
  });
}

function animateWikiIn() {
  anime({
    targets: '.wiki-sec',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(80, { start: 80 }),
    duration: 400,
    easing: 'easeOutQuart'
  });
  anime({
    targets: '.wiki-hdr',
    opacity: [0, 1],
    translateY: [14, 0],
    duration: 420,
    easing: 'easeOutQuart'
  });
}

function animateSidebar() {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    anime({
      targets: '.sidebar',
      translateX: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutQuart'
    });
  }
  anime({
    targets: '.s-logo',
    opacity: [0, 1],
    translateY: [-8, 0],
    duration: 400,
    delay: 100,
    easing: 'easeOutBack'
  });
  anime({
    targets: '.nav-group',
    opacity: [0, 1],
    translateX: [-12, 0],
    delay: anime.stagger(30, { start: 200 }),
    duration: 350,
    easing: 'easeOutQuart'
  });
}

/* ── Boot ──────────────────────────────────── */
window.addEventListener('DOMContentLoaded', ()=>{
  /* Wczesna walidacja konfiguracji ułatwia wychwycenie braków podczas uruchomienia aplikacji. */
  warnAboutMissingDomainKeys();
  buildPageMap();
  pageMap.set('__home__',{id:'__home__',label:'Strona główna',section:''});
  loadSearchUiState();
  rebuildSearchIndex();
  renderSidebar();
  setupSidebarInteractions();
  setupSearchInteractions();
  applySearchUi();
  setupGlobalInteractions();
  animateSidebar();
  const hash = window.location.hash.slice(1);
  navigate(hash && pageMap.has(hash) ? hash : SITE_CONFIG.defaultPage, true);
});

/* ── Theme switcher ────────────────────────── */
(function() {
  const DEFAULT_THEME = 'dark';
  const THEMES = [DEFAULT_THEME, 'light', 'sepia'];
  const stored = localStorage.getItem('psyhub-theme') || DEFAULT_THEME;
  const active  = THEMES.includes(stored) ? stored : DEFAULT_THEME;

  function themeAttr(theme) { return theme === DEFAULT_THEME ? '' : theme; }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = themeAttr(theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.theme === theme);
    });
    localStorage.setItem('psyhub-theme', theme);
  }

  // Apply immediately (before DOMContentLoaded to avoid flash)
  document.documentElement.dataset.theme = themeAttr(active);

  window.addEventListener('DOMContentLoaded', () => {
    // Sync button states
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.theme === active);
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });
  });
})();

window.addEventListener('popstate', e => {
  const id = e.state?.id || window.location.hash.slice(1) || SITE_CONFIG.defaultPage;
  navigate(pageMap.has(id) ? id : SITE_CONFIG.defaultPage, true);
});

window.addEventListener('hashchange', () => {
  const id = window.location.hash.slice(1) || SITE_CONFIG.defaultPage;
  if (id !== current && pageMap.has(id)) navigate(id, true);
});
