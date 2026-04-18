(function(){
'use strict';

/* Zwraca panel skrótów klawiaturowych zależny od trybu testu. */
function renderKeyboardHints(mode) {
  const common = '<span><kbd>←</kbd>/<kbd>→</kbd> nawigacja</span>';
  const perMode = mode === 'specialization'
    ? '<span><kbd>1-6</kbd> wybór odpowiedzi</span>'
    : '<span><kbd>1-4</kbd> wybór odpowiedzi</span>';
  return `<div class="test-hotkeys" role="note" aria-label="Skróty klawiaturowe">${common}${perMode}</div>`;
}

/* Buduje czytelne podsumowanie postępu testu dla użytkownika. */
function renderProgressSummary(total, answered, modeLabel) {
  const remaining = Math.max(0, total - answered);
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return `<div class="test-progress-summary">
    <span class="test-progress-chip">${modeLabel}</span>
    <span class="test-progress-chip">Udzielone: <strong>${answered}/${total}</strong></span>
    <span class="test-progress-chip">Pozostało: <strong>${remaining}</strong></span>
    <span class="test-progress-chip">Postęp: <strong>${pct}%</strong></span>
  </div>`;
}

function renderSpecializationTest(id, item) {
  const area = document.getElementById('content');
  setBreadcrumb(item);
  const test = window.SPECIALIZATION_TEST;
  if (!test) {
    area.innerHTML = '<div class="error-box"><h2>Błąd ładowania testu</h2><p>Nie udało się wczytać logiki testu specjalności.</p></div>';
    return;
  }

  const total = test.QUESTIONS.length;
  const answered = testAnswers.filter(v => typeof v === 'number').length;
  const counter = readSpecializationTestCounter();
  const todayCount = counter.byDate[getTodayDateKey()] || 0;
  const clampedIndex = Math.min(Math.max(testCurrentIndex, 0), total - 1);
  testCurrentIndex = Number.isFinite(clampedIndex) ? clampedIndex : 0;
  const question = test.QUESTIONS[testCurrentIndex];
  const specialtyFilters = test.SPECIALTIES.map(spec => `
    <div class="ttest-topic-btn">
      <span class="ttest-topic-icon">🎯</span>${spec.name}
    </div>
  `).join('');
  const options = question.options.map((opt, oIdx) => {
    const selected = testAnswers[testCurrentIndex] === oIdx ? 'is-active' : '';
    return `<button class="test-opt ${selected}" aria-pressed="${selected ? 'true' : 'false'}" onclick="selectTestAnswer(${testCurrentIndex},${oIdx})">
      <span class="test-opt-id">${oIdx + 1}.</span>
      <span>${opt.text}</span>
    </button>`;
  }).join('');
  const pagerHtml = renderQuestionPager(total, testCurrentIndex, testAnswers, 'goToQuestionIndex');
  const currentQ = `<div class="test-card">
    <div class="test-meta">Pytanie ${testCurrentIndex + 1} / ${total}</div>
    <div class="test-q">${question.text}</div>
    <div class="test-opts">${options}</div>
    ${pagerHtml}
  </div>`;

  const resultsBlock = answered === total ? renderTestResults(test.evaluate(testAnswers)) : '';

  area.innerHTML = `<div class="rendered test-wrap">
    <div class="page-hero">
      <span class="chapter-lbl">${item.section || ''}</span>
      <h1>Test wyboru specjalności</h1>
      <p class="lead">Odpowiedz na 20 pytań, aby uzyskać rekomendację specjalności, poziom dopasowania do pozostałych obszarów oraz profil na sześciu osiach decyzyjnych.</p>
    </div>
    ${renderTestZoneBanner()}
    ${renderProgressSummary(total, answered, 'Test specjalizacji')}
    ${renderKeyboardHints('specialization')}
    <div class="ttest-layout">
      <aside class="ttest-side">
        <div class="ttest-section">
          <div class="ttest-section-title">Tematy specjalizacji</div>
          <div class="ttest-topic-list">${specialtyFilters}</div>
        </div>
        <div class="ttest-section">
          <div class="ttest-section-title">Nawigacja pytań</div>
          ${pagerHtml}
        </div>
      </aside>
      <section class="ttest-main">
        <p class="test-intro">Pytania są celowo nieoczywiste i zawierają scenki oraz dylematy etyczno-praktyczne (m.in. medycyna, farmakologia, diagnostyka, statystyka, neurologia i kompetencje miękkie).</p>
        <div class="test-meta">Udzielone odpowiedzi: <strong>${answered}/${total}</strong></div>
        <div class="test-meta">Wypełnione podejścia łącznie: <strong>${counter.totalCompleted}</strong> · Dzisiaj: <strong>${todayCount}</strong></div>
        <div class="test-actions ttest-sticky">
          <button class="test-btn" onclick="resetSpecializationTest()">Wyczyść odpowiedzi</button>
          <button class="test-btn" onclick="goToPrevQuestion()" ${testCurrentIndex===0?'disabled':''}>Poprzednie pytanie</button>
          <button class="test-btn primary" onclick="goToNextQuestion()" ${testCurrentIndex===total-1?'disabled':''}>Następne pytanie</button>
          <button class="test-btn" onclick="jumpToFirstUnanswered()" ${answered===total?'disabled':''}>Pierwsze nieuzupełnione</button>
        </div>
        ${currentQ}
        ${resultsBlock}
      </section>
    </div>
  </div>`;
  window.scrollTo(0,0);
  animateContentIn();
}

function renderTestResults(result) {
  const bars = result.ranking.map(r => `
    <div class="fit-row">
      <div class="fit-lbl">${r.name}</div>
      <div class="fit-bar"><div class="fit-fill" style="width:${r.percent}%;background:${r.color}"></div></div>
      <div class="fit-num">${r.percent}%</div>
    </div>`).join('');

  const axes = result.axes.map(axis => {
    const markerLeft = 50 + (axis.value / 2);
    return `<div class="axis-row">
      <div class="axis-head"><span>${axis.left}</span><span>${axis.right}</span></div>
      <div class="axis-track"><span class="axis-marker" style="left:calc(${markerLeft}% - 1px)"></span></div>
    </div>`;
  }).join('');

  return `<div class="result-box">
    <div class="result-title">Rekomendowana specjalność</div>
    <div class="result-main">${result.recommended.name}</div>
    <p>${result.recommended.desc}</p>
    <h3>Poziom dopasowania do wszystkich specjalności</h3>
    <div class="fit-grid">${bars}</div>
    <h3>Profil decyzyjny (osie dwubiegunowe)</h3>
    <div class="axis-grid">${axes}</div>
  </div>`;
}

window.selectTestAnswer = function(questionIndex, optionIndex) {
  /* Pierwsza odpowiedź oznacza rozpoczęcie nowego podejścia do testu. */
  testAttemptState.started = true;
  testAnswers[questionIndex] = optionIndex;
  const test = window.SPECIALIZATION_TEST;
  if (test && questionIndex < test.QUESTIONS.length - 1) {
    testCurrentIndex = questionIndex + 1;
  }
  /* Po domknięciu wszystkich odpowiedzi zapisujemy ukończone podejście. */
  const answered = testAnswers.filter(v => typeof v === 'number').length;
  if (test && answered === test.QUESTIONS.length) {
    registerCompletedSpecializationAttempt();
  }
  if (current === 'students/test_specjalnosci') {
    renderSpecializationTest(current, pageMap.get(current));
  }
};

window.resetSpecializationTest = function() {
  testAnswers.length = 0;
  testCurrentIndex = 0;
  /* Reset przygotowuje nową próbę i odblokowuje możliwość kolejnego zliczenia ukończenia. */
  testAttemptState = { started: false, completed: false };
  if (current === 'students/test_specjalnosci') {
    renderSpecializationTest(current, pageMap.get(current));
  }
};

window.goToPrevQuestion = function() {
  testCurrentIndex = Math.max(0, testCurrentIndex - 1);
  if (current === 'students/test_specjalnosci') {
    renderSpecializationTest(current, pageMap.get(current));
  }
};

window.goToNextQuestion = function() {
  const test = window.SPECIALIZATION_TEST;
  if (!test) return;
  testCurrentIndex = Math.min(test.QUESTIONS.length - 1, testCurrentIndex + 1);
  if (current === 'students/test_specjalnosci') {
    renderSpecializationTest(current, pageMap.get(current));
  }
};

/* Umożliwia skok do konkretnego pytania z mini-paginatora. */
window.goToQuestionIndex = function(index) {
  const test = window.SPECIALIZATION_TEST;
  if (!test) return;
  testCurrentIndex = Math.max(0, Math.min(test.QUESTIONS.length - 1, index));
  if (current === 'students/test_specjalnosci') {
    renderSpecializationTest(current, pageMap.get(current));
  }
};

window.jumpToFirstUnanswered = function() {
  const test = window.SPECIALIZATION_TEST;
  const missingIdx = test.QUESTIONS.findIndex((_, idx) => typeof testAnswers[idx] !== 'number');
  if (missingIdx < 0) return;
  testCurrentIndex = missingIdx;
  if (current === 'students/test_specjalnosci') {
    renderSpecializationTest(current, pageMap.get(current));
  }
};


function ttShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ttGetCounts(length, difficulty) {
  const ratios = {
    easy:   [0.60, 0.30, 0.10],
    normal: [0.33, 0.33, 0.34],
    hard:   [0.10, 0.30, 0.60]
  };
  const r = ratios[difficulty] || ratios.normal;
  const d1 = Math.round(r[0] * length);
  const d2 = Math.min(Math.round(r[1] * length), length - d1);
  const d3 = length - d1 - d2;
  return [d1, d2, d3];
}

function ttShuffleOptions(questions) {
  return questions.map(q => {
    const indices = ttShuffle(q.options.map((_, i) => i));
    const shuffledOptions = indices.map(i => q.options[i]);
    const newCorrect = indices.indexOf(q.correct);
    return Object.assign({}, q, { options: shuffledOptions, correct: newCorrect });
  });
}

function ttSelectQuestions(allQuestions, length, difficulty) {
  const byDiff = [
    allQuestions.filter(q => q.difficulty === 1),
    allQuestions.filter(q => q.difficulty === 2),
    allQuestions.filter(q => q.difficulty === 3)
  ];
  const counts = ttGetCounts(length, difficulty);
  const selected = [];
  counts.forEach((n, i) => {
    const pool = ttShuffle([...byDiff[i]]);
    selected.push(...pool.slice(0, n));
  });
  return ttShuffle(selected);
}

/* Sprawdza, czy aktywna podstrona korzysta ze wspólnego modułu testów teoretycznych. */
function isTheoreticalTestPageActive() {
  const activeItem = pageMap.get(current);
  return Boolean(activeItem && activeItem.custom === 'theoretical_test');
}

/*
 * Buduje zunifikowany katalog tematów niezależnie od tego,
 * czy konfiguracja używa nowego podziału na kategorie, czy starego cfg.topics.
 */
function ttBuildTopicCatalog(cfg) {
  const defaultMeta = {
    theoretical: { label: 'Testy teoretyczne', description: 'Klasyczne testy przekrojowe z głównych obszarów psychologii.' },
    specialization: { label: 'Specjalizacje i moduły rozszerzone', description: 'Zestawy przygotowujące do pracy w obszarach specjalistycznych.' },
    clinical_vignettes: { label: 'Winiety kliniczne', description: 'Ćwiczenia na analizie przypadków i decyzjach diagnostycznych.' },
    diploma_mock: { label: 'Egzamin dyplomowy — mock', description: 'Próbne testy sprawdzające gotowość do egzaminu dyplomowego.' }
  };

  const categoryMeta = Object.assign({}, defaultMeta, cfg.categoryMeta || {});
  let categories = [];

  if (cfg.categories && typeof cfg.categories === 'object') {
    const preferredOrder = ['theoretical', 'specialization', 'clinical_vignettes', 'diploma_mock'];
    const dynamicKeys = Object.keys(cfg.categories).filter(k => !preferredOrder.includes(k));
    const orderedKeys = preferredOrder.filter(k => Array.isArray(cfg.categories[k])).concat(dynamicKeys);
    categories = orderedKeys.map(key => {
      const topics = Array.isArray(cfg.categories[key]) ? cfg.categories[key] : [];
      return { key, meta: categoryMeta[key] || { label: key, description: '' }, topics };
    }).filter(c => c.topics.length > 0);
  }

  /* Fallback kompatybilności wstecznej dla historycznej struktury cfg.topics. */
  if (!categories.length && Array.isArray(cfg.topics) && cfg.topics.length > 0) {
    categories = [{
      key: 'theoretical',
      meta: categoryMeta.theoretical || { label: 'Testy teoretyczne', description: '' },
      topics: cfg.topics
    }];
  }

  const topicByKey = new Map();
  categories.forEach(cat => cat.topics.forEach(topic => topicByKey.set(topic.key, topic)));

  const firstTopicKey = categories[0] && categories[0].topics[0] ? categories[0].topics[0].key : null;
  return { categories, topicByKey, firstTopicKey };
}

/* Wyznacza kategorię dla presetTopic na podstawie mapowania lub realnej pozycji tematu. */
function ttResolvePresetCategory(cfg, catalog, presetTopic) {
  if (!presetTopic) return null;
  const mappedCategory = cfg.presetTopicCategoryMap && cfg.presetTopicCategoryMap[presetTopic];
  if (mappedCategory) return mappedCategory;
  const owner = catalog.categories.find(cat => cat.topics.some(topic => topic.key === presetTopic));
  return owner ? owner.key : null;
}

/* Renderuje spójny pasek informacyjny dla wszystkich widoków testowych. */
function renderTestZoneBanner() {
  return `<div class="test-zone-banner" role="status" aria-label="Strefa testów">
    <span class="test-zone-icon" aria-hidden="true">🧪</span>
    <span class="test-zone-title">Strefa testów</span>
    <span class="test-zone-desc">Tryb ćwiczeniowy z natychmiastową informacją zwrotną.</span>
  </div>`;
}

/* Buduje mini-nawigator numerowany, aby szybciej przeskakiwać między pytaniami. */
function renderQuestionPager(total, currentIndex, answers, onClickName) {
  return `<div class="ttest-pager">${
    Array.from({ length: total }, (_, idx) => {
      const isActive = idx === currentIndex ? ' is-active' : '';
      const answeredCls = answers[idx] === null || answers[idx] === undefined ? ' is-unanswered' : ' is-answered';
      return `<button class="ttest-page-btn${isActive}${answeredCls}" onclick="${onClickName}(${idx})">${idx + 1}</button>`;
    }).join('')
  }</div>`;
}

function renderTheoreticalTest(id, item) {
  const area = document.getElementById('content');
  setBreadcrumb(item);
  const cfg = window.THEORETICAL_TEST;
  if (!cfg) {
    area.innerHTML = '<div class="error-box"><h2>Błąd ładowania modułu</h2><p>Nie udało się wczytać konfiguracji testów teoretycznych.</p></div>';
    return;
  }
  const catalog = ttBuildTopicCatalog(cfg);
  if (!catalog.firstTopicKey) {
    area.innerHTML = '<div class="error-box"><h2>Brak dostępnych tematów</h2><p>Konfiguracja testów nie zawiera żadnych aktywnych zestawów pytań.</p></div>';
    return;
  }
  const presetCategory = ttResolvePresetCategory(cfg, catalog, item.presetTopic);
  if (!theoreticalTestState) {
    theoreticalTestState = {
      phase: 'setup',
      /* Dla skrótów w menu "Dla studentów" ustawiamy domyślny temat modułu. */
      topicKey: item.presetTopic || catalog.firstTopicKey,
      activeCategoryKey: presetCategory || (catalog.categories[0] && catalog.categories[0].key),
      length: 30,
      difficulty: 'normal',
      questions: [],
      currentIndex: 0,
      answers: [],
      startTime: null,
      endTime: null,
      reviewVisible: false,
      reviewWrongOnly: true,
      reviewRevealCount: 10
    };
  }
  const st = theoreticalTestState;
  /* Synchronizacja skrótu tematycznego działa wyłącznie podczas konfiguracji testu. */
  if (st.phase === 'setup' && item.presetTopic && st.topicKey !== item.presetTopic) {
    st.topicKey = item.presetTopic;
  }
  /* Podczas konfiguracji utrzymujemy aktywny blok kategorii zgodny z presetem. */
  if (st.phase === 'setup' && presetCategory) {
    st.activeCategoryKey = presetCategory;
  }
  const heroTitle = item.label || 'Testy Teoretyczne';
  const heroLead = item.presetTopic
    ? 'Uruchom dedykowany test dla wybranego modułu i sprawdź wynik wraz z uzasadnieniami odpowiedzi.'
    : 'Sprawdź swoją wiedzę z wybranego zakresu psychologii. Odpowiedz na pytania zamknięte i sprawdź wynik.';
  if (st.phase === 'setup') {
    /* Przenosi aktywną kategorię na początek listy, aby skróty prowadziły od razu do właściwej sekcji. */
    const orderedCategories = [...catalog.categories].sort((a, b) => {
      if (a.key === st.activeCategoryKey) return -1;
      if (b.key === st.activeCategoryKey) return 1;
      return 0;
    });
    const topicsHtml = orderedCategories.map(category => {
      const meta = category.meta || {};
      const categoryActive = category.key === st.activeCategoryKey ? ' is-active' : '';
      const topicButtons = category.topics.map(topic => {
        const active = topic.key === st.topicKey ? ' is-active' : '';
        return `<button class="ttest-topic-btn${active}" onclick="ttSetTopic('${topic.key}')"><span class="ttest-topic-icon">${topic.icon || '📘'}</span>${topic.label}</button>`;
      }).join('');
      return `<section class="ttest-category-block${categoryActive}" data-category-key="${category.key}">
        <div class="ttest-category-title">${meta.label || category.key}</div>
        <div class="ttest-category-desc">${meta.description || ''}</div>
        <div class="ttest-topic-list">${topicButtons}</div>
      </section>`;
    }).join('');
    const lenOpts = [
      { v: 15, label: 'Krótki — 15 pytań' },
      { v: 30, label: 'Domyślny — 30 pytań' },
      { v: 60, label: 'Długi — 60 pytań' }
    ].map(o => `<button class="ttest-opt-btn${st.length === o.v ? ' is-active' : ''}" onclick="ttSetLength(${o.v})">${o.label}</button>`).join('');
    const diffOpts = [
      { v: 'easy',   label: 'Łatwy',    desc: '60% łatwych, 30% średnich, 10% trudnych' },
      { v: 'normal', label: 'Normalny', desc: '33% łatwych, 33% średnich, 33% trudnych' },
      { v: 'hard',   label: 'Trudny',   desc: '10% łatwych, 30% średnich, 60% trudnych' }
    ].map(o => `<button class="ttest-opt-btn${st.difficulty === o.v ? ' is-active' : ''}" onclick="ttSetDiff('${o.v}')" title="${o.desc}">${o.label}</button>`).join('');
    const selDiffDesc = { easy: '60% łatwych pytań, 30% średnich, 10% trudnych', normal: '33% łatwych, 33% średnich, 33% trudnych', hard: '10% łatwych, 30% średnich, 60% trudnych' }[st.difficulty];
    area.innerHTML = `<div class="rendered ttest-wrap">
      <div class="page-hero">
        <span class="chapter-lbl">${item.section || ''}</span>
        <h1>${heroTitle}</h1>
        <p class="lead">${heroLead}</p>
      </div>
      ${renderTestZoneBanner()}
      ${renderKeyboardHints('theoretical')}
      <div class="ttest-layout ttest-layout--setup">
        <aside class="ttest-side">
          <div class="ttest-section">
            <div class="ttest-section-title">Wybierz temat i kategorię</div>
            <div class="ttest-topic-list">${topicsHtml}</div>
          </div>
        </aside>
        <section class="ttest-main">
          <div class="ttest-section">
            <div class="ttest-section-title">Długość testu</div>
            <div class="ttest-options">${lenOpts}</div>
          </div>
          <div class="ttest-section">
            <div class="ttest-section-title">Poziom trudności</div>
            <div class="ttest-options">${diffOpts}</div>
            <div class="ttest-diff-desc">${selDiffDesc}</div>
          </div>
          <button class="ttest-start-btn" onclick="ttStart()">Rozpocznij test →</button>
        </section>
      </div>
    </div>`;
  } else if (st.phase === 'test') {
    const total = st.questions.length;
    const q = st.questions[st.currentIndex];
    const letters = ['A', 'B', 'C', 'D'];
    const optHtml = q.options.map((opt, i) => {
      const sel = st.answers[st.currentIndex] === i ? ' is-active' : '';
      return `<button class="ttest-ans-btn${sel}" onclick="ttSelectAnswer(${i})"><span class="ttest-ans-letter">${letters[i]}</span><span>${opt}</span></button>`;
    }).join('');
    const answered = st.answers.filter(a => a !== null).length;
    const pct = Math.round(((st.currentIndex + 1) / total) * 100);
    const canFinish = answered === total;
    const pagerHtml = renderQuestionPager(total, st.currentIndex, st.answers, 'ttGoToQuestion');
    area.innerHTML = `<div class="rendered ttest-wrap">
      <div class="page-hero">
        <span class="chapter-lbl">${item.section || ''}</span>
        <h1>${heroTitle}</h1>
      </div>
      ${renderTestZoneBanner()}
      ${renderProgressSummary(total, answered, 'Test teoretyczny')}
      ${renderKeyboardHints('theoretical')}
      <div class="ttest-layout">
        <aside class="ttest-side">
          <div class="ttest-section">
            <div class="ttest-section-title">Nawigacja pytań</div>
            ${pagerHtml}
          </div>
        </aside>
        <section class="ttest-main">
          <div class="ttest-progress-bar"><div class="ttest-progress-fill" style="width:${pct}%"></div></div>
          <div class="ttest-q-card">
            <div class="ttest-q-num">Pytanie ${st.currentIndex + 1} / ${total} &nbsp;·&nbsp; Udzielone: ${answered}/${total}</div>
            <div class="ttest-q-text">${q.question}</div>
            <div class="ttest-answers">${optHtml}</div>
          </div>
          <div class="ttest-nav ttest-sticky">
            <button class="ttest-nav-btn" onclick="ttPrev()" ${st.currentIndex === 0 ? 'disabled' : ''}>← Poprzednie</button>
            <button class="ttest-nav-btn primary" onclick="ttNext()" ${(st.currentIndex === total - 1 || st.answers[st.currentIndex] === null) ? 'disabled' : ''}>Następne →</button>
            <button class="ttest-nav-btn" onclick="ttFirstUnanswered()" ${canFinish ? 'disabled' : ''}>Pierwsze bez odpowiedzi</button>
            <button class="ttest-nav-btn" onclick="ttFinish()" ${!canFinish ? 'disabled' : ''} style="margin-left:auto">Zakończ test ✓</button>
          </div>
        </section>
      </div>
      <div style="margin-top:.8rem">
        <button class="ttest-nav-btn" onclick="ttAbort()">✕ Przerwij test</button>
      </div>
    </div>`;
  } else if (st.phase === 'results') {
    const total = st.questions.length;
    const correct = st.questions.filter((q, i) => st.answers[i] === q.correct).length;
    const pct = Math.round((correct / total) * 100);
    const grade = pct >= 90 ? { label: 'Doskonały', cls: 'excellent' }
                : pct >= 75 ? { label: 'Dobry',     cls: 'good' }
                : pct >= 60 ? { label: 'Zaliczony',  cls: 'pass' }
                :             { label: 'Niezaliczony', cls: 'fail' };
    const letters = ['A', 'B', 'C', 'D'];
    let timeHtml = '';
    if (st.startTime && st.endTime) {
      const elapsed = st.endTime - st.startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      timeHtml = `<div class="ttest-result-time">⏱ Czas wypełniania: ${minutes}:${seconds.toString().padStart(2, '0')}</div>`;
    }
    const reviewItems = st.questions.map((q, i) => {
      const userAns = st.answers[i];
      const isCorrect = userAns === q.correct;
      const cls = isCorrect ? 'is-correct' : 'is-wrong';
      const userLabel = userAns !== null && userAns !== undefined ? `${letters[userAns]}. ${q.options[userAns]}` : '(brak odpowiedzi)';
      const corrLabel = `${letters[q.correct]}. ${q.options[q.correct]}`;
      const ansHtml = isCorrect
        ? `<span class="is-correct-ans">✓ ${userLabel}</span>`
        : `<span class="is-wrong-ans">${userLabel}</span> → <span class="is-correct-ans">✓ ${corrLabel}</span>`;
      const justHtml = q.justification ? `<div class="ttest-review-just">${q.justification}</div>` : '';
      return { isCorrect, html: `<div class="ttest-review-item ${cls}">
        <div class="ttest-review-q">${i + 1}. ${q.question}</div>
        <div class="ttest-review-ans">${ansHtml}</div>
        ${justHtml}
      </div>` };
    });
    const filteredItems = st.reviewWrongOnly ? reviewItems.filter(item => !item.isCorrect) : reviewItems;
    const visibleItems = st.reviewVisible ? filteredItems.slice(0, st.reviewRevealCount) : [];
    const reviewHtml = visibleItems.map(item => item.html).join('');
    const canLoadMore = st.reviewVisible && filteredItems.length > st.reviewRevealCount;
    area.innerHTML = `<div class="rendered ttest-wrap">
      <div class="page-hero">
        <span class="chapter-lbl">${item.section || ''}</span>
        <h1>Wynik testu — ${heroTitle}</h1>
      </div>
      ${renderTestZoneBanner()}
      <div class="ttest-result-box">
        <div class="ttest-result-score">${correct} / ${total}</div>
        <div class="ttest-result-pct">${pct}% poprawnych odpowiedzi</div>
        ${timeHtml}
        <span class="ttest-result-grade ${grade.cls}">${grade.label}</span>
        <div class="ttest-nav ttest-sticky" style="margin-top:.5rem">
          <button class="ttest-nav-btn primary" onclick="ttReset()">Nowy test</button>
          <button class="ttest-nav-btn" onclick="ttReview()">${st.reviewVisible ? 'Ukryj przegląd ↑' : 'Pokaż przegląd ↓'}</button>
        </div>
      </div>
      <div id="ttest-review-block" style="display:${st.reviewVisible ? 'block' : 'none'}">
        <div class="ttest-review-title">Przegląd pytań i odpowiedzi</div>
        <div class="ttest-review-controls">
          <label class="ttest-filter-toggle">
            <input type="checkbox" onchange="ttToggleWrongOnly(this.checked)" ${st.reviewWrongOnly ? 'checked' : ''}>
            Tylko błędne odpowiedzi
          </label>
          <span class="ttest-review-meta">Pokazane: ${visibleItems.length}/${filteredItems.length}</span>
        </div>
        ${reviewHtml || '<div class="test-meta">Brak pozycji do wyświetlenia dla aktywnego filtra.</div>'}
        ${canLoadMore ? '<button class="ttest-nav-btn" onclick="ttLoadMoreReview()">Załaduj kolejną sekcję</button>' : ''}
      </div>
    </div>`;
  }
  window.scrollTo(0, 0);
  animateContentIn();
}

/* Obsługuje skróty klawiaturowe dla aktywnego widoku testowego. */
function handleTestKeyboardShortcuts(event) {
  const tagName = (event.target && event.target.tagName) ? event.target.tagName.toLowerCase() : '';
  if (tagName === 'input' || tagName === 'textarea' || event.target?.isContentEditable) return;

  if (current === 'students/test_specjalnosci') {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      window.goToPrevQuestion();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      window.goToNextQuestion();
      return;
    }
    if (/^[1-6]$/.test(event.key)) {
      const index = Number(event.key) - 1;
      event.preventDefault();
      window.selectTestAnswer(testCurrentIndex, index);
    }
    return;
  }

  if (!isTheoreticalTestPageActive() || !theoreticalTestState || theoreticalTestState.phase !== 'test') return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    window.ttPrev();
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    window.ttNext();
    return;
  }
  if (/^[1-4]$/.test(event.key)) {
    event.preventDefault();
    window.ttSelectAnswer(Number(event.key) - 1);
  }
}

/* Rejestrujemy listener raz, aby nie dublować nasłuchiwania po kolejnych renderach. */
window.addEventListener('keydown', handleTestKeyboardShortcuts);

window.ttSetTopic = function(key) {
  if (!theoreticalTestState) return;
  theoreticalTestState.topicKey = key;
  /* Aktualizuje aktywną kategorię, aby skróty i kliknięcia utrzymywały właściwy kontekst sekcji. */
  const cfg = window.THEORETICAL_TEST;
  if (cfg) {
    const catalog = ttBuildTopicCatalog(cfg);
    const ownerCategory = catalog.categories.find(category => category.topics.some(topic => topic.key === key));
    if (ownerCategory) theoreticalTestState.activeCategoryKey = ownerCategory.key;
  }
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttSetLength = function(n) {
  if (!theoreticalTestState) return;
  theoreticalTestState.length = n;
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttSetDiff = function(d) {
  if (!theoreticalTestState) return;
  theoreticalTestState.difficulty = d;
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttStart = async function() {
  const st = theoreticalTestState;
  if (!st) return;
  const cfg = window.THEORETICAL_TEST;
  const catalog = cfg ? ttBuildTopicCatalog(cfg) : null;
  const topic = catalog ? catalog.topicByKey.get(st.topicKey) : null;
  if (!topic) return;
  try {
    const r = await fetch(topic.file);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const allQuestions = await r.json();
    const questions = ttShuffleOptions(ttSelectQuestions(allQuestions, st.length, st.difficulty));
    st.questions = questions;
    st.currentIndex = 0;
    st.answers = new Array(questions.length).fill(null);
    st.startTime = Date.now();
    st.endTime = null;
    st.reviewVisible = false;
    st.reviewWrongOnly = true;
    st.reviewRevealCount = 10;
    st.phase = 'test';
    if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
  } catch(e) {
    const area = document.getElementById('content');
    area.innerHTML = '<div class="error-box"><h2>Błąd ładowania pytań</h2><p>Nie udało się wczytać pytań testu. Sprawdź połączenie i spróbuj ponownie.</p></div>';
  }
};

window.ttSelectAnswer = function(optIdx) {
  if (!theoreticalTestState || theoreticalTestState.phase !== 'test') return;
  const st = theoreticalTestState;
  st.answers[st.currentIndex] = optIdx;
  if (st.answers.every(a => a !== null)) {
    st.endTime = Date.now();
    st.phase = 'results';
  } else if (st.currentIndex < st.questions.length - 1) {
    st.currentIndex++;
  }
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttPrev = function() {
  if (!theoreticalTestState) return;
  theoreticalTestState.currentIndex = Math.max(0, theoreticalTestState.currentIndex - 1);
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttNext = function() {
  if (!theoreticalTestState) return;
  const st = theoreticalTestState;
  if (st.answers[st.currentIndex] === null) return;
  st.currentIndex = Math.min(st.questions.length - 1, st.currentIndex + 1);
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

/* Pozwala przejść bezpośrednio do wybranego pytania z paginacji. */
window.ttGoToQuestion = function(index) {
  if (!theoreticalTestState) return;
  const st = theoreticalTestState;
  st.currentIndex = Math.max(0, Math.min(st.questions.length - 1, index));
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttFirstUnanswered = function() {
  if (!theoreticalTestState) return;
  const st = theoreticalTestState;
  const idx = st.answers.findIndex(a => a === null);
  if (idx < 0) return;
  st.currentIndex = idx;
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttFinish = function() {
  if (!theoreticalTestState) return;
  const st = theoreticalTestState;
  if (st.answers.some(a => a === null)) return;
  st.endTime = Date.now();
  st.phase = 'results';
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttAbort = function() {
  theoreticalTestState = null;
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttReset = function() {
  theoreticalTestState = null;
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

window.ttReview = function() {
  if (!theoreticalTestState) return;
  theoreticalTestState.reviewVisible = !theoreticalTestState.reviewVisible;
  if (theoreticalTestState.reviewVisible && theoreticalTestState.reviewRevealCount < 10) {
    theoreticalTestState.reviewRevealCount = 10;
  }
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

/* Przełącza filtr „tylko błędne odpowiedzi” i restartuje paginację sekcji. */
window.ttToggleWrongOnly = function(onlyWrong) {
  if (!theoreticalTestState) return;
  theoreticalTestState.reviewWrongOnly = Boolean(onlyWrong);
  theoreticalTestState.reviewRevealCount = 10;
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};

/* Doładowuje kolejną paczkę odpowiedzi, aby uniknąć ciężkiego renderu na starcie. */
window.ttLoadMoreReview = function() {
  if (!theoreticalTestState) return;
  theoreticalTestState.reviewRevealCount += 10;
  if (isTheoreticalTestPageActive()) renderTheoreticalTest(current, pageMap.get(current));
};


window.PsyHubTestsUI = {
  renderSpecializationTest,
  renderTheoreticalTest
};
})();
