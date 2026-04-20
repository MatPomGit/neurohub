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
