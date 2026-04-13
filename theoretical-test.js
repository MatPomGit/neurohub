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
      },
      {
        key: 'psychometria_i_metodologia',
        label: 'Psychometria i metodologia',
        file: 'tests/psychometria_i_metodologia.json',
        icon: '📊'
      },
      {
        key: 'psychologia_zdrowia',
        label: 'Psychologia zdrowia',
        file: 'tests/psychologia_zdrowia.json',
        icon: '🩺'
      },
      {
        key: 'interwencja_kryzysowa',
        label: 'Interwencja kryzysowa',
        file: 'tests/interwencja_kryzysowa.json',
        icon: '🆘'
      },
      /* Kolejne paczki pytań rozszerzające obszary specjalistyczne dla studentów. */
      {
        key: 'psychologia_biologiczna',
        label: 'Psychologia biologiczna',
        file: 'tests/psychologia_biologiczna.json',
        icon: '🧬'
      },
      {
        key: 'psychologia_pracy_i_organizacji',
        label: 'Psychologia pracy i organizacji',
        file: 'tests/psychologia_pracy_i_organizacji.json',
        icon: '🏢'
      },
      {
        key: 'psychologia_sadowa',
        label: 'Psychologia sądowa',
        file: 'tests/psychologia_sadowa.json',
        icon: '🧾'
      },
      {
        key: 'geropsychologia',
        label: 'Geropsychologia',
        file: 'tests/geropsychologia.json',
        icon: '👵'
      },
      /* Moduły przekrojowe rozszerzające sekcję testów o zastosowania praktyczne. */
      {
        key: 'rzeczywiste_testy_psychologiczne',
        label: 'Moduł rzeczywistych testów psychologicznych',
        file: 'tests/rzeczywiste_testy_psychologiczne.json',
        icon: '🧪'
      },
      {
        key: 'winiety_kliniczne',
        label: 'Moduł winiet klinicznych',
        file: 'tests/winiety_kliniczne.json',
        icon: '🩺'
      },
      {
        key: 'egzamin_dyplomowy',
        label: 'Moduł egzaminu dyplomowego',
        file: 'tests/egzamin_dyplomowy.json',
        icon: '🎓'
      }
    ]
  };
})();
