# Referencja parsera: listy wielopoziomowe

## Kontekst testu
Ten artykuł referencyjny zawiera przypadki graniczne dla parsera Markdown w PsyHub. Celem jest sprawdzenie, czy zagnieżdżone listy numerowane i nienumerowane renderują się stabilnie.

## Przypadek 1: lista nienumerowana z trzema poziomami
- Poziom 1 — diagnoza
  - Poziom 2 — wywiad kliniczny
    - Poziom 3 — pytania o objawy
    - Poziom 3 — pytania o zasoby
  - Poziom 2 — obserwacja zachowania
- Poziom 1 — plan interwencji

### Dobra praktyka
- Utrzymuj spójne wcięcia (2 spacje).
  - Dzięki temu parser nie „gubi” poziomu.

### Zła praktyka
- Mieszanie wcięć przypadkowo.
   - Jeden poziom ma 3 spacje, a kolejny 2.

Konsekwencja: użytkownik otrzymuje niejednoznaczną strukturę i trudniej śledzić logikę listy.

## Przypadek 2: lista numerowana z trzema poziomami
1. Etap konceptualizacji
   1. Identyfikacja problemu
      1. Operacjonalizacja objawu
      2. Kryteria nasilenia
   2. Hipotezy robocze
2. Etap planowania
   1. Wybór narzędzi

## Przypadek 3: listy mieszane
1. Proces badawczy
   - Dobór próby
   - Walidacja narzędzia
     1. Rzetelność
     2. Trafność
2. Raportowanie
   - Ograniczenia
   - Implikacje praktyczne

### Perspektywa nieoczywista
W praktyce edukacyjnej listy pełnią rolę „mikro-struktury argumentu”. To nie tylko formatowanie, ale narzędzie epistemiczne: dobrze ułożona lista porządkuje relacje przyczynowo-skutkowe i obniża koszt poznawczy analizy tekstu.

## Podsumowanie
Parser powinien poprawnie obsłużyć:
- 2–3 poziomy zagnieżdżeń,
- zmianę typu listy (UL ↔ OL),
- przejrzystość semantyczną bez utraty czytelności.

## Bibliografia
1. Gruber, J. (2004). *Markdown* (specyfikacja pierwotna).
2. CommonMark. (2024). *CommonMark Spec*.
3. W3C. (2021). *HTML Living Standard* — sekcje dotyczące list.
