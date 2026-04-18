/* ══════════════════════════════════════════════════
   TESTY TEORETYCZNE — konfiguracja modułu
   Plik: theoretical-test.js
   Zawiera listę dostępnych tematów testów pogrupowanych
   wg kategorii widocznych w interfejsie.
══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Wspólna pula standardowych tematów teoretycznych. */
  const theoreticalTopics = [
    { key: 'diagnoza_psychologiczna', label: 'Diagnoza psychologiczna', file: 'tests/diagnoza_psychologiczna.json', icon: '🔬' },
    { key: 'psychopatologia', label: 'Psychopatologia', file: 'tests/psychopatologia.json', icon: '🧩' },
    { key: 'psychoterapia', label: 'Psychoterapia', file: 'tests/psychoterapia.json', icon: '🛋️' },
    { key: 'psychologia_spoleczna', label: 'Psychologia społeczna', file: 'tests/psychologia_spoleczna.json', icon: '👥' },
    { key: 'neuropsychologia', label: 'Neuropsychologia', file: 'tests/neuropsychologia.json', icon: '🧠' },
    { key: 'psychologia_poznawcza', label: 'Psychologia poznawcza', file: 'tests/psychologia_poznawcza.json', icon: '💡' },
    { key: 'psychologia_rozwojowa', label: 'Psychologia rozwojowa', file: 'tests/psychologia_rozwojowa.json', icon: '🌱' },
    { key: 'psychologia_kulturowa', label: 'Psychologia kulturowa', file: 'tests/psychologia_kulturowa.json', icon: '🌍' },
    { key: 'uzaleznienia', label: 'Psychologia uzależnień', file: 'tests/uzaleznienia.json', icon: '🔗' },
    { key: 'etyka_zawodowa', label: 'Etyka zawodowa', file: 'tests/etyka_zawodowa.json', icon: '⚖️' },
    { key: 'filozofia', label: 'Filozofia', file: 'tests/filozofia.json', icon: '🏛️' },
    { key: 'relacje_i_zwiazki', label: 'Relacje i związki', file: 'tests/relacje_i_zwiazki.json', icon: '💑' },
    { key: 'psychometria_i_metodologia', label: 'Psychometria i metodologia', file: 'tests/psychometria_i_metodologia.json', icon: '📊' },
    { key: 'psychologia_zdrowia', label: 'Psychologia zdrowia', file: 'tests/psychologia_zdrowia.json', icon: '🩺' },
    { key: 'interwencja_kryzysowa', label: 'Interwencja kryzysowa', file: 'tests/interwencja_kryzysowa.json', icon: '🆘' }
  ];

  /* Tematy specjalizacyjne i rozszerzające dla studentów. */
  const specializationTopics = [
    { key: 'psychologia_biologiczna', label: 'Psychologia biologiczna', file: 'tests/psychologia_biologiczna.json', icon: '🧬' },
    { key: 'psychologia_pracy_i_organizacji', label: 'Psychologia pracy i organizacji', file: 'tests/psychologia_pracy_i_organizacji.json', icon: '🏢' },
    { key: 'psychologia_sadowa', label: 'Psychologia sądowa', file: 'tests/psychologia_sadowa.json', icon: '🧾' },
    { key: 'geropsychologia', label: 'Geropsychologia', file: 'tests/geropsychologia.json', icon: '👵' },
    { key: 'rzeczywiste_testy_psychologiczne', label: 'Moduł rzeczywistych testów psychologicznych', file: 'tests/rzeczywiste_testy_psychologiczne.json', icon: '🧪' }
  ];

  window.THEORETICAL_TEST = {
    /*
     * Definicje sekcji interfejsu. Te opisy pojawią się jako leady
     * nad listami tematów w renderze konfiguracji testu.
     */
    categoryMeta: {
      theoretical: {
        label: 'Testy teoretyczne',
        description: 'Klasyczne testy przekrojowe z głównych obszarów psychologii.'
      },
      specialization: {
        label: 'Specjalizacje i moduły rozszerzone',
        description: 'Zestawy przygotowujące do pracy w obszarach specjalistycznych.'
      },
      clinical_vignettes: {
        label: 'Winiety kliniczne',
        description: 'Ćwiczenia na analizie przypadków i podejmowaniu decyzji diagnostycznych.'
      },
      diploma_mock: {
        label: 'Egzamin dyplomowy — mock',
        description: 'Próbne testy sprawdzające gotowość do egzaminu dyplomowego.'
      }
    },

    /*
     * Docelowa, kategoryzowana struktura tematów.
     * Każda kategoria zawiera oddzielną listę zestawów pytań.
     */
    categories: {
      theoretical: theoreticalTopics,
      specialization: specializationTopics,
      clinical_vignettes: [
        { key: 'winiety_kliniczne', label: 'Moduł winiet klinicznych', file: 'tests/winiety_kliniczne.json', icon: '🩺' }
      ],
      diploma_mock: [
        { key: 'egzamin_dyplomowy', label: 'Moduł egzaminu dyplomowego', file: 'tests/egzamin_dyplomowy.json', icon: '🎓' }
      ]
    },

    /*
     * Mapowanie skrótów z nawigacji na kategorię, dzięki czemu router
     * potrafi od razu ustawić właściwy blok sekcji.
     */
    presetTopicCategoryMap: {
      winiety_kliniczne: 'clinical_vignettes',
      egzamin_dyplomowy: 'diploma_mock'
    }
  };
})();
