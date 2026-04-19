#!/usr/bin/env node
/*
 * Skrypt lintujący konfigurację narzędzi pomiarowych bez uruchamiania aplikacji.
 * Tryb strict podnosi ostrzeżenia do poziomu błędu i zwraca kod wyjścia != 0.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const validatorPath = path.join(repoRoot, 'measurement-tools-validator.js');
const siteConfigPath = path.join(repoRoot, 'site-config.js');

/* Ładuje moduł walidatora i konfigurację strony do kontekstu Node.js. */
function loadConfigAndValidator() {
  const validatorModule = require(validatorPath);
  const validator = validatorModule?.validateMeasurementToolsConfig;

  if (typeof validator !== 'function') {
    throw new Error('Nie udało się załadować validateMeasurementToolsConfig z measurement-tools-validator.js');
  }

  const configCode = fs.readFileSync(siteConfigPath, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(configCode, sandbox, { filename: 'site-config.js' });

  if (!sandbox.window?.SITE_CONFIG) {
    throw new Error('Nie udało się odczytać window.SITE_CONFIG z site-config.js');
  }

  return { validator, siteConfig: sandbox.window.SITE_CONFIG };
}

/* Formatuje i wypisuje pojedynczy wpis raportu walidacji. */
function logIssue(issue) {
  const prefix = `[PsyHub][measurement-tools][${issue.level}]`;
  const message = `${prefix} ${issue.path} | ${issue.field} | ${issue.message}`;
  if (issue.level === 'error') {
    console.error(message);
  } else {
    console.warn(message);
  }
}

function main() {
  const strict = process.argv.includes('--strict');
  const { validator, siteConfig } = loadConfigAndValidator();
  const report = validator(siteConfig, { strict });

  report.allIssues.forEach(logIssue);

  if (report.isValid) {
    console.log(`[PsyHub][measurement-tools][ok] Walidacja zakończona sukcesem (strict=${strict}).`);
    process.exit(0);
  }

  console.error(`[PsyHub][measurement-tools][summary] errors=${report.errors.length}, warnings=${report.warnings.length}, strict=${strict}`);
  process.exit(1);
}

main();
