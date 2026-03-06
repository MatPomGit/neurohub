/**
 * brain3d.js — Moduł wizualizacji mózgu 3D
 * Neuropsychologia Portal Wiedzy
 *
 * Renderuje mózg jako chmurę punktów w przestrzeni 3D (Three.js).
 * Każdy region anatomiczny ma własny zbiór punktów rozłożonych
 * wokół trójwymiarowej bryły parametrycznej imitującej kształt
 * danej struktury. Etykiety i opisy są w języku polskim.
 */

(function (global) {
  'use strict';

  // ─────────────────────────────────────────────
  //  Dane anatomiczne – definicje regionów mózgu
  // ─────────────────────────────────────────────

  /**
   * Każdy region opisany jest przez:
   *   id        – klucz wewnętrzny
   *   label     – nazwa polska (krótka, do przycisku)
   *   name      – pełna nazwa polska
   *   color     – kolor hex punktów
   *   desc      – opis kliniczny po polsku
   *   points    – liczba punktów w chmurze
   *   shape     – funkcja generująca pozycję punktu (x,y,z)
   */
  const REGIONS = [
    {
      id: 'frontal',
      label: 'Płat czołowy',
      name: 'Płat czołowy (Lobus frontalis)',
      color: 0x5b8cb8,
      desc: 'Odpowiada za planowanie, podejmowanie decyzji, kontrolę impulsów i funkcje wykonawcze. Zawiera pierwotną korę ruchową (pole 4 Brodmanna) oraz obszar Broki (pola 44/45) — centrum produkcji mowy. Uszkodzenia powodują zmiany osobowości, deficyty hamowania i afazję ekspresyjną.',
      points: 6000,
      shape: (rng) => ellipsoidShell(rng, 1.05, 0.72, 0.85, -0.32, 0.30, 0.44),
    },
    {
      id: 'frontal_r',
      label: null, // prawa półkula – nie osobny przycisk
      name: 'Płat czołowy (prawa półkula)',
      color: 0x5b8cb8,
      desc: null,
      points: 6000,
      shape: (rng) => ellipsoidShell(rng, 1.05, 0.72, 0.85,  0.32, 0.30, 0.44),
      linkedTo: 'frontal',
    },
    {
      id: 'parietal',
      label: 'Płat ciemieniowy',
      name: 'Płat ciemieniowy (Lobus parietalis)',
      color: 0x4a9b9b,
      desc: 'Centrum integracji somatosensorycznej i przestrzennej. Zawiera pierwotną korę czuciową (pola 1,2,3) i asocjacyjną korę ciemieniową. Uczestniczy w uwadze przestrzennej, gnozji i praksji. Uszkodzenia prawostronnie wywołują zaniedbywanie (neglect), lewostronnie — apraksję i aleksję.',
      points: 5000,
      shape: (rng) => ellipsoidShell(rng, 0.82, 0.70, 0.72, -0.38, 0.48, -0.24),
    },
    {
      id: 'parietal_r',
      label: null,
      name: 'Płat ciemieniowy (prawa półkula)',
      color: 0x4a9b9b,
      desc: null,
      points: 5000,
      shape: (rng) => ellipsoidShell(rng, 0.82, 0.70, 0.72,  0.38, 0.48, -0.24),
      linkedTo: 'parietal',
    },
    {
      id: 'temporal',
      label: 'Płat skroniowy',
      name: 'Płat skroniowy (Lobus temporalis)',
      color: 0xc9a227,
      desc: 'Przetwarza słuch, mowę i pamięć. Obszar Wernickego (pole 22) odpowiada za rozumienie języka. Tylna część pośredniczy w pamięci semantycznej. Uszkodzenia lewostronnie powodują afazję Wernickego, obustronnie — głębokę amnezję (uszkodzenie hipokampa).',
      points: 5500,
      shape: (rng) => ellipsoidShell(rng, 0.64, 0.54, 0.92, -0.68, -0.12, 0.10),
    },
    {
      id: 'temporal_r',
      label: null,
      name: 'Płat skroniowy (prawa półkula)',
      color: 0xc9a227,
      desc: null,
      points: 5500,
      shape: (rng) => ellipsoidShell(rng, 0.64, 0.54, 0.92,  0.68, -0.12, 0.10),
      linkedTo: 'temporal',
    },
    {
      id: 'occipital',
      label: 'Płat potyliczny',
      name: 'Płat potyliczny (Lobus occipitalis)',
      color: 0x8b7ab8,
      desc: 'Główny ośrodek przetwarzania wzrokowego. Pierwotna kora wzrokowa (V1, pole 17) odbiera sygnały z siatkówki przez ciało kolankowate boczne. Okolice V2–V5 przetwarzają ruch, kolor i głębię. Uszkodzenia mogą powodować ślepotę korową, agnozje wzrokowe lub prozopagnozję.',
      points: 4000,
      shape: (rng) => ellipsoidShell(rng, 0.80, 0.68, 0.62, -0.28, -0.02, -0.88),
    },
    {
      id: 'occipital_r',
      label: null,
      name: 'Płat potyliczny (prawa półkula)',
      color: 0x8b7ab8,
      desc: null,
      points: 4000,
      shape: (rng) => ellipsoidShell(rng, 0.80, 0.68, 0.62,  0.28, -0.02, -0.88),
      linkedTo: 'occipital',
    },
    {
      id: 'hippocampus',
      label: 'Hipokamp',
      name: 'Hipokamp (Hippocampus)',
      color: 0xe8845a,
      desc: 'Kluczowa struktura układu limbicznego zlokalizowana w przyśrodkowej części płata skroniowego. Niezbędny do konsolidacji pamięci deklaratywnej (przejście z pamięci krótkotrwałej do długotrwałej). Zawiera komórki miejsca (place cells) i komórki siatki, tworząc wewnętrzną mapę przestrzeni. Jego obustronne uszkodzenie (jak u H.M.) powoduje ciężką amnezję anterogradową.',
      points: 1200,
      shape: (rng) => hippoShape(rng, -0.42, -0.18, -0.12),
    },
    {
      id: 'hippocampus_r',
      label: null,
      name: 'Hipokamp (prawa półkula)',
      color: 0xe8845a,
      desc: null,
      points: 1200,
      shape: (rng) => hippoShape(rng,  0.42, -0.18, -0.12),
      linkedTo: 'hippocampus',
    },
    {
      id: 'amygdala',
      label: 'Ciało migdałowate',
      name: 'Ciało migdałowate (Amygdala)',
      color: 0xd45f6e,
      desc: 'Jądro migdałowate kształtu migdała leżące przed hipokampem. Centralny węzeł przetwarzania emocji — szczególnie strachu i lęku. Ocenia wartościowość emocjonalną bodźców i moduluje pamięć emocjonalną poprzez noradrenalinę. Obustronne uszkodzenia znoszą reakcję strachu (przypadek S.M.) i zaburzają rozpoznawanie emocji z twarzy.',
      points: 800,
      shape: (rng) => smallNucleus(rng, -0.52, -0.12, 0.22, 0.15, 0.12, 0.14),
    },
    {
      id: 'amygdala_r',
      label: null,
      name: 'Ciało migdałowate (prawa półkula)',
      color: 0xd45f6e,
      desc: null,
      points: 800,
      shape: (rng) => smallNucleus(rng,  0.52, -0.12, 0.22, 0.15, 0.12, 0.14),
      linkedTo: 'amygdala',
    },
    {
      id: 'thalamus',
      label: 'Wzgórze',
      name: 'Wzgórze (Thalamus)',
      color: 0x7cc47f,
      desc: 'Centralne jądro przekaźnikowe mózgu, leżące na granicy międzymózgowia i kresomózgowia. Wszystkie informacje sensoryczne (poza węchem) przechodzą przez wzgórze w drodze do kory. Jądra swoiste (np. ciało kolankowate) przekazują sygnały modalnościowo-specyficzne, jądra nieswoiste modulują ogólne pobudzenie kory.',
      points: 1600,
      shape: (rng) => smallNucleus(rng, -0.14, 0.04, -0.10, 0.22, 0.20, 0.26),
    },
    {
      id: 'thalamus_r',
      label: null,
      name: 'Wzgórze (prawa półkula)',
      color: 0x7cc47f,
      desc: null,
      points: 1600,
      shape: (rng) => smallNucleus(rng,  0.14, 0.04, -0.10, 0.22, 0.20, 0.26),
      linkedTo: 'thalamus',
    },
    {
      id: 'basal_ganglia',
      label: 'Jądra podstawy',
      name: 'Jądra podstawy (Ganglia basalia)',
      color: 0xf0a04b,
      desc: 'Zespół jąder podkorowych (prążkowie, gałka blada, jądro niskowzgórzowe, istota czarna) regulujących inicjację i hamowanie ruchów oraz uczenie proceduralne. Uczestniczą w selekcji działań i nagradzaniu. Dysfunkcja powoduje chorobę Parkinsona (niedobór dopaminy w istocie czarnej) lub pląsawicę Huntingtona (degeneracja prążkowia).',
      points: 1800,
      shape: (rng) => smallNucleus(rng, -0.30, 0.08, 0.06, 0.28, 0.24, 0.22),
    },
    {
      id: 'basal_ganglia_r',
      label: null,
      name: 'Jądra podstawy (prawa półkula)',
      color: 0xf0a04b,
      desc: null,
      points: 1800,
      shape: (rng) => smallNucleus(rng,  0.30, 0.08, 0.06, 0.28, 0.24, 0.22),
      linkedTo: 'basal_ganglia',
    },
    {
      id: 'cerebellum',
      label: 'Móżdżek',
      name: 'Móżdżek (Cerebellum)',
      color: 0xa0c4ff,
      desc: 'Struktura tylnej części mózgu z charakterystyczną gęstą laminacją kory — zawiera więcej neuronów niż cała reszta mózgu. Koordynuje precyzję ruchów, równowagę i uczenie motoryczne. Nowe badania wskazują na jego rolę w funkcjach poznawczych i językowych. Uszkodzenie powoduje ataksję, dysmetrię i drżenie zamiarowe.',
      points: 5000,
      shape: (rng) => ellipsoidShell(rng, 0.88, 0.56, 0.68, 0.00, -0.58, -0.60),
    },
    {
      id: 'brainstem',
      label: 'Pień mózgu',
      name: 'Pień mózgu (Truncus cerebri)',
      color: 0xc0c0c0,
      desc: 'Zawiera śródmózgowie, most i rdzeń przedłużony. Tutaj przebiegają wszystkie szlaki łączące mózg z rdzeniem kręgowym oraz jądra nerwów czaszkowych III–XII. Zarządza funkcjami życiowymi: oddychaniem, tętnem, snem (układ siatkowaty ARAS). Uszkodzenie pnia jest bezpośrednio zagrażające życiu.',
      points: 2000,
      shape: (rng) => stemShape(rng, 0.00, -0.68, -0.20),
    },
    {
      id: 'corpus_callosum',
      label: 'Ciało modzelowate',
      name: 'Ciało modzelowate (Corpus callosum)',
      color: 0xe8e8b0,
      desc: 'Największa komisura mózgu — płat istoty białej zawierający ~200 milionów aksonów łączących obie półkule. Umożliwia synchronizację i podział pracy między półkulami. Chirurgiczne przecięcie (callosotomia) stosowane w leczeniu padaczki opornej — u tych pacjentów Sperry zaobserwował „podzielony mózg".',
      points: 1400,
      shape: (rng) => callosumShape(rng),
    },
    {
      id: 'broca',
      label: 'Obszar Broki',
      name: 'Obszar Broki (Area Brocae, pola 44/45)',
      color: 0xff9ef0,
      desc: 'Zlokalizowany w dolnym zakręcie czołowym lewej półkuli. Odpowiada za produkcję mowy, składnię i sekwencjonowanie ruchów artykulacyjnych. Odkryty przez Paula Brokę w 1861 roku dzięki przypadkowi „Tana". Uszkodzenie powoduje afazję Broki — mowę niefluentną, telegrafficzną, przy zachowanym rozumieniu.',
      points: 600,
      shape: (rng) => smallNucleus(rng, -0.72, 0.26, 0.62, 0.10, 0.08, 0.10),
    },
    {
      id: 'wernicke',
      label: 'Obszar Wernickego',
      name: 'Obszar Wernickego (Area Wernicke, pole 22)',
      color: 0xffcc6e,
      desc: 'Leży w tylnej części górnego zakrętu skroniowego lewej półkuli. Niezbędny do rozumienia mowy i generowania poprawnych semantycznie słów. Odkryty przez Carla Wernickego w 1874 roku. Uszkodzenie daje afazję Wernickego — mowę fluentną, lecz parafatyczną i niezrozumiałą, z głębokim deficytem rozumienia.',
      points: 600,
      shape: (rng) => smallNucleus(rng, -0.70, -0.04, -0.20, 0.12, 0.10, 0.12),
    },
    {
      id: 'insula',
      label: 'Wyspa (insula)',
      name: 'Kora wyspy (Insula)',
      color: 0x90e0ef,
      desc: 'Piąty płat mózgu, ukryty w bruździe bocznej (Sylwiusza), widoczny dopiero po rozsunięciu płatów czołowego i skroniowego. Integruje sygnały interoceptywne (stan ciała), smak, ból, emocje społeczne i świadomość. Uczestniczy w przetwarzaniu dysgustującego i aktywuje się w momencie empatii z bólem innych.',
      points: 900,
      shape: (rng) => smallNucleus(rng, -0.60, 0.06, 0.16, 0.14, 0.18, 0.16),
    },
    {
      id: 'insula_r',
      label: null,
      name: 'Kora wyspy (prawa półkula)',
      color: 0x90e0ef,
      desc: null,
      points: 900,
      shape: (rng) => smallNucleus(rng,  0.60, 0.06, 0.16, 0.14, 0.18, 0.16),
      linkedTo: 'insula',
    },
    {
      id: 'cingulate',
      label: 'Zakręt obręczy',
      name: 'Zakręt obręczy (Gyrus cinguli)',
      color: 0xb5ead7,
      desc: 'Łukowata struktura na przyśrodkowej ścianie półkuli, stanowiąca część układu limbicznego i kory przedczołowej. Przednia część (ACC) monitoruje błędy i konflikty poznawcze, moduluje ból i emocje. Tylna część (PCC) wchodzi w skład sieci domyślnej trybu (DMN) aktywnej w spoczynku i samoreferencji.',
      points: 1000,
      shape: (rng) => cingulateShape(rng),
    },
  ];

  // ─────────────────────────────────────────────
  //  Generatory kształtów punktów
  // ─────────────────────────────────────────────

  /** Deterministyczny RNG (Mulberry32) — gwarantuje spójny kształt przy każdym renderowaniu. */
  function makePRNG(seed) {
    let s = seed >>> 0;
    return function () {
      s += 0x6d2b79f5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Losowy punkt na powierzchni elipsoidy z opcjonalnym rozproszeniem (noise). */
  function ellipsoidShell(rng, rx, ry, rz, cx, cy, cz) {
    // Równomierny rozkład kątów na sferze
    const u = rng() * 2 - 1;
    const theta = rng() * Math.PI * 2;
    const sinU = Math.sqrt(1 - u * u);
    // Dodajemy drobny szum promieniowy, żeby uniknąć idealnej muszli
    const noise = 0.88 + rng() * 0.24;
    return new THREE.Vector3(
      cx + rx * sinU * Math.cos(theta) * noise,
      cy + ry * u * noise,
      cz + rz * sinU * Math.sin(theta) * noise
    );
  }

  /** Wypełniony elipsoid (dla mniejszych jąder podkorowych). */
  function smallNucleus(rng, cx, cy, cz, rx, ry, rz) {
    const u = rng() * 2 - 1;
    const theta = rng() * Math.PI * 2;
    const r = Math.cbrt(rng()); // sześcienny pierwiastek = równomierny rozkład w objętości
    const sinU = Math.sqrt(1 - u * u);
    return new THREE.Vector3(
      cx + rx * r * sinU * Math.cos(theta),
      cy + ry * r * u,
      cz + rz * r * sinU * Math.sin(theta)
    );
  }

  /**
   * Hipokamp — podłużna, lekko zakrzywiona struktura,
   * przypominająca konika morskiego (stąd nazwa grecka).
   */
  function hippoShape(rng, cx, cy, cz) {
    const t = rng() * Math.PI; // wzdłuż długiej osi
    const r = rng() * 0.08;    // promień przekroju
    const phi = rng() * Math.PI * 2;
    // Krzywa w kształcie litery C
    const bx = 0.30 * Math.cos(t) - 0.18;
    const by = 0.10 * Math.sin(t * 2) * 0.5;
    const bz = 0.28 * Math.sin(t);
    return new THREE.Vector3(
      cx + bx + r * Math.cos(phi),
      cy + by + r * Math.sin(phi),
      cz + bz + r * 0.5
    );
  }

  /**
   * Pień mózgu — ścięty stożek biegnący nieco ukośnie
   * w osi głowa–ogon (dorso–wentralnie).
   */
  function stemShape(rng, cx, cy, cz) {
    const t = rng();          // 0..1 wzdłuż osi pionowej
    const phi = rng() * Math.PI * 2;
    const radius = 0.13 - 0.04 * t + rng() * 0.03; // zwęża się ku dołowi
    return new THREE.Vector3(
      cx + radius * Math.cos(phi),
      cy + t * 0.78,           // długość pnia
      cz - t * 0.24            // lekkie pochylenie ku tyłowi
    );
  }

  /**
   * Ciało modzelowate — spłaszczony łuk w płaszczyźnie strzałkowej,
   * biegnący nad komorami bocznymi.
   */
  function callosumShape(rng) {
    const t = rng() * Math.PI - Math.PI / 2; // od -90° do +90°
    const noise = rng() * 0.06 - 0.03;
    const thickness = rng() * 0.07 - 0.035;
    return new THREE.Vector3(
      (rng() * 0.28 - 0.14),   // wzdłuż osi lewo-prawo (cienka struktura)
      0.32 + 0.18 * Math.sin(t + Math.PI / 2) + thickness,
      -0.08 + 0.52 * Math.cos(t + Math.PI / 2) + noise
    );
  }

  /**
   * Zakręt obręczy — łukowata wstęga biegnąca nad ciałem modzelowatym
   * po przyśrodkowej ścianie półkuli.
   */
  function cingulateShape(rng) {
    const t = rng() * Math.PI * 1.1 - 0.5;
    const thickness = rng() * 0.06 - 0.03;
    const side = rng() < 0.5 ? -1 : 1;
    return new THREE.Vector3(
      side * (0.06 + rng() * 0.14),
      0.46 + 0.22 * Math.sin(t + 0.4) + thickness,
      -0.12 + 0.68 * Math.cos(t + 0.4) + rng() * 0.05
    );
  }

  // ─────────────────────────────────────────────
  //  Budowa chmury punktów
  // ─────────────────────────────────────────────

  /**
   * Tworzy obiekt THREE.Points dla jednego regionu.
   * Punkty są rozmieszczone zgodnie z funkcją shape() regionu.
   */
  function buildRegionCloud(region, seed) {
    const rng = makePRNG(seed);
    const positions = new Float32Array(region.points * 3);

    for (let i = 0; i < region.points; i++) {
      const v = region.shape(rng);
      positions[i * 3]     = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: region.color,
      size: 0.016,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.82,
    });

    const cloud = new THREE.Points(geometry, material);
    cloud.userData = {
      regionId: region.linkedTo || region.id,
      baseColor: region.color,
      baseOpacity: 0.82,
      baseSize: 0.016,
    };
    return cloud;
  }

  // ─────────────────────────────────────────────
  //  Etykiety 3D (CSS2DRenderer alternatywnie:
  //  Sprite z canvas-tekstem, renderowane w THREE)
  // ─────────────────────────────────────────────

  /**
   * Tworzy etykietę jako THREE.Sprite z tekstem narysowanym na canvas.
   * Dzięki temu nie potrzebujemy dodatkowego renderera CSS2D.
   */
  function makeLabel(text, x, y, z, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Tło z zaokrąglonymi rogami
    ctx.fillStyle = 'rgba(10,10,14,0.78)';
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 56, 8);
    ctx.fill();

    // Kolorowy pasek po lewej
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    ctx.fillRect(4, 4, 5, 56);

    // Tekst
    ctx.fillStyle = '#f0f0f0';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 20, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(x, y, z);
    sprite.scale.set(0.72, 0.18, 1);
    sprite.userData.isLabel = true;
    sprite.userData.visible = true;
    return sprite;
  }

  // ─────────────────────────────────────────────
  //  Klasa główna: Brain3DViewer
  // ─────────────────────────────────────────────

  class Brain3DViewer {
    constructor(containerId, infoPanelId) {
      this.containerId = containerId;
      this.infoPanelId = infoPanelId;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.brainGroup = null;
      this.clouds = [];      // { cloud, region }
      this.labels = [];
      this.activeRegion = 'all';
      this.labelsVisible = true;
      this._animFrame = null;
      this._autoRotate = true;
    }

    /** Inicjalizacja – wywoływana raz po otwarciu modalu. */
    init() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      // Wyczyść poprzednią instancję (jeśli była)
      while (container.firstChild) container.removeChild(container.firstChild);
      if (this._animFrame) cancelAnimationFrame(this._animFrame);

      // Scena
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0c0c10);
      this.scene.fog = new THREE.FogExp2(0x0c0c10, 0.18);

      // Kamera
      this.camera = new THREE.PerspectiveCamera(
        48,
        container.clientWidth / container.clientHeight,
        0.05,
        100
      );
      this.camera.position.set(0, 0.2, 4.2);

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      // Orbit Controls
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.minDistance = 1.8;
      this.controls.maxDistance = 8;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.5;

      // Oświetlenie (subtelne — większość "oświetlenia" pochodzi z kolorów punktów)
      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      this.scene.add(ambient);

      // Grupuje wszystkie chmury punktów
      this.brainGroup = new THREE.Group();
      this.scene.add(this.brainGroup);

      // Buduje chmury
      this._buildClouds();

      // Buduje etykiety
      this._buildLabels();

      // Osiowe linie pomocnicze (subtelne)
      this._addAxisHelper();

      // Obsługa kliknięcia (wybór regionu)
      this._setupPicking();

      // Pętla animacji
      this._animate();

      // Resize
      this._resizeHandler = () => this._onResize();
      window.addEventListener('resize', this._resizeHandler);
    }

    _buildClouds() {
      this.clouds = [];
      REGIONS.forEach((region, idx) => {
        const cloud = buildRegionCloud(region, idx * 7919 + 1);
        this.brainGroup.add(cloud);
        this.clouds.push({ cloud, region });
      });
    }

    _buildLabels() {
      this.labels = [];
      // Wyświetlamy etykiety tylko dla regionów z przyciskiem (label !== null)
      const labelDefs = [
        { id: 'frontal',       x: -1.05, y:  0.70, z:  0.90 },
        { id: 'parietal',      x: -1.05, y:  0.82, z: -0.44 },
        { id: 'temporal',      x: -1.32, y: -0.12, z:  0.18 },
        { id: 'occipital',     x: -1.00, y: -0.10, z: -1.28 },
        { id: 'hippocampus',   x: -0.82, y: -0.26, z: -0.22 },
        { id: 'amygdala',      x: -0.92, y: -0.04, z:  0.38 },
        { id: 'thalamus',      x:  0.50, y:  0.16, z: -0.10 },
        { id: 'basal_ganglia', x:  0.72, y:  0.22, z:  0.12 },
        { id: 'cerebellum',    x:  0.00, y: -1.12, z: -0.90 },
        { id: 'brainstem',     x:  0.42, y: -0.72, z: -0.10 },
        { id: 'corpus_callosum', x: 0.42, y: 0.60, z:  0.00 },
        { id: 'broca',         x: -1.12, y:  0.38, z:  0.82 },
        { id: 'wernicke',      x: -1.12, y: -0.02, z: -0.28 },
        { id: 'insula',        x: -1.02, y:  0.14, z:  0.28 },
        { id: 'cingulate',     x:  0.42, y:  0.72, z: -0.06 },
      ];

      labelDefs.forEach(def => {
        const region = REGIONS.find(r => r.id === def.id);
        if (!region || !region.label) return;
        const sprite = makeLabel(region.label, def.x, def.y, def.z, region.color);
        this.brainGroup.add(sprite);
        this.labels.push({ sprite, regionId: def.id });
      });
    }

    _addAxisHelper() {
      // Delikatna siatka referencyjna
      const gridHelper = new THREE.GridHelper(4, 20, 0x222230, 0x1a1a24);
      gridHelper.position.y = -1.2;
      this.scene.add(gridHelper);
    }

    _setupPicking() {
      const raycaster = new THREE.Raycaster();
      raycaster.params.Points.threshold = 0.04;
      const mouse = new THREE.Vector2();
      const canvas = this.renderer.domElement;

      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);
        const pointClouds = this.clouds.map(c => c.cloud);
        const intersects = raycaster.intersectObjects(pointClouds);

        if (intersects.length > 0) {
          const regionId = intersects[0].object.userData.regionId;
          this.highlightRegion(regionId);
        }
      });
    }

    _animate() {
      this._animFrame = requestAnimationFrame(() => this._animate());
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    _onResize() {
      const container = document.getElementById(this.containerId);
      if (!container || !this.renderer) return;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    /** Podświetla wybrany region, przyciemniając pozostałe. */
    highlightRegion(regionId) {
      this.activeRegion = regionId;
      this._updateInfoPanel(regionId);

      this.clouds.forEach(({ cloud, region }) => {
        const mat = cloud.material;
        const id = cloud.userData.regionId;
        const isTarget = regionId === 'all' || id === regionId;

        mat.color.setHex(isTarget ? cloud.userData.baseColor : 0x1a1a24);
        mat.opacity = isTarget ? cloud.userData.baseOpacity : 0.10;
        mat.size = isTarget ? cloud.userData.baseSize * (regionId === 'all' ? 1 : 1.5) : 0.010;
        mat.needsUpdate = true;
      });

      // Synchronizuje przyciski interfejsu
      document.querySelectorAll('.brain-region-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.region === regionId);
      });

      // Ukrywa etykiety nie-wybranych regionów (jeśli nie „wszystkie")
      this.labels.forEach(({ sprite, regionId: lid }) => {
        sprite.material.opacity = (regionId === 'all' || lid === regionId) ? 1 : 0.15;
        sprite.material.needsUpdate = true;
      });
    }

    /** Przełącza widoczność etykiet. */
    toggleLabels() {
      this.labelsVisible = !this.labelsVisible;
      this.labels.forEach(({ sprite }) => {
        sprite.visible = this.labelsVisible;
      });
      return this.labelsVisible;
    }

    /** Przełącza autorotację. */
    toggleRotation() {
      this._autoRotate = !this._autoRotate;
      this.controls.autoRotate = this._autoRotate;
      return this._autoRotate;
    }

    /** Resetuje widok kamery. */
    resetView() {
      this.camera.position.set(0, 0.2, 4.2);
      this.controls.reset();
      this.highlightRegion('all');
    }

    /** Aktualizuje panel opisu regionu. */
    _updateInfoPanel(regionId) {
      const panel = document.getElementById(this.infoPanelId);
      if (!panel) return;

      if (regionId === 'all') {
        panel.innerHTML = `
          <div class="brain-info-title">🧠 Model chmury punktów</div>
          <div class="brain-info-desc">
            Kliknij region na modelu lub wybierz przycisk poniżej, aby poznać szczegóły wybranej struktury mózgu.
            Model zawiera <strong>${REGIONS.reduce((s,r)=>s+r.points,0).toLocaleString('pl-PL')}</strong> punktów rozmieszczonych w anatomicznie wiarygodnych pozycjach.
            Możesz obracać model myszą oraz przybliżać kółkiem.
          </div>`;
        return;
      }

      const region = REGIONS.find(r => r.id === regionId);
      if (!region || !region.desc) return;

      const colorHex = '#' + region.color.toString(16).padStart(6, '0');
      panel.innerHTML = `
        <div class="brain-info-title" style="color:${colorHex}">
          ◉ ${region.name}
        </div>
        <div class="brain-info-desc">${region.desc}</div>`;
    }

    /** Sprzątanie przy zamknięciu modalu. */
    destroy() {
      if (this._animFrame) cancelAnimationFrame(this._animFrame);
      if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
      if (this.renderer) {
        this.renderer.dispose();
        const canvas = this.renderer.domElement;
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
      this.scene = null;
      this.renderer = null;
    }
  }

  // ─────────────────────────────────────────────
  //  Eksport globalny
  // ─────────────────────────────────────────────
  global.Brain3DViewer = Brain3DViewer;
  global.BRAIN_REGIONS = REGIONS;

})(window);
