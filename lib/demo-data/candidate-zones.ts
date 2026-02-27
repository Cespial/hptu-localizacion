export type CandidateZone = {
  id: string;
  name: string;
  subtitle: string;
  coordinates: [number, number]; // center [lng, lat]
  score: number;
  scores: {
    accesibilidad: number;
    demanda: number;
    competencia: number;
    valorInmobiliario: number;
  };
  color: string;
  description: string;
  highlights: string[];
  demandEstimate: number; // estimated target population within 20min
  avgM2Price: number; // COP per m2
  driveTimeToHPTU: number; // minutes to current HPTU
  potViability: string; // POT land use viability
};

export const candidateZones: CandidateZone[] = [
  {
    id: "palmas-bajo",
    name: "Las Palmas Bajo",
    subtitle: "Indiana - EIA (Corredor Primario)",
    coordinates: [-75.5465, 6.2080],
    score: 88,
    scores: {
      accesibilidad: 91,
      demanda: 94,
      competencia: 78,
      valorInmobiliario: 82,
    },
    color: "#0d9488",
    description:
      "Zona entre Indiana y la EIA sobre la via Las Palmas. Maxima accesibilidad desde El Poblado y la Transversal Inferior. Concentra el mayor trafico vehicular del corredor con tiempos de desplazamiento optimos a las zonas residenciales E5/E6 de San Lucas, El Tesoro y Los Balsos. Lotes disponibles con uso del suelo compatible segun POT. Proximidad directa al Club El Rodeo, Colegio Colombo Britanico y la Clinica Las Vegas.",
    highlights: [
      "Maxima accesibilidad vehicular del corredor Las Palmas",
      "128,500 habitantes E5/E6 en radio de 15 minutos",
      "Uso del suelo compatible con equipamiento en salud (POT)",
      "Flujo vehicular promedio: 42,000 vehiculos/dia",
      "Proximidad a EIA, Club El Rodeo y colegios premium",
    ],
    demandEstimate: 128500,
    avgM2Price: 8500000,
    driveTimeToHPTU: 18,
    potViability: "Compatible - Uso dotacional en salud permitido",
  },
  {
    id: "palmas-medio",
    name: "Las Palmas Medio",
    subtitle: "Cedro Verde - Transversal (Zona de Transicion)",
    coordinates: [-75.5380, 6.1980],
    score: 79,
    scores: {
      accesibilidad: 76,
      demanda: 86,
      competencia: 82,
      valorInmobiliario: 70,
    },
    color: "#06b6d4",
    description:
      "Sector Cedro Verde hasta la transversal de Las Palmas. Zona de transicion entre el Poblado urbano y la parte alta rural. Menor densidad vehicular que la zona baja pero buena conectividad. Los lotes son mas amplios y con mejor relacion precio-area. Menor competencia directa en salud. Los condominios cerrados de Cedro Verde y alrededores albergan poblacion de alto poder adquisitivo.",
    highlights: [
      "Lotes amplios con relacion precio-area favorable",
      "82,300 habitantes E5/E6 en radio de 20 minutos",
      "Baja competencia directa en servicios de salud",
      "Vistas panoramicas y entorno natural premium",
      "Condominios de alto standing: Cedro Verde, Altos del Poblado",
    ],
    demandEstimate: 82300,
    avgM2Price: 6200000,
    driveTimeToHPTU: 25,
    potViability: "Compatible con condiciones - Requiere concepto ambiental",
  },
  {
    id: "palmas-alto",
    name: "Las Palmas Alto",
    subtitle: "Alto de Las Palmas - Santa Elena (Polo Emergente)",
    coordinates: [-75.5260, 6.1920],
    score: 63,
    scores: {
      accesibilidad: 52,
      demanda: 58,
      competencia: 88,
      valorInmobiliario: 65,
    },
    color: "#f59e0b",
    description:
      "Zona alta del corredor, desde el Alto de Las Palmas hacia Santa Elena. Excelente posicionamiento de marca por la exclusividad del sector. Sin embargo, la accesibilidad se reduce significativamente: tiempos de desplazamiento 35-50 minutos desde el centro de El Poblado en hora pico. La demanda directa es menor aunque la poblacion flotante de fines de semana es considerable. Valor del suelo mas bajo permite proyectos de mayor escala.",
    highlights: [
      "Exclusividad del sector y posicionamiento de marca",
      "35,800 habitantes E5/E6 en radio de 20 minutos",
      "Minima competencia: ningun centro de salud en 5 km",
      "Valor del suelo 40% menor que zona baja Las Palmas",
      "Poblacion flotante alta en fines de semana y puentes festivos",
    ],
    demandEstimate: 35800,
    avgM2Price: 4800000,
    driveTimeToHPTU: 35,
    potViability: "Restringido - Suelo rural con posibilidad de equipamiento",
  },
  {
    id: "envigado",
    name: "Envigado - Zuniga",
    subtitle: "Expansion Sur (Zona Alternativa)",
    coordinates: [-75.5780, 6.1680],
    score: 74,
    scores: {
      accesibilidad: 72,
      demanda: 82,
      competencia: 65,
      valorInmobiliario: 74,
    },
    color: "#3b82f6",
    description:
      "Corredor sur del Valle de Aburra con el mayor crecimiento inmobiliario de estratos altos en la ultima decada. Zuniga y Loma del Escobero presentan mas de 15 proyectos residenciales de alta gama. La conectividad con Sabaneta, Itagui y el sur amplia el area de influencia. Menor presencia de competencia hospitalaria directa. La via distribuidora sur en construccion mejorara significativamente la accesibilidad futura.",
    highlights: [
      "Mayor crecimiento poblacional E5/E6 del sur metropolitano",
      "95,200 habitantes E5/E6 en radio de 20 minutos",
      "15+ proyectos residenciales de alta gama recientes",
      "Valor del suelo 15-20% menor que El Poblado",
      "Via distribuidora sur mejorara accesibilidad futura",
    ],
    demandEstimate: 95200,
    avgM2Price: 7100000,
    driveTimeToHPTU: 22,
    potViability: "Compatible - Expansion urbana con uso dotacional",
  },
  {
    id: "nuevo-poblado",
    name: "Nuevo Poblado - Itagui",
    subtitle: "Oportunidad Estrategica (Vision Ciudad del Rio 2.0)",
    coordinates: [-75.5920, 6.1950],
    score: 68,
    scores: {
      accesibilidad: 80,
      demanda: 70,
      competencia: 55,
      valorInmobiliario: 60,
    },
    color: "#8b5cf6",
    description:
      "Zona emergente sobre la autopista en Itagui, en lo que se denomina el Nuevo Poblado. Incluye el area de la plaza de mercado y sectores aledanos en plena transformacion urbanistica. Analogia con Ciudad del Rio hace 25 anos: precios actuales muy bajos con potencial de valorizacion extraordinario. Ubicacion centrica permite acceso rapido desde el Poblado, Envigado y Sabaneta cruzando un puente. El POT contempla transformacion de uso del suelo para este sector.",
    highlights: [
      "Precio del suelo 55% menor que El Poblado (oportunidad unica)",
      "75,400 habitantes E5/E6 en radio de 20 min (Poblado + Envigado + Sabaneta)",
      "POT contempla transformacion urbanistica del sector",
      "Conectividad: Autopista Sur + puente peatonal a El Poblado",
      "Vision a 10 anos: analogia con la transformacion de Ciudad del Rio",
    ],
    demandEstimate: 75400,
    avgM2Price: 3800000,
    driveTimeToHPTU: 15,
    potViability: "En transformacion - POT preve cambio de uso a mixto/dotacional",
  },
];
