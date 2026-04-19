# Katalog narzędzi pomiarowych — zasady operacyjne

## Cel dokumentu

Ten dokument porządkuje sposób dodawania i utrzymania wpisów w katalogu narzędzi pomiarowych (`measurementToolsByDomain` w `site-config.js`) tak, aby dane były spójne, audytowalne i użyteczne w UI.

## Checklista dodawania nowego narzędzia

> Uzupełnij wszystkie kroki przed oznaczeniem wpisu jako gotowego.

1. **Wybierz dziedzinę** i sprawdź, czy istnieje sekcja domeny w `measurementToolsByDomain`.
2. **Uzupełnij pola identyfikacyjne:** `id`, `name`, `type`.
3. **Uzupełnij pola merytoryczne:** `constructs`, `population`, `ageRange`, `administrationTime`, `scoring`.
4. **Uzupełnij pola jakościowe:** `evidenceLevel`, `reliability`, `validity`, `normsInfo`, `limitations`.
5. **Uzupełnij pola zgodności i bezpieczeństwa:** `ethicalNotes`, `contraindications`, `license`, `requiresPermissions`.
6. **Dodaj pola referencyjne:** `articleLinks`, `methodologyLinks`, `language`.
7. **Zweryfikuj słowniki kontrolowane** (`type`, `evidenceLevel`, `license`) względem `measurementToolsControlledVocabulary`.
8. **Dodaj minimum 1 link merytoryczny** w `methodologyLinks` (np. artykuł o rzetelności/trafności/normalizacji).
9. **Zaktualizuj datę domeny** w `measurementToolsDomainUpdates.<domain>.updatedAt` (format `YYYY-MM-DD`).
10. **Sprawdź UI** — czy wpis renderuje się poprawnie i czy widoczna jest sekcja „Ostatnia aktualizacja (dziedzina)”.

## Definition of Done (DoD) dla wpisu narzędzia

Wpis uznajemy za ukończony tylko wtedy, gdy:

- zawiera komplet pól obowiązkowych:
  - `id`, `name`, `type`, `constructs`, `population`, `ageRange`, `administrationTime`, `scoring`,
  - `evidenceLevel`, `license`, `requiresPermissions`, `language`,
  - `articleLinks`, `methodologyLinks`,
  - `reliability`, `validity`, `normsInfo`, `limitations`, `ethicalNotes`, `contraindications`;
- zawiera **co najmniej 1 link do artykułu merytorycznego** (`methodologyLinks.length >= 1`);
- używa wartości ze słowników kontrolowanych (`measurementToolsControlledVocabulary`);
- dla dziedziny wpisu ustawiono aktualne `updatedAt`.

## Ostatnia aktualizacja per dziedzina (`updatedAt`)

W każdej dziedzinie utrzymujemy metadane aktualizacji:

- lokalizacja: `measurementToolsDomainUpdates.<domain>.updatedAt` w `site-config.js`;
- format: `YYYY-MM-DD` (ISO);
- zasada: przy każdej zmianie wpisów narzędzi w domenie aktualizujemy odpowiadającą datę `updatedAt`.

## Cykliczny przegląd katalogu (kwartalny)

Przegląd wykonujemy raz na kwartał (Q1/Q2/Q3/Q4):

1. Przegląd kompletności pól obowiązkowych.
2. Przegląd aktualności linków (`articleLinks` i `methodologyLinks`).
3. Weryfikacja jakości opisów (`reliability`, `validity`, `limitations`, `ethicalNotes`).
4. Aktualizacja `updatedAt` dla każdej dziedziny, w której wykonano zmianę.

### Procedura oznaczania wpisów „do rewizji”

Wpis oznaczamy jako „do rewizji”, gdy:

- brakuje pola obowiązkowego,
- brak linku merytorycznego,
- link prowadzi do nieistniejącego artykułu,
- opis jakościowy jest nieaktualny lub niespójny.

Sugerowany workflow:

1. Dodać etykietę roboczą `DO_REWIZJI` w opisie problemu (issue / TODO zespołu).
2. Uzupełnić brakujące pola i/lub poprawić linki.
3. Po poprawce: usunąć etykietę `DO_REWIZJI`, zaktualizować `updatedAt`, zweryfikować render w UI.

## Uwagi końcowe

- Katalog ma charakter edukacyjny i nie zastępuje pełnej procedury diagnostycznej.
- Zmiany merytoryczne powinny być konsultowane z osobą odpowiedzialną za obszar psychometrii/diagnostyki.
