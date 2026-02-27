export type POICategory =
  | "hospital"
  | "club"
  | "colegio"
  | "corporativo"
  | "residencial"
  | "prepagada";

export type POI = {
  id: string;
  name: string;
  category: POICategory;
  coordinates: [number, number]; // [lng, lat]
  description: string;
};

export const categoryColors: Record<POICategory, string> = {
  hospital: "#ef4444",
  club: "#8b5cf6",
  colegio: "#f59e0b",
  corporativo: "#3b82f6",
  residencial: "#10b981",
  prepagada: "#ec4899",
};

export const categoryLabels: Record<POICategory, string> = {
  hospital: "Clinicas y Hospitales",
  club: "Clubes Sociales",
  colegio: "Colegios Premium",
  corporativo: "Centros Corporativos",
  residencial: "Zonas Residenciales E5/E6",
  prepagada: "Medicina Prepagada / Seguros",
};

export const pois: POI[] = [
  // ── Clinicas y Hospitales ──────────────────────────────────────────
  {
    id: "hosp-01",
    name: "Clinica Las Vegas",
    category: "hospital",
    coordinates: [-75.5637, 6.2012],
    description:
      "Clinica de alta complejidad sobre la Avenida Las Vegas, referente en cirugia cardiovascular y trasplantes. Competidor directo en zona de influencia.",
  },
  {
    id: "hosp-02",
    name: "Clinica El Rosario - Sede Tesoro",
    category: "hospital",
    coordinates: [-75.559, 6.1985],
    description:
      "Sede premium de la Clinica El Rosario junto al C.C. El Tesoro, urgencias 24h y cuidado critico. Competidor en segmento premium.",
  },
  {
    id: "hosp-03",
    name: "Clinica Medellin - Sede Poblado",
    category: "hospital",
    coordinates: [-75.567, 6.208],
    description:
      "Centro de atencion integral con oncologia, traumatologia y maternidad en El Poblado.",
  },
  {
    id: "hosp-04",
    name: "HPTU - Sede Actual (Prado)",
    category: "hospital",
    coordinates: [-75.5644, 6.2683],
    description:
      "Sede historica del Hospital Pablo Tobon Uribe en el barrio Prado. Referente en trasplantes y hematologia. Distancia al corredor Las Palmas: 18-25 min.",
  },
  {
    id: "hosp-05",
    name: "Clinica del Country Medellin",
    category: "hospital",
    coordinates: [-75.571, 6.2035],
    description:
      "Clinica privada con enfoque en cirugia estetica, ortopedia y medicina deportiva en Los Balsos.",
  },
  {
    id: "hosp-06",
    name: "Clinica CES",
    category: "hospital",
    coordinates: [-75.5460, 6.1960],
    description:
      "Centro clinico de la Universidad CES en la via Las Palmas. Referente academico en medicina. Proximidad a zona candidata Las Palmas Medio.",
  },
  {
    id: "hosp-07",
    name: "Hospital San Vicente - Rionegro",
    category: "hospital",
    coordinates: [-75.3740, 6.1530],
    description:
      "Caso de exito referente: sede del Hospital San Vicente en el Oriente. La junta del HPTU lo cita como modelo a replicar en Las Palmas.",
  },

  // ── Medicina Prepagada / Seguros ──────────────────────────────────
  {
    id: "prep-01",
    name: "SURA - Sede Salud El Poblado",
    category: "prepagada",
    coordinates: [-75.5650, 6.2050],
    description:
      "Centro de atencion de Sura Salud en El Poblado. Mayor aseguradora del mercado premium con ~320,000 afiliados de medicina prepagada en Antioquia.",
  },
  {
    id: "prep-02",
    name: "Colsanitas - Centro Medico Poblado",
    category: "prepagada",
    coordinates: [-75.5620, 6.2030],
    description:
      "Centro medico de Colsanitas/Sanitas en El Poblado. Segunda mayor prepagada del pais con cobertura significativa en estratos 4-6.",
  },
  {
    id: "prep-03",
    name: "Medplus - Sede El Tesoro",
    category: "prepagada",
    coordinates: [-75.5580, 6.1990],
    description:
      "Centro de medicina prepagada Medplus cerca de El Tesoro. Atiende segmento corporativo y familiar de alta gama.",
  },

  // ── Clubes Sociales ────────────────────────────────────────────────
  {
    id: "club-01",
    name: "Club El Rodeo",
    category: "club",
    coordinates: [-75.5490, 6.2040],
    description:
      "Exclusivo club social y deportivo sobre la via a Las Palmas con golf, piscinas olimpicas y tenis. Punto de referencia del corredor.",
  },
  {
    id: "club-02",
    name: "Club Campestre de Medellin",
    category: "club",
    coordinates: [-75.548, 6.175],
    description:
      "Club social mas tradicional de Medellin con golf 18 hoyos, hipica y zonas verdes en la parte alta de El Poblado.",
  },
  {
    id: "club-03",
    name: "Club El Nogal",
    category: "club",
    coordinates: [-75.562, 6.192],
    description:
      "Club social de networking empresarial y eventos corporativos, frecuentado por ejecutivos de la Milla de Oro.",
  },

  // ── Colegios Premium (Corredor Las Palmas) ────────────────────────
  {
    id: "cole-01",
    name: "Colegio Colombo Britanico",
    category: "colegio",
    coordinates: [-75.5442, 6.2005],
    description:
      "Institucion bilingue IB sobre la via Las Palmas. Mas de 50 anos de trayectoria. Generador de trafico familiar clave en el corredor.",
  },
  {
    id: "cole-02",
    name: "Colegio Montessori",
    category: "colegio",
    coordinates: [-75.541, 6.195],
    description:
      "Colegio con metodologia Montessori y STEM en la parte alta de El Poblado. Familias de estratos 5-6.",
  },
  {
    id: "cole-03",
    name: "Colegio Aleman (Deutsche Schule)",
    category: "colegio",
    coordinates: [-75.5505, 6.1790],
    description:
      "Colegio trilingue con Abitur en El Poblado sur. Comunidad expatriada y estrato 6.",
  },
  {
    id: "cole-04",
    name: "Escuela de Ingenieria de Antioquia (EIA)",
    category: "colegio",
    coordinates: [-75.5430, 6.2050],
    description:
      "Universidad de ingenieria sobre la via Las Palmas. Referente academico y generador de trafico. Punto limite de la zona candidata Las Palmas Bajo.",
  },

  // ── Centros Corporativos ───────────────────────────────────────────
  {
    id: "corp-01",
    name: "Milla de Oro",
    category: "corporativo",
    coordinates: [-75.5655, 6.206],
    description:
      "Principal corredor financiero de Medellin: bancos, aseguradoras, consultorias. Alta concentracion de usuarios prepagada y corporativos.",
  },
  {
    id: "corp-02",
    name: "One Plaza Business Center",
    category: "corporativo",
    coordinates: [-75.568, 6.21],
    description:
      "Torre corporativa clase A con coworking y helipuerto sobre la transversal inferior.",
  },
  {
    id: "corp-03",
    name: "Edificio Direccion General Bancolombia",
    category: "corporativo",
    coordinates: [-75.564, 6.213],
    description:
      "Sede principal de Bancolombia, mas de 4,000 empleados. Convenios de salud prepagada con Sura y Colsanitas.",
  },
  {
    id: "corp-04",
    name: "Centro Comercial El Tesoro",
    category: "corporativo",
    coordinates: [-75.5575, 6.1975],
    description:
      "Principal centro comercial de estratos 5/6 en El Poblado. Punto de referencia para la zona Las Palmas y ancla de flujos vehiculares.",
  },

  // ── Zonas Residenciales E5/E6 ──────────────────────────────────────
  {
    id: "resi-01",
    name: "Sector Las Palmas - Indiana",
    category: "residencial",
    coordinates: [-75.5470, 6.2070],
    description:
      "Corredor residencial E5/E6 entre Indiana y la EIA. Condominios cerrados, vistas panoramicas. Zona de maxima demanda para nueva sede.",
  },
  {
    id: "resi-02",
    name: "Zona El Tesoro - San Lucas",
    category: "residencial",
    coordinates: [-75.556, 6.199],
    description:
      "Entorno residencial premium con torres de lujo. Poblacion estimada: 42,000 hab E5/E6. A 8 min de Las Palmas Bajo.",
  },
  {
    id: "resi-03",
    name: "Los Balsos - Lalinde",
    category: "residencial",
    coordinates: [-75.5680, 6.2010],
    description:
      "Barrio residencial de estrato 6 con alta concentracion de usuarios de medicina prepagada.",
  },
  {
    id: "resi-04",
    name: "Zuniga - Envigado Alto",
    category: "residencial",
    coordinates: [-75.578, 6.168],
    description:
      "Zona residencial en expansion con 15+ proyectos de alta gama. Poblacion E5/E6 en crecimiento acelerado.",
  },
  {
    id: "resi-05",
    name: "Sabaneta - Aves Maria",
    category: "residencial",
    coordinates: [-75.6150, 6.1510],
    description:
      "Municipio del sur con alta densidad de estratos 4-5. Crecimiento poblacional mas alto del area metropolitana.",
  },
  {
    id: "resi-06",
    name: "Loma del Escobero - Envigado",
    category: "residencial",
    coordinates: [-75.5650, 6.1620],
    description:
      "Sector exclusivo en las partes altas de Envigado. Condominios de lujo con potencial de demanda hacia Las Palmas.",
  },
];
