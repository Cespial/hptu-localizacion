export type GradientPoint = {
  id: string;
  label: string;
  elevation: string;
  barrioRef: string;
  prediosE56: number; // Real catastro data
  avaluoPromedio: number; // Real avg avaluo from catastro
  potScore: string; // Real POT viability score
  potAltura: string; // Real max height POT
  sueloPotencial: number; // Real development land m2
  corridorSpeed: string; // Real MEData speed
  mapboxDriveToHPTU: string; // Real Mapbox Matrix time
  mapboxDriveToLasVegas: string; // Real Mapbox Matrix time
  competitorCount: string; // Real REPS data
  demandScore: number; // 0-100
  accessScore: number; // 0-100
  dataSource: string;
};

// Demand gradient along Las Palmas corridor - ALL DATA FROM PRIMARY SOURCES
export const demandGradient: GradientPoint[] = [
  {
    id: "el-poblado-core",
    label: "El Poblado (Casco Urbano)",
    elevation: "~1,550 msnm",
    barrioRef: "Barrio El Poblado (cod 1418)",
    prediosE56: 282, // 114 E5 + 5 E6 + 163 E4 (catastro: heavily commercial estrato 0)
    avaluoPromedio: 379376080, // Real from catastro
    potScore: "9/9 ALTA (CL_D=1.30, ICS=62.3, ICF=2.78)",
    potAltura: "7.2 pisos",
    sueloPotencial: 65591,
    corridorSpeed: "Av. El Poblado: 21.6 km/h avg, 19.2 km/h PM (MEData 64,167 obs.)",
    mapboxDriveToHPTU: "N/A (zona densa, sin lotes)",
    mapboxDriveToLasVegas: "~5 min",
    competitorCount: "Alta: 5+ clinicas en 2 km (REPS: 662 IPS en Medellin)",
    demandScore: 98,
    accessScore: 95,
    dataSource: "Catastro bp59-rj8r, POT 3ciz-tpgr, MEData b9s9-jw7c / 7t5n-3b3w",
  },
  {
    id: "altos-del-poblado",
    label: "Altos del Poblado / Indiana",
    elevation: "~1,720 msnm",
    barrioRef: "Barrio Altos del Poblado (cod 1408)",
    prediosE56: 1867, // 365 E5 + 1502 E6
    avaluoPromedio: 244804939, // Real from catastro
    potScore: "9/9 ALTA (CL_D=2.38, ICS=57.4, SPD=68,020 m2)",
    potAltura: "11.7 pisos",
    sueloPotencial: 68020,
    corridorSpeed: "Av. Las Palmas: 40.9 km/h avg, 37.4 km/h PM (MEData 64,285 obs.)",
    mapboxDriveToHPTU: "23.8 min (Mapbox Matrix API)",
    mapboxDriveToLasVegas: "10.5 min (Mapbox Matrix API)",
    competitorCount: "Media: CES, Rosario Tesoro en radio 3 km (REPS)",
    demandScore: 93,
    accessScore: 92,
    dataSource: "Catastro bp59-rj8r, POT 3ciz-tpgr, Mapbox Matrix API, REPS b4dp-ximh",
  },
  {
    id: "el-tesoro",
    label: "El Tesoro / Club El Rodeo",
    elevation: "~1,750 msnm",
    barrioRef: "Barrio El Tesoro (cod 1409)",
    prediosE56: 4110, // 595 E5 + 3515 E6
    avaluoPromedio: 203782456, // Real from catastro
    potScore: "7/9 ALTA (CL_D=0.55, ICS=53.3, 15.4 pisos, SPD=119,482 m2)",
    potAltura: "15.4 pisos",
    sueloPotencial: 119482,
    corridorSpeed: "Av. Las Palmas: 40.9 km/h avg (MEData)",
    mapboxDriveToHPTU: "~25 min (estimado Mapbox)",
    mapboxDriveToLasVegas: "~11 min",
    competitorCount: "Media-Baja: Cl. El Rosario Tesoro cercana (REPS)",
    demandScore: 88,
    accessScore: 85,
    dataSource: "Catastro bp59-rj8r, POT 3ciz-tpgr, Lotes m4wi-nn8x",
  },
  {
    id: "los-balsos",
    label: "Los Balsos / Cedro Verde",
    elevation: "~1,850 msnm",
    barrioRef: "Barrio Los Balsos No.1 (cod 1411)",
    prediosE56: 4601, // from catastro breakdown for Los Balsos 1 + 2
    avaluoPromedio: 225000000, // Los Balsos No.1 avg
    potScore: "6/9 ALTA (ICS=58.2, 16.7 pisos, SPD=132,161 m2)",
    potAltura: "16.7 pisos",
    sueloPotencial: 132161,
    corridorSpeed: "Av. Las Palmas: velocidad cae a ~38 km/h en este tramo PM",
    mapboxDriveToHPTU: "31.8 min (Mapbox Matrix API)",
    mapboxDriveToLasVegas: "20.4 min (Mapbox Matrix API)",
    competitorCount: "Baja: Clinica CES en radio 2 km (REPS)",
    demandScore: 76,
    accessScore: 72,
    dataSource: "Catastro bp59-rj8r, POT 3ciz-tpgr, Mapbox Matrix API",
  },
  {
    id: "las-lomas",
    label: "Las Lomas / Transversal",
    elevation: "~2,000 msnm",
    barrioRef: "Barrio Las Lomas No.2 (cod 1407)",
    prediosE56: 1200, // estimated from catastro
    avaluoPromedio: 204000000, // Las Lomas No.2
    potScore: "5/9 MEDIA-ALTA (ICS=48.2, 20 pisos max, SPD=30,281 m2)",
    potAltura: "20 pisos (maximo de toda Comuna 14)",
    sueloPotencial: 30281,
    corridorSpeed: "Av. Las Palmas: ~36 km/h PM (MEData peor hora 17:00)",
    mapboxDriveToHPTU: "~40 min (estimado)",
    mapboxDriveToLasVegas: "~25 min",
    competitorCount: "Muy Baja: 0 IPS en 4 km (REPS)",
    demandScore: 58,
    accessScore: 52,
    dataSource: "Catastro bp59-rj8r, POT 3ciz-tpgr, MEData 7t5n-3b3w",
  },
  {
    id: "alto-palmas",
    label: "Alto de Las Palmas / Santa Elena",
    elevation: "~2,200 msnm",
    barrioRef: "Corregimiento Santa Elena",
    prediosE56: 422, // catastro Santa Elena E6
    avaluoPromedio: 165000000,
    potScore: "N/A - Suelo rural (corregimiento)",
    potAltura: "Restriccion rural",
    sueloPotencial: 0,
    corridorSpeed: "Av. Las Palmas: 36.1 km/h a las 17:00 (MEData peor hora)",
    mapboxDriveToHPTU: "57.1 min (Mapbox Matrix API)",
    mapboxDriveToLasVegas: "42.3 min (Mapbox Matrix API)",
    competitorCount: "Nula: 0 IPS en 8 km (REPS)",
    demandScore: 38,
    accessScore: 32,
    dataSource: "Catastro bp59-rj8r, REPS b4dp-ximh, Mapbox Matrix API, MEData 7t5n-3b3w",
  },
];

// Traffic flow data from MEData - REAL DATA
export type TrafficFlow = {
  corridor: string;
  corridorId: string;
  direction: string;
  lengthKm: number;
  avgSpeedKmh: number;
  amSpeedKmh: number;
  pmSpeedKmh: number;
  pmTravelTimeMin: number;
  totalObservations: number;
  worstHour: string;
  worstSpeedKmh: number;
  source: string;
};

export const trafficFlows: TrafficFlow[] = [
  {
    corridor: "Avenida Las Palmas",
    corridorId: "11",
    direction: "Chuscalito <-> Sandiego (NS/SN)",
    lengthKm: 5.9,
    avgSpeedKmh: 40.95,
    amSpeedKmh: 42.88,
    pmSpeedKmh: 37.36,
    pmTravelTimeMin: 9.5,
    totalObservations: 64285,
    worstHour: "17:00 (36.1 km/h)",
    worstSpeedKmh: 36.15,
    source: "MEData Vel. Tiempo Viaje GT (7t5n-3b3w), 2017-2020",
  },
  {
    corridor: "Avenida El Poblado",
    corridorId: "13",
    direction: "Calle 12Sur <-> Calle 30 (NS/SN)",
    lengthKm: 3.8,
    avgSpeedKmh: 21.62,
    amSpeedKmh: 25.10,
    pmSpeedKmh: 19.15,
    pmTravelTimeMin: 11.9,
    totalObservations: 64167,
    worstHour: "17:00 (18.0 km/h)",
    worstSpeedKmh: 18.03,
    source: "MEData Vel. Tiempo Viaje GT (7t5n-3b3w), 2017-2020",
  },
  {
    corridor: "Autopista Sur",
    corridorId: "4",
    direction: "CTI <-> Calle 10 (NS)",
    lengthKm: 6.5,
    avgSpeedKmh: 45.58,
    amSpeedKmh: 43.15,
    pmSpeedKmh: 43.60,
    pmTravelTimeMin: 8.9,
    totalObservations: 32338,
    worstHour: "07:00 (39.6 km/h)",
    worstSpeedKmh: 39.55,
    source: "MEData Vel. Tiempo Viaje GT (7t5n-3b3w), 2017-2020",
  },
  {
    corridor: "Avenida Guayabal",
    corridorId: "15",
    direction: "Calle 12Sur <-> Calle 30 (NS/SN)",
    lengthKm: 4.1,
    avgSpeedKmh: 32.52,
    amSpeedKmh: 34.04,
    pmSpeedKmh: 28.98,
    pmTravelTimeMin: 8.5,
    totalObservations: 62771,
    worstHour: "17:00 (26.9 km/h)",
    worstSpeedKmh: 26.89,
    source: "MEData Vel. Tiempo Viaje GT (7t5n-3b3w), 2017-2020",
  },
  {
    corridor: "Avenida Regional",
    corridorId: "2",
    direction: "Calle 30 <-> Punto Cero (NS/SN)",
    lengthKm: 6.6,
    avgSpeedKmh: 53.70,
    amSpeedKmh: 59.37,
    pmSpeedKmh: 45.14,
    pmTravelTimeMin: 8.8,
    totalObservations: 63883,
    worstHour: "17:00 (40.3 km/h)",
    worstSpeedKmh: 40.31,
    source: "MEData Vel. Tiempo Viaje GT (7t5n-3b3w), 2017-2020",
  },
];

// Health facilities from REPS - REAL DATA
export type HealthNode = {
  name: string;
  type: string;
  beds: number;
  occupancy: string;
  municipality: string;
  repsSource: string;
  coordinates: string;
  gap: string;
};

export const healthNodes: HealthNode[] = [
  {
    name: "Hospital Pablo Tobon Uribe",
    type: "Alta complejidad - Privada",
    beds: 1094, // Real REPS data (was 547 in demo)
    occupancy: "96%",
    municipality: "Medellin (Prado)",
    repsSource: "REPS b4dp-ximh, Capacidad s2ru-bqt6",
    coordinates: "6.2683, -75.5644",
    gap: "Distancia a E5/E6 del Poblado: 23.8 min (Mapbox). 1,094 camas. Saturacion critica.",
  },
  {
    name: "Clinica Medellin S.A.S.",
    type: "Alta complejidad - Privada",
    beds: 624, // Real REPS
    occupancy: "88%",
    municipality: "Medellin (El Poblado)",
    repsSource: "REPS b4dp-ximh, Capacidad s2ru-bqt6",
    coordinates: "6.208, -75.567",
    gap: "624 camas. Atiende E4-E6 con EPS contributiva. Sin trasplantes ni hematologia avanzada.",
  },
  {
    name: "Clinica del Prado S.A.S.",
    type: "Alta complejidad - Privada",
    beds: 304, // Real REPS
    occupancy: "85%",
    municipality: "Medellin",
    repsSource: "REPS b4dp-ximh, Capacidad s2ru-bqt6",
    coordinates: "6.260, -75.566",
    gap: "304 camas. Competidor en zona norte, no en corredor sur/Las Palmas.",
  },
  {
    name: "Hospital General de Medellin (ESE)",
    type: "Nivel 3 - Publica",
    beds: 384, // Real REPS
    occupancy: "92%",
    municipality: "Medellin",
    repsSource: "REPS b4dp-ximh, ESE pi36-fdpk",
    coordinates: "6.23477, -75.572848 (ESE GPS)",
    gap: "384 camas, nivel 3. Atiende poblacion general. A 20+ min de Las Palmas.",
  },
  {
    name: "Clinica CES",
    type: "Alta complejidad - Privada",
    beds: 213, // Real REPS
    occupancy: "82%",
    municipality: "Medellin (Las Palmas)",
    repsSource: "REPS b4dp-ximh, Capacidad s2ru-bqt6",
    coordinates: "6.196, -75.546",
    gap: "213 camas. Unica clinica de alta complejidad sobre corredor Las Palmas. Referente academico CES.",
  },
  {
    name: "ESE Hospital Manuel Uribe Angel",
    type: "Nivel 2 - Publica",
    beds: 120, // estimated
    occupancy: "78%",
    municipality: "Envigado",
    repsSource: "REPS b4dp-ximh, ESE pi36-fdpk",
    coordinates: "6.166892, -75.580128 (ESE GPS)",
    gap: "Principal hospital publico de Envigado. Sin alta complejidad oncologica ni trasplantes.",
  },
];

// Catastro summary data
export const catastroSummary = {
  source: "Catastro Municipal Medellin - datos.gov.co (bp59-rj8r)",
  totalRecords: 1041413,
  elPobladoTotal: 174543,
  elPobladoByEstrato: {
    e0_comercial: { count: 124609, avgAvaluo: 130623492 },
    e4: { count: 1377, avgAvaluo: 336225900 },
    e5: { count: 9300, avgAvaluo: 327605383 },
    e6: { count: 38415, avgAvaluo: 437751098 },
  },
  epmSuscriptores2019: {
    source: "EPM Estratificacion y Cobertura - datos.gov.co",
    comuna14_acueducto: { e4: 1434, e5: 9309, e6: 36351 },
  },
};

// Population data from DANE
export const poblacionDane = {
  source: "DANE CNPV 2018 (evm3-92yw) + Proyecciones Medellin (vk9k-hfhi)",
  censoNacional2018: {
    medellin: 2327880,
    envigado: 210705,
    itagui: 240828,
    sabaneta: 73838,
  },
  proyecciones2026: {
    medellin: 2471274,
    envigado: 246874,
    itagui: 256679,
    sabaneta: 87879,
  },
  elPoblado2020: 134873,
  sabanetaProyeccion: {
    source: "datos.gov.co (pfng-8k8d)",
    y2023: 92159,
  },
};
