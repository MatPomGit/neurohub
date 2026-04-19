# Portal Wiedzy Psychologicznej

## Walidacja konfiguracji narzędzi pomiarowych

- Szybka walidacja lokalna:
  - `node tools/lint-measurement-tools-config.js`
- Tryb **strict** (zalecany do CI):
  - `node tools/lint-measurement-tools-config.js --strict`

W trybie strict ostrzeżenia (`warn`) są traktowane jak błędy (`error`).
