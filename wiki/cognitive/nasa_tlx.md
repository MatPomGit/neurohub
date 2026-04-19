---
lastReviewed: 2026-04-01
reviewCycleMonths: 24
evidenceCutoffDate: 2025-12-31
---

# NASA Task Load Index (NASA-TLX)

NASA Task Load Index (NASA-TLX) to wielowymiarowa skala do pomiaru subiektywnego obciążenia pracą umysłową, opracowana w latach 80. XX wieku przez Sandrego G. Harta i Lowell E. Staveland w Ames Research Center NASA. Jest jednym z najszerzej stosowanych narzędzi w ergonomii poznawczej, psychologii lotniczej i inżynierii czynników ludzkich.

## Historia i kontekst powstania

W latach 80. NASA prowadziła intensywne badania nad obciążeniem poznawczym pilotów i operatorów złożonych systemów. Istniejące jednoczątkowe miary (np. oceny na skali 1–10) okazały się niewystarczające — nie odzwierciedlały wielowymiarowego charakteru obciążenia umysłowego.

Hart i Staveland (1988) zaproponowali procedurę łączącą:

1. Sześć subiektywnych wymiarów obciążenia;
2. Ważenie wymiarów poprzez parowanie (procedura porównań par);
3. Wynik ważony — ogólny wskaźnik obciążenia.

Narzędzie przeszło walidację w warunkach symulatorów lotniczych, uzyskując wysoką rzetelność i trafność zbieżną z innymi miarami obciążenia (m.in. czasem podwójnego zadania, miarami fizjologicznymi).

## Sześć wymiarów NASA-TLX

| Wymiar | Oryginalna nazwa | Definicja |
|--------|-----------------|-----------|
| **Wymagania umysłowe** | Mental Demand | Ile myślenia, decydowania, obliczania, zapamiętywania wymagało zadanie? |
| **Wymagania fizyczne** | Physical Demand | Ile aktywności fizycznej (naciski, ciągnienie, sterowanie) wymagało zadanie? |
| **Wymagania czasowe** | Temporal Demand | Jak dużo presji czasu odczuwałeś/aś — czy tempo było pośpieszne czy powolne? |
| **Osiągane wyniki** | Performance | Jak dobrze oceniasz własne wyniki w stosunku do celów zadania? |
| **Wysiłek** | Effort | Jak ciężko musiałeś/aś pracować (umysłowo i fizycznie), by osiągnąć ten poziom wyników? |
| **Frustracja** | Frustration Level | Jak bardzo czułeś/aś irytację, stres, napięcie lub podrażnienie podczas zadania? |

Każdy wymiar oceniany jest na skali 0–100 (podzielonej na 20 przedziałów po 5 punktów).

> Wymiar „Osiągane wyniki" jest odwrócony: niska ocena (blisko 0) oznacza doskonałe wyniki, wysoka — słabe. Przy obliczaniu wskaźnika globalnego wynik Performance jest traktowany odwrotnie niż pozostałe wymiary.

## Procedura pomiaru

### Wersja oryginalna (z ważeniem)

Procedura dwuetapowa:

**Etap 1 — ocena wymiarów:** Bezpośrednio po wykonaniu zadania uczestnik ocenia każdy z 6 wymiarów na skali 0–100.

**Etap 2 — porównanie par (pairwise comparisons):** Uczestnik przegląda 15 par wymiarów (wszystkie kombinacje z 6 elementów) i wskazuje, który z każdej pary był ważniejszy dla jego ogólnego odczucia obciążenia w danym zadaniu. Na tej podstawie każdy wymiar otrzymuje wagę 0–5 (liczbę wyborów).

**Obliczanie wyniku ważonego:**

```
NASA-TLX = Σ (wynik_wymiaru × waga_wymiaru) / 15
```

Wynik mieści się w przedziale 0–100.

### Wersja uproszczona (Raw TLX)

W wersji Raw TLX (Hart, 2006) pomija się etap ważenia — oblicza się średnią arytmetyczną 6 wymiarów. Badania wykazały, że Raw TLX koreluje wysoce z wersją ważoną (r > 0,95) i jest równie czułą miarą obciążenia, co czyni ją popularnym wyborem w badaniach aplikacyjnych.

## Właściwości psychometryczne

**Rzetelność:** Alfa Cronbacha dla ogólnego wskaźnika wynosi typowo α = 0,72–0,86. Rzetelność test-retest jest umiarkowana (r ≈ 0,60–0,75), co jest uzasadnione — obciążenie jest zależne od kontekstu i może zmieniać się w kolejnych sesjach.

**Trafność zbieżna:** NASA-TLX koreluje z:

- Wydajnością wykonania zadania (miary obiektywne);
- Parametrami fizjologicznymi: częstością akcji serca, jej zmiennością (HRV), poziomem kortyzolu;
- Innymi skalami obciążenia: SWAT (Subjective Workload Assessment Technique), MCH (Modified Cooper-Harper).

**Trafność różnicowa:** Skala poprawnie różnicuje poziomy obciążenia w zadaniach o obiektywnie różnej trudności (np. loty VFR vs. IFR, sterowanie jednym vs. wieloma podsystemami).

> Metaanaliza Rubio i wsp. (2004) na 550 badaniach potwierdziła, że NASA-TLX jest jedną z najtrafniejszych i najczulszych subiektywnych miar obciążenia pracą.

## Obszary zastosowań

### Ergonomia i projektowanie interfejsów

NASA-TLX służy do oceny, jak różne projekty interfejsów, układy sterowania lub procedury wpływają na obciążenie operatora. Porównuje się wersje A i B produktu — lepsza jest ta, która generuje niższe obciążenie przy zachowaniu tego samego poziomu wyników.

### Psychologia lotnicza i wojskowa

Pierwotne zastosowanie narzędzia — ocena obciążenia pilotów myśliwców, pilotów cywilnych i operatorów bezzałogowych statków powietrznych (UAV/dronów). Wysoki wskaźnik NASA-TLX koreluje z ryzykiem błędów ludzkich.

### Medycyna i chirurgia

Liczne badania stosują NASA-TLX do pomiaru obciążenia poznawczego chirurgów (szczególnie w laparoskopii i operacjach robotycznych), lekarzy na dyżurach nocnych oraz ratowników medycznych. Wysokie obciążenie podczas procedur chirurgicznych jest predyktorem błędów i powikłań.

### Edukacja i e-learning

W badaniach nad nauczaniem NASA-TLX ocenia efektywność materiałów edukacyjnych — czy nowy format kursu zmniejsza obciążenie przy zachowaniu efektów uczenia.

### Praca z komputerem i telepraca

Stosowany do porównania obciążenia podczas pracy zdalnej vs. stacjonarnej, przy różnych narzędziach oprogramowania lub w warunkach wielozadaniowości.

## Ograniczenia i krytyka

**Subiektywność:** NASA-TLX mierzy subiektywne odczucie obciążenia, które może różnić się od obiektywnego pomiaru. Osoby o niskiej interocepcji mogą niedoszacowywać obciążenia.

**Efekt sufitu:** W ekstremalnie obciążających zadaniach (np. loty bojowe) wielu wymiarów osiąga maksimum, ograniczając czułość różnicującą.

**Retrospekcja:** Ocena dokonywana po zadaniu może być zniekształcona przez mechanizmy adaptacji, zapominania lub efekt końcowy (peak-end rule Kahnemana).

**Brak obiektywnych kotwic skali:** Wartości 0 i 100 są zdefiniowane opisowo ("bardzo niskie" vs. "bardzo wysokie"), co może prowadzić do różnic indywidualnych w rozumieniu krańców skali.

**Wymiar fizyczny:** W zadaniach czysto umysłowych (np. praca biurowa) wymiar Physical Demand uzyskuje stale niskie wyniki i może zaburzać interpretację ogólnego wskaźnika.

## Modyfikacje i wersje pochodne

- **NASA-TLX dla środowisk cyfrowych (NASA-RTLX):** Uproszczona wersja dla szybkiego zastosowania w testach UX.
- **Multi-Attribute Task Battery (MATB):** Zestaw zadań laboratoryjnych stworzony przez NASA do wywoływania kontrolowanego obciążenia mierzalnego NASA-TLX.
- **Wersja pediatryczna i geriatryczna:** Adaptacje z uproszczonymi kotwicami werbalnymi.
- **NASA-TLX w czasie rzeczywistym:** Wersje umożliwiające ocenę co kilka minut podczas długotrwałych zadań.

## NASA-TLX a teoria obciążenia poznawczego

NASA-TLX nawiązuje do teorii obciążenia poznawczego (Cognitive Load Theory, Sweller, 1988), która wyróżnia trzy typy obciążenia:

- **Obciążenie wewnętrzne (intrinsic):** Trudność materiału/zadania.
- **Obciążenie zewnętrzne (extraneous):** Niepotrzebna złożoność wynikająca ze sposobu prezentacji.
- **Obciążenie istotne (germane):** Wysiłek potrzebny do tworzenia schematów poznawczych.

Wymiar Mental Demand NASA-TLX koreluje z intrinsic load, zaś Effort — z obciążeniem łącznym. Skala nie mierzy bezpośrednio obciążenia zewnętrznego, co jest często przytaczane jako obszar jej uzupełnienia przez narzędzia behawioralne (np. czasy reakcji w zadaniu dodatkowym).

> **Przykład kliniczny:** Badanie Langa i wsp. (2013) wykazało, że chirurdzy wykonujący laparoskopową resekcję okrężnicy uzyskują istotnie wyższe wyniki NASA-TLX w nocy (po dyżurze) niż rano, co korelowało z wydłużonym czasem operacji i większą liczbą odchyleń od standardowej techniki. Dane te posłużyły jako argument za reorganizacją harmonogramów dyżurów.
