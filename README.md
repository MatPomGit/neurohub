# Portal Wiedzy Psychologicznej

## Workflow tworzenia artykułów

Poniżej znajduje się rekomendowany przepływ pracy dla autorów i redaktorów.

### 1) Utworzenie szablonu artykułu

Skorzystaj z narzędzia `tools/konwerter.py` w trybie `new-article`:

- `python3 tools/konwerter.py new-article wiki/kategoria/nowy_artykul.md --title "Tytuł artykułu"`

Polecenie utworzy plik `.md` z wymaganymi sekcjami:

- Wprowadzenie,
- Definicje,
- Analiza,
- Dobra praktyka,
- Zła praktyka,
- Perspektywa nieoczywista,
- Podsumowanie,
- Bibliografia.

### 2) Opracowanie treści

Uzupełnij każdą sekcję zgodnie ze standardem redakcyjnym projektu (rzetelność naukowa, poprawna polszczyzna, rozdzielenie faktów od opinii, argumentacja oparta na źródłach).

### 3) Walidacja redakcyjna

Uruchom walidator sekcji przed commitem:

- `python3 tools/konwerter.py validate-article wiki/kategoria/nowy_artykul.md`

Można walidować wiele plików naraz:

- `python3 tools/konwerter.py validate-article wiki/**/*.md`

### 4) Kontrola w hookach Git

Repozytorium zawiera hooki `pre-commit` i `pre-push`, które automatycznie sprawdzają **nowe** pliki `wiki/**/*.md`.

Aby je aktywować lokalnie:

- `git config core.hooksPath .githooks`

Od tego momentu:

- `pre-commit` waliduje nowe pliki `.md` dodane do indeksu,
- `pre-push` waliduje nowe pliki `.md` względem gałęzi upstream.

## Kryteria „gotowości do publikacji”

Artykuł uznaje się za gotowy do publikacji, gdy spełnia wszystkie kryteria:

1. Zawiera komplet wymaganych sekcji redakcyjnych.
2. Przechodzi walidację `validate-article` bez błędów.
3. Zawiera bibliografię opartą na wiarygodnych źródłach naukowych.
4. Przedstawia co najmniej jeden przykład dobrej praktyki i jeden przykład złej praktyki (lub częstego błędu).
5. Omawia perspektywę nieoczywistą wraz z argumentacją.
6. Został sprawdzony językowo (poprawność ortograficzna, interpunkcyjna i terminologiczna).

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
