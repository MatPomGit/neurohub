---
lastReviewed: 2026-04-01
reviewCycleMonths: 24
evidenceCutoffDate: 2025-12-31
---

# Kontrola jakości i zarządzanie danymi

Jakość danych to osobny strumień pracy, który powinien być planowany tak samo szczegółowo jak metodologia eksperymentu.

## Plan zarządzania danymi (Data Management Plan)

Plan powinien obejmować:

- strukturę katalogów i konwencję nazw,
- słownik zmiennych,
- harmonogram backupów,
- role i uprawnienia,
- procedurę archiwizacji.

## Walidacja danych

Wprowadź automatyczne reguły walidacji:

- zakresy dopuszczalnych wartości,
- wykrywanie duplikatów,
- kontrola braków,
- flagowanie nietypowych sekwencji odpowiedzi.

## Obsługa braków i outlierów

Jeszcze przed analizą ustal:

- jak identyfikujesz outliery,
- kiedy rekord jest wykluczany,
- jak traktujesz brakujące dane (np. imputacja/analiza pełnych przypadków).

## Reprodukowalność pipeline’u

Każda transformacja danych powinna być zapisana i możliwa do odtworzenia. Unikaj ręcznej edycji „w arkuszu bez historii”.

## Audytowalność

Dobra praktyka: utrzymuj dziennik decyzji danych z datą, autorem i uzasadnieniem. To znacząco ułatwia przegląd metodologiczny i replikację.
