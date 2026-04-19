/*
 * Walidator konfiguracji narzędzi pomiarowych.
 * Działa zarówno w przeglądarce (window), jak i w Node.js (module.exports).
 */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.MeasurementToolsConfigValidator = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const CRITICAL_FIELDS = ['reliability', 'validity', 'normsInfo', 'limitations', 'ethicalNotes', 'contraindications'];
  const VOCAB_FIELDS = ['type', 'evidenceLevel', 'license'];

  /* Sprawdza, czy wartość tekstowa istnieje i po trim() nie jest pusta. */
  function hasNonEmptyText(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  /* Zwraca listę dozwolonych wartości słownikowych dla wskazanego pola. */
  function allowedValuesFor(config, fieldName) {
    const vocabulary = config?.measurementToolsControlledVocabulary;
    const values = vocabulary?.[fieldName];
    return Array.isArray(values) ? values : [];
  }

  /* Normalizuje identyfikator wpisu, żeby log zawsze miał postać domain/id. */
  function buildToolPath(domainKey, tool) {
    const toolId = hasNonEmptyText(tool?.id) ? tool.id.trim() : 'missing-id';
    return `${domainKey}/${toolId}`;
  }

  /* Dodaje wynik walidacji do raportu i nadaje poziom zgodnie z trybem strict. */
  function pushIssue(report, strict, baseLevel, path, field, message) {
    const level = strict && baseLevel === 'warn' ? 'error' : baseLevel;
    report.push({ level, path, field, message });
  }

  /* Waliduje complete config i zwraca raport (errors/warnings/all). */
  function validateMeasurementToolsConfig(siteConfig, options = {}) {
    const strict = Boolean(options.strict);
    const report = [];
    const byDomain = siteConfig?.measurementToolsByDomain;

    if (!byDomain || typeof byDomain !== 'object') {
      pushIssue(report, strict, 'error', 'measurementToolsByDomain', 'root', 'Brak lub niepoprawny obiekt measurementToolsByDomain.');
      return summarize(report);
    }

    Object.entries(byDomain).forEach(([domainKey, tools]) => {
      if (!Array.isArray(tools)) {
        pushIssue(report, strict, 'error', `${domainKey}/<domain>`, 'tools', 'Wartość domeny musi być tablicą narzędzi.');
        return;
      }

      tools.forEach(tool => {
        const path = buildToolPath(domainKey, tool);

        CRITICAL_FIELDS.forEach(fieldName => {
          if (!hasNonEmptyText(tool?.[fieldName])) {
            pushIssue(report, strict, 'error', path, fieldName, `Brak wymaganego pola krytycznego "${fieldName}".`);
          }
        });

        VOCAB_FIELDS.forEach(fieldName => {
          const value = tool?.[fieldName];
          const allowedValues = allowedValuesFor(siteConfig, fieldName);
          if (!hasNonEmptyText(value)) {
            pushIssue(report, strict, 'error', path, fieldName, `Brak wartości słownikowej dla pola "${fieldName}".`);
            return;
          }
          if (!allowedValues.includes(value)) {
            pushIssue(report, strict, 'error', path, fieldName, `Niedozwolona wartość "${value}" dla pola "${fieldName}".`);
          }
        });

        if (!Array.isArray(tool?.articleLinks) || tool.articleLinks.length === 0) {
          pushIssue(report, strict, 'warn', path, 'articleLinks', 'Brak powiązanych artykułów (articleLinks).');
        }

        if (!Array.isArray(tool?.methodologyLinks) || tool.methodologyLinks.length === 0) {
          pushIssue(report, strict, 'warn', path, 'methodologyLinks', 'Brak artykułów metodologicznych (methodologyLinks).');
        }

        if (!hasNonEmptyText(tool?.lastReviewed)) {
          pushIssue(report, strict, 'warn', path, 'lastReviewed', 'Brak pola lastReviewed (format YYYY-MM-DD).');
        }

        const hasPrimarySourceYear = Number.isFinite(tool?.primarySourceYear)
          || (typeof tool?.primarySourceYear === 'string' && /^\d{4}$/.test(tool.primarySourceYear.trim()));
        if (!hasPrimarySourceYear) {
          pushIssue(report, strict, 'warn', path, 'primarySourceYear', 'Brak pola primarySourceYear (format YYYY).');
        }
      });
    });

    return summarize(report);
  }

  /* Grupuje raport na listę błędów i ostrzeżeń dla łatwiejszego użycia. */
  function summarize(allIssues) {
    const errors = allIssues.filter(issue => issue.level === 'error');
    const warnings = allIssues.filter(issue => issue.level === 'warn');
    return {
      allIssues,
      errors,
      warnings,
      isValid: errors.length === 0,
    };
  }

  return {
    validateMeasurementToolsConfig,
  };
});
