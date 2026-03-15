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
  // Coordenadas verificadas con OSM/Mapcarta/Google Maps — marzo 2026
  {
    id: "hosp-01",
    name: "Clinica Las Vegas",
    category: "hospital",
    coordinates: [-75.5765, 6.2033],
    description:
      "Clinica de alta complejidad sobre la Avenida Las Vegas (Cl 2 Sur #46-55). 171 camas. Referente en cirugia cardiovascular. Competidor directo en zona de influencia.",
  },
  {
    id: "hosp-02",
    name: "Clinica El Rosario - Sede Tesoro",
    category: "hospital",
    coordinates: [-75.5575, 6.1939],
    description:
      "Sede premium de la Clinica El Rosario junto al C.C. El Tesoro (Cra 20 #2 Sur-185). 158 camas. Urgencias 24h y cuidado critico.",
  },
  {
    id: "hosp-03",
    name: "Clinica Medellin - Sede Poblado",
    category: "hospital",
    coordinates: [-75.5712, 6.2068],
    description:
      "Centro de atencion integral (Cl 7 #39-290, Torre Medica El Poblado). Oncologia, traumatologia y maternidad.",
  },
  {
    id: "hosp-04",
    name: "HPTU - Sede Actual (Robledo)",
    category: "hospital",
    coordinates: [-75.5797, 6.2773],
    description:
      "Sede del Hospital Pablo Tobon Uribe en Robledo (CL 78B #69-240). 1,094 camas al 96% de ocupacion. Referente nacional en trasplantes y hematologia.",
  },
  {
    id: "hosp-05",
    name: "Clinica SOMA",
    category: "hospital",
    coordinates: [-75.5672, 6.2095],
    description:
      "Clinica privada en El Poblado con enfoque en cirugia estetica, ortopedia y medicina deportiva. Calle 7 #39-107.",
  },
  {
    id: "hosp-06",
    name: "Clinica CES",
    category: "hospital",
    coordinates: [-75.5654, 6.2576],
    description:
      "Centro clinico de la Universidad CES en Prado Centro (Cra 50C #58-55). 213 camas. A 7.16 km del corredor Las Palmas. No ubicada en el corredor.",
  },
  {
    id: "hosp-07",
    name: "Hospital San Vicente - Rionegro",
    category: "hospital",
    coordinates: [-75.4345, 6.1523],
    description:
      "Caso de exito referente: sede del Hospital San Vicente en el Oriente (Vda La Convencion, km 2.3 Via Aeropuerto). La junta del HPTU lo cita como modelo a replicar.",
  },

  // ── Medicina Prepagada / Seguros ──────────────────────────────────
  {
    id: "prep-01",
    name: "SURA - Sede Salud El Poblado",
    category: "prepagada",
    coordinates: [-75.5668, 6.2080],
    description:
      "Centro de atencion de Sura Salud en El Poblado. Mayor aseguradora del mercado premium con ~320,000 afiliados de medicina prepagada en Antioquia.",
  },
  {
    id: "prep-02",
    name: "Colsanitas - Centro Medico Poblado",
    category: "prepagada",
    coordinates: [-75.5658, 6.2055],
    description:
      "Centro medico de Colsanitas/Sanitas en El Poblado. Segunda mayor prepagada del pais con cobertura significativa en estratos 4-6.",
  },
  {
    id: "prep-03",
    name: "Medplus - Sede El Tesoro",
    category: "prepagada",
    coordinates: [-75.5580, 6.1965],
    description:
      "Centro de medicina prepagada Medplus cerca de El Tesoro. Atiende segmento corporativo y familiar de alta gama.",
  },

  // ── Clubes Sociales ────────────────────────────────────────────────
  {
    id: "club-01",
    name: "Club Campestre El Rodeo",
    category: "club",
    coordinates: [-75.5953, 6.2064],
    description:
      "Club social y deportivo con golf, piscinas y tenis (Cl 2 Sur #65-535). Ubicado en sector Guayabal, no directamente sobre la via Las Palmas.",
  },
  {
    id: "club-02",
    name: "Club Campestre de Medellin",
    category: "club",
    coordinates: [-75.5726, 6.1895],
    description:
      "Club social mas tradicional de Medellin con golf 18 hoyos (Cl 16A Sur #34-950). Sector Belen / El Poblado sur.",
  },
  {
    id: "club-03",
    name: "Club El Nogal",
    category: "club",
    coordinates: [-75.5640, 6.2020],
    description:
      "Club social de networking empresarial y eventos corporativos en El Poblado, frecuentado por ejecutivos de la Milla de Oro.",
  },

  // ── Colegios Premium (Corredor Las Palmas) ────────────────────────
  {
    id: "cole-01",
    name: "Colegio Colombo Britanico",
    category: "colegio",
    coordinates: [-75.5567, 6.2013],
    description:
      "Institucion bilingue IB en El Poblado (Cra 43A #18 Sur-174). Mas de 50 anos de trayectoria. Generador de trafico familiar.",
  },
  {
    id: "cole-02",
    name: "Colegio Montessori",
    category: "colegio",
    coordinates: [-75.5535, 6.1970],
    description:
      "Colegio con metodologia Montessori y STEM en la parte alta de El Poblado. Familias de estratos 5-6.",
  },
  {
    id: "cole-03",
    name: "Colegio Aleman (Deutsche Schule)",
    category: "colegio",
    coordinates: [-75.5644, 6.1820],
    description:
      "Colegio trilingue con Abitur en El Poblado sur. Comunidad expatriada y estrato 6.",
  },
  {
    id: "cole-04",
    name: "Escuela de Ingenieria de Antioquia (EIA)",
    category: "colegio",
    coordinates: [-75.5169, 6.1570],
    description:
      "Universidad de ingenieria sobre la via Las Palmas (km 2+200 Via Aeropuerto, Envigado). Referente academico y generador de trafico en el corredor.",
  },

  // ── Centros Corporativos ───────────────────────────────────────────
  {
    id: "corp-01",
    name: "Milla de Oro",
    category: "corporativo",
    coordinates: [-75.5688, 6.2080],
    description:
      "Principal corredor financiero de Medellin: bancos, aseguradoras, consultorias. Alta concentracion de usuarios prepagada y corporativos.",
  },
  {
    id: "corp-02",
    name: "One Plaza Business Center",
    category: "corporativo",
    coordinates: [-75.5695, 6.2105],
    description:
      "Torre corporativa clase A con coworking y helipuerto sobre la transversal inferior.",
  },
  {
    id: "corp-03",
    name: "Edificio Direccion General Bancolombia",
    category: "corporativo",
    coordinates: [-75.5690, 6.2125],
    description:
      "Sede principal de Bancolombia, mas de 4,000 empleados. Convenios de salud prepagada con Sura y Colsanitas.",
  },
  {
    id: "corp-04",
    name: "Centro Comercial El Tesoro",
    category: "corporativo",
    coordinates: [-75.5586, 6.1960],
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
    coordinates: [-75.5560, 6.1950],
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
    coordinates: [-75.5780, 6.1680],
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
