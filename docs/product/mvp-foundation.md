# Fundament MVP produktu PsyHub

## 1. Cel produktu
Celem produktu **PsyHub** w wersji MVP jest stworzenie spójnego, mierzalnego i możliwego do szybkiej iteracji środowiska edukacyjnego, które:
- umożliwia studentowi przejście od poziomu początkującego do wykonania pierwszego działającego prototypu,
- wspiera prowadzącego w publikacji materiałów, zbieraniu zadań i udzielaniu informacji zwrotnej,
- zapewnia administratorowi kontrolę jakości treści, procesu i metryk operacyjnych.

W perspektywie 4 tygodni MVP ma potwierdzić, że proces dydaktyczny jest:
1. **zrozumiały** (użytkownicy wiedzą, co robić dalej),
2. **wykonalny** (użytkownicy domykają kluczowe kroki bez wsparcia ad hoc),
3. **skalowalny operacyjnie** (prowadzący i admin są w stanie obsłużyć proces przy ograniczonych zasobach).

## 2. Grupy użytkowników

### 2.1 Student
**Profil:** osoba rozpoczynająca naukę, często bez doświadczenia praktycznego.

**Główne potrzeby:**
- jasna ścieżka „krok po kroku”,
- szybkie uruchomienie pierwszego środowiska i wykonanie pierwszego zadania,
- czytelny feedback i kryteria oceny.

**Kryteria wartości:**
- student wie, co ma zrobić w danym tygodniu,
- student potrafi samodzielnie oddać zadanie,
- student uzyskuje pierwszy działający prototyp do końca modułu startowego.

### 2.2 Prowadzący
**Profil:** ekspert merytoryczny odpowiedzialny za przygotowanie i ocenę pracy studentów.

**Główne potrzeby:**
- szybka publikacja treści i zadań,
- jednoznaczne rubryki oceny,
- ograniczenie czasu operacyjnego (powtarzalne działania, komunikacja masowa).

**Kryteria wartości:**
- prowadzący publikuje materiał i zadanie bez wsparcia technicznego,
- prowadzący ocenia prace według jednolitych kryteriów,
- czas obsługi pojedynczego cyklu zadaniowego pozostaje przewidywalny.

### 2.3 Admin
**Profil:** osoba odpowiedzialna za konfigurację, nadzór procesowy i monitorowanie KPI.

**Główne potrzeby:**
- kontrola kompletności treści i terminów,
- monitorowanie metryk i ryzyk,
- szybkie reagowanie na odchylenia (opóźnienia, przeciążenia, luki jakościowe).

**Kryteria wartości:**
- admin ma minimalny panel kontrolny procesu,
- admin identyfikuje ryzyka przed eskalacją,
- admin utrzymuje regularny rytm aktualizacji wersji i DoD.

## 3. Zakres MVP na 4 tygodnie

### Tydzień 1 — Fundament treści i ścieżki
- przygotowanie modułu startowego (wprowadzenie + instrukcja środowiska + pierwsze zadanie),
- publikacja kryteriów oceny i szablonu oddania,
- konfiguracja podstawowego monitoringu KPI (arkusz / dashboard operacyjny).

### Tydzień 2 — Pierwszy cykl dydaktyczny
- uruchomienie ścieżki studenta od rejestracji do oddania zadania,
- publikacja zadania przez prowadzącego i test procesu oceny,
- zasilenie metryk danymi z pierwszego tygodnia działania.

### Tydzień 3 — Iteracja jakościowa
- poprawki treści na podstawie danych i feedbacku,
- skrócenie czasu obsługi błędów i niejasności,
- standaryzacja informacji zwrotnej prowadzącego.

### Tydzień 4 — Walidacja MVP
- domknięcie dwóch pełnych scenariuszy użytkownika,
- ocena osiągnięcia KPI progowych,
- decyzja: kontynuacja / pivot / rozszerzenie backlogu.

## 4. KPI MVP (mierzalne)

| KPI | Definicja | Wzór pomiaru | Próg MVP (4 tygodnie) | Częstotliwość |
|---|---|---|---|---|
| Czas ukończenia pierwszego modułu | Mediana czasu od startu modułu do oddania pierwszego zadania | `median(data_oddania - data_startu)` | ≤ 7 dni | tygodniowo |
| Odsetek oddanych zadań w terminie | Udział zadań oddanych przed deadlinem | `liczba_oddanych_w_terminie / liczba_wszystkich_oddanych * 100%` | ≥ 80% | tygodniowo |
| Średni czas rozwiązania błędu krytycznego | Średni czas od zgłoszenia do zamknięcia błędu blokującego postęp | `avg(data_zamknięcia - data_zgłoszenia)` | ≤ 48 h | tygodniowo |
| Czas publikacji zadania przez prowadzącego | Czas od rozpoczęcia tworzenia zadania do publikacji | `avg(data_publikacji - data_rozpoczęcia_edycji)` | ≤ 30 min | tygodniowo |
| Odsetek studentów z pierwszym prototypem | Udział aktywnych studentów, którzy dostarczyli działający prototyp | `liczba_studentów_z_prototypem / liczba_studentów_aktywnych * 100%` | ≥ 70% | na koniec T4 |

**Uwaga operacyjna:** progi KPI są progami walidacji MVP, nie docelowym standardem produkcyjnym.

## 5. Definition of Done (DoD)

### 5.1 DoD dla modułów edukacyjnych
Moduł edukacyjny uznaje się za „Done”, gdy spełnia wszystkie kryteria:

1. **Cele i efekty uczenia**
   - opisane minimum 2 mierzalne efekty uczenia,
   - każdy efekt mapuje się na co najmniej jedno zadanie lub element weryfikacji.

2. **Treść i kompletność**
   - moduł zawiera: wprowadzenie, instrukcję wykonania, kryteria oceny, FAQ,
   - wszystkie linki i załączniki działają.

3. **Kryteria akceptacji**
   - zdefiniowane kryteria „zaliczone/niezaliczone” dla zadania,
   - podane przykłady minimalnie poprawnego rozwiązania.

4. **Test scenariusza**
   - przeprowadzony test „cold start” przez osobę nieautorską,
   - brak blokera uniemożliwiającego ukończenie modułu.

5. **Jakość dydaktyczna**
   - język prosty i jednoznaczny,
   - oszacowany czas pracy studenta (np. 90–120 min).

6. **Metadane wersji**
   - `Data aktualizacji`: YYYY-MM-DD,
   - `Wersja modułu`: semver (np. 0.1.0),
   - `Właściciel modułu`: rola lub osoba.

### 5.2 DoD dla funkcji produktowych
Funkcja produktowa uznawana jest za „Done”, gdy spełnia wszystkie kryteria:

1. **Kryteria akceptacji**
   - spisane w formacie Given/When/Then,
   - pokrywają scenariusz pozytywny i co najmniej 1 scenariusz błędny.

2. **Test scenariusza**
   - wykonany test end-to-end dla kluczowego przepływu,
   - potwierdzona obsługa błędów użytkownika (walidacje, komunikaty).

3. **Jakość techniczna i operacyjna**
   - brak błędów krytycznych i wysokich,
   - telemetryka dla KPI (eventy / logi) dostępna po wdrożeniu.

4. **Dokumentacja i wdrożenie**
   - uzupełniony opis funkcji i ograniczeń,
   - wskazany plan rollbacku lub bezpiecznego wyłączenia.

5. **Metadane wersji**
   - `Data aktualizacji`: YYYY-MM-DD,
   - `Wersja funkcji`: semver (np. 0.1.0),
   - `Status`: Draft / Active / Deprecated.

## 6. Minimalne scenariusze użytkownika

### 6.1 Student: „od zera do pierwszego prototypu”
1. Student loguje się po raz pierwszy i widzi moduł startowy.
2. Przechodzi checklistę uruchomienia środowiska.
3. Wykonuje ćwiczenie wprowadzające i uruchamia szablon projektu.
4. Tworzy pierwszy prosty prototyp zgodnie z instrukcją.
5. Oddaje zadanie przez formularz wraz z linkiem/artefaktem.
6. Otrzymuje ocenę oraz krótkie wskazówki do iteracji.

**Warunek sukcesu:** student dostarcza działający prototyp i przechodzi moduł w czasie ≤ 7 dni.

### 6.2 Prowadzący: „publikuje i ocenia zadanie”
1. Prowadzący wybiera szablon zadania.
2. Uzupełnia opis, kryteria i termin oddania.
3. Publikuje zadanie do wskazanej grupy.
4. Otrzymuje zgłoszenia studentów w jednym widoku.
5. Ocenia pracę według rubryki i przekazuje feedback.
6. Zamyka cykl zadania oraz eksportuje podsumowanie.

**Warunek sukcesu:** publikacja + ocena przebiegają bez wsparcia technicznego, a średni czas publikacji zadania ≤ 30 min.

## 7. Checklista ryzyk i plan mitigacji

| Ryzyko | Sygnał ostrzegawczy | Wpływ | Mitigacja | Właściciel | Status |
|---|---|---|---|---|---|
| Braki treści w module startowym | Niekompletne sekcje / brak instrukcji | Student nie kończy modułu | Blokada publikacji bez spełnienia DoD + przegląd treści 48h przed startem | Prowadzący | Otwarte |
| Opóźnienia template’ów | Brak gotowego szablonu do ćwiczeń | Przesunięcie harmonogramu i frustracja studentów | Utrzymanie „template fallback” + priorytet P1 dla zespołu tworzącego szablony | Admin + Dev | Otwarte |
| Przeciążenie prowadzących | Wydłużony czas oceniania i opóźniony feedback | Spadek jakości procesu uczenia | Rubryki oceny, batchowanie sprawdzania, limit liczby aktywnych zadań tygodniowo | Admin | Otwarte |

## 8. Podsumowanie
Zakres MVP na 4 tygodnie koncentruje się na walidacji najbardziej krytycznych przepływów dydaktycznych i operacyjnych: ukończenia pierwszego modułu przez studenta oraz publikacji i oceny zadania przez prowadzącego. Przyjęte KPI i Definition of Done umożliwiają obiektywną ocenę postępu, a checklista ryzyk ogranicza prawdopodobieństwo opóźnień i spadku jakości.

---

### Bibliografia
1. Kerzner, H. (2022). *Project Management: A Systems Approach to Planning, Scheduling, and Controlling* (13th ed.). Wiley.
2. Ries, E. (2011). *The Lean Startup*. Crown Business.
3. Croll, A., & Yoskovitz, B. (2013). *Lean Analytics*. O’Reilly Media.
4. Bloom, B. S. (red.) (1956). *Taxonomy of Educational Objectives: The Classification of Educational Goals*. Longman.
5. Biggs, J., & Tang, C. (2011). *Teaching for Quality Learning at University* (4th ed.). Open University Press.
