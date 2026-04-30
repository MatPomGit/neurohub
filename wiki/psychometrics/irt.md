---
lastReviewed: 2026-04-01
reviewCycleMonths: 24
evidenceCutoffDate: 2025-12-31
---

# IRT i model Rascha

Teoria odpowiedzi na pozycje (Item Response Theory, IRT) to nowoczesne podejście do pomiaru psychologicznego, które modeluje relację między cechą latentną (nieobserwowalną) a prawdopodobieństwem odpowiedzi na każdą pozycję testową. Stanowi alternatywę dla klasycznej teorii testu (CTT), usuwając jej ograniczenia.

## Ograniczenia CTT i motywacja dla IRT

Klasyczna teoria testu (CTT) zakłada, że rzetelność testu zależy od konkretnej próby badanych — im bardziej jednorodna próba, tym niższy szacowany współczynnik rzetelności. Trudność pozycji i zdolność osoby są wyrażone na różnych skalach i nie mogą być bezpośrednio porównywane.

IRT rozwiązuje te problemy przez:
- Umieszczenie trudności pozycji i zdolności osoby na tej samej skali (logity)
- Parametry pozycji niezależne od próby (w teorii)
- Możliwość adaptacyjnego testowania

## Model Rascha (model 1PL)

**Model Rascha** (Georg Rasch, 1960) jest najprostszym modelem IRT. Zakłada, że prawdopodobieństwo poprawnej odpowiedzi zależy tylko od różnicy między zdolnością osoby (θ) a trudnością pozycji (b):

*P(X=1 | θ, b) = exp(θ - b) / [1 + exp(θ - b)]*

Cecha charakterystyczna: model Rascha jest **probabilistycznym modelem addytywnym** — jeśli dane dobrze pasują do modelu, wyniki są mierzalne w sensie Raasha (porównywalne jak temperatura w stopniach Celsjusza, nie tylko w rankingach).

> **Intuicja:** Jeśli zdolność osoby θ = trudność pozycji b, prawdopodobieństwo odpowiedzi poprawnej wynosi 50%. Każde odchylenie o 1 logit zwiększa/zmniejsza prawdopodobieństwo ok. 25 punktów procentowych.

## Model 2PL i 3PL

**Model 2-parametrowy (2PL, Birnbaum)** dodaje parametr dyskryminacji (a) — jak strome jest przejście od małej do dużej szansy odpowiedzi poprawnej. Pozycje z wysoką dyskryminacją lepiej różnicują osoby o zbliżonych zdolnościach.

**Model 3-parametrowy (3PL)** dodaje parametr zgadywania (c) — dolną asymptotę krzywej charakterystycznej pozycji. Stosowany przy testach wyboru, gdzie możliwość zgadywania jest realna.

## Krzywa charakterystyczna pozycji (ICC)

**ICC (Item Characteristic Curve)** to graficzna reprezentacja relacji między zdolnością (θ) a prawdopodobieństwem odpowiedzi poprawnej. Dla modelu Rascha jest to krzywa logistyczna. Analiza ICC pozwala wykrywać pozycje, które zachowują się inaczej dla różnych grup (DIF — Differential Item Functioning).

## Funkcja informacyjna

**Funkcja informacyjna pozycji (IIF)** opisuje, jak precyzyjnie dana pozycja mierzy zdolność w różnych punktach skali. Każda pozycja jest najbardziej informacyjna w okolicach swojej trudności.

**Testowa funkcja informacyjna (TIF)** to suma IIF wszystkich pozycji. Pozwala ocenić, dla jakich poziomów zdolności test jest najdokładniejszy, i dostosować dobór pozycji do zamierzonego celu pomiaru.

## Komputerowe testowanie adaptacyjne (CAT)

**CAT** (Computerized Adaptive Testing) to najważniejsze praktyczne zastosowanie IRT. Komputer dobiera kolejne pytania na podstawie aktualnego szacunku zdolności osoby. Efektem jest:
- Krótszy test (50–60% mniej pozycji) przy tej samej dokładności
- Brak frustracji z pytaniami zbyt łatwymi lub zbyt trudnymi
- Mniejsze ryzyko zmęczenia testowego

Przykłady: GRE, niektóre testy adaptacyjne ADHD i depresji.

## Analiza DIF

**DIF (Differential Item Functioning)** oznacza, że pozycja zachowuje się inaczej dla różnych grup (np. płeć, kultura) po kontroli za poziom zdolności. Jest to wskaźnik stronniczości testu (test bias).

Wykrycie DIF nie zawsze oznacza błąd — pozycja może rzeczywiście mierzyć nieco inną cechę w różnych grupach (impact vs. bias).

## Dopasowanie modelu

Dane empiryczne rzadko idealnie pasują do wybranego modelu IRT. Standardem jest analiza dopasowania (fit statistics):
- **Infit** — ważony przez informację, czuły na anomalie w centrum skali
- **Outfit** — nieważony, czuły na ekstremalne odpowiedzi

Pozycje z nieodpowiednim dopasowaniem powinny być rewizowane lub usunięte.

> **Wybór modelu:** Model Rascha jest bardziej restrykcyjny (zakłada równą dyskryminację pozycji), ale daje mocniejsze właściwości pomiarowe. Modele 2PL/3PL są bardziej elastyczne, ale mogą nadmiernie dopasowywać się do danych. Wybór zależy od celów pomiaru i filozofii pomiarowej.


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


## Podsumowanie

Najważniejszy wniosek jest taki, że rzetelne rozumienie omawianego tematu wymaga łączenia definicji, danych empirycznych i konsekwencji praktycznych. Skuteczne działania opierają się na dopasowaniu metod do celu, monitorowaniu efektów oraz świadomym zarządzaniu ograniczeniami. Jednocześnie należy zachować ostrożność wobec nadmiernych uogólnień, bo jakość wniosków zależy od kontekstu i jakości pomiaru. Włączenie perspektywy alternatywnej zwiększa trafność diagnozy i użyteczność interwencji. Ostatecznie to właśnie integracja wiedzy teoretycznej z praktyką decyduje o wartości edukacyjnej i klinicznej artykułu.


## Bibliografia

1. American Psychiatric Association. (2022). Diagnostic and Statistical Manual of Mental Disorders (5th ed., text rev.).
2. Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.
3. Nęcka, E., Orzechowski, J., & Szymura, B. (2020). Psychologia poznawcza. PWN.
4. World Health Organization. (2022). World Mental Health Report: Transforming mental health for all.
5. Zimbardo, P. G., Johnson, R. L., & McCann, V. (2021). Psychologia: kluczowe koncepcje. PWN.
