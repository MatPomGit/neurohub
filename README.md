# Portal Wiedzy Psychologicznej

## Walidacja konfiguracji narzędzi pomiarowych

- Szybka walidacja lokalna:
  - `node tools/lint-measurement-tools-config.js`
- Tryb **strict** (zalecany do CI):
  - `node tools/lint-measurement-tools-config.js --strict`

W trybie strict ostrzeżenia (`warn`) są traktowane jak błędy (`error`).

## Katalog narzędzi — zasada pola `primarySourceYear`

- `primarySourceYear` zapisujemy zawsze w formacie `YYYY`.
- Domyślna reguła: wpisujemy rok **pierwotnej publikacji wersji bazowej** narzędzia.
- Wyjątek: jeżeli narzędzie jest w projekcie definiowane przez **oficjalną rewizję** (np. nazwa zawiera numer rewizji, jak `ADOS-2` lub `DIVA-5`), wpisujemy rok tej rewizji.
- W sytuacjach spornych co do „pierwotnego” roku dopuszczamy krótki komentarz redakcyjny bezpośrednio przy wpisie narzędzia w `site-config.js`.
