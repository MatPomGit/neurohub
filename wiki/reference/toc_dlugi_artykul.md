# Referencja TOC: długi artykuł i nawigacja hash

## Wprowadzenie
To jest artykuł testowy dla spisu treści (TOC). Zawiera wiele nagłówków drugiego i trzeciego poziomu, aby zweryfikować aktywną sekcję podczas przewijania oraz zachowanie hash navigation.

## Mechanika TOC w artykule
TOC powinien automatycznie wykrywać nagłówki `##` i `###`, a następnie budować z nich mapę nawigacyjną po dokumencie.

### Generowanie identyfikatorów sekcji
Każdy nagłówek wymaga stabilnego identyfikatora URL. Najczęściej stosuje się „slug” oparty na tekście nagłówka.

### Dedupikacja identycznych nagłówków
Jeżeli dwa nagłówki mają taki sam tekst, identyfikatory muszą być rozróżnione sufiksami liczbowymi.

## Zachowanie podczas przewijania
Aktywna sekcja TOC powinna aktualizować się zgodnie z tym, który nagłówek jest aktualnie widoczny w oknie.

### Dobra praktyka
Wykorzystanie `IntersectionObserver` zwykle obniża koszt obliczeniowy względem ręcznego nasłuchiwania scrolla dla każdego piksela.

### Częsty błąd
Ustawienie zbyt agresywnego `rootMargin` może powodować „migotanie” aktywnej sekcji.

## Integracja z hash navigation
Kliknięcie elementu TOC powinno aktualizować hash URL i przewijać użytkownika do właściwej sekcji.

### Stabilność linków bezpośrednich
Użytkownik wchodzący na adres z hashem sekcji powinien od razu trafić do właściwego miejsca w tekście.

### Niezależność od routingu strony
Hash sekcji nie może rozbijać mechanizmu przełączania artykułów. Routing strony i routing sekcji muszą współistnieć.

## Dodatkowe przypadki graniczne
Testuj także dłuższe treści, aby upewnić się, że podświetlenie aktywnej sekcji działa w środkowej i końcowej części dokumentu.

### Fragment A
Rozbudowany akapit testowy 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pulvinar, lorem eu ullamcorper consequat, nisl magna convallis nisi, vitae vulputate sem purus vel lorem.

### Fragment B
Rozbudowany akapit testowy 2: Integer id erat et sem dignissim fermentum. Curabitur aliquam mi eu odio feugiat, non malesuada lectus varius. Aenean quis finibus nibh.

### Fragment C
Rozbudowany akapit testowy 3: Proin convallis ante nec ligula varius, vitae posuere sem luctus. Morbi luctus volutpat mauris, non convallis est interdum at.

## Perspektywa nieoczywista
TOC jest nie tylko narzędziem UX. W praktyce badawczej może służyć jako „model poznawczy” dokumentu: ujawnia strukturę argumentu, wskazuje luki logiczne i ułatwia krytyczną ocenę narracji.

## Podsumowanie
Kluczowe kryteria akceptacyjne:
- TOC tworzy się automatycznie z `##` i `###`.
- Aktywna sekcja podświetla się podczas przewijania.
- Linkowanie sekcji nie psuje routingu artykułów.

## Bibliografia
1. Mozilla Developer Network. (2025). *Intersection Observer API*.
2. WHATWG. (2025). *URL Standard*.
3. Nielsen, J. (2020). *Web usability heuristics*.


## Definicje

W tym artykule kluczowe pojęcia są rozumiane w sposób operacyjny, tak aby można je było stosować w badaniach i praktyce. Definicja zjawiska obejmuje zarówno jego kryteria rozpoznania, jak i granice pojęciowe odróżniające je od konstruktów pokrewnych. Warto pamiętać, że część terminów ma kilka konkurencyjnych ujęć, zależnie od szkoły teoretycznej. Dlatego podczas interpretacji wyników należy zawsze wskazać, którą definicję przyjęto i dlaczego. Taka precyzja terminologiczna zwiększa porównywalność danych oraz jakość wnioskowania.


## Analiza

Mechanizmy omawianego zjawiska najlepiej wyjaśniać na kilku poziomach: poznawczym, emocjonalnym, behawioralnym i środowiskowym. Dane empiryczne zwykle pokazują, że efekt końcowy wynika z interakcji wielu czynników, a nie z pojedynczej przyczyny. Z perspektywy metodologicznej warto uwzględnić zarówno wyniki badań przekrojowych, jak i podłużnych, ponieważ odpowiadają one na różne pytania. Ograniczeniem bywa heterogeniczność prób i narzędzi pomiarowych, która utrudnia bezpośrednie porównania między badaniami. Mimo tych ograniczeń spójny obraz zjawiska można uzyskać, łącząc dane ilościowe, jakościowe i kliniczne.


## Dobra praktyka

Dobrą praktyką jest rozpoczynanie pracy od jasnego celu, kryteriów oceny postępów oraz wspólnego języka używanego przez specjalistę i odbiorcę interwencji. W praktyce oznacza to regularny monitoring efektów, krótkie cykle informacji zwrotnej i gotowość do modyfikacji planu działania. Wysoką skuteczność wspiera także psychoedukacja, która zwiększa poczucie sprawstwa i rozumienie procesu zmiany. Istotne jest ponadto respektowanie granic etycznych oraz uwzględnianie różnic indywidualnych. Konsekwencją takiego podejścia jest większa trwałość rezultatów i mniejsze ryzyko działań pozornych.


## Zła praktyka

Częstym błędem jest stosowanie jednego schematu postępowania niezależnie od kontekstu, potrzeb i możliwości danej osoby lub grupy. Problemem bywa również opieranie decyzji na intuicji bez sprawdzania jakości danych i aktualnych rekomendacji. W praktyce prowadzi to do nietrafnych interwencji, spadku motywacji oraz utraty zaufania do procesu wsparcia. Złą praktyką jest także pomijanie czynników systemowych, takich jak warunki środowiskowe czy bariery organizacyjne. Konsekwencje obejmują nie tylko słabsze efekty, ale również ryzyko wtórnej szkody psychologicznej.
