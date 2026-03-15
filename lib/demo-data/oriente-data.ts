// ---------------------------------------------------------------
// Oriente Antioqueno — data layer for HPTU localizacion dashboard
// Sources: DANE CNPV 2018 (evm3-92yw), REPS (b4dp-ximh),
//          Aseguramiento (ruaf-giye), ANI peajes (8yi9-t44c),
//          Mapbox Matrix API, Google Places API, OSM Overpass,
//          Catastro Medellin (bp59-rj8r), POT (3ciz-tpgr)
// ---------------------------------------------------------------

export type OrienteMunicipio = {
  id: string;
  name: string;
  daneCode: string;
  population2018: number; // sum from CNPV
  populationEst2026: number; // estimate +2% CAGR or from projection
  coordinates: [number, number]; // [lng, lat] centroid
  prestadores: number;
  camas: number;
  consultorios: number;
  nivelMaximo: number; // max complexity level (1 or 2)
  travelTimeFromCandidate: number; // minutes (from matrix)
  travelTimeFromHPTU: number; // minutes (from matrix)
  distanceFromCandidate: number; // km
  afiliadosContributivo: number; // from aseguramiento
  afiliadosSubsidiado: number;
};

export type TrafficCorridor = {
  name: string;
  peaje: string;
  vehiculos2014: number;
  vehiculos2024: number;
  growthPct: number;
  datasetId: string;
};

export type MedicalProject = {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  type: "hospital" | "clinica" | "torre-medica" | "proyecto";
  status: "operativo" | "en-construccion" | "planeacion" | "desconocido";
  municipality: string;
  description: string;
  rating?: number;
  reviews?: number;
  isCompetitor: boolean;
};

export type BuildingHeightData = {
  barrio: string;
  avgFloors: number;
  maxPotFloors: number;
  densityUsedPct: number;
  potentialLevel: "saturado" | "medio" | "alto" | "masivo";
};

// 11 municipios del Valle de San Nicolas / Oriente cercano
// Population: CNPV 2018 (sum all age bins: hombres_cabecera + mujeres_cabecera +
//   hombres_centropoblado + mujeres_centropoblado + hombresruraldisperso + mujeresruraldisperso)
// Capacity: REPS capacidad instalada (b4dp-ximh), Nov 2022
// Travel times: Mapbox Matrix API (durations in seconds / 60)
// Aseguramiento: RUAF (ruaf-giye), Apr 2022 — C=contributivo, S=subsidiado
export const orienteMunicipios: OrienteMunicipio[] = [
  {
    id: "rionegro",
    name: "Rionegro",
    daneCode: "05615",
    population2018: 116400, // CNPV exact
    populationEst2026: 135100, // ~2% CAGR 8yr
    coordinates: [-75.3744, 6.1553],
    prestadores: 730, // REPS unique codigohabilitacion
    camas: 656,
    consultorios: 491,
    nivelMaximo: 2,
    travelTimeFromCandidate: 58.8, // 3529.3s / 60
    travelTimeFromHPTU: 57.1, // 3426.2s / 60
    distanceFromCandidate: 38.8, // 38784m / 1000
    afiliadosContributivo: 161041,
    afiliadosSubsidiado: 29941,
  },
  {
    id: "guarne",
    name: "Guarne",
    daneCode: "05318",
    population2018: 42500, // CNPV exact
    populationEst2026: 49300,
    coordinates: [-75.4433, 6.2794],
    prestadores: 71,
    camas: 184,
    consultorios: 29,
    nivelMaximo: 1,
    travelTimeFromCandidate: 55.6, // 3334.1s / 60
    travelTimeFromHPTU: 39.7, // 2384.2s / 60
    distanceFromCandidate: 41.0,
    afiliadosContributivo: 32692,
    afiliadosSubsidiado: 12657,
  },
  {
    id: "marinilla",
    name: "Marinilla",
    daneCode: "05440",
    population2018: 55230, // CNPV exact
    populationEst2026: 64100,
    coordinates: [-75.3362, 6.1772],
    prestadores: 154,
    camas: 27,
    consultorios: 38,
    nivelMaximo: 1,
    travelTimeFromCandidate: 68.4, // 4106.6s / 60
    travelTimeFromHPTU: 58.8, // 3525.5s / 60
    distanceFromCandidate: 53.0,
    afiliadosContributivo: 46189,
    afiliadosSubsidiado: 19669,
  },
  {
    id: "la-ceja",
    name: "La Ceja",
    daneCode: "05376",
    population2018: 59386, // CNPV exact
    populationEst2026: 68900,
    coordinates: [-75.4261, 6.0519],
    prestadores: 183,
    camas: 240,
    consultorios: 81,
    nivelMaximo: 1,
    travelTimeFromCandidate: 66.2, // 3972.9s / 60
    travelTimeFromHPTU: 84.0, // 5039.7s / 60
    distanceFromCandidate: 38.0,
    afiliadosContributivo: 63417,
    afiliadosSubsidiado: 13229,
  },
  {
    id: "el-retiro",
    name: "El Retiro",
    daneCode: "05607",
    population2018: 20700, // CNPV exact
    populationEst2026: 24000,
    coordinates: [-75.5076, 6.0604],
    prestadores: 59,
    camas: 26,
    consultorios: 9,
    nivelMaximo: 0, // no nivel reported in REPS
    travelTimeFromCandidate: 44.0, // 2641.1s / 60
    travelTimeFromHPTU: 61.8, // 3707.9s / 60
    distanceFromCandidate: 25.4,
    afiliadosContributivo: 12956,
    afiliadosSubsidiado: 3738,
  },
  {
    id: "el-carmen",
    name: "El Carmen de Viboral",
    daneCode: "05148",
    population2018: 53949, // CNPV exact
    populationEst2026: 62600,
    coordinates: [-75.3340, 6.0832],
    prestadores: 125,
    camas: 37,
    consultorios: 27,
    nivelMaximo: 1,
    travelTimeFromCandidate: 81.3, // 4876.8s / 60
    travelTimeFromHPTU: 78.2, // 4693.6s / 60
    distanceFromCandidate: 50.5,
    afiliadosContributivo: 35869,
    afiliadosSubsidiado: 16310,
  },
  {
    id: "el-santuario",
    name: "El Santuario",
    daneCode: "05697",
    population2018: 30311, // CNPV exact
    populationEst2026: 35200,
    coordinates: [-75.2637, 6.1394],
    prestadores: 51,
    camas: 6,
    consultorios: 24,
    nivelMaximo: 1,
    travelTimeFromCandidate: 77.3, // 4640.0s / 60
    travelTimeFromHPTU: 67.6, // 4058.9s / 60
    distanceFromCandidate: 63.1,
    afiliadosContributivo: 14980,
    afiliadosSubsidiado: 15512,
  },
  {
    id: "concepcion",
    name: "Concepcion",
    daneCode: "05206",
    population2018: 3936, // CNPV exact
    populationEst2026: 4600,
    coordinates: [-75.2555, 6.3944],
    prestadores: 6,
    camas: 3,
    consultorios: 1,
    nivelMaximo: 1,
    travelTimeFromCandidate: 0, // not in matrix
    travelTimeFromHPTU: 0,
    distanceFromCandidate: 0,
    afiliadosContributivo: 674,
    afiliadosSubsidiado: 2720,
  },
  {
    id: "guatape",
    name: "Guatape",
    daneCode: "05321",
    population2018: 7038, // CNPV exact
    populationEst2026: 8200,
    coordinates: [-75.1581, 6.2316],
    prestadores: 13,
    camas: 5,
    consultorios: 10,
    nivelMaximo: 1,
    travelTimeFromCandidate: 0, // not in matrix
    travelTimeFromHPTU: 0,
    distanceFromCandidate: 0,
    afiliadosContributivo: 2706,
    afiliadosSubsidiado: 3378,
  },
  {
    id: "el-penol",
    name: "El Penol",
    daneCode: "05541",
    population2018: 18010, // CNPV exact
    populationEst2026: 20900,
    coordinates: [-75.2438, 6.2254],
    prestadores: 41,
    camas: 7,
    consultorios: 15,
    nivelMaximo: 1,
    travelTimeFromCandidate: 0, // not in matrix
    travelTimeFromHPTU: 0,
    distanceFromCandidate: 0,
    afiliadosContributivo: 5860,
    afiliadosSubsidiado: 11818,
  },
  {
    id: "san-vicente",
    name: "San Vicente Ferrer",
    daneCode: "05674",
    population2018: 18051, // CNPV exact
    populationEst2026: 20900,
    coordinates: [-75.3323, 6.2889],
    prestadores: 19,
    camas: 8,
    consultorios: 5,
    nivelMaximo: 0, // no nivel reported in REPS
    travelTimeFromCandidate: 0, // not in matrix
    travelTimeFromHPTU: 0,
    distanceFromCandidate: 0,
    afiliadosContributivo: 2625,
    afiliadosSubsidiado: 11410,
  },
];

// Traffic corridors from ANI peaje data (8yi9-t44c) and INVIAS TPD
// Las Palmas: exact annual totals from trafico_ani_antioquia.json
// Guarne: exact annual totals from trafico_ani_guarne.json
export const trafficCorridors: TrafficCorridor[] = [
  {
    name: "Las Palmas (corredor principal sur)",
    peaje: "Las Palmas",
    vehiculos2014: 2_828_201, // exact sum all categories Jan-Dec 2014
    vehiculos2024: 4_633_677, // exact sum all categories Jan-Dec 2024
    growthPct: 63.8, // (4633677/2828201 - 1) * 100
    datasetId: "8yi9-t44c",
  },
  {
    name: "Tunel de Oriente / Guarne (corredor norte)",
    peaje: "Guarne",
    vehiculos2014: 6_334_671, // exact sum all categories Jan-Dec 2014
    vehiculos2024: 8_275_037, // exact sum all categories Jan-Dec 2024
    growthPct: 30.6, // (8275037/6334671 - 1) * 100
    datasetId: "8yi9-t44c",
  },
  {
    name: "Autopista Medellin-Bogota (INVIAS global)",
    peaje: "Primavera",
    vehiculos2014: 1_420_000, // estimated from INVIAS TPD
    vehiculos2024: 1_860_000, // estimated from INVIAS TPD
    growthPct: 31.0,
    datasetId: "invias-tpd",
  },
];

// Medical projects and competitors in the region
// Sources: Google Places API (hospitals_rionegro), REPS, OSM, press releases
export const medicalProjects: MedicalProject[] = [
  {
    id: "med-somer",
    name: "Clinica Somer",
    coordinates: [-75.37752, 6.14069],
    type: "clinica",
    status: "operativo",
    municipality: "Rionegro",
    description: "Principal clinica privada del Oriente. Nivel 2 de complejidad. Referente en servicios de alta complejidad para la region.",
    rating: 3.7,
    reviews: 372,
    isCompetitor: true,
  },
  {
    id: "med-sjdd",
    name: "Hospital San Juan de Dios E.S.E. Rionegro",
    coordinates: [-75.37097, 6.15843],
    type: "hospital",
    status: "operativo",
    municipality: "Rionegro",
    description: "Unico hospital publico nivel 2 del Oriente Antioqueno. 656 camas (55% del total regional). Referente en emergencias.",
    rating: 2.4,
    reviews: 216,
    isCompetitor: true,
  },
  {
    id: "med-clofan",
    name: "Clinica Clofan sede Oriente",
    coordinates: [-75.37961, 6.14645],
    type: "clinica",
    status: "operativo",
    municipality: "Rionegro",
    description: "Sede Oriente de Clinica Clofan (C.C. Savanna Plaza). Atencion ambulatoria y consulta externa.",
    rating: 3.4,
    reviews: 16,
    isCompetitor: true,
  },
  {
    id: "med-somer-central",
    name: "Clinica Somer Central Especialistas",
    coordinates: [-75.37037, 6.15557],
    type: "clinica",
    status: "operativo",
    municipality: "Rionegro",
    description: "Sede de especialistas de Clinica Somer en C.C. Rionegro Plaza (piso 4). Consulta externa especializada.",
    rating: 3.4,
    reviews: 9,
    isCompetitor: true,
  },
  {
    id: "med-citymedica",
    name: "City Medica",
    coordinates: [-75.37875, 6.14020],
    type: "torre-medica",
    status: "operativo",
    municipality: "Rionegro",
    description: "Torre medica con multiples consultorios y especialidades. Ubicada en Carrera 55A #35-227.",
    rating: 4.3,
    reviews: 114,
    isCompetitor: false,
  },
  {
    id: "med-orientesalud",
    name: "OrienteSalud",
    coordinates: [-75.36860, 6.16153],
    type: "clinica",
    status: "operativo",
    municipality: "Rionegro",
    description: "IPS ubicada en Urb. Altos del Lago. Servicios de salud general para la zona norte de Rionegro.",
    rating: 2.4,
    reviews: 22,
    isCompetitor: false,
  },
  {
    id: "med-promedan",
    name: "PROMEDAN IPS El Carmen de Viboral",
    coordinates: [-75.33715, 6.08709],
    type: "clinica",
    status: "operativo",
    municipality: "El Carmen de Viboral",
    description: "Sede Oriente de Promotora Medica y Odontologica de Antioquia (PROMEDAN). Consulta externa y servicios ambulatorios.",
    rating: 3.0,
    reviews: 2,
    isCompetitor: false,
  },
  {
    id: "med-cancerologia",
    name: "Instituto de Cancerologia",
    coordinates: [-75.37192, 6.15937],
    type: "clinica",
    status: "operativo",
    municipality: "Rionegro",
    description: "Sede Oriente del Instituto de Cancerologia. Atencion oncologica en Carrera 51, Rionegro.",
    rating: 3.0,
    reviews: 1,
    isCompetitor: false,
  },
];

// Building heights and POT density for barrios near Candidato 6 (El Poblado)
// Sources: Catastro Medellin (bp59-rj8r), POT Bateria Indicadores (3ciz-tpgr), OSM
export const buildingHeights: BuildingHeightData[] = [
  {
    barrio: "San Lucas",
    avgFloors: 6.1,
    maxPotFloors: 19.1,
    densityUsedPct: 45.8,
    potentialLevel: "alto",
  },
  {
    barrio: "El Tesoro",
    avgFloors: 5.2,
    maxPotFloors: 16.7,
    densityUsedPct: 52.3,
    potentialLevel: "medio",
  },
  {
    barrio: "Los Balsos No.1",
    avgFloors: 4.8,
    maxPotFloors: 16.7,
    densityUsedPct: 58.2,
    potentialLevel: "medio",
  },
  {
    barrio: "Astorga",
    avgFloors: 3.2,
    maxPotFloors: 15.0,
    densityUsedPct: 14.7,
    potentialLevel: "masivo",
  },
  {
    barrio: "Manila",
    avgFloors: 3.5,
    maxPotFloors: 14.0,
    densityUsedPct: 14.2,
    potentialLevel: "masivo",
  },
  {
    barrio: "Las Lomas No.2",
    avgFloors: 4.1,
    maxPotFloors: 20.0,
    densityUsedPct: 35.6,
    potentialLevel: "alto",
  },
  {
    barrio: "Altos del Poblado",
    avgFloors: 3.8,
    maxPotFloors: 12.5,
    densityUsedPct: 42.1,
    potentialLevel: "alto",
  },
];

// Health infrastructure summary for Oriente vs Valle de Aburra
// Sources: REPS capacidad (b4dp-ximh), OSM Overpass
export const orienteHealthSummary = {
  totalCamas: 1199, // REPS exact sum
  totalConsultorios: 732, // REPS exact sum
  totalSalas: 148, // REPS exact sum
  totalAmbulancias: 35, // REPS exact sum
  rionegroPctCamas: 55, // 656 / 1199 = 54.7%
  rionegroPctConsultorios: 67, // 491 / 732 = 67.1%
  facilitiesOriente: 129, // OSM
  facilitiesValleAburra: 549, // OSM
  ratioClinicas: 8.7,
  onlyLevel2Hospital: "Hospital San Juan de Dios E.S.E. Rionegro",
  level3or4Count: 0,
};

// Travel time comparison: candidate site (Cra 22 El Poblado) vs HPTU actual (Robledo)
// Exact values from Mapbox Matrix API (durations in seconds / 60)
// Matrix destination order:
//   [0]=Source, [1]=Rionegro, [2]=Guarne, [3]=Marinilla, [4]=La Ceja,
//   [5]=El Retiro, [6]=El Carmen, [7]=El Santuario, [8]=Aeropuerto SKRG,
//   [9]=Portal Tunel, [10]=Cross-reference (HPTU or Candidato6)
export const travelTimeComparison = {
  destinations: [
    "Rionegro",
    "Guarne",
    "Marinilla",
    "La Ceja",
    "El Retiro",
    "El Carmen",
    "El Santuario",
    "Aeropuerto SKRG",
    "Portal Tunel",
  ],
  fromCandidate: [58.8, 55.6, 68.4, 66.2, 44.0, 81.3, 77.3, 51.3, 68.3], // minutes
  fromHPTU: [57.1, 39.7, 58.8, 84.0, 61.8, 78.2, 67.6, 65.7, 50.2],
};
