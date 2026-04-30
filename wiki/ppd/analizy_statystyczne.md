---
lastReviewed: 2026-04-01
reviewCycleMonths: 24
evidenceCutoffDate: 2025-12-31
---

# Analizy statystyczne w badaniach psychologicznych

Statystyki są narzędziem — nie celem pracy magisterskiej. Celem jest odpowiedź na pytania badawcze, a statystyki są językiem, w którym ta odpowiedź jest formułowana. Wybór właściwych analiz jest równie ważny jak poprawne ich wykonanie.

## Planowanie analiz przed zbieraniem danych

**Preregistracja analiz** (przed zebraniem danych) to rosnący standard w psychologii. Polega na publicznym zapisaniu planowanych hipotez, metody i analiz (np. w OSF — Open Science Framework) przed zebraniem danych. Chroni przed **p-hackingiem** i zwiększa wiarygodność wyników.

Nawet bez preregistracji warto przed badaniem zaplanować:
- Jakie testy zastosujemy do każdej hipotezy?
- Jakie będą zmienne niezależne, zależne i kontrolne?
- Czy będziemy przeprowadzać analizy moderacji/mediacji?
- Jak postąpimy z wartościami odstającymi (outliers)?

## Statystyki opisowe

Zawsze zacznij od statystyk opisowych. Dla każdej zmiennej ciągłej oblicz:
- **Średnią arytmetyczną (M)**
- **Odchylenie standardowe (SD)**
- **Minimum i maksimum**
- **Skośność i kurtozę** (wskaźniki normalności rozkładu)

Dla zmiennych kategorycznych: **częstości** i **odsetki (%)**.

## Sprawdzanie założeń

Większość testów parametrycznych (t, ANOVA, regresja) wymaga spełnienia założeń:

| Założenie | Test/sprawdzenie |
|-----------|-----------------|
| Normalność rozkładu | Shapiro-Wilk (n < 50), K-S, histogram, Q-Q plot |
| Homogeniczność wariancji | Levene'a, Bartletta |
| Liniowość relacji | Wykres rozproszenia, kwadratura reszt |
| Niezależność obserwacji | Wynika z projektu badania |
| Brak multikolinearności (regresja) | VIF < 10, tolerancja > 0,1 |

Naruszenie założenia wymaga albo **transformacji danych** (logarytm, pierwiastek), albo zastosowania **testów nieparametrycznych**.

## Testy istotności — kiedy stosować?

### Porównanie grup

| Sytuacja | Test parametryczny | Test nieparametryczny |
|----------|-------------------|----------------------|
| 2 grupy niezależne | t-test dla prób niezależnych | U Manna-Whitneya |
| 2 grupy zależne (pomiary powtórzone) | t-test dla prób zależnych | Wilcoxona |
| 3+ grupy niezależne | ANOVA jednokierunkowa | Kruskala-Wallisa |
| 3+ grupy, czynnik powtórzony | ANOVA z pomiarami powtórzonymi | Friedmana |
| 2 czynniki | ANOVA dwuczynnikowa | — |

### Zależności między zmiennymi

| Sytuacja | Test |
|----------|------|
| Dwie zmienne ciągłe | Korelacja r Pearsona |
| Dwie zmienne porządkowe | Korelacja ρ Spearmana lub τ Kendalla |
| Dwie zmienne nominalne | Chi-kwadrat (χ²) |
| Predykcja liniowa | Regresja prosta lub wielokrotna |
| Mediacja, moderacja | Regresja z bootstrappingiem (PROCESS, lavaan) |
| Zmienne binarne | Regresja logistyczna |

## Wielkość efektu (effect size)

**Wartość p mówi nam, czy efekt istnieje. Wielkość efektu mówi nam, jak duży jest.**

Raportowanie wyłącznie wartości p bez wielkości efektu jest niewystarczające i coraz częściej krytykowane.

| Test | Miara wielkości efektu | Interpretacja |
|------|------------------------|---------------|
| t-test | Cohen's d | 0,2 mały; 0,5 średni; 0,8 duży |
| ANOVA | η² (eta kwadrat) / ω² | 0,01; 0,06; 0,14 |
| Korelacja | r | 0,10; 0,30; 0,50 |
| Regresja | R², ΔR² | — |
| Chi-kwadrat | Cramér's V, φ | 0,10; 0,30; 0,50 |

## Przedziały ufności

Podawaj **95% przedziały ufności (CI)** dla kluczowych parametrów. Przedziały ufności mówią, w jakim zakresie znajduje się prawdziwa wartość parametru z 95% prawdopodobieństwem. Wąski CI = precyzyjny oszacunek. Jeśli CI dla różnicy nie zawiera 0, efekt jest istotny statystycznie.

## Programy statystyczne

| Program | Zalety | Dostęp |
|---------|--------|--------|
| **SPSS** | Intuicyjny interfejs graficzny, popularny w Polsce | Płatny (licencje uczelniane) |
| **R + RStudio** | Bezpłatny, elastyczny, publikowalne skrypty | Bezpłatny |
| **Jamovi** | Intuicyjny, bezpłatny, oparty na R | Bezpłatny |
| **JASP** | Statystyki bayesowskie i klasyczne | Bezpłatny |
| **PROCESS (Hayes)** | Mediacja, moderacja w SPSS/R | Bezpłatny plugin |

> **Wskazówka:** Jamovi i JASP to doskonałe alternatywy dla SPSS — bezpłatne, łatwe i produkujące tabele gotowe do wklejenia do pracy.

## Raportowanie wyników statystycznych (styl APA)

Standardowe raportowanie w stylu APA 7:

- **t-test:** *t*(df) = wartość, *p* = wartość, *d* = wartość, 95% CI [dolny, górny]
- **ANOVA:** *F*(df_between, df_within) = wartość, *p* = wartość, η² = wartość
- **Korelacja:** *r*(df) = wartość, *p* = wartość, 95% CI [dolny, górny]
- **Regresja:** *b* = wartość, *SE* = wartość, *β* = wartość, *t*(df) = wartość, *p* = wartość

Przykład: *Uczestnicy w grupie eksperymentalnej uzyskali istotnie wyższe wyniki (M = 42,3, SD = 8,1) niż w grupie kontrolnej (M = 36,7, SD = 9,4), t(148) = 3,72, p = 0,003, d = 0,64, 95% CI [2,5, 8,7].*

## Tabele i wykresy

- Każda tabela i wykres powinny mieć **numer i opis** (zgodnie z APA 7)
- Tabele: unikaj pionowych linii; użyj poziomych linii wyłącznie w nagłówkach i stopce
- Wykresy: osie z opisami i jednostkami; legenda; brak zbędnych „śmieci" graficznych (*chart junk*)
- Zawsze podawaj *n* w grupach

## Statystyki bayesowskie

Alternatywa dla klasycznych testów istotności — Bayesian Factor (BF) mówi, ile razy bardziej prawdopodobna jest hipoteza badawcza niż zerowa przy zaobserwowanych danych. BF > 3 wspiera H1, BF < 1/3 wspiera H0. Dostępne w JASP.

## Podsumowanie

Analiza statystyczna wymaga planowania, znajomości założeń i odpowiedniego raportowania. Nie wystarczy „wrzucić danych do SPSS-a" — każda decyzja analityczna powinna być świadoma i uzasadniona. Wyniki należy interpretować nie tylko przez pryzmat *p*, ale też wielkości efektu, przedziałów ufności i kontekstu teoretycznego.


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
