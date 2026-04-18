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

function buildPageMap() {
  for (const sec of SITE_CONFIG.nav)
    for (const item of sec.items)
      pageMap.set(item.id, { ...item, section: sec.section });
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
  for (const sec of SITE_CONFIG.nav) {
    const open = sec.section === activeSec;
    html += `<div class="nav-group${open?' open':''}" data-sec="${q(sec.section)}">`;
    html += `<div class="nav-group-hdr" onclick="toggleGroup(this)">`;
    html += `<span class="ng-label">${sec.section}</span>`;
    html += `<svg class="ng-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;
    html += `</div><div class="nav-items">`;
    for (const item of sec.items) {
      if (item.href) {
        html += `<a class="nav-item nav-item-external" href="${q(item.href)}" target="_blank" rel="noopener noreferrer">${item.label} ↗</a>`;
      } else {
        const cls = ['nav-item', item.wiki?'is-wiki':'', item.kind === 'test' ? 'nav-item-test' : '', item.id===active?'is-active':''].filter(Boolean).join(' ');
        html += `<div class="${cls}" data-id="${item.id}" onclick="navigate('${item.id}')">${item.label}</div>`;
      }
    }
    html += `</div></div>`;
  }
  nav.innerHTML = html;
}
function q(s){ return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;') }

function toggleGroup(hdr) {
  const group = hdr.parentElement;
  const isOpen = group.classList.contains('open');
  document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
  if (!isOpen) group.classList.add('open');
}

function setActive(id) {
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('is-active', el.dataset.id === id)
  );
  const el = document.querySelector(`.nav-item[data-id="${id}"]`);
  if (el) {
    const group = el.closest('.nav-group');
    document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
    group?.classList.add('open');
    el.scrollIntoView({ block:'nearest', behavior:'smooth' });
  }
}

/* ── Navigate ──────────────────────────────── */
function navigate(id, replaceHistory) {
  if (!id) return;
  const item = pageMap.get(id);
  if (!item) return;
  current = id;
  if (replaceHistory) history.replaceState({id},'','#'+id);
  else                history.pushState({id},'','#'+id);
  setActive(id);
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
    const domainKey = id.split('/')[0];
    const planItems = (SITE_CONFIG.plans || {})[domainKey] || [];
    const plansHtml = planItems.length ? renderPlans(planItems, id) : '';
    area.innerHTML = `<div class="rendered">
      <div class="page-hero">
        <span class="chapter-lbl">${item.section||''}</span>
        <h1>${title}</h1>
      </div>
      ${EMPTY_BANNER_HTML}
      ${plansHtml}
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
  const domainKey = id.split('/')[0];
  const planItems = (SITE_CONFIG.plans || {})[domainKey] || [];
  const plansHtml = planItems.length ? renderPlans(planItems, id) : '';

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
    <div class="page-nav">${prevB}${nextB}</div>
  </div>`;
  window.scrollTo(0,0);
  document.getElementById('progFill').style.width='0%';
  if (isEmpty) updateEmptyIndicators();
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
  const today = new Date().getDay(); /* 0=Sun … 6=Sat */
  const displayDay = (dailySelectedDay !== null) ? dailySelectedDay : today;
  const entry = data.find(e => e.day === displayDay) || data[0];

  const typeLabels = {
    reflection: 'Refleksja', challenge: 'Wyzwanie', bodyscan: 'Skan ciała',
    writing: 'Pisanie', mindfulness: 'Uważność', social: 'Wyzwanie społeczne', creative: 'Kreatywność'
  };

  const navBtns = data.map(e => {
    const isToday = e.day === today;
    const isActive = e.day === displayDay;
    const todayMark = isToday ? `<span class="daily-today-label">dziś</span>` : '';
    return `<button class="daily-day-btn${isActive ? ' is-active' : ''}" onclick="selectDailyDay(${e.day})">${e.emoji} ${e.dayName}${todayMark}</button>`;
  }).join('');

  const stepsHtml = entry.exercise.steps.map((step, i) =>
    `<li><span class="daily-step-num">${i + 1}</span><span>${step}</span></li>`
  ).join('');

  const bodyParas = entry.curiosity.body.map(p => `<p>${p}</p>`).join('');

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
      <div class="daily-card-title">${entry.curiosity.title}</div>
      <div class="daily-card-lead">${entry.curiosity.lead}</div>
      <div class="daily-card-body">${bodyParas}</div>
    </div>

    <div class="daily-card">
      <div class="daily-card-hdr">
        <span class="daily-card-icon">✏️</span>
        <span class="daily-card-label exercise">Praca nad sobą</span>
      </div>
      <div class="daily-card-title">${entry.exercise.title}</div>
      <span class="daily-exercise-type ${entry.exercise.type}">${typeLabels[entry.exercise.type] || entry.exercise.type}</span>
      <div class="daily-card-lead">${entry.exercise.intro}</div>
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
  const domains   = SITE_CONFIG.nav.filter(s=>!['Encyklopedie','Referencje','Wprowadzenie'].includes(s.section));
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

  area.innerHTML = `<div class="rendered">
    <div class="home-hero">
      <div class="home-eyebrow">Portal Wiedzy Psychologicznej</div>
      <h1>Witaj w <span>PsyHub</span></h1>
      <p>Encyklopedia psychologii i neuropsychologii — każdy artykuł w osobnym pliku Markdown, każdy dział z pełnym planem rozbudowy.</p>
      <div class="home-stats">
        <div><div class="stat-val">${totalMd}</div><div class="stat-lbl">Artykułów</div></div>
        <div><div class="stat-val">${totalPlan}</div><div class="stat-lbl">Zaplanowanych</div></div>
        <div><div class="stat-val">${totalWiki}</div><div class="stat-lbl">Encyklopedii</div></div>
        <div><div class="stat-val">${domains.length}</div><div class="stat-lbl">Działów</div></div>
      </div>
    </div>
    <div><div class="domains-h2">Działy tematyczne</div><div class="domain-grid">${cards}</div></div>
  </div>`;
  window.scrollTo(0,0);
  animateHomeCards();
}

/* ── Breadcrumb ────────────────────────────── */
function setBreadcrumb(item) {
  const bc = document.getElementById('breadcrumb');
  if (!item) { bc.innerHTML = `<a onclick="navigate(SITE_CONFIG.defaultPage)">PsyHub</a>`; return; }
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
}

/* ── Search ────────────────────────────────── */
document.getElementById('searchInput').addEventListener('input', function(){
  const q = this.value.trim().toLowerCase();
  document.querySelectorAll('.nav-item').forEach(el=>{
    el.style.display = (!q || el.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
  document.querySelectorAll('.nav-group').forEach(g=>{
    const any = [...g.querySelectorAll('.nav-item')].some(i=>i.style.display!=='none');
    g.style.display = any ? '' : 'none';
    if (q && any) g.classList.add('open');
    if (!q && !g.querySelector('.nav-item.is-active')) g.classList.remove('open');
  });
});

/* ── Sidebar mobile ────────────────────────── */
function openSidebar()  { document.getElementById('sidebar').classList.add('open');  document.getElementById('overlay').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }

/* ── Progress bar ──────────────────────────── */
window.addEventListener('scroll',()=>{
  const h=document.body.scrollHeight-window.innerHeight;
  document.getElementById('progFill').style.width=(h>0?Math.min(100,window.scrollY/h*100):0)+'%';
});

/* ── Keyboard ──────────────────────────────── */
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeSidebar(); });

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
  buildPageMap();
  pageMap.set('__home__',{id:'__home__',label:'Strona główna',section:''});
  renderSidebar();
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
