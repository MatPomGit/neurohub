#!/usr/bin/env node
/*
 * Agregator kontroli jakości treści i konfiguracji dla projektu PsyHub.
 * Skrypt jest przygotowany do uruchamiania w CI (kod wyjścia != 0 przy błędach).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const siteConfigPath = path.join(repoRoot, 'site-config.js');
const validatorPath = path.join(repoRoot, 'measurement-tools-validator.js');

const DEFAULT_MIN_CHARS_LIVE = 600;

/* Wczytuje konfigurację strony z pliku browserowego do bezpiecznego sandboxa VM. */
function loadSiteConfig() {
  const code = fs.readFileSync(siteConfigPath, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'site-config.js' });

  if (!sandbox.window?.SITE_CONFIG || typeof sandbox.window.SITE_CONFIG !== 'object') {
    throw new Error('Nie udało się załadować window.SITE_CONFIG z site-config.js.');
  }

  return sandbox.window.SITE_CONFIG;
}

/* Wczytuje funkcję strict-lintu dla measurement-tools. */
function loadMeasurementToolsValidator() {
  const validatorModule = require(validatorPath);
  const validator = validatorModule?.validateMeasurementToolsConfig;
  if (typeof validator !== 'function') {
    throw new Error('Nie udało się załadować validateMeasurementToolsConfig z measurement-tools-validator.js.');
  }
  return validator;
}

/* Tworzy bazową strukturę raportu z podziałem na poziomy i liczniki OK. */
function createReport() {
  return {
    errors: [],
    warnings: [],
    ok: [],
  };
}

/* Dodaje wpis błędu do raportu. */
function pushError(report, check, message, context) {
  report.errors.push({ check, message, context });
}

/* Dodaje wpis ostrzeżenia do raportu. */
function pushWarning(report, check, message, context) {
  report.warnings.push({ check, message, context });
}

/* Dodaje wpis sukcesu do raportu. */
function pushOk(report, check, message, context) {
  report.ok.push({ check, message, context });
}

/* Rekurencyjnie przechodzi po obiekcie i zwraca listę wszystkich obiektów wraz ze ścieżką. */
function collectObjects(node, basePath = 'SITE_CONFIG', out = []) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectObjects(item, `${basePath}[${index}]`, out));
    return out;
  }

  if (node && typeof node === 'object') {
    out.push({ path: basePath, value: node });
    Object.entries(node).forEach(([key, value]) => collectObjects(value, `${basePath}.${key}`, out));
  }

  return out;
}

/* Buduje mapę id -> file na podstawie wpisów, które mają oba pola. */
function buildIdToFileMap(collected) {
  const map = new Map();

  collected.forEach(({ value }) => {
    if (typeof value?.id === 'string' && typeof value?.file === 'string') {
      map.set(value.id, value.file);
    }
  });

  return map;
}

/* Próbuje rozwiązać wpis do ścieżki pliku, korzystając z file albo id. */
function resolveEntryFile(entry, idToFileMap) {
  if (typeof entry.file === 'string' && entry.file.trim()) {
    return entry.file.trim();
  }

  if (typeof entry.id === 'string' && entry.id.trim()) {
    const id = entry.id.trim();
    if (idToFileMap.has(id)) {
      return idToFileMap.get(id);
    }
    return `wiki/${id}.md`;
  }

  return null;
}

/* Kontrola strict-lint konfiguracji measurement-tools. */
function runMeasurementToolsStrictLint(siteConfig, report) {
  const validator = loadMeasurementToolsValidator();
  const result = validator(siteConfig, { strict: true });

  result.allIssues.forEach(issue => {
    const message = `${issue.path} | ${issue.field} | ${issue.message}`;
    if (issue.level === 'error') {
      pushError(report, 'measurement-tools-strict-lint', message);
    } else {
      pushWarning(report, 'measurement-tools-strict-lint', message);
    }
  });

  if (result.errors.length === 0) {
    pushOk(report, 'measurement-tools-strict-lint', 'Walidacja strict zakończona bez błędów.');
  }
}

/* Sprawdza istnienie plików wskazywanych przez wpisy statusowe i mapowanie id/file. */
function runFileExistenceCheck(siteConfig, report) {
  const collected = collectObjects(siteConfig);
  const idToFileMap = buildIdToFileMap(collected);

  let resolvedCount = 0;
  const entriesWithStatus = collected.filter(({ value }) => typeof value?.status === 'string');

  entriesWithStatus.forEach(({ path: objectPath, value }) => {
    const resolvedFile = resolveEntryFile(value, idToFileMap);

    if (!resolvedFile) {
      pushError(report, 'site-config-file-existence', 'Wpis statusowy nie ma pola file ani id (martwy wpis).', { objectPath });
      return;
    }

    resolvedCount += 1;
    const absPath = path.join(repoRoot, resolvedFile);

    if (!fs.existsSync(absPath)) {
      pushError(report, 'site-config-file-existence', `Brak pliku: ${resolvedFile}`, { objectPath, status: value.status });
    }
  });

  pushOk(report, 'site-config-file-existence', `Sprawdzono wpisy statusowe: ${resolvedCount}.`);
}

/* Zlicza objętość pliku markdown po odjęciu pustych znaków. */
function countContentChars(fileContent) {
  const withoutCodeBlocks = fileContent.replace(/```[\s\S]*?```/g, ' ');
  const plainText = withoutCodeBlocks
    .replace(/\[[^\]]*\]\([^\)]*\)/g, ' ')
    .replace(/[#>*`_\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.length;
}

/* Kontrola minimalnej objętości dla wpisów o statusie live. */
function runMinimumVolumeCheck(siteConfig, report, minChars) {
  const collected = collectObjects(siteConfig);
  const idToFileMap = buildIdToFileMap(collected);
  const seenFiles = new Set();

  const liveEntries = collected.filter(({ value }) => value?.status === 'live');

  let checkedCount = 0;
  liveEntries.forEach(({ path: objectPath, value }) => {
    const resolvedFile = resolveEntryFile(value, idToFileMap);
    if (!resolvedFile || seenFiles.has(resolvedFile)) {
      return;
    }
    seenFiles.add(resolvedFile);

    const absPath = path.join(repoRoot, resolvedFile);
    if (!fs.existsSync(absPath)) {
      return;
    }

    const content = fs.readFileSync(absPath, 'utf8');
    const size = countContentChars(content);
    checkedCount += 1;

    if (size < minChars) {
      pushError(
        report,
        'live-minimum-volume',
        `Plik ${resolvedFile} ma zbyt małą objętość (${size} < ${minChars}).`,
        { objectPath }
      );
      return;
    }

  });

  pushOk(report, 'live-minimum-volume', `Sprawdzono objętość plików live: ${checkedCount}.`);
}

/* Detekcja potencjalnych duplikatów i martwych wpisów na podstawie statusowych obiektów. */
function runDuplicatesAndDeadEntriesCheck(siteConfig, report) {
  const collected = collectObjects(siteConfig);
  const idToFileMap = buildIdToFileMap(collected);
  const entriesWithStatus = collected.filter(({ value }) => typeof value?.status === 'string');

  const idOccurrences = new Map();
  const fileOccurrences = new Map();

  entriesWithStatus.forEach(({ path: objectPath, value }) => {
    const entryId = typeof value.id === 'string' ? value.id.trim() : '';
    const entryFile = resolveEntryFile(value, idToFileMap);

    if (!entryId && !entryFile) {
      pushError(report, 'duplicates-dead-entries', 'Wpis statusowy bez id i file (martwy wpis).', { objectPath });
      return;
    }

    if (entryId) {
      const arr = idOccurrences.get(entryId) || [];
      arr.push({ objectPath, status: value.status, entryFile, entryId });
      idOccurrences.set(entryId, arr);
    }

    if (entryFile) {
      const arr = fileOccurrences.get(entryFile) || [];
      arr.push({ objectPath, status: value.status, entryFile, entryId });
      fileOccurrences.set(entryFile, arr);
    }
  });

  idOccurrences.forEach((occurrences, id) => {
    const liveLike = occurrences.filter(item => item.status === 'live' || item.status === 'planned');
    if (liveLike.length <= 1) {
      return;
    }

    const resolvedFiles = new Set(liveLike.map(item => item.entryFile || '<brak pliku>'));
    if (resolvedFiles.size > 1) {
      pushWarning(
        report,
        'duplicates-dead-entries',
        `Potencjalny konflikt id: "${id}" wskazuje różne pliki (${[...resolvedFiles].join(', ')}).`,
        { objectPaths: liveLike.map(item => item.objectPath) }
      );
    }
  });

  fileOccurrences.forEach((occurrences, file) => {
    const liveLike = occurrences.filter(item => item.status === 'live' || item.status === 'planned');
    if (liveLike.length <= 1) {
      return;
    }

    const concreteIds = liveLike.map(item => item.entryId).filter(Boolean);
    const distinctIds = new Set(concreteIds);
    const hasXlinkOrWiki = liveLike.some(item => item.status === 'xlink' || item.status === 'wiki');

    if (distinctIds.size > 1 && !hasXlinkOrWiki) {
      pushWarning(
        report,
        'duplicates-dead-entries',
        `Potencjalny duplikat pliku: "${file}" podpięty pod różne id (${[...distinctIds].join(', ')}).`,
        { objectPaths: liveLike.map(item => item.objectPath) }
      );
    }
  });

  pushOk(report, 'duplicates-dead-entries', 'Zakończono analizę duplikatów i martwych wpisów.');
}

/* Wypisuje raport szczegółowy oraz podsumowanie errors/warnings/ok. */
function printReport(report) {
  report.errors.forEach(issue => {
    console.error(`[ERROR][${issue.check}] ${issue.message}`);
  });

  report.warnings.forEach(issue => {
    console.warn(`[WARN][${issue.check}] ${issue.message}`);
  });

  report.ok.forEach(issue => {
    console.log(`[OK][${issue.check}] ${issue.message}`);
  });

  console.log('');
  console.log('=== PODSUMOWANIE check_content ===');
  console.log(`errors: ${report.errors.length}`);
  console.log(`warnings: ${report.warnings.length}`);
  console.log(`ok: ${report.ok.length}`);
}

/* Odczytuje parametry CLI. */
function parseArgs(argv) {
  let minChars = DEFAULT_MIN_CHARS_LIVE;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--min-chars') {
      const raw = argv[index + 1];
      const parsed = Number.parseInt(raw, 10);
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error('Parametr --min-chars musi być nieujemną liczbą całkowitą.');
      }
      minChars = parsed;
      index += 1;
    }
  }

  return { minChars };
}

/* Główna funkcja spinająca wszystkie kontrole. */
function main() {
  const { minChars } = parseArgs(process.argv.slice(2));
  const report = createReport();

  try {
    const siteConfig = loadSiteConfig();

    runMeasurementToolsStrictLint(siteConfig, report);
    runFileExistenceCheck(siteConfig, report);
    runMinimumVolumeCheck(siteConfig, report, minChars);
    runDuplicatesAndDeadEntriesCheck(siteConfig, report);

    printReport(report);
    process.exit(report.errors.length > 0 ? 1 : 0);
  } catch (error) {
    pushError(report, 'runtime', error.message || String(error));
    printReport(report);
    process.exit(1);
  }
}

main();
