/* ══════════════════════════════════════════════════
   TESTY TEORETYCZNE — konfiguracja modułu
   Plik: theoretical-test.js
   Zawiera listę dostępnych tematów testów.
   Pytania ładowane są dynamicznie z plików JSON.
══════════════════════════════════════════════════ */
(function () {
  'use strict';

  window.THEORETICAL_TEST = {
    topics: [
      {
        key: 'diagnoza_psychologiczna',
        label: 'Diagnoza psychologiczna',
        file: 'tests/diagnoza_psychologiczna.json',
        icon: '🔬'
      },
      {
        key: 'psychopatologia',
        label: 'Psychopatologia',
        file: 'tests/psychopatologia.json',
        icon: '🧩'
      },
      {
        key: 'psychoterapia',
        label: 'Psychoterapia',
        file: 'tests/psychoterapia.json',
        icon: '🛋️'
      },
      {
        key: 'psychologia_spoleczna',
        label: 'Psychologia społeczna',
        file: 'tests/psychologia_spoleczna.json',
        icon: '👥'
      },
      {
        key: 'neuropsychologia',
        label: 'Neuropsychologia',
        file: 'tests/neuropsychologia.json',
        icon: '🧠'
      },
      {
        key: 'psychologia_poznawcza',
        label: 'Psychologia poznawcza',
        file: 'tests/psychologia_poznawcza.json',
        icon: '💡'
      },
      {
        key: 'psychologia_rozwojowa',
        label: 'Psychologia rozwojowa',
        file: 'tests/psychologia_rozwojowa.json',
        icon: '🌱'
      },
      {
        key: 'psychologia_kulturowa',
        label: 'Psychologia kulturowa',
        file: 'tests/psychologia_kulturowa.json',
        icon: '🌍'
      },
      {
        key: 'uzaleznienia',
        label: 'Psychologia uzależnień',
        file: 'tests/uzaleznienia.json',
        icon: '🔗'
      },
      {
        key: 'etyka_zawodowa',
        label: 'Etyka zawodowa',
        file: 'tests/etyka_zawodowa.json',
        icon: '⚖️'
      },
      {
        key: 'relacje_i_zwiazki',
        label: 'Relacje i związki',
        file: 'tests/relacje_i_zwiazki.json',
        icon: '💑'
      }
    ]
  };
})();
