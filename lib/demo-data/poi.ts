export type POICategory =
  | "hospital"
  | "club"
  | "colegio"
  | "corporativo"
  | "residencial";

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
};

export const categoryLabels: Record<POICategory, string> = {
  hospital: "Clinicas y Hospitales",
  club: "Clubes Sociales",
  colegio: "Colegios Premium",
  corporativo: "Centros Corporativos",
  residencial: "Zonas Residenciales E5/E6",
};

export const pois: POI[] = [
  // ── Clinicas y Hospitales ──────────────────────────────────────────
  {
    id: "hosp-01",
    name: "Clinica Las Vegas",
    category: "hospital",
    coordinates: [-75.5637, 6.2012],
    description:
      "Clinica de alta complejidad sobre la Avenida Las Vegas, referente en cirugia cardiovascular y trasplantes en el sur del Valle de Aburra.",
  },
  {
    id: "hosp-02",
    name: "Clinica El Rosario - Sede Tesoro",
    category: "hospital",
    coordinates: [-75.559, 6.1985],
    description:
      "Sede premium de la Clinica El Rosario ubicada junto al centro comercial El Tesoro, con urgencias 24h y unidades de cuidado critico.",
  },
  {
    id: "hosp-03",
    name: "Clinica Medellin - Sede Poblado",
    category: "hospital",
    coordinates: [-75.567, 6.208],
    description:
      "Centro de atencion integral con servicios de oncologia, traumatologia y maternidad en el corazon de El Poblado.",
  },
  {
    id: "hosp-04",
    name: "HPTU - Sede Actual (Prado)",
    category: "hospital",
    coordinates: [-75.5644, 6.2683],
    description:
      "Sede historica del Hospital Pablo Tobon Uribe en el barrio Prado, reconocido por su excelencia en trasplantes y hematologia.",
  },
  {
    id: "hosp-05",
    name: "Clinica del Country Medellin",
    category: "hospital",
    coordinates: [-75.571, 6.2035],
    description:
      "Clinica privada con enfoque en cirugia estetica, ortopedia y medicina deportiva, ubicada en la loma de Los Balsos.",
  },

  // ── Clubes Sociales ────────────────────────────────────────────────
  {
    id: "club-01",
    name: "Club El Rodeo",
    category: "club",
    coordinates: [-75.559, 6.187],
    description:
      "Exclusivo club social y deportivo en la via a Las Palmas con campos de golf, piscinas olimpicas y canchas de tenis.",
  },
  {
    id: "club-02",
    name: "Club Campestre de Medellin",
    category: "club",
    coordinates: [-75.548, 6.175],
    description:
      "El club social mas tradicional de la ciudad con campo de golf de 18 hoyos, hípica y amplias zonas verdes en la parte alta de El Poblado.",
  },
  {
    id: "club-03",
    name: "Club El Nogal",
    category: "club",
    coordinates: [-75.562, 6.192],
    description:
      "Club social enfocado en networking empresarial y eventos corporativos, frecuentado por ejecutivos de la Milla de Oro.",
  },

  // ── Colegios Premium ───────────────────────────────────────────────
  {
    id: "cole-01",
    name: "Colegio Colombo Britanico",
    category: "colegio",
    coordinates: [-75.5542, 6.192],
    description:
      "Institucion bilingue con curriculo internacional IB, ubicada en la via a Las Palmas con mas de 50 anos de trayectoria academica.",
  },
  {
    id: "cole-02",
    name: "Colegio Montessori",
    category: "colegio",
    coordinates: [-75.551, 6.185],
    description:
      "Colegio con metodologia Montessori y enfasis en STEM, situado en la parte alta de El Poblado con vista panoramica al valle.",
  },
  {
    id: "cole-03",
    name: "Colegio Aleman (Deutsche Schule)",
    category: "colegio",
    coordinates: [-75.5605, 6.179],
    description:
      "Colegio trilingue (espanol, aleman, ingles) con certificacion internacional y bachillerato Abitur, referente en El Poblado sur.",
  },

  // ── Centros Corporativos ───────────────────────────────────────────
  {
    id: "corp-01",
    name: "Milla de Oro",
    category: "corporativo",
    coordinates: [-75.5655, 6.206],
    description:
      "Principal corredor financiero y corporativo de Medellin sobre la Avenida El Poblado, con sedes de bancos, aseguradoras y firmas de consultoria.",
  },
  {
    id: "corp-02",
    name: "One Plaza Business Center",
    category: "corporativo",
    coordinates: [-75.568, 6.21],
    description:
      "Torre corporativa de ultima generacion con oficinas clase A, coworking y helipuerto, sobre la transversal inferior.",
  },
  {
    id: "corp-03",
    name: "Edificio Direccion General Bancolombia",
    category: "corporativo",
    coordinates: [-75.564, 6.213],
    description:
      "Sede principal del grupo Bancolombia, el conglomerado financiero mas grande de Colombia, con mas de 4.000 empleados en esta locacion.",
  },

  // ── Zonas Residenciales E5/E6 ──────────────────────────────────────
  {
    id: "resi-01",
    name: "Sector Las Palmas",
    category: "residencial",
    coordinates: [-75.545, 6.195],
    description:
      "Corredor residencial de estratos 5 y 6 sobre la via a Las Palmas, con condominios cerrados, vistas panoramicas y alta valorizacion.",
  },
  {
    id: "resi-02",
    name: "Zona El Tesoro - San Lucas",
    category: "residencial",
    coordinates: [-75.556, 6.199],
    description:
      "Entorno residencial premium alrededor del centro comercial El Tesoro y el sector de San Lucas, con torres de apartamentos de lujo.",
  },
  {
    id: "resi-03",
    name: "Zuniga - Envigado",
    category: "residencial",
    coordinates: [-75.578, 6.168],
    description:
      "Barrio residencial en expansion al sur de Medellin con proyectos inmobiliarios de alta gama y excelente conectividad vial.",
  },
  {
    id: "resi-04",
    name: "Llanogrande - Rionegro",
    category: "residencial",
    coordinates: [-75.42, 6.08],
    description:
      "Zona de casas campestres y parcelaciones de lujo en el Oriente antioqueno, con poblacion flotante de fines de semana y festivos.",
  },
];
