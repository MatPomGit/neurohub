#!/usr/bin/env node
'use strict';

/*
 * Runner dla testów uruchamianych w czystym środowisku Node.js.
 * Cel: odseparować testy browser-only od testów konfiguracji i narzędziowych.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

/* Uruchamia polecenie i wypisuje czytelny log z kodem wyjścia. */
function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (typeof result.status !== 'number' || result.status !== 0) {
    throw new Error(`[PsyHub][node-tests] Polecenie nie powiodło się: ${command} ${args.join(' ')}`);
  }
}

/*
 * Sprawdza, czy moduł UI zwraca czytelny komunikat browser-only,
 * gdy jest uruchamiany bez DOM w czystym Node.
 */
function assertBrowserOnlyMessageInPureNode() {
  const targetModule = path.join(repoRoot, 'modules', 'tests-ui.js');
  const result = spawnSync(process.execPath, [targetModule], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  const output = `${result.stdout || ''}\n${result.stderr || ''}`;

  if (result.status === 0) {
    throw new Error('[PsyHub][node-tests] Oczekiwano błędu browser-only, ale moduł UI uruchomił się poprawnie w Node.');
  }

  if (!output.includes('to test browser-only')) {
    throw new Error('[PsyHub][node-tests] Brak oczekiwanego komunikatu „to test browser-only” w wyjściu dla czystego Node.');
  }

  console.log('[PsyHub][node-tests] OK: moduł UI w czystym Node zgłasza komunikat browser-only.');
}

function main() {
  runCommand(process.execPath, ['tools/lint-measurement-tools-config.js', '--strict']);
  assertBrowserOnlyMessageInPureNode();
  console.log('[PsyHub][node-tests] OK: testy Node zakończone sukcesem.');
}

main();
