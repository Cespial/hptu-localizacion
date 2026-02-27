export type GradientPoint = {
  id: string;
  label: string;
  elevation: string;
  distanceFromPoblado: string;
  driveTimePeak: string;
  driveTimeOffPeak: string;
  populationE56_20min: number;
  prepagadaEstimate: number;
  competitorDensity: string;
  avgM2Price: number;
  vehiclesPerDay: number;
  potStatus: string;
  demandScore: number; // 0-100
  accessScore: number; // 0-100
};

// Demand gradient along Las Palmas corridor (south to north / low to high)
export const demandGradient: GradientPoint[] = [
  {
    id: "mirador",
    label: "Mirador del Poblado",
    elevation: "1,650 msnm",
    distanceFromPoblado: "0 km (base)",
    driveTimePeak: "5-8 min",
    driveTimeOffPeak: "3-5 min",
    populationE56_20min: 142000,
    prepagadaEstimate: 42600,
    competitorDensity: "Alta (5 clinicas en 2 km)",
    avgM2Price: 12500000,
    vehiclesPerDay: 48000,
    potStatus: "Urbano consolidado - Sin lotes disponibles",
    demandScore: 98,
    accessScore: 97,
  },
  {
    id: "indiana",
    label: "Indiana - Inicio Las Palmas",
    elevation: "1,720 msnm",
    distanceFromPoblado: "2.1 km",
    driveTimePeak: "10-15 min",
    driveTimeOffPeak: "5-8 min",
    populationE56_20min: 128500,
    prepagadaEstimate: 38550,
    competitorDensity: "Media (3 clinicas en 3 km)",
    avgM2Price: 8500000,
    vehiclesPerDay: 42000,
    potStatus: "Compatible - Uso dotacional permitido",
    demandScore: 94,
    accessScore: 91,
  },
  {
    id: "eia",
    label: "EIA - Club El Rodeo",
    elevation: "1,790 msnm",
    distanceFromPoblado: "3.8 km",
    driveTimePeak: "12-18 min",
    driveTimeOffPeak: "7-10 min",
    populationE56_20min: 110200,
    prepagadaEstimate: 33060,
    competitorDensity: "Media-Baja (2 clinicas en 4 km)",
    avgM2Price: 7200000,
    vehiclesPerDay: 38000,
    potStatus: "Compatible con condiciones",
    demandScore: 88,
    accessScore: 85,
  },
  {
    id: "cedro-verde",
    label: "Cedro Verde",
    elevation: "1,880 msnm",
    distanceFromPoblado: "5.5 km",
    driveTimePeak: "18-25 min",
    driveTimeOffPeak: "10-14 min",
    populationE56_20min: 82300,
    prepagadaEstimate: 24690,
    competitorDensity: "Baja (1 clinica en 5 km)",
    avgM2Price: 6200000,
    vehiclesPerDay: 28000,
    potStatus: "Compatible - Requiere concepto ambiental",
    demandScore: 76,
    accessScore: 72,
  },
  {
    id: "transversal",
    label: "Transversal Las Palmas",
    elevation: "2,020 msnm",
    distanceFromPoblado: "7.2 km",
    driveTimePeak: "25-35 min",
    driveTimeOffPeak: "14-18 min",
    populationE56_20min: 52100,
    prepagadaEstimate: 15630,
    competitorDensity: "Muy Baja (0 en 5 km)",
    avgM2Price: 5100000,
    vehiclesPerDay: 18000,
    potStatus: "Suelo suburbano - Restricciones",
    demandScore: 58,
    accessScore: 55,
  },
  {
    id: "alto-palmas",
    label: "Alto de Las Palmas",
    elevation: "2,200 msnm",
    distanceFromPoblado: "10.5 km",
    driveTimePeak: "35-50 min",
    driveTimeOffPeak: "18-25 min",
    populationE56_20min: 35800,
    prepagadaEstimate: 10740,
    competitorDensity: "Nula (0 en 8 km)",
    avgM2Price: 4800000,
    vehiclesPerDay: 12000,
    potStatus: "Rural - Equipamiento con restricciones",
    demandScore: 42,
    accessScore: 38,
  },
];

// Traffic flow data for Phase 2
export type TrafficFlow = {
  corridor: string;
  direction: string;
  amPeak: number; // vehicles/hour
  pmPeak: number;
  avgSpeed_amPeak: string;
  avgSpeed_offPeak: string;
  bottleneck: string;
};

export const trafficFlows: TrafficFlow[] = [
  {
    corridor: "Via Las Palmas (subida)",
    direction: "Sur → Norte (ascenso)",
    amPeak: 3200,
    pmPeak: 1800,
    avgSpeed_amPeak: "25 km/h",
    avgSpeed_offPeak: "45 km/h",
    bottleneck: "Glorieta Indiana - congestion 7:00-8:30 AM",
  },
  {
    corridor: "Via Las Palmas (bajada)",
    direction: "Norte → Sur (descenso)",
    amPeak: 1600,
    pmPeak: 3800,
    avgSpeed_amPeak: "40 km/h",
    avgSpeed_offPeak: "50 km/h",
    bottleneck: "Convergencia con Transversal Inferior - 5:00-7:00 PM",
  },
  {
    corridor: "Transversal Inferior",
    direction: "Este ↔ Oeste",
    amPeak: 4200,
    pmPeak: 4500,
    avgSpeed_amPeak: "18 km/h",
    avgSpeed_offPeak: "35 km/h",
    bottleneck: "Cruce con Av. El Poblado - semaforizacion deficiente",
  },
  {
    corridor: "Av. El Poblado",
    direction: "Norte ↔ Sur",
    amPeak: 3800,
    pmPeak: 4100,
    avgSpeed_amPeak: "15 km/h",
    avgSpeed_offPeak: "30 km/h",
    bottleneck: "Sector Oviedo a San Fernando - alto volumen peatonal",
  },
  {
    corridor: "Autopista Sur",
    direction: "Norte ↔ Sur (Envigado-Itagui)",
    amPeak: 5200,
    pmPeak: 5800,
    avgSpeed_amPeak: "22 km/h",
    avgSpeed_offPeak: "55 km/h",
    bottleneck: "Intercambio Envigado - colapso en hora pico PM",
  },
];

// Health facilities catchment analysis for Phase 2
export type HealthNode = {
  name: string;
  type: string;
  beds: number;
  occupancy: string;
  catchmentRadius: string;
  mainMarket: string;
  gap: string;
};

export const healthNodes: HealthNode[] = [
  {
    name: "Clinica Las Vegas",
    type: "Alta complejidad",
    beds: 280,
    occupancy: "92%",
    catchmentRadius: "8 km",
    mainMarket: "E4-E6, prepagada y particular",
    gap: "Lista de espera en cirugia cardiovascular: 3-4 semanas",
  },
  {
    name: "Clinica El Rosario Tesoro",
    type: "Alta complejidad",
    beds: 150,
    occupancy: "88%",
    catchmentRadius: "5 km",
    mainMarket: "E5-E6, prepagada",
    gap: "Sin servicio de trasplantes ni hematologia avanzada",
  },
  {
    name: "Clinica Medellin Poblado",
    type: "Mediana complejidad",
    beds: 120,
    occupancy: "85%",
    catchmentRadius: "4 km",
    mainMarket: "E4-E5, EPS contributiva",
    gap: "No atiende alta complejidad oncologica",
  },
  {
    name: "HPTU Actual (Prado)",
    type: "Alta complejidad",
    beds: 550,
    occupancy: "96%",
    catchmentRadius: "Ciudad completa",
    mainMarket: "Todos los estratos, referencia nacional",
    gap: "Distancia a E5/E6 del sur: 25-40 min. Saturacion de capacidad.",
  },
  {
    name: "Clinica del Country",
    type: "Mediana complejidad",
    beds: 80,
    occupancy: "78%",
    catchmentRadius: "3 km",
    mainMarket: "E5-E6, particular y prepagada",
    gap: "Capacidad limitada, sin urgencias 24h complejas",
  },
];
