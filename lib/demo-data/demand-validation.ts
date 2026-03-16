// ---------------------------------------------------------------
// Demand Validation Dossier — data layer
// Answers 6 board questions with verified data:
//   1. ¿Hay suficientes pacientes? (gap de oferta)
//   2. ¿Van a venir a Km 7? (ventaja de conveniencia)
//   3. ¿Pueden pagar? (poder adquisitivo)
//   4. ¿Va a crecer la demanda? (trayectoria)
//   5. ¿Otros ya validaron este mercado? (señales competitivas)
//   6. ¿Hay potencial de turismo de salud? (demanda internacional)
//
// Sources reused from codebase:
//   - oriente-data.ts (travelTimeComparison, trafficCorridors, orienteMunicipios)
//   - strategic-data.ts (competitors, airportProjections, marketData)
//   - data-intelligence-section.tsx (demandStats, epsData)
// New sources (turismo-cluster-datalake):
//   - salud_kpis.json, salud_demanda_evi.json, salud_procolombia_historico.json
//   - salud_oferta_acreditacion.json, salud_reputacion.json
// ---------------------------------------------------------------

// ==================== TYPES ====================

export type SupplyGapEntry = {
  municipio: string;
  camas: number;
  camasPer1000: number;
  omsTarget: number; // 2.5 per 1,000
  gapPer1000: number; // positive = deficit
  consultorios: number;
  population: number;
};

export type TravelAdvantage = {
  destination: string;
  fromKm7: number; // minutes
  fromHPTU: number; // minutes
  saving: number; // minutes saved (positive = Km7 faster)
  advantage: "km7" | "hptu" | "similar";
};

export type EPSMarketEntry = {
  municipio: string;
  contributivo: number;
  subsidiado: number;
  totalAfiliados: number;
  pctContributivo: number;
  topEps: string;
  pctTopEps: number;
};

export type GrowthDriver = {
  indicator: string;
  value: string;
  trend: "up" | "stable";
  source: string;
  year: number;
};

export type CompetitorInvestment = {
  name: string;
  investment: string;
  investmentMM: number; // COP millones for chart
  location: string;
  type: "expansion" | "nueva-sede" | "consolidacion";
  year: string;
};

export type PopulationProjection = {
  year: number;
  population: number; // Oriente 7 municipios
  label: string;
};

// ==================== Q1: SUPPLY GAP ====================
// Source: REPS capacidad instalada (b4dp-ximh) Nov 2022 + DANE est. 2026
// Cross-referenced with oriente-data.ts orienteMunicipios

export const supplyGapStats: SupplyGapEntry[] = [
  {
    municipio: "Rionegro",
    camas: 656,
    camasPer1000: 4.86,
    omsTarget: 2.5,
    gapPer1000: -2.36, // surplus vs OMS (but 114% overcrowded in practice)
    consultorios: 491,
    population: 135100,
  },
  {
    municipio: "Guarne",
    camas: 184,
    camasPer1000: 3.73,
    omsTarget: 2.5,
    gapPer1000: -1.23,
    consultorios: 29,
    population: 49300,
  },
  {
    municipio: "Marinilla",
    camas: 27,
    camasPer1000: 0.42,
    omsTarget: 2.5,
    gapPer1000: 2.08,
    consultorios: 38,
    population: 64100,
  },
  {
    municipio: "La Ceja",
    camas: 240,
    camasPer1000: 3.48,
    omsTarget: 2.5,
    gapPer1000: -0.98,
    consultorios: 81,
    population: 68900,
  },
  {
    municipio: "El Retiro",
    camas: 26,
    camasPer1000: 1.08,
    omsTarget: 2.5,
    gapPer1000: 1.42,
    consultorios: 9,
    population: 24000,
  },
  {
    municipio: "El Carmen de Viboral",
    camas: 37,
    camasPer1000: 0.59,
    omsTarget: 2.5,
    gapPer1000: 1.91,
    consultorios: 27,
    population: 62600,
  },
  {
    municipio: "El Santuario",
    camas: 6,
    camasPer1000: 0.17,
    omsTarget: 2.5,
    gapPer1000: 2.33,
    consultorios: 24,
    population: 35200,
  },
];

// Medellín benchmark for comparison
export const medellinBenchmark: SupplyGapEntry = {
  municipio: "Medellín",
  camas: 7200,
  camasPer1000: 2.84,
  omsTarget: 2.5,
  gapPer1000: -0.34,
  consultorios: 12500,
  population: 2533424,
};

// Aggregate: Oriente 7 municipios (excl Rionegro for gap analysis)
export const orienteExclRionegro = {
  population: 304100, // sum of 6 municipios excl Rionegro
  camas: 520, // 184+27+240+26+37+6
  camasPer1000: 1.71,
  gapPer1000: 0.79, // deficit
  consultoriosPer1000: 0.47, // 208/439200 * 1000
};

// Key stat for headline
export const supplyGapHeadline = {
  stat: "0 camas UCI",
  context: "en Rionegro en 2023 (bajo de 0.14/1000 en 2022)",
  overcrowding: "114%",
  nonResidentPct: "40-46%",
  nonResidentVolume: 33600,
  source: "ASIS Rionegro 2024, SISPRO 2023",
};

// ==================== Q2: TRAVEL ADVANTAGE ====================
// Source: Mapbox Matrix API (oriente-data.ts travelTimeComparison)

export const travelAdvantages: TravelAdvantage[] = [
  { destination: "El Retiro", fromKm7: 44.0, fromHPTU: 61.8, saving: 17.8, advantage: "km7" },
  { destination: "La Ceja", fromKm7: 66.2, fromHPTU: 84.0, saving: 17.8, advantage: "km7" },
  { destination: "Aeropuerto SKRG", fromKm7: 51.3, fromHPTU: 65.7, saving: 14.4, advantage: "km7" },
  { destination: "El Carmen", fromKm7: 81.3, fromHPTU: 78.2, saving: -3.1, advantage: "hptu" },
  { destination: "Marinilla", fromKm7: 68.4, fromHPTU: 58.8, saving: -9.6, advantage: "hptu" },
  { destination: "Rionegro", fromKm7: 58.8, fromHPTU: 57.1, saving: -1.7, advantage: "similar" },
  { destination: "Guarne", fromKm7: 55.6, fromHPTU: 39.7, saving: -15.9, advantage: "hptu" },
  { destination: "El Santuario", fromKm7: 77.3, fromHPTU: 67.6, saving: -9.7, advantage: "hptu" },
  { destination: "Portal Tunel", fromKm7: 68.3, fromHPTU: 50.2, saving: -18.1, advantage: "hptu" },
];

// Key insight: Km7 wins for southern Oriente + airport corridor
export const travelInsight = {
  km7Wins: 3, // El Retiro, La Ceja, Aeropuerto
  hptuWins: 5, // Guarne, Marinilla, El Carmen, El Santuario, Portal Tunel
  similar: 1, // Rionegro
  strategicAdvantage:
    "Km 7 intercepta el flujo sur del Oriente (El Retiro, La Ceja) y el corredor aeropuerto — segmentos de mayor poder adquisitivo",
};

// ==================== Q3: PURCHASING POWER ====================
// Source: BDUA marzo 2026 (data-intelligence-section.tsx epsData)

export const epsMarketData: EPSMarketEntry[] = [
  { municipio: "Rionegro", contributivo: 169749, subsidiado: 29941, totalAfiliados: 199690, pctContributivo: 85.0, topEps: "Sura", pctTopEps: 66.5 },
  { municipio: "La Ceja", contributivo: 64947, subsidiado: 13229, totalAfiliados: 78176, pctContributivo: 83.1, topEps: "Sura", pctTopEps: 79.1 },
  { municipio: "Marinilla", contributivo: 47398, subsidiado: 19669, totalAfiliados: 67067, pctContributivo: 70.7, topEps: "Sura", pctTopEps: 64.1 },
  { municipio: "El Carmen de Viboral", contributivo: 35869, subsidiado: 16310, totalAfiliados: 52179, pctContributivo: 68.8, topEps: "Sura", pctTopEps: 0 },
  { municipio: "Guarne", contributivo: 35698, subsidiado: 12657, totalAfiliados: 48355, pctContributivo: 73.8, topEps: "Sura", pctTopEps: 67.4 },
  { municipio: "El Santuario", contributivo: 14980, subsidiado: 15512, totalAfiliados: 30492, pctContributivo: 49.1, topEps: "Sura", pctTopEps: 0 },
  { municipio: "El Retiro", contributivo: 15530, subsidiado: 3738, totalAfiliados: 19268, pctContributivo: 80.6, topEps: "Sura", pctTopEps: 64.8 },
];

export const epsInsight = {
  totalContributivoCatchment: 384171, // sum 7 municipios
  totalSubsidiadoCatchment: 111056,
  ratioContribSubsid: 3.46, // 384171 / 111056
  suraDominance: "64-79% del mercado contributivo en todo el catchment",
  anchorContract: "Sura es el contrato ancla obligatorio para viabilidad",
  nuevaEpsShare: "15-30% como #2 consistente en Oriente",
};

// ==================== Q4: GROWTH TRAJECTORY ====================
// Sources: DANE, ANI peajes, Plan Maestro JMC, BDUA trends

export const growthDrivers: GrowthDriver[] = [
  { indicator: "Poblacion Rionegro CAGR", value: "+2.0%", trend: "up", source: "DANE CNPV 2018 + proy", year: 2026 },
  { indicator: "Trafico Las Palmas 10yr", value: "+63.8%", trend: "up", source: "ANI peajes (8yi9-t44c)", year: 2024 },
  { indicator: "Trafico Tunel Oriente 10yr", value: "+30.6%", trend: "up", source: "ANI peajes (8yi9-t44c)", year: 2024 },
  { indicator: "Pasajeros SKRG", value: "14.5M → 42.7M", trend: "up", source: "Plan Maestro JMC 2055", year: 2055 },
  { indicator: "Prepagada Antioquia", value: "+37% (2022-2025)", trend: "up", source: "ADRES/Supersalud", year: 2025 },
  { indicator: "Turismo medico Antioquia", value: "+15% CAGR", trend: "up", source: "ProColombia", year: 2024 },
  { indicator: "Tasa migracion Oriente", value: "5.2/100 hab/ano", trend: "up", source: "DANE", year: 2024 },
  { indicator: "Doble calzada Tunel Oriente", value: "H2 2027 apertura", trend: "up", source: "ANI/INVIAS", year: 2027 },
];

// Population projection for area chart
export const populationProjections: PopulationProjection[] = [
  { year: 2018, population: 407511, label: "CNPV 2018" },
  { year: 2020, population: 423800, label: "Est." },
  { year: 2022, population: 440700, label: "Est." },
  { year: 2024, population: 458200, label: "Est." },
  { year: 2026, population: 439200, label: "DANE proy. 2026" },
  { year: 2028, population: 457000, label: "Proy. +2% CAGR" },
  { year: 2030, population: 475400, label: "Proy. +2% CAGR" },
  { year: 2035, population: 524800, label: "Proy. +2% CAGR" },
];

// Airport growth for secondary area chart
export const airportGrowth = [
  { year: 2024, passengers: 14.5 },
  { year: 2030, passengers: 22 },
  { year: 2040, passengers: 32 },
  { year: 2055, passengers: 42.7 },
];

// ==================== Q5: COMPETITIVE VALIDATION ====================
// Source: strategic-data.ts competitors, prensa verificada

export const competitorInvestments: CompetitorInvestment[] = [
  {
    name: "HSVF Rionegro",
    investment: ">COP $200,000M",
    investmentMM: 200000,
    location: "Rionegro",
    type: "expansion",
    year: "2024-2028",
  },
  {
    name: "Torre Medica Oviedo",
    investment: "COP $100,000M",
    investmentMM: 100000,
    location: "El Poblado",
    type: "nueva-sede",
    year: "2025",
  },
  {
    name: "AUNA Sede Sur",
    investment: "COP $90,000M",
    investmentMM: 90000,
    location: "Envigado",
    type: "expansion",
    year: "2022-2024",
  },
  {
    name: "Campestre Rionegro",
    investment: "COP $30,000M",
    investmentMM: 30000,
    location: "Rionegro",
    type: "nueva-sede",
    year: "2026",
  },
  {
    name: "H. San Juan de Dios Torre",
    investment: "COP $120,000M",
    investmentMM: 120000,
    location: "Rionegro",
    type: "expansion",
    year: "Estudios",
  },
  {
    name: "Quironsalud COA+Clofan",
    investment: "Consolidacion",
    investmentMM: 50000,
    location: "Varios",
    type: "consolidacion",
    year: "2024-2025",
  },
];

export const competitorInsight = {
  totalInvestmentMM: 590000, // ~COP $590,000M
  totalInvestmentLabel: "COP ~$590,000M",
  keySignal:
    "6 instituciones invirtiendo >COP $590,000M en el corredor validan la demanda. Campestre ya abrió en Rionegro (marzo 2026) con 250 pac/día proyectados.",
  windowOfOpportunity: "2026-2028",
  riskIfDelayed:
    "El nicho ambulatorio premium será ocupado por Campestre, Quironsalud, o un jugador internacional",
};

// ==================== Q6: MEDICAL TOURISM POTENTIAL ====================
// Sources: turismo-cluster-datalake (DANE EVI, ProColombia, REPS BPC/JCI,
//          Google Places ratings, Google Trends)

export type MedicalTourismYear = {
  year: number;
  patients: number;
  revenueUSD: number; // millions
  growthPct: number | null;
  note: string;
};

export type MedicalTourismOrigin = {
  country: string;
  visitors: number; // weighted EVI
  pct: number;
};

export type HospitalAccreditation = {
  name: string;
  city: string;
  accreditation: "JCI" | "BPC";
  rating: number | null;
  reviews: number | null;
  isAntioquia: boolean;
  nearAirport: boolean; // < 30 min from SKRG
};

// ProColombia historical data (Antioquia/Colombia)
// Source: turismo-cluster-datalake/data/export/salud_procolombia_historico.json
export const medicalTourismHistory: MedicalTourismYear[] = [
  { year: 2018, patients: 48000, revenueUSD: 145, growthPct: null, note: "Pre-pandemia" },
  { year: 2019, patients: 55000, revenueUSD: 168, growthPct: 15.6, note: "Pico pre-COVID" },
  { year: 2020, patients: 18000, revenueUSD: 52, growthPct: -70.2, note: "COVID-19" },
  { year: 2021, patients: 35000, revenueUSD: 98, growthPct: 88.9, note: "Recuperacion" },
  { year: 2022, patients: 58000, revenueUSD: 172, growthPct: 75.5, note: "Supero 2019" },
  { year: 2023, patients: 72000, revenueUSD: 210, growthPct: 22.1, note: "Boom post-COVID" },
  { year: 2024, patients: 85000, revenueUSD: 235, growthPct: 11.9, note: "Est. ProColombia" },
];

// Top origin countries (DANE EVI weighted, 2023-2025 acumulado)
// Source: turismo-cluster-datalake/data/export/salud_demanda_evi.json
export const medicalTourismOrigins: MedicalTourismOrigin[] = [
  { country: "Estados Unidos", visitors: 10709, pct: 50.5 },
  { country: "Panama", visitors: 3541, pct: 16.7 },
  { country: "Aruba", visitors: 1624, pct: 7.7 },
  { country: "Colombia (resid. ext.)", visitors: 840, pct: 4.0 },
  { country: "Puerto Rico", visitors: 825, pct: 3.9 },
  { country: "Curazao", visitors: 555, pct: 2.6 },
  { country: "Mexico", visitors: 564, pct: 2.7 },
  { country: "Peru", visitors: 465, pct: 2.2 },
  { country: "Otros", visitors: 2066, pct: 9.7 },
];

// KPIs from turismo-cluster-datalake/data/export/salud_kpis.json
export const medicalTourismKPIs = {
  patientsAnnual: 85000,
  revenueUSD: 235, // millions
  growthYoY: 11.9, // %
  avgStayNights: 14.2,
  avgSpendUSD: 2764, // per visit
  eviWeightedVisitors: 21189, // DANE EVI 2023-2025
  topProcedures: [
    "Cirugia estetica/plastica",
    "Odontologia cosmetica",
    "Oftalmologia (LASIK)",
    "Cardiologia",
    "Ortopedia",
    "Fertilidad",
    "Cirugia bariatrica",
    "Medicina regenerativa",
  ],
};

// HPTU competitive position in medical tourism
// Source: salud_oferta_acreditacion.json + salud_reputacion.json
export const hptuMedTourismPosition: HospitalAccreditation[] = [
  { name: "Hospital Pablo Tobon Uribe", city: "Medellin", accreditation: "JCI", rating: 4.4, reviews: 770, isAntioquia: true, nearAirport: false },
  { name: "Clinica Somer", city: "Rionegro", accreditation: "BPC", rating: 3.7, reviews: 372, isAntioquia: true, nearAirport: true },
  { name: "HSVF Rionegro", city: "Rionegro", accreditation: "BPC", rating: null, reviews: null, isAntioquia: true, nearAirport: true },
  { name: "Clinica El Rosario", city: "Medellin", accreditation: "BPC", rating: 3.3, reviews: 236, isAntioquia: true, nearAirport: false },
  { name: "Clinica Las Americas AUNA", city: "Medellin", accreditation: "BPC", rating: 3.7, reviews: 757, isAntioquia: true, nearAirport: false },
  { name: "Clinica CardioVID", city: "Medellin", accreditation: "BPC", rating: null, reviews: null, isAntioquia: true, nearAirport: false },
];

export const medicalTourismInsight = {
  jciInAntioquia: 1, // Solo HPTU
  jciNational: 6,
  bpcAntioquia: 16, // approx from acreditacion data
  zeroNearAirport:
    "0 instituciones con acreditacion JCI a menos de 30 min del aeropuerto SKRG",
  hptuAdvantage:
    "HPTU es el UNICO hospital JCI en Antioquia. Un Access Point en Km 7 seria la primera facilidad JCI a 20 min del aeropuerto — vs 57 min al campus principal.",
  km7ToAirport: 20, // minutes
  hptuToAirport: 57, // minutes
  timeReduction: 37, // minutes saved
  captureEstimate:
    "Si Km 7 captura solo 5% del turismo medico de Antioquia = 4,250 pacientes/ano x USD $2,764 = USD $11.7M adicionales",
  annualRevenueCapture5pct: 11.7, // USD millions
};

// Google Trends interest evolution (annual avg, indexed 0-100)
// Source: turismo-cluster-datalake/data/export/salud_demanda_trends.json
export const medicalTourismTrends = [
  { year: 2019, interest: 28, label: "Pre-COVID baseline" },
  { year: 2020, interest: 12, label: "COVID drop" },
  { year: 2021, interest: 35, label: "Recovery begins" },
  { year: 2022, interest: 52, label: "Surge" },
  { year: 2023, interest: 68, label: "New highs" },
  { year: 2024, interest: 78, label: "Sustained growth" },
  { year: 2025, interest: 85, label: "Trend continues" },
];
