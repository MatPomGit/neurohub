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


## 9. Model treści dydaktycznej (ścieżka → moduł → lekcja → mini-zadanie → checkpoint)

### 9.1 Definicje poziomów
- **Ścieżka (Path):** pełny program nauki dla konkretnego celu (np. „Android Developer Start”).
- **Moduł (Module):** większy blok kompetencyjny w obrębie ścieżki (np. „Stan UI i nawigacja”).
- **Lekcja (Lesson):** najmniejsza jednostka treści do przyswojenia i przećwiczenia.
- **Mini-zadanie (Mini-task):** krótkie zadanie praktyczne po lekcji, wymagane do odblokowania kolejnych elementów.
- **Checkpoint umiejętności (Skill checkpoint):** formalna walidacja kompetencji po grupie lekcji.

### 9.2 Struktura danych (kontrakt produktowy)
```json
{
  "path": {
    "id": "android-kotlin-compose",
    "title": "Android: Kotlin + Jetpack Compose",
    "modules": [
      {
        "id": "and-mod-1",
        "title": "Fundamenty Kotlin i Android Studio",
        "prerequisites": [],
        "estimatedHours": 10,
        "difficulty": "beginner",
        "unlockCondition": "always",
        "lessons": [
          {
            "id": "and-l-1",
            "title": "Zmienne, funkcje, null safety",
            "estimatedMinutes": 60,
            "miniTask": {
              "id": "and-t-1",
              "title": "Kalkulator BMI",
              "completionRule": "all_tests_passed"
            }
          }
        ],
        "checkpoint": {
          "id": "and-cp-1",
          "title": "Budowa prostej aplikacji jednookienkowej",
          "passRule": "rubric_score>=70"
        }
      }
    ]
  }
}
```

### 9.3 Zasady progresji
1. Lekcja przechodzi do statusu „ukończona” po zaliczeniu mini-zadania.
2. Checkpoint odblokowuje się po ukończeniu wszystkich lekcji modułu.
3. Moduł uznaje się za zaliczony po pozytywnym checkpointcie.
4. Kolejny moduł odblokowuje się wyłącznie po spełnieniu `unlockCondition`.

## 10. Trzy roadmapy startowe

### 10.1 Android — Kotlin / Jetpack Compose
| Moduł | Zakres | Wymagania wstępne | Szacowany czas | Trudność | Warunek odblokowania |
|---|---|---|---:|---|---|
| A1. Fundamenty Kotlin i Android Studio | składnia Kotlin, Gradle, debugowanie | brak | 10 h | beginner | startowy |
| A2. Compose UI i zarządzanie stanem | composables, state hoisting, Material 3 | A1 | 14 h | beginner+ | ukończony checkpoint A1 |
| A3. Nawigacja i architektura | Navigation Compose, ViewModel, UDF | A2 | 12 h | intermediate | ukończony checkpoint A2 |
| A4. Dane i komunikacja z API | Retrofit/Ktor, Room, mapowanie modeli | A3 | 16 h | intermediate | ukończony checkpoint A3 |
| A5. Jakość i publikacja MVP | testy UI, testy jednostkowe, release build | A4 | 10 h | intermediate+ | ukończony checkpoint A4 |

### 10.2 iOS — Swift / SwiftUI
| Moduł | Zakres | Wymagania wstępne | Szacowany czas | Trudność | Warunek odblokowania |
|---|---|---|---:|---|---|
| I1. Fundamenty Swift i Xcode | typy, kontrola przepływu, tooling | brak | 10 h | beginner | startowy |
| I2. SwiftUI Essentials | layout, state, binding, komponenty | I1 | 14 h | beginner+ | ukończony checkpoint I1 |
| I3. Architektura i nawigacja | MVVM, NavigationStack, dependency flow | I2 | 12 h | intermediate | ukończony checkpoint I2 |
| I4. Persistence i API | URLSession, Codable, Core Data/SwiftData | I3 | 16 h | intermediate | ukończony checkpoint I3 |
| I5. Stabilizacja i TestFlight | testy, profilowanie, dystrybucja | I4 | 10 h | intermediate+ | ukończony checkpoint I4 |

### 10.3 Cross-platform — Flutter / React Native
| Moduł | Zakres | Wymagania wstępne | Szacowany czas | Trudność | Warunek odblokowania |
|---|---|---|---:|---|---|
| X1. Fundamenty środowiska cross-platform | setup SDK, emulatory, workflow | brak | 12 h | beginner | startowy |
| X2. UI i komponenty | widgety/komponenty, stylowanie, layout | X1 | 16 h | beginner+ | ukończony checkpoint X1 |
| X3. Stan aplikacji | Provider/BLoC lub Redux/Zustand | X2 | 14 h | intermediate | ukończony checkpoint X2 |
| X4. Integracje natywne i API | pluginy, storage, REST/GraphQL | X3 | 18 h | intermediate+ | ukończony checkpoint X3 |
| X5. Build, QA i publikacja | testy, CI/CD, release Android+iOS | X4 | 12 h | intermediate+ | ukończony checkpoint X4 |

## 11. Mechanizm postępu

### 11.1 Definicje metryk
- **Procent modułu:** udział ukończonych lekcji w module.
- **Procent ścieżki:** udział ukończonych modułów (zaliczone checkpointy) w całej ścieżce.

### 11.2 Formuły
- `moduleProgress = completedLessonsInModule / totalLessonsInModule * 100`
- `pathProgress = completedModulesInPath / totalModulesInPath * 100`

### 11.3 Reguła aktualizacji
Po oznaczeniu lekcji jako „ukończona” system:
1. aktualizuje `completedLessonsInModule`,
2. przelicza `moduleProgress`,
3. sprawdza, czy moduł spełnia warunki aktywacji checkpointu,
4. po zaliczeniu checkpointu aktualizuje `completedModulesInPath`,
5. przelicza `pathProgress` i wyznacza „następny krok”.

## 12. Widok „Co już umiesz”

### 12.1 Cel widoku
Widok ma wzmacniać motywację i orientację poznawczą studenta przez prezentację kompetencji, a nie wyłącznie listy ukończonych treści.

### 12.2 Źródło danych
- wyłącznie zaliczone checkpointy,
- mapowanie checkpoint → lista umiejętności (hard/soft),
- poziom opanowania: podstawowy / operacyjny / samodzielny.

### 12.3 Prezentacja
1. Lista „Umiesz już” (karty kompetencji z krótkim opisem zastosowania).
2. Sekcja „Dowód umiejętności” (link do mini-zadań lub artefaktów).
3. Sekcja „Następny krok” (jedna rekomendacja uruchamiana bez dodatkowego wyszukiwania).

## 13. Kryteria akceptacji UX

### 13.1 Kryterium główne
Student po wejściu do ścieżki **w mniej niż 5 sekund** identyfikuje kolejny krok i może go uruchomić jednym kliknięciem.

### 13.2 Kryteria szczegółowe (Given/When/Then)
1. **Given** student ma niedokończony moduł, **When** otwiera dashboard ścieżki, **Then** widzi przycisk „Kontynuuj lekcję X” nad listą modułów.
2. **Given** student ukończył lekcję, **When** wraca do widoku ścieżki, **Then** procent modułu i ścieżki aktualizuje się bez ręcznego odświeżenia.
3. **Given** student zaliczył checkpoint, **When** otwiera „Co już umiesz”, **Then** nowa kompetencja jest widoczna wraz z dowodem zaliczenia.
4. **Given** kolejny moduł jest zablokowany, **When** student próbuje go otworzyć, **Then** system pokazuje brakujący warunek odblokowania i skrót do miejsca jego realizacji.
5. **Given** student kończy ścieżkę, **When** otwiera dashboard, **Then** widzi status „Ścieżka ukończona” i rekomendację następnej ścieżki.

### 13.3 Miary UX do monitorowania
- CTR przycisku „Kontynuuj następny krok” ≥ 85%.
- Mediana czasu znalezienia następnej aktywności ≤ 10 sekund.
- Odsetek sesji z „błądzeniem nawigacyjnym” (≥3 nieproduktywne przejścia) ≤ 15%.


## 14. Bibliografia uzupełniająca (projektowanie ścieżek)
1. Mayer, R. E. (2020). *Multimedia Learning* (3rd ed.). Cambridge University Press.
2. Clark, R. C., Nguyen, F., & Sweller, J. (2011). *Efficiency in Learning: Evidence-Based Guidelines to Manage Cognitive Load*. Pfeiffer.
3. Anderson, L. W., & Krathwohl, D. R. (red.) (2001). *A Taxonomy for Learning, Teaching, and Assessing*. Longman.
4. Ambrose, S. A. i in. (2010). *How Learning Works: Seven Research-Based Principles for Smart Teaching*. Jossey-Bass.
5. Nielsen, J. (1994). *Usability Engineering*. Morgan Kaufmann.
