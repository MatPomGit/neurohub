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

## Metryki sukcesu (wyszukiwarka + kopiowanie linku)

W aplikacji zbierane są lokalnie (w `localStorage`) podstawowe metryki użyteczności:

1. **Czas znalezienia treści** (`firstClickTimesMs`)
   - Definicja: czas od rozpoczęcia zapytania do pierwszego kliknięcia wyniku.
   - Cel: spadek mediany tego czasu po wdrożeniu indeksu pełnotekstowego i TOC.

2. **CTR wyników wyszukiwania**
   - Definicja: `searchResultClicks / searchResultImpressions`.
   - Cel: wzrost CTR dzięki lepszym dopasowaniom i snippetom z treści artykułów.

3. **Użycie funkcji „Kopiuj link”** (`copyLinkUses`)
   - Definicja: liczba kliknięć przycisku kopiowania linku artykułu.
   - Cel: wzrost użycia przy nawigacji i współdzieleniu konkretnych treści.

4. **Liczba rozpoczętych sesji wyszukiwania** (`searchStarts`)
   - Definicja: liczba unikalnych zapytań rozpoczętych w sesji użytkownika.
   - Cel: pomocniczy wskaźnik kontekstu do interpretacji CTR i czasu.

## Walidacja konfiguracji narzędzi pomiarowych

- Szybka walidacja lokalna:
  - `node tools/lint-measurement-tools-config.js`
- Tryb **strict** (zalecany do CI):
  - `node tools/lint-measurement-tools-config.js --strict`

W trybie strict ostrzeżenia (`warn`) są traktowane jak błędy (`error`).

## Jak uruchamiać testy

W projekcie rozdzielamy testy na dwa niezależne typy:

- **Node-only** — testy konfiguracji i walidacji, bez API przeglądarki.
- **Browser-only (jsdom)** — testy modułów wymagających `window`/`document`.

### Lokalnie

1. Uruchom testy Node-only:
   - `node tools/run-node-tests.js`
2. Uruchom testy browser-only:
   - `npm install --no-save jsdom`
   - `node tools/run-ui-tests-jsdom.js`

`modules/tests-ui.js` jest modułem browser-only. Przy uruchomieniu w czystym Node moduł zwraca czytelny komunikat z frazą: `to test browser-only`.

### W CI

Konfiguracja CI powinna mieć dwa osobne joby:

1. `config-lint`:
   - `node tools/run-node-tests.js`
2. `browser-tests`:
   - `npm install --no-save jsdom`
   - `node tools/run-ui-tests-jsdom.js`

## Katalog narzędzi — zasada pola `primarySourceYear`

- `primarySourceYear` zapisujemy zawsze w formacie `YYYY`.
- Domyślna reguła: wpisujemy rok **pierwotnej publikacji wersji bazowej** narzędzia.
- Wyjątek: jeżeli narzędzie jest w projekcie definiowane przez **oficjalną rewizję** (np. nazwa zawiera numer rewizji, jak `ADOS-2` lub `DIVA-5`), wpisujemy rok tej rewizji.
- W sytuacjach spornych co do „pierwotnego” roku dopuszczamy krótki komentarz redakcyjny bezpośrednio przy wpisie narzędzia w `site-config.js`.


## Zintegrowana kontrola treści (CI)

Aby jednym poleceniem uruchomić pełny zestaw kontroli jakości treści i konfiguracji, użyj:

- `node tools/check_content.js`

Skrypt wykonuje:

1. strict lint `measurement-tools`,
2. sprawdzenie istnienia plików wskazanych w `site-config.js`,
3. kontrolę minimalnej objętości dla wpisów o statusie `live`,
4. detekcję potencjalnych duplikatów i martwych wpisów.

Dodatkowo wypisywany jest raport zbiorczy (`errors / warnings / ok`) i zwracany kod wyjścia `!= 0`, gdy pojawią się błędy.

Opcjonalnie możesz zmienić próg objętości:

- `node tools/check_content.js --min-chars 800`
