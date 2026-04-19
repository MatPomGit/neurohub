---
lastReviewed: 2026-04-19
reviewCycleMonths: 24
evidenceCutoffDate: 2025-12-31
---

# Kontrola jakości i zarządzanie danymi

## Wprowadzenie i kontekst
Dane o niskiej jakości nie stają się wiarygodne dzięki zaawansowanej statystyce. W psychologii eksperymentalnej jakość danych musi być projektowana od początku: od formularza zbierania po archiwizację.

## Definicje kluczowych pojęć
- **Data Management Plan (DMP)** – plan cyklu życia danych: zbieranie, przechowywanie, przetwarzanie, udostępnianie.
- **Walidacja danych** – automatyczne i ręczne reguły wykrywania błędów.
- **Outlier** – obserwacja skrajna, która może być prawidłowa lub błędna.
- **Audytowalność** – możliwość prześledzenia, kto i dlaczego podjął decyzję dotyczącą danych.

## Mechanizmy i zależności
Kluczowe zależności:
1. Jakość wejścia (formularze, instrukcje) wpływa na poziom braków danych.
2. Spójność identyfikatorów warunkuje możliwość łączenia tabel.
3. Automatyzacja pipeline’u redukuje błędy ręcznej edycji.
4. Dziennik decyzji zwiększa reprodukowalność.

## Dobra praktyka
Przykład dobrej praktyki: każdy rekord przechodzi walidację zakresu, formatu i spójności logicznej, a transformacje danych są wykonywane skryptowo z wersjonowaniem.

**Konsekwencje:** mniej błędów technicznych, szybsza analiza i pełna ścieżka audytu.

## Zła praktyka (częsty błąd)
Przykład złej praktyki: ręczne poprawki „na szybko” w arkuszu bez historii zmian i bez aktualizacji słownika zmiennych.

**Konsekwencje:** utrata odtwarzalności oraz wysoka podatność na błędy niemożliwe do wykrycia po czasie.

## Perspektywa nieoczywista
Niekiedy uważa się, że rygor jakości danych jest potrzebny tylko w dużych projektach. W rzeczywistości małe próby są bardziej wrażliwe na pojedyncze błędy rekordów, więc wymagają jeszcze staranniejszej kontroli.

## Podsumowanie
- DMP jest dokumentem metodologicznym, nie administracyjnym.
- Automatyzacja i wersjonowanie powinny zastąpić ręczne operacje.
- Audytowalność danych jest warunkiem rzetelnego wnioskowania.

## Bibliografia
1. Borer, E. T., et al. (2009). Some simple guidelines for effective data management. *Bulletin of the Ecological Society of America, 90*(2), 205–214.
2. European Commission. (2016). *Guidelines on FAIR Data Management in Horizon 2020*.
3. Michener, W. K. (2015). Ecological data sharing. *Ecological Informatics, 29*, 33–44.
4. Wilkinson, M. D., et al. (2016). The FAIR guiding principles for scientific data management and stewardship. *Scientific Data, 3*, 160018.
