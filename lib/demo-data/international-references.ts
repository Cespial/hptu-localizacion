// ---------------------------------------------------------------
// Referencias Internacionales — Cleveland Clinic, PRENUVO, CEDIMED
// Sources: Cleveland Clinic Annual Reports, PRENUVO.com,
//          CEDIMED.com.co, prensa verificada
// ---------------------------------------------------------------

export type InternationalReference = {
  id: string;
  name: string;
  type: "modelo" | "servicio" | "competidor";
  country: string;
  summary: string;
  keyFacts: string[];
  relevanceForHPTU: string;
  source: string;
};

export const internationalReferences: InternationalReference[] = [
  {
    id: "cleveland-ambulatory",
    name: "Cleveland Clinic — Modelo de Centros Ambulatorios",
    type: "modelo",
    country: "Estados Unidos",
    summary:
      "Cleveland Clinic opera 270+ ambulatory locations fuera de su campus principal en Ohio. " +
      "El modelo de Family Health Centers y Express Care Clinics lleva servicios de alta calidad " +
      "a zonas suburbanas y comunitarias, generando >50% de ingresos ambulatorios fuera del hospital.",
    keyFacts: [
      "270+ ubicaciones ambulatorias fuera del campus principal",
      ">50% de ingresos provienen de servicios ambulatorios",
      "Express Care: consultas sin cita en centros retail y comunidades",
      "Modelo hub-and-spoke: campus principal + satelites especializados",
      "Cada satelite hereda la marca y protocolos del hospital principal",
      "Servicios tipicos: imagenes, laboratorio, consulta especializada, cirugia de dia",
      "Revenue ambulatorio 2024: ~USD $6.800M (del total USD $15.700M)",
    ],
    relevanceForHPTU:
      "El modelo de Cleveland Clinic demuestra que la expansion ambulatoria fuera del campus " +
      "principal es viable y rentable. Una sede HPTU en Access Point operaria como un satelite " +
      "que hereda el prestigio y protocolos del hospital de Robledo, sin necesidad de camas de " +
      "hospitalizacion. El concepto de 'heritage de marca' permite cobrar tarifas premium.",
    source: "Cleveland Clinic Annual Report 2024, Becker's Hospital Review",
  },
  {
    id: "prenuvo",
    name: "PRENUVO — Full-Body MRI Preventivo",
    type: "servicio",
    country: "Estados Unidos / Canada",
    summary:
      "PRENUVO ofrece escaneos de resonancia magnetica de cuerpo completo sin radiacion " +
      "como herramienta de deteccion temprana. Un solo escaneo dura ~1 hora y cubre cerebro, " +
      "torax, abdomen y pelvis. Precio: $1,800-$2,499 USD por escaneo. " +
      "La empresa ha crecido exponencialmente con clientela de alto poder adquisitivo.",
    keyFacts: [
      "Precio: $1,800-$2,499 USD por escaneo completo",
      "Duracion: ~60 minutos, sin radiacion (MRI no usa rayos X)",
      "Detecta: cancer temprano, aneurismas, enfermedades hepaticas, renales",
      "Target: ejecutivos, deportistas, personas con historial familiar de cancer",
      "Celebrities como Kim Kardashian y Marc Cuban lo han promovido",
      "18 centros en EE.UU., Canada, UK. Expansion rapida.",
      "Revenue estimado 2024: >$200M USD",
      "Wait list de 3-6 meses en la mayoria de centros",
    ],
    relevanceForHPTU:
      "PRENUVO como servicio diferenciador para la sede ambulatoria HPTU (FASE 2, no lanzamiento): " +
      "1) Target perfecto: ejecutivos de Zona Franca (300 empresas, 12,000 empleados), " +
      "viajeros frecuentes del aeropuerto, residentes E5/E6 de El Poblado y Oriente. " +
      "2) Precio premium justifica inversion en equipo MRI de ultima generacion. " +
      "3) No requiere hospitalizacion ni urgencias — alineado con concepto ambulatorio. " +
      "4) Diferenciador unico: ningun competidor en Antioquia ofrece este servicio. " +
      "NOTA: Programado para Fase 2 — requiere volumen y base instalada de MRI operativa.",
    source: "PRENUVO.com, Forbes, Bloomberg 2024",
  },
  {
    id: "cedimed",
    name: "CEDIMED — Centro Diagnostico Medico de Antioquia",
    type: "competidor",
    country: "Colombia (Medellin)",
    summary:
      "CEDIMED es el centro de imagenes diagnosticas mas reconocido de Antioquia. " +
      "Opera desde 1990 con multiples sedes en Medellin y presencia en Torre Medica " +
      "El Tesoro y Torre Oviedo. Ofrece resonancia magnetica, tomografia, " +
      "ecografia, mamografia, densitometria y medicina nuclear.",
    keyFacts: [
      "Fundado en 1990 — 35+ anos de experiencia en Antioquia",
      "Sedes: Poblado (El Tesoro), San Diego, Oviedo, Envigado",
      "Sede en Torre Medica Oviedo (inaugurada jun 2025, dentro de CC Oviedo)",
      "Servicios: RMN, TAC, PET-CT, mamografia, ecografia, medicina nuclear",
      "Convenio con multiples EPS y prepagadas",
      "No tiene presencia en el Oriente Antioqueno",
      "Referente de calidad en imagenes diagnosticas en la region",
    ],
    relevanceForHPTU:
      "CEDIMED es un competidor directo en imagenes diagnosticas en El Poblado, pero " +
      "NO tiene presencia en el Oriente. Una sede HPTU con imagenes avanzadas en Access Point " +
      "capturaria la demanda de Oriente que hoy viaja a Medellin para estudios complejos. " +
      "Ademas, el modelo CEDIMED valida que los centros de imagenes satelite (fuera del " +
      "campus hospitalario) son rentables en Antioquia.",
    source: "CEDIMED.com.co, Torre Medica Oviedo comunicado 2025",
  },
];

// Ambulatory portfolio for the expansion
export type AmbulatoryService = {
  category: string;
  services: string[];
  differentiator: string;
  excludes?: string;
};

export const ambulatoryPortfolio: AmbulatoryService[] = [
  {
    category: "Imagenes Diagnosticas",
    services: [
      "TAC multicorte",
      "Resonancia magnetica 3T",
      "Ecografia avanzada",
      "Mamografia digital",
    ],
    differentiator:
      "Centro de referencia en imagenes avanzadas para el corredor Las Palmas-Oriente (Fase 1). PET-CT y full-body MRI preventivo (PRENUVO) programados para Fase 2 cuando volumen oncologico lo justifique.",
  },
  {
    category: "Consulta Especializada Ambulatoria",
    services: [
      "Cardiologia",
      "Neurologia",
      "Oncologia (segunda opinion)",
      "Ortopedia",
      "Urologia",
      "Ginecologia",
      "Dermatologia",
      "Endocrinologia",
      "Gastroenterologia",
      "Neumologia",
    ],
    differentiator:
      "Subespecialistas HPTU rotando a la sede ambulatoria — heritage de marca",
  },
  {
    category: "Cirugia Ambulatoria",
    services: [
      "Ortopedia (artroscopia, mano, pie)",
      "Urologia (litotricia, cistoscopia)",
      "Ginecologia (laparoscopia, histeroscopia)",
      "ORL (septoplastia, amigdalectomia)",
      "Cirugia general (hernia, vesicula, apendice)",
      "Oftalmologia (catarata, refractiva)",
    ],
    differentiator:
      "Quirofanos ambulatorios tipo Cleveland Clinic — alta rotacion, alta eficiencia",
    excludes: "No incluye cirugia mayor, trasplantes ni procedimientos que requieran UCI",
  },
  {
    category: "Chequeo Ejecutivo / Wellness",
    services: [
      "Check-up ejecutivo completo (dia completo)",
      "Full-body MRI preventivo",
      "Panel cardiovascular avanzado",
      "Evaluacion oncologica preventiva",
      "Evaluacion deportiva (VO2max, biomecánica)",
      "Nutricion y metabolismo",
    ],
    differentiator:
      "Target: 300 empresas Zona Franca (12,000 empleados), viajeros frecuentes aeropuerto",
  },
  {
    category: "Rehabilitacion Especializada",
    services: [
      "Neuro-rehabilitacion (ACV, TEC)",
      "Rehabilitacion cardiaca",
      "Rehabilitacion deportiva",
      "Rehabilitacion post-quirurgica",
      "Terapia fisica y ocupacional avanzada",
    ],
    differentiator:
      "Inexistente en Oriente — cero competencia en rehabilitacion especializada",
  },
  {
    category: "Estetica y Dermatologia",
    services: [
      "Dermatologia clinica",
      "Cirugia dermatologica (Mohs)",
      "Laser y tecnologia estetica",
      "Medicina estetica no invasiva",
    ],
    differentiator:
      "Complemento natural para turismo medico (23,323 pac internacionales/ano en Medellin)",
  },
  {
    category: "Oncologia Ambulatoria",
    services: [
      "Quimioterapia ambulatoria",
      "Inmunoterapia",
      "Segunda opinion oncologica",
      "Seguimiento post-tratamiento",
      "Consejeria genetica",
    ],
    differentiator:
      "Complementa duopolio Somer-SVF en Oriente — tercer punto de atencion oncologica",
    excludes: "No incluye radioterapia ni cirugia oncologica mayor",
  },
];

// What the expansion explicitly DOES NOT include
export const expansionExclusions = [
  "Urgencias 24/7",
  "Hospitalizacion (camas)",
  "Unidad de Cuidados Intensivos (UCI)",
  "Trasplantes",
  "Cirugia de alta complejidad",
  "Atencion neonatal",
  "Radioterapia (equipo propio)",
];

// Wellness/esperas productivas concept
export const wellnessConcept = {
  title: "Esperas Productivas: El Modelo de Wellness Center",
  description:
    "El concepto de esperas productivas transforma el tiempo de espera del paciente " +
    "en una experiencia positiva. En lugar de una sala de espera tradicional, el entorno " +
    "del centro ambulatorio incluye retail, cafeterias, farmacias y servicios complementarios " +
    "que generan revenue adicional y mejoran la experiencia.",
  examples: [
    "Cleveland Clinic: cafeterias, farmacias, retail en cada ambulatory center",
    "Mayo Clinic: giftshops, restaurantes, servicios de concierge",
    "Access Point: 4 torres de oficinas con potencial para retail en primeros pisos",
    "Torre Medica Oviedo: dentro de CC Oviedo — esperas productivas naturales",
  ],
  metricsProxy:
    "Se mide como densidad de establecimientos retail/servicios en 500m del centro.",
};
