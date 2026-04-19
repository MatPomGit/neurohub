---
lastReviewed: 2026-04-01
reviewCycleMonths: 24
evidenceCutoffDate: 2025-12-31
---

# Standard redakcyjny przypisów i bibliografii (v1)

Ten dokument definiuje minimalny standard cytowania dla treści w `wiki/**/*.md`.

## Zakres stosowania

- Obowiązuje wszystkie nowe i aktualizowane artykuły.
- Priorytet wdrożenia (iteracja 1): `wiki/diagnostics`, `wiki/psychometrics`, `wiki/forensic_psychology`.

## Zasady obowiązkowe

1. Każde twierdzenie faktograficzne, kliniczne, prawne lub statystyczne, które może być kwestionowane, musi mieć odwołanie przypisowe w tekście: `[^id]`.
2. Definicje przypisów umieszczamy na końcu artykułu po nagłówku `## Bibliografia (APA 7)`.
3. Każda pozycja bibliograficzna ma format APA 7.
4. Gdy dostępny jest DOI lub stabilny URL, należy go dodać na końcu wpisu.
5. Identyfikatory przypisów powinny być krótkie i jednoznaczne, np. `[^nasreddine2005]`, `[^kpk]`.

## Minimalny szablon

```md
Treść twierdzenia wymagającego źródła.[^id]

## Bibliografia (APA 7)

[^id]: Nazwisko, I. I. (Rok). Tytuł. *Czasopismo, tom*(numer), strony. https://doi.org/...
```

## Plan iteracyjny

- Iteracja 1 (zrealizowana częściowo): wdrożenie wzorca w wybranych artykułach działów wysokiego ryzyka.
- Iteracja 2: rozszerzenie na pozostałe pliki w wymienionych działach.
- Iteracja 3: rozszerzenie na resztę `wiki/**`.
