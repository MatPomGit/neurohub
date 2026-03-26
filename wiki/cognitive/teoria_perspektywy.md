# Teoria perspektywy (Prospect Theory)

Teoria perspektywy (ang. *Prospect Theory*) to deskryptywna teoria podejmowania decyzji w warunkach ryzyka, sformułowana przez Daniela Kahnemana i Amosa Tversky'ego w 1979 roku. Stanowi fundamentalne odejście od normatywnego modelu racjonalnego aktora — teorii oczekiwanej użyteczności — i jest jednym z kamieni węgielnych ekonomii behawioralnej.

## Geneza i motywacja teoretyczna

Teoria oczekiwanej użyteczności (Expected Utility Theory — EUT), sformułowana przez von Neumanna i Morgensterna (1944), zakłada, że racjonalny decydent:

1. Ocenia wyniki w kategoriach stanu końcowego (bogactwa);
2. Ma stabilne, przechodnie preferencje;
3. Waży subiektywną użyteczność przez obiektywne prawdopodobieństwo.

Kahneman i Tversky zauważyli systematyczne naruszenia EUT w empirycznych badaniach preferencji. Przez serię eksperymentów (słynny *Allais Paradox* oraz własne eksperymenty z „perspektywami" — gamblami) zidentyfikowali wzorce, których EUT nie potrafiła wyjaśnić, i zaproponowali nowy model.

> Daniel Kahneman otrzymał Nagrodę Nobla w dziedzinie ekonomii w 2002 roku — w dużej mierze za teorię perspektywy. Amos Tversky nie dożył tego wyróżnienia (zmarł w 1996 r.).

## Kluczowe komponenty teorii

### 1. Funkcja wartości (Value Function)

W odróżnieniu od EUT, teoria perspektywy zakłada, że wartość jest oceniana **względem punktu odniesienia** (zwykle status quo), nie w kategoriach absolutnego stanu bogactwa.

Funkcja wartości ma trzy kluczowe właściwości:

**a) Kształt w kształcie litery S:**

- W domenie zysków (powyżej punktu odniesienia) — wklęsła (malejąca wrażliwość krańcowa);
- W domenie strat (poniżej punktu odniesienia) — wypukła (malejąca wrażliwość na straty).

**b) Malejąca wrażliwość (Diminishing Sensitivity):** Różnica między 10 a 20 zł jest subiektywnie odczuwana jako większa niż między 1010 a 1020 zł — zarówno dla zysków, jak i strat.

**c) Asymetria zysk–strata (Loss Aversion):** Funkcja wartości jest bardziej stroma po stronie strat niż zysków. Empirycznie strata jest psychologicznie ok. 2–2,5 razy bardziej dotkliwa niż zysk tej samej wielkości.

```
Wartość (v)
     |        /
     |      /        ← domena zysków (wklęsła)
     |    /
─────┼──────────── Zyski/Straty
     |    \
     |      \        ← domena strat (wypukła, stroma)
     |        \
```

### 2. Funkcja wag prawdopodobieństwa (Probability Weighting Function)

W EUT prawdopodobieństwa są stosowane bezpośrednio. Teoria perspektywy zakłada, że ludzie **przekształcają** obiektywne prawdopodobieństwa w subiektywne wagi decyzyjne π(p):

- **Przecenianie małych prawdopodobieństw:** p = 0,01 jest ważone wyżej niż 0,01 (stąd atrakcyjność loterii i ubezpieczeń na katastrofę).
- **Niedocenianie średnich i dużych prawdopodobieństw:** p = 0,9 jest ważone niżej niż 0,9.
- **Efekt pewności (Certainty Effect):** Pewność (p = 1,0) jest nieproporcjonalnie preferowana względem wysokiego prawdopodobieństwa (np. 0,99).

Funkcja wag π(p) ma kształt odwróconej S — jest wklęsła dla wysokich i wypukła dla niskich prawdopodobieństw.

### 3. Kodowanie zysków i strat

Decydent nie ocenia wyników w wartościach absolutnych, lecz jako **zyski lub straty względem punktu odniesienia**. Punkt odniesienia zazwyczaj odpowiada obecnemu stanowi posiadania, oczekiwanemu wynikowi lub aspiracji.

Zmiana punktu odniesienia zmienia ocenę tej samej opcji: premia 500 zł jest odczuwana jako zysk, jeśli spodziewano się 0 zł, ale jako strata, jeśli spodziewano się 1000 zł.

## Awersja do strat — centralny mechanizm

Awersja do strat (*loss aversion*) jest najważniejszą, empirycznie najlepiej udokumentowaną właściwością teorii perspektywy. Formalnie wyraża się jako:

```
|v(-x)| > |v(+x)|   dla wszystkich x > 0
```

Typowy współczynnik awersji do strat λ ≈ 2,0–2,5 (Kahneman i Tversky, 1992).

### Konsekwencje awersji do strat

- **Efekt dyspozycji:** Inwestorzy trzymają przegrywające akcje (unikają realizacji straty) i sprzedają wygrywające za wcześnie (realizują zysk).
- **Status quo bias:** Awersja do zmiany, bo każda zmiana niesie ryzyko straty (nawet jeśli w oczekiwaniu jest neutralna).
- **Efekt posiadania (Endowment Effect):** Przedmioty, które posiadamy, wyceniamy wyżej niż identyczne przedmioty, których nie posiadamy — posiadanie tworzy punkt odniesienia.
- **Niechęć do negocjacji:** Każda ustępstwo jest kodowane jako strata.

> **Przykład badania:** Thaler (1980) prosił studentów, by wskazali minimalną cenę, za jaką sprzedaliby losowo przydzielony im kubek (mediana: ~5,25 $). Inni studenci pytani o maksymalną cenę, jaką zapłaciliby za taki kubek, podawali ~2,75 $. Ta sama wartość użytkowa — dwukrotna różnica w wycenie wynikająca wyłącznie z efektu posiadania.

## Izolacja i efekt ramowania

Teoria perspektywy przewiduje, że decydenci często **izolują** jeden aspekt problemu (upraszczają zadanie), zamiast analizować go globalnie. Prowadzi to do preferencji zależnych od sposobu przedstawienia (ramowania) — co jest bezpośrednio sprzeczne z EUT, która wymaga niezmienności opisowej.

Klasyczny eksperyment ramowania (Kahneman i Tversky, 1981 — „choroba azjatycka"):

**Rama zysku:**
> „Jeśli przyjęty zostanie Program A, uratowanych zostanie 200 osób. Jeśli Program B — z prawdopodobieństwem 1/3 uratowanych zostanie 600 osób, a z prawdopodobieństwem 2/3 nikt nie przeżyje."

72% respondentów wybiera Program A (awersja do ryzyka w domenie zysku).

**Rama straty:**
> „Jeśli przyjęty zostanie Program C, umrze 400 osób. Jeśli Program D — z prawdopodobieństwem 1/3 nikt nie umrze, a z prawdopodobieństwem 2/3 umrze 600 osób."

78% respondentów wybiera Program D (poszukiwanie ryzyka w domenie straty).

Matematycznie A = C i B = D. Zmiana ramy całkowicie odwraca preferencje.

## Skumulowana teoria perspektywy (CPT)

W 1992 roku Kahneman i Tversky sformułowali **skumulowaną teorię perspektywy** (*Cumulative Prospect Theory*, CPT), która rozszerza model na wiele wyników:

- Wagi prawdopodobieństwa są stosowane do **skumulowanych** (rang-porządkowych) prawdopodobieństw, co eliminuje naruszenie dominacji stochastycznej;
- CPT jest aksjomatycznie spójna i odpowiada na krytykę matematyczną teorii oryginalnej;
- Stosuje oddzielne funkcje wag dla zysków (π⁺) i strat (π⁻).

CPT jest standardową wersją teorii perspektywy stosowaną we współczesnej ekonomii behawioralnej.

## Zastosowania kliniczne i praktyczne

### Komunikacja medyczna i health framing

Lekarze i psycholodzy zdrowia powinni być świadomi, że:

- Komunikat „operacja ma 10% śmiertelności" i „operacja ma 90% przeżywalności" wywołują różne reakcje — mimo identycznej treści;
- Pacjenci są bardziej skłonni do działania profilaktycznego, gdy informacja jest ramowana jako zapobieganie stracie zdrowia, nie jako osiągnięcie zdrowia;
- Awersja do strat wyjaśnia, dlaczego pacjenci unikają badań przesiewowych (wynik negatywny jest pewny, ale diagnoza może przynieść „stratę").

### Finanse behawioralne

Teoria perspektywy jest podstawą wyjaśnienia:

- Premii za ryzyko akcji (*equity premium puzzle*);
- Efektu dyspozycji wśród inwestorów indywidualnych;
- Popularności ubezpieczeń od małych strat i loterii.

### Projektowanie interwencji (Nudging)

Opierając się na teorii perspektywy, Thaler i Sunstein (2008) stworzyli podejście *nudging* — projektowania wyborów poprzez manipulację punktem odniesienia lub ramą. Przykład: automatyczne zapisywanie do programów emerytalnych (opt-out zamiast opt-in) zwiększa uczestnictwo, gdyż zmiana status quo jest kosztem.

### Negocjacje i mediacje

Negocjatorzy i mediatorzy stosują wiedzę o awersji do strat, by:

- Reframować ustępstwa jako uniknięcie straty, nie jako zysk;
- Rozumieć, że obie strony mogą postrzegać tę samą propozycję jako stratę;
- Unikać kotwiczenia na niesprzyjającym punkcie odniesienia.

## Ograniczenia teorii

- Teoria ma charakter deskryptywny (opisuje, jak ludzie decydują), nie normatywny (jak powinni). Nie wskazuje, jak podjąć optymalną decyzję.
- Punkt odniesienia jest definiowany ogólnikowo — empirycznie jego wyznaczenie bywa trudne.
- Model zakłada stabilność awersji do strat, tymczasem λ może się zmieniać w zależności od nastroju, zmęczenia czy stawek.
- Teoria dotyczy indywidualnych decyzji jednoetapowych; rozszerzenie na sekwencje decyzji i decyzje grupowe wymaga dodatkowych modeli.

> **Podsumowanie:** Teoria perspektywy ujawniła, że ludzkie decyzje są asymetryczne — straty bolą bardziej niż cieszą zyski tej samej wartości. Punkt odniesienia, nie obiektywny wynik, jest głównym wyznacznikiem subiektywnej wartości. To fundamentalne odkrycie zrewolucjonizowało ekonomię, politykę publiczną i psychologię kliniczną.
