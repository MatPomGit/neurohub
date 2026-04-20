# Portal Wiedzy Psychologicznej

## Walidacja konfiguracji narzędzi pomiarowych

- Szybka walidacja lokalna:
  - `node tools/lint-measurement-tools-config.js`
- Tryb **strict** (zalecany do CI):
  - `node tools/lint-measurement-tools-config.js --strict`

W trybie strict ostrzeżenia (`warn`) są traktowane jak błędy (`error`).

## Jak uruchamiać testy UI

Moduł `modules/tests-ui.js` wymaga API przeglądarki (`window`, `document`, obsługa zdarzeń DOM). Próba uruchomienia go w „czystym” Node kończy się teraz czytelnym błędem z instrukcją dalszych kroków.

### Zalecane uruchomienie lokalne (jsdom)

1. Zainstaluj tymczasowo zależność:
   - `npm install --no-save jsdom`
2. Uruchom dedykowany runner:
   - `node tools/run-ui-tests-jsdom.js`

Runner przygotowuje środowisko DOM w `jsdom` i wykonuje smoke test ładowania modułu UI.

### Rekomendacja do CI

- Krok 1 (Node): lint i walidacja konfiguracji, np. `node tools/lint-measurement-tools-config.js --strict`.
- Krok 2 (DOM/jsdom): testy UI przez `node tools/run-ui-tests-jsdom.js` po zapewnieniu `jsdom`.

## Katalog narzędzi — zasada pola `primarySourceYear`

- `primarySourceYear` zapisujemy zawsze w formacie `YYYY`.
- Domyślna reguła: wpisujemy rok **pierwotnej publikacji wersji bazowej** narzędzia.
- Wyjątek: jeżeli narzędzie jest w projekcie definiowane przez **oficjalną rewizję** (np. nazwa zawiera numer rewizji, jak `ADOS-2` lub `DIVA-5`), wpisujemy rok tej rewizji.
- W sytuacjach spornych co do „pierwotnego” roku dopuszczamy krótki komentarz redakcyjny bezpośrednio przy wpisie narzędzia w `site-config.js`.
