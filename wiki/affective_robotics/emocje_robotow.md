---
lastReviewed: 2026-04-01
reviewCycleMonths: 24
evidenceCutoffDate: 2025-12-31
---

# Emocje w robotach — projektowanie i rozpoznawanie

## Czym są emocje w kontekście robotyki?

Pytanie o to, czy robot może „mieć" emocje, jest jednym z najbardziej dyskutowanych w kognitywistyce i filozofii umysłu. W praktyce inżynierskiej mówi się zwykle o dwóch odrębnych zadaniach:

- **rozpoznawanie emocji** — zdolność robota do wykrycia i interpretacji stanu emocjonalnego człowieka
- **wyrażanie emocji** — zdolność robota do komunikowania stanów wewnętrznych w sposób czytelny dla człowieka

Oba zadania są niezbędne do naturalnej, afektywnej interakcji człowiek–robot.

## Affective computing — obliczenia afektywne

Termin wprowadzony przez Rosalind Picard (MIT, 1997) opisuje systemy komputerowe zdolne do rozpoznawania, interpretowania i symulowania ludzkich emocji. Obliczenia afektywne opierają się na wielomodalnym przetwarzaniu danych wejściowych:

- **wyraz twarzy** — system kodowania ruchów mięśni twarzy FACS (Paul Ekman i Wallace Friesen, 1978)
- **ton i parametry głosu** — rytm, wysokość, tempo, energia
- **gestykulacja i postawa ciała** — kinematyka ruchów
- **sygnały fizjologiczne** — tętno, przewodność skóry (EDA), temperatura ciała, EEG

> **Fakt:** Paul Ekman zidentyfikował sześć emocji podstawowych (radość, smutek, gniew, strach, wstręt, zaskoczenie), które według jego badań są rozpoznawalne cross-kulturowo — stały się one podstawą wielu systemów rozpoznawania emocji w robotach.

## Systemy rozpoznawania emocji

### Rozpoznawanie wyrazu twarzy

Nowoczesne systemy oparte na sieciach konwolucyjnych (CNN) osiągają dokładność przekraczającą 90% w rozpoznawaniu podstawowych emocji ze zdjęć i wideo. Wyzwania obejmują: mikro-ekspresje trwające ułamki sekundy, różnice kulturowe w ekspresji oraz maskowanie emocji.

### Analiza głosu

Systemy SER (*Speech Emotion Recognition*) analizują prozodię, barwę i dynamikę głosu. Modele transformerowe (np. wav2vec) osiągają wysoką skuteczność nawet bez zrozumienia treści wypowiedzi.

### Sygnały fizjologiczne

Bransolety i sensory mierzące EDA (elektrodermalna aktywność), HRV (zmienność rytmu serca) i temperaturę skóry są coraz częściej integrowane z robotami terapeutycznymi i edukacyjnymi.

## Wyrażanie emocji przez roboty

### Mimika i ruch

Roboty humanoidalne takie jak **Sophia** (Hanson Robotics) posiadają silikonową skórę i silniki napędzające 50+ mięśni twarzy, umożliwiając bogatą ekspresję mimiczną. **Pepper** (SoftBank) i **NAO** używają uproszczonej, ale czytelnej mimiki oraz gestów ciała.

### Komunikacja werbalna i paralingwistyczna

Modulacja tonu, rytmu i głośności wypowiedzi przekazuje emocje nawet bez słów. Współczesne syntezatory mowy (np. ElevenLabs, Google WaveNet) umożliwiają naturalnie brzmiącą ekspresję emocjonalną.

### Kolor i oświetlenie

Wiele robotów (np. NAO, Cozmo) komunikuje stany wewnętrzne za pomocą koloru LED — czerwony sygnalizuje złość lub ostrzeżenie, niebieski spokój, zielony gotowość do interakcji.

> **Fakt:** Badania Kappasa i współpracowników (2010) wykazały, że roboty wyrażające emocje spójne z kontekstem sytuacyjnym są oceniane przez ludzi jako bardziej kompetentne i godne zaufania niż roboty „neutralne emocjonalnie".

## Wyzwania i kontrowersje

### Autentyczność vs symulacja

Kluczowe pytanie etyczne: czy robot *przeżywa* emocje, czy jedynie je *symuluje*? Większość badaczy przyjmuje stanowisko funkcjonalistyczne — robot wyraża stany funkcjonalnie odpowiadające emocjom, niezależnie od tego, czy towarzyszą im subiektywne przeżycia.

### Manipulacja emocjonalna

Roboty zdolne do wzbudzania emocji mogą być użyte manipulacyjnie — np. w celu zwiększenia zaangażowania klientów lub uzależnienia dzieci od interakcji. To poważne wyzwanie etyczne dla projektantów.

### Różnice kulturowe

Ekspresja i interpretacja emocji różnią się między kulturami. System trenowany na danych z jednego kręgu kulturowego może być znacznie mniej dokładny w innym.

## Podsumowanie

Projektowanie i rozpoznawanie emocji w robotach to jedno z najbardziej dynamicznych pól badawczych na skrzyżowaniu psychologii, neuronauki i inżynierii. Postęp w tej dziedzinie otwiera zarówno ogromne możliwości terapeutyczne i edukacyjne, jak i poważne pytania etyczne dotyczące granic symulacji i autentyczności.


## Wprowadzenie

Temat tego artykułu jest istotny dla praktyki psychologicznej, ponieważ łączy perspektywę teoretyczną z codziennymi decyzjami klinicznymi lub edukacyjnymi. W literaturze podkreśla się, że trafne rozumienie zjawiska wymaga uwzględnienia kontekstu biologicznego, społecznego i kulturowego. W niniejszym opracowaniu przyjmujemy podejście oparte na dowodach, oddzielając ustalenia empiryczne od interpretacji. Taki porządek ułatwia ocenę jakości argumentów i ogranicza ryzyko uproszczeń. Dzięki temu czytelnik może przełożyć wiedzę teoretyczną na bardziej świadome działania praktyczne.


## Definicje

W tym artykule kluczowe pojęcia są rozumiane w sposób operacyjny, tak aby można je było stosować w badaniach i praktyce. Definicja zjawiska obejmuje zarówno jego kryteria rozpoznania, jak i granice pojęciowe odróżniające je od konstruktów pokrewnych. Warto pamiętać, że część terminów ma kilka konkurencyjnych ujęć, zależnie od szkoły teoretycznej. Dlatego podczas interpretacji wyników należy zawsze wskazać, którą definicję przyjęto i dlaczego. Taka precyzja terminologiczna zwiększa porównywalność danych oraz jakość wnioskowania.


## Analiza

Mechanizmy omawianego zjawiska najlepiej wyjaśniać na kilku poziomach: poznawczym, emocjonalnym, behawioralnym i środowiskowym. Dane empiryczne zwykle pokazują, że efekt końcowy wynika z interakcji wielu czynników, a nie z pojedynczej przyczyny. Z perspektywy metodologicznej warto uwzględnić zarówno wyniki badań przekrojowych, jak i podłużnych, ponieważ odpowiadają one na różne pytania. Ograniczeniem bywa heterogeniczność prób i narzędzi pomiarowych, która utrudnia bezpośrednie porównania między badaniami. Mimo tych ograniczeń spójny obraz zjawiska można uzyskać, łącząc dane ilościowe, jakościowe i kliniczne.


## Dobra praktyka

Dobrą praktyką jest rozpoczynanie pracy od jasnego celu, kryteriów oceny postępów oraz wspólnego języka używanego przez specjalistę i odbiorcę interwencji. W praktyce oznacza to regularny monitoring efektów, krótkie cykle informacji zwrotnej i gotowość do modyfikacji planu działania. Wysoką skuteczność wspiera także psychoedukacja, która zwiększa poczucie sprawstwa i rozumienie procesu zmiany. Istotne jest ponadto respektowanie granic etycznych oraz uwzględnianie różnic indywidualnych. Konsekwencją takiego podejścia jest większa trwałość rezultatów i mniejsze ryzyko działań pozornych.


## Zła praktyka

Częstym błędem jest stosowanie jednego schematu postępowania niezależnie od kontekstu, potrzeb i możliwości danej osoby lub grupy. Problemem bywa również opieranie decyzji na intuicji bez sprawdzania jakości danych i aktualnych rekomendacji. W praktyce prowadzi to do nietrafnych interwencji, spadku motywacji oraz utraty zaufania do procesu wsparcia. Złą praktyką jest także pomijanie czynników systemowych, takich jak warunki środowiskowe czy bariery organizacyjne. Konsekwencje obejmują nie tylko słabsze efekty, ale również ryzyko wtórnej szkody psychologicznej.


## Perspektywa nieoczywista

Nieoczywista perspektywa polega na przesunięciu uwagi z pytania „co jest nie tak” na pytanie „jakie warunki podtrzymują aktualny wzorzec funkcjonowania”. Taki punkt widzenia pozwala dostrzec, że część zachowań ocenianych jako problemowe pełni funkcję adaptacyjną w krótkim horyzoncie czasu. W badaniach oznacza to potrzebę analizy kosztów i korzyści z perspektywy uczestnika, a nie wyłącznie obserwatora. W praktyce może to prowadzić do bardziej realistycznych celów i mniejszego oporu wobec zmiany. Ta rama interpretacyjna nie neguje trudności, lecz porządkuje je w kategoriach funkcji i kontekstu.


## Bibliografia

1. American Psychiatric Association. (2022). Diagnostic and Statistical Manual of Mental Disorders (5th ed., text rev.).
2. Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.
3. Nęcka, E., Orzechowski, J., & Szymura, B. (2020). Psychologia poznawcza. PWN.
4. World Health Organization. (2022). World Mental Health Report: Transforming mental health for all.
5. Zimbardo, P. G., Johnson, R. L., & McCann, V. (2021). Psychologia: kluczowe koncepcje. PWN.
