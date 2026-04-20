#!/usr/bin/env node
'use strict';

/*
 * Uruchamia moduł UI w środowisku jsdom i wykonuje prosty smoke test.
 * Celem jest szybka walidacja, że moduł ładuje się poprawnie poza przeglądarką.
 */
(async function runUiTestsInJsdom() {
  let JSDOM;
  try {
    ({ JSDOM } = await import('jsdom'));
  } catch (error) {
    /*
     * Komunikat celowo podpowiada gotowe polecenie instalacji,
     * aby deweloper od razu mógł uruchomić testy UI lokalnie.
     */
    console.error('[PsyHub][UI] Brakuje zależności "jsdom".');
    console.error('[PsyHub][UI] Zainstaluj ją i uruchom ponownie: npm install --no-save jsdom && node tools/run-ui-tests-jsdom.js');
    process.exitCode = 1;
    return;
  }

  const dom = new JSDOM('<!doctype html><html><body><main id="content"></main></body></html>', {
    url: 'http://localhost/'
  });

  /*
   * Eksponujemy minimalny zestaw globali wymaganych przez moduł UI.
   * Dzięki temu import nie kończy się błędem w środowisku Node.
   */
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.navigator = dom.window.navigator;
  globalThis.fetch = async () => {
    throw new Error('Mock fetch: runner jsdom nie pobiera danych zewnętrznych.');
  };

  await import('../modules/tests-ui.js');

  if (!window.PsyHubTestsUI || typeof window.PsyHubTestsUI.renderTheoreticalTest !== 'function') {
    throw new Error('[PsyHub][UI] Nie udało się zarejestrować API modułu tests-ui.js w jsdom.');
  }

  console.log('[PsyHub][UI] OK: moduł tests-ui.js załadowany poprawnie w jsdom.');
})();
