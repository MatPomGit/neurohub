# PsyHub — TODO (realny plan pracy)

> Ostatnia aktualizacja: 2026-04-20  
> Źródło weryfikacji: `app.js`, `index.html`, `site-config.js`, komendy CLI (Node.js)

## Done (zweryfikowane)

- [x] **Przełączanie motywu UI (dark / light / sepia) działa i zapisuje wybór w `localStorage`.**  
  **Właściciel:** Frontend  
  **Priorytet:** P1  
  **Definition of Done:** Kliknięcie przycisku motywu zmienia `data-theme` na `<html>` i utrzymuje ustawienie po odświeżeniu.

- [x] **Parser Markdown obsługuje obrazy `![alt](url)`.**  
  **Właściciel:** Frontend  
  **Priorytet:** P1  
  **Definition of Done:** Dla składni obrazka parser generuje tag `<img ... loading="lazy">`.

- [x] **Nawigacja SPA używa `history.pushState`/`replaceState` i hash routingu.**  
  **Właściciel:** Frontend  
  **Priorytet:** P1  
  **Definition of Done:** Przejście między artykułami aktualizuje URL (`#id`), działa `popstate`, a widok ładuje właściwy artykuł.

- [x] **`plans.disability_psychology` istnieje i zawiera wpisy `live`.**  
  **Właściciel:** Content + Config  
  **Priorytet:** P2  
  **Definition of Done:** W `site-config.js` istnieje klucz `plans.disability_psychology` oraz komplet wpisów z poprawnymi ścieżkami plików.

- [x] **Sekcje nawigacji i plany dla nowych domen (`spoleczna`, `kulturowa`, `rozwojowa`, `uzaleznienia`, `relacje`, `etyka`) są obecne.**  
  **Właściciel:** Content + Config  
  **Priorytet:** P2  
  **Definition of Done:** Domena ma wpisy w `nav` i odpowiadający klucz w `plans`.

- [x] **Jeden „source of truth” dla logiki UI (`app.js` vs skrypt inline w `index.html`).**
  **Właściciel:** Frontend Lead  
  **Priorytet:** P0  
  **Definition of Done:** Ustalony i udokumentowany jeden aktywny plik źródłowy logiki aplikacji; duplikaty usunięte lub automatycznie generowane.

- [x] **Status „live” rzeczywiście oznacza „niepusty artykuł” dla całego repo wiki.**  
  **Właściciel:** Content QA  
  **Priorytet:** P1  
  **Definition of Done:** Raport pokazuje 0 przypadków `status: 'live'` dla plików pustych lub brakujących.  
  **Weryfikacja:** 2026-04-20, `node tools/check_content.js --min-chars 1` → wynik: `errors: 0`, `warnings: 0`.

## To verify

- [ ] **Spójność mapowania: każdy wpis `nav` ma odpowiadający wpis planu w tej samej domenie (lub uzasadniony wyjątek).**  
  **Właściciel:** Content + Config  
  **Priorytet:** P2  
  **Definition of Done:** Automatyczna walidacja wykazuje brak niespójności nav↔plans.  
  **Weryfikacja:** 2026-04-20, `node -e "const fs=require('fs');const vm=require('vm');const code=fs.readFileSync('site-config.js','utf8');const s={window:{}};vm.createContext(s);vm.runInContext(code,s);const c=s.window.SITE_CONFIG;const issues=[];for(const sec of c.nav||[]){const plan=c.plans?.[sec.domainKey];if(!plan){issues.push('missing-plan:'+sec.domainKey);continue;}const ids=new Set((Array.isArray(plan)?plan:[]).map(e=>e&&e.id).filter(Boolean));for(const item of sec.items||[]){if(item?.id&&!ids.has(item.id))issues.push('missing-id:'+sec.domainKey+':'+item.id);}}console.log('issues='+issues.length);process.exit(issues.length===0?0:1);"` → wynik: `issues=568` (pozycja nadal otwarta).

## Plan techniczny

### Roadmap — katalog narzędzi

- [ ] **Etap 3: filtry i eksport** (UI/UX i operacje na danych katalogu).  
  **Właściciel:** Frontend + Tooling  
  **Priorytet:** P2  
  **Definition of Done:** Dostępne filtrowanie po typie/licencji/evidence level oraz eksport danych (np. CSV/JSON).

- [ ] **Wyszukiwanie pełnotekstowe po treści artykułów (nie tylko po etykietach nawigacji).**  
  **Właściciel:** Frontend  
  **Priorytet:** P1  
  **Definition of Done:** Zapytanie przeszukuje treść MD i zwraca listę trafień z kontekstem.

- [ ] **Przycisk „Kopiuj link” (deeplink do aktualnego artykułu).**  
  **Właściciel:** Frontend  
  **Priorytet:** P2  
  **Definition of Done:** Jeden klik kopiuje pełny URL z hashem; użytkownik dostaje potwierdzenie (toast/tooltip).

- [ ] **TOC generowany z nagłówków `##` + wyróżnianie aktualnej sekcji (IntersectionObserver).**  
  **Właściciel:** Frontend  
  **Priorytet:** P2  
  **Definition of Done:** Po wejściu na artykuł renderuje się spis treści, a aktywny nagłówek podświetla się podczas scrolla.

- [ ] **Lepsze renderowanie zagnieżdżonych list Markdown.**  
  **Właściciel:** Frontend  
  **Priorytet:** P1  
  **Definition of Done:** Parser poprawnie renderuje co najmniej 3 poziomy list numerowanych i nienumerowanych.

- [ ] **Dynamiczne SEO: aktualizacja `<title>` i `<meta name="description">` przy zmianie artykułu.**  
  **Właściciel:** Frontend/SEO  
  **Priorytet:** P1  
  **Definition of Done:** Po nawigacji metadane odzwierciedlają aktualny artykuł bez przeładowania strony.

- [ ] **Open Graph (`og:title`, `og:description`) dla udostępnień.**  
  **Właściciel:** Frontend/SEO  
  **Priorytet:** P2  
  **Definition of Done:** Strona główna i kluczowe podstrony mają poprawne OG; walidacja w debuggerze social media bez błędów krytycznych.

- [ ] **Narzędzie walidujące spójność `site-config.js` (`tools/check_config.py`).**  
  **Właściciel:** Tooling  
  **Priorytet:** P1  
  **Definition of Done:** Skrypt wykrywa brakujące pliki, duplikaty ID, brakujące pola i niespójności statusów; zwraca kod != 0 przy błędach.

- [ ] **Rozszerzenie `tools/konwerter.py` o generowanie szkieletów artykułów z szablonu.**  
  **Właściciel:** Tooling + Content  
  **Priorytet:** P3  
  **Definition of Done:** CLI przyjmuje domenę i tytuł, tworzy plik `.md` z gotowym szkieletem sekcji i metadanych.

- [ ] **Addon // mały stworek chodzący po stronie**

## Plan contentowy

### Roadmap — katalog narzędzi

- [ ] **Etap 1: dziedziny z gotową bazą testową** (`diagnostics`, `psychometrics`, `disorders`, `neuro`, `spoleczna`).  
  **Właściciel:** Content + Config  
  **Priorytet:** P1  
  **Definition of Done:** Każda z wymienionych dziedzin ma komplet wpisów spełniających DoD i uzupełnione `updatedAt`.

- [ ] **Etap 2: pozostałe dziedziny** (uzupełnianie listy `measurementToolsTodoDomains`).  
  **Właściciel:** Content + Config  
  **Priorytet:** P2  
  **Definition of Done:** Każda domena z listy TODO ma co najmniej startowy zestaw narzędzi + datę `updatedAt`.

- [ ] **Nowa zakładka z 12 artykułami „Somatic Experiencing jako metoda pracy ze stresem i traumą”**
- [ ] **Nowa zakładka z 12 artykułami „Wstęp do psychologii klinicznej dziecka”**
- [ ] **Nowa zakładka z 12 artykułami „Reagowanie na krytykę”**
- [x] **Nowa zakładka z 12 artykułami „Psychologia nadmiernego jedzenia”**
- [x] **Nowa zakładka z 12 artykułami „Instytucje pomocy dziecku i rodzinie”**
- [ ] **Nowa zakładka z 12 artykułami „Systemy rodzinne”**
- [ ] **Nowa zakładka z 12 artykułami „Wystąpienia publiczne i autoprezentacja”**
- [ ] **Nowa zakładka z 12 artykułami „Psycholog w IT”**
- [x] **Nowa zakładka z 12 artykułami „Resocjalizacja”**
- [ ] **Artykuł dotyczący zachowania i dwóch półkul mózgu.**
