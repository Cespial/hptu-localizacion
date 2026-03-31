/**
 * Modelo Financiero Preliminar — Hospital de Alta Complejidad + Centro Ambulatorio
 * NOTA: Parámetros marcados con ⚠️ requieren validación con datos reales
 *
 * Fuentes:
 * - Costos construcción: Scielo/Univ. Militar Nueva Granada, DNP Proyectos Tipo
 * - Benchmarks hospitalarios: HUSI Estados Financieros 2024, DANE, MinSalud
 * - Precios suelo: Fincaraíz, Metrocuadrado, Espacio Urbano (Mar 2026)
 * - POT: Acuerdo 48 de 2014, Batería Indicadores POT Medellín
 * - Población: DANE CNPV 2018, Proyecciones 2025-2037
 *
 * ────────────────────────────────────────────────────────────────────
 * AMBULATORY MODEL (added Mar 2026, revised Mar 2026):
 * The project pivoted from a 250-300 bed hospital to an ambulatory center
 * at Access Point (Km 7 Las Palmas). Key differences:
 *   - No land purchase — lease space in Access Point towers (4 torres, 10 pisos, 1,085 parking)
 *   - Fit-out only (~$3.5M COP/m²) instead of full construction (~$4.0M COP/m²)
 *   - ~6,000 m² (1.5 floors of one tower) vs 12,000-18,000 m² hospital
 *   - Equipment CAPEX Phase 1: ~$31.000M COP (MRI 3T, CT, 4 surgical suites, etc.)
 *   - PET-CT ($14.000M) moved to Phase 2 — requires FDG logistics, few cyclotrons in Colombia
 *   - Revenue model: 6 service lines, ~$51.000M COP/year at maturity (Phase 1)
 *   - EBITDA margin: 18-22% (vs 5-12% hospital) — ambulatory has much higher margins
 *   - Ramp-up: 40% → 65% → 85% → 100% over 4 years
 *   - Payback: ~7 years base case (vs 10-20+ years hospital)
 *   - Time-to-operation: 18-24 months fit-out (vs 36+ months construction)
 *     (medical fit-out with surgical suites, MRI RF shielding, reinforced floors,
 *      regulatory approvals — habilitación REPS, INVIMA)
 *   - Opening target: H1 2028
 *   - 3 scenarios: pessimistic (70% rev, 15% EBITDA), base (100%, 18%), optimistic (115% + Phase 2 PET-CT, 22%)
 * ────────────────────────────────────────────────────────────────────
 */

export type FinancialParameter = {
  label: string;
  value: number;
  unit: string;
  source: string;
  validated: boolean; // true = dato confirmado, false = supuesto por validar
  notes?: string;
};

export type ZoneFinancials = {
  zoneId: string;
  zoneName: string;
  landCostM2: FinancialParameter;
  lotSizeM2: number;
  constructionCostM2: FinancialParameter;
  builtAreaM2: number;
  floors: number;
  beds: number;
  equipmentPct: FinancialParameter;
  totalInvestment: number; // calculated
  annualRevenue: number; // calculated
  annualOpex: number; // calculated
  occupancyTarget: FinancialParameter;
  revenuePerBed: FinancialParameter;
  ebitdaMargin: FinancialParameter;
  paybackYears: number; // calculated
  npv10y: number; // calculated (discount rate 12%)
};

// ── Ambulatory center type definitions ──
// Ambulatory model does NOT use beds or land purchase — it uses lease + service lines

export type AmbulatoryRevenueStream = {
  id: string;
  name: string;
  annualRevenueMM: number; // COP miles de millones at maturity
  description: string;
  keyMetric: string; // e.g. "~2,400 procedures/year"
};

export type AmbulatoryEquipment = {
  id: string;
  name: string;
  costMM: number; // COP miles de millones
  notes: string;
};

export type AmbulatoryFinancials = {
  // Identity
  modelType: "ambulatory";
  siteName: string;
  siteDescription: string;

  // Space & Lease (no land purchase)
  totalAreaM2: number;
  floorsUsed: number;
  leaseCostM2Month: FinancialParameter; // COP/m²/month
  annualLeaseCost: number; // calculated: area × lease × 12
  fitoutCostM2: FinancialParameter; // COP/m² for medical-grade interior
  totalFitoutCost: number; // calculated: area × fitout

  // Equipment CAPEX
  equipment: AmbulatoryEquipment[];
  totalEquipmentCost: number; // sum of equipment

  // Total investment
  totalCapex: number; // fitout + equipment

  // Revenue
  revenueStreams: AmbulatoryRevenueStream[];
  totalAnnualRevenueMature: number; // sum of all streams at maturity (COP)
  rampUp: { year: number; pct: number }[]; // ramp-up schedule

  // Margins & Returns
  ebitdaMargin: FinancialParameter; // 18-22%
  annualEbitdaMature: number; // calculated
  annualOpexMature: number; // calculated (includes lease)
  paybackYears: number; // calculated
  npv10y: number; // calculated

  // Timeline advantage
  fitoutMonths: FinancialParameter; // 18-24 months vs 36+ hospital
  timeToFirstRevenue: number; // months

  // Access Point specifics
  accessPointAdvantage: string[];
};

// ── Parámetros generales (aplican a todas las zonas) ──
export const generalParams: Record<string, FinancialParameter> = {
  constructionCostM2: {
    label: "Costo construcción/m² (alta complejidad)",
    value: 4_000_000,
    unit: "COP/m²",
    source: "Scielo - Univ. Militar Nueva Granada (2017), ajustado IPC 2026",
    validated: true,
    notes: "Rango confirmado: $3.0M-$4.0M/m². Usamos extremo superior por alta complejidad + trasplantes.",
  },
  equipmentPct: {
    label: "Dotación y equipamiento (% inversión civil)",
    value: 25,
    unit: "%",
    source: "DNP Proyectos Tipo Salud, benchmark H. Soacha",
    validated: true,
    notes: "Rango 20-30%. Usamos 25% como punto medio. Incluye equipos biomédicos, mobiliario, IT.",
  },
  occupancyTarget: {
    label: "Tasa de ocupación objetivo",
    value: 80,
    unit: "%",
    source: "Estándar sectorial Colombia, SaluData Bogotá",
    validated: true,
    notes: "Meta operativa para 7-8 meses del año. UCI puede alcanzar 85-90%.",
  },
  revenuePerBed: {
    label: "Ingreso por cama/año",
    value: 1_600_000_000,
    unit: "COP/cama/año",
    source: "HUSI Estados Financieros 2024 ($597,216M / ~370 camas)",
    validated: false,
    notes: "⚠️ Estimado a partir de HUSI (hospital universitario sin ánimo de lucro). Hospitales privados de alta complejidad podrían generar $1,800M-$2,200M/cama/año. Validar con datos ClPablo Tobón o Cl. Las Américas.",
  },
  ebitdaMargin: {
    label: "Margen EBITDA operativo",
    value: 8,
    unit: "%",
    source: "Estimación sectorial — fondos de capital privado en hospitales Colombia",
    validated: false,
    notes: "⚠️ HUSI reporta ~2.3% (sin ánimo de lucro). Privados bien gestionados: 5-12%. Usamos 8% como base conservadora. Validar con benchmark de Christus Sinergia o Grupo Keralty.",
  },
  discountRate: {
    label: "Tasa de descuento (WACC estimado)",
    value: 12,
    unit: "%",
    source: "Estimación — sector salud Colombia, riesgo país + prima sector",
    validated: false,
    notes: "⚠️ Tasa libre de riesgo ~10% (TES 10Y) + prima sectorial 2-4%. Validar con análisis WACC específico.",
  },
  constructionMonths: {
    label: "Tiempo de construcción",
    value: 36,
    unit: "meses",
    source: "Benchmark hospitales colombianos (H. Bosa: 30 meses, H. Soacha: 36 meses)",
    validated: true,
  },
  designMonths: {
    label: "Diseño y licenciamiento",
    value: 18,
    unit: "meses",
    source: "Curadurías Medellín, benchmark H. Fontibón",
    validated: false,
    notes: "⚠️ Puede variar según complejidad del trámite POT y EIA. Rango: 12-24 meses.",
  },
};

// ── Modelo por zona candidata ──
export const zoneFinancials: ZoneFinancials[] = [
  {
    zoneId: "palmas-bajo",
    zoneName: "Las Palmas Bajo",
    landCostM2: {
      label: "Precio suelo/m²",
      value: 1_500_000,
      unit: "COP/m²",
      source: "Metrocuadrado/Fincaraíz — lotes Las Palmas transición urbano-rural",
      validated: false,
      notes: "⚠️ Rango: $800K (rural Las Palmas) a $3.0M (urbano El Tesoro). Usar $1.5M como zona de transición. Validar con Lonja de Propiedad Raíz de Medellín.",
    },
    lotSizeM2: 10_000,
    constructionCostM2: generalParams.constructionCostM2,
    builtAreaM2: 15_000, // IO 0.6 × 10,000 × ~2.5 efectivo
    floors: 8,
    beds: 250,
    equipmentPct: generalParams.equipmentPct,
    totalInvestment: 0, // calculated below
    annualRevenue: 0,
    annualOpex: 0,
    occupancyTarget: generalParams.occupancyTarget,
    revenuePerBed: generalParams.revenuePerBed,
    ebitdaMargin: generalParams.ebitdaMargin,
    paybackYears: 0,
    npv10y: 0,
  },
  {
    zoneId: "palmas-medio",
    zoneName: "Las Palmas Medio",
    landCostM2: {
      label: "Precio suelo/m²",
      value: 1_200_000,
      unit: "COP/m²",
      source: "Fincaraíz — lotes sector EIA/Los Balsos alto",
      validated: false,
      notes: "⚠️ Zona con menor densificación. Lotes ~$410K-$650K en parcelas rurales, pero lotes urbanos en Los Balsos hasta $5.5M. Promedio estimado para lote institucional.",
    },
    lotSizeM2: 12_000,
    constructionCostM2: generalParams.constructionCostM2,
    builtAreaM2: 18_000,
    floors: 10,
    beds: 300,
    equipmentPct: generalParams.equipmentPct,
    totalInvestment: 0,
    annualRevenue: 0,
    annualOpex: 0,
    occupancyTarget: generalParams.occupancyTarget,
    revenuePerBed: generalParams.revenuePerBed,
    ebitdaMargin: generalParams.ebitdaMargin,
    paybackYears: 0,
    npv10y: 0,
  },
  {
    zoneId: "palmas-alto",
    zoneName: "Las Palmas Alto",
    landCostM2: {
      label: "Precio suelo/m²",
      value: 500_000,
      unit: "COP/m²",
      source: "Fincaraíz — lotes Alto de Las Palmas / Santa Elena",
      validated: false,
      notes: "⚠️ Suelo rural corregimiento. Parcelas grandes a menor costo pero con restricciones POT.",
    },
    lotSizeM2: 15_000,
    constructionCostM2: generalParams.constructionCostM2,
    builtAreaM2: 12_000,
    floors: 4,
    beds: 150,
    equipmentPct: generalParams.equipmentPct,
    totalInvestment: 0,
    annualRevenue: 0,
    annualOpex: 0,
    occupancyTarget: { ...generalParams.occupancyTarget, value: 65, notes: "⚠️ Menor demanda por aislamiento. Ramp-up más lento." },
    revenuePerBed: generalParams.revenuePerBed,
    ebitdaMargin: { ...generalParams.ebitdaMargin, value: 5, notes: "⚠️ Menor volumen penaliza margen. Estimado conservador." },
    paybackYears: 0,
    npv10y: 0,
  },
  {
    zoneId: "envigado",
    zoneName: "Envigado - Zúñiga",
    landCostM2: {
      label: "Precio suelo/m²",
      value: 2_500_000,
      unit: "COP/m²",
      source: "Metrocuadrado — lotes Envigado zona norte / Zúñiga",
      validated: false,
      notes: "⚠️ Zona urbana consolidada. Mayor precio pero mejor accesibilidad. Requiere POT Envigado.",
    },
    lotSizeM2: 8_000,
    constructionCostM2: generalParams.constructionCostM2,
    builtAreaM2: 14_000,
    floors: 10,
    beds: 220,
    equipmentPct: generalParams.equipmentPct,
    totalInvestment: 0,
    annualRevenue: 0,
    annualOpex: 0,
    occupancyTarget: generalParams.occupancyTarget,
    revenuePerBed: generalParams.revenuePerBed,
    ebitdaMargin: generalParams.ebitdaMargin,
    paybackYears: 0,
    npv10y: 0,
  },
  {
    zoneId: "nuevo-poblado",
    zoneName: "Nuevo Poblado - Itagüí",
    landCostM2: {
      label: "Precio suelo/m²",
      value: 1_800_000,
      unit: "COP/m²",
      source: "Estimación — Autopista Sur / Itagüí Norte, zona en transformación",
      validated: false,
      notes: "⚠️ Zona tipo Ciudad del Río en transformación. Menor costo vs El Poblado pero en revalorización. Requiere POT Itagüí.",
    },
    lotSizeM2: 10_000,
    constructionCostM2: generalParams.constructionCostM2,
    builtAreaM2: 16_000,
    floors: 10,
    beds: 260,
    equipmentPct: generalParams.equipmentPct,
    totalInvestment: 0,
    annualRevenue: 0,
    annualOpex: 0,
    occupancyTarget: generalParams.occupancyTarget,
    revenuePerBed: generalParams.revenuePerBed,
    ebitdaMargin: generalParams.ebitdaMargin,
    paybackYears: 0,
    npv10y: 0,
  },
];

// ── Calculate financials ──
function calcZone(z: ZoneFinancials): ZoneFinancials {
  const landCost = z.landCostM2.value * z.lotSizeM2;
  const constructionCost = z.constructionCostM2.value * z.builtAreaM2;
  const equipmentCost = constructionCost * (z.equipmentPct.value / 100);
  const totalInvestment = landCost + constructionCost + equipmentCost;

  const occupancy = z.occupancyTarget.value / 100;
  const annualRevenue = z.beds * z.revenuePerBed.value * occupancy;
  const margin = z.ebitdaMargin.value / 100;
  const annualEbitda = annualRevenue * margin;
  const annualOpex = annualRevenue * (1 - margin);

  // Simple payback
  const paybackYears = totalInvestment / annualEbitda;

  // NPV over 10 years (simplified)
  const r = generalParams.discountRate.value / 100;
  let npv = -totalInvestment;
  for (let y = 1; y <= 10; y++) {
    // Ramp-up: 60% year 1, 80% year 2, 100% thereafter
    const ramp = y === 1 ? 0.6 : y === 2 ? 0.8 : 1.0;
    npv += (annualEbitda * ramp) / Math.pow(1 + r, y);
  }

  return {
    ...z,
    totalInvestment,
    annualRevenue,
    annualOpex,
    paybackYears: Math.round(paybackYears * 10) / 10,
    npv10y: Math.round(npv),
  };
}

// Calculate all zones
export const zoneFinancialsCalculated = zoneFinancials.map(calcZone);

// ── Summary metrics (hospital model) ──
export const financialSummary = {
  totalCatchmentPop2025: 800_000,
  totalCatchmentPop2030: 835_000,
  bedsPerThousand: 1.7,
  bedsDeficit: "Colombia: 1.7 camas/1000 hab vs OCDE: 4.3 — déficit de 2.6 camas/1000",
  constructionTimeline: `${generalParams.designMonths.value} meses diseño + ${generalParams.constructionMonths.value} meses construcción = ${generalParams.designMonths.value + generalParams.constructionMonths.value} meses total`,
  keyRisks: [
    "Demoras en licenciamiento urbanístico (POT Acuerdo 48 de 2014)",
    "Volatilidad en costos de construcción (inflación materiales)",
    "Retrasos en pagos EPS (cartera sector salud ~$14.000M COP)",
    "Competencia de nuevos proyectos hospitalarios en el corredor",
    "Riesgo regulatorio: cambios en POT o normativa de salud",
  ],
  parametersToValidate: [
    { param: "Precio suelo/m² por zona", priority: "ALTA", how: "Consulta Lonja de Propiedad Raíz de Medellín" },
    { param: "Ingreso por cama/año (alta complejidad privada)", priority: "ALTA", how: "Benchmark Cl. Pablo Tobón Uribe, Cl. Las Américas, o Grupo Keralty" },
    { param: "Margen EBITDA operativo", priority: "ALTA", how: "Estados financieros de hospitales comparables (Supersalud)" },
    { param: "Tasa de descuento (WACC)", priority: "MEDIA", how: "Análisis financiero específico con estructura de capital definida" },
    { param: "Tamaño de lote disponible por zona", priority: "ALTA", how: "Búsqueda activa con inmobiliarias / propietarios" },
    { param: "Costos diseño + licenciamiento", priority: "MEDIA", how: "Cotización firmas de arquitectura hospitalaria (Urdaneta Vélez, AEI)" },
    { param: "Fichas normativas POT por polígono", priority: "ALTA", how: "Consulta Departamento Administrativo de Planeación Medellín o GeoMedellín" },
    { param: "Índice de ocupación/construcción específico", priority: "MEDIA", how: "Fichas normativas POT del lote específico" },
  ],
};

// =====================================================================
// ██ AMBULATORY MODEL — Access Point at Km 7 Las Palmas
// =====================================================================
// This is the ACTIVE model after the project pivoted from hospital to
// ambulatory center. The hospital model above is kept for comparison.
//
// Key premise: lease space in Access Point towers (existing building,
// 4 towers, 10 floors each, 1,085 parking spots) — no land purchase,
// no construction from scratch, only medical-grade fit-out + equipment.
// =====================================================================

// ── Ambulatory Parameters ──
export const ambulatoryParams: Record<string, FinancialParameter> = {
  fitoutCostM2: {
    label: "Adecuación interior grado médico/m²",
    value: 3_500_000,
    unit: "COP/m²",
    source: "Benchmark adecuaciones hospitalarias Colombia — firmas de arquitectura hospitalaria",
    validated: false,
    notes: "⚠️ Rango: $2.5M-$4.5M/m² según nivel de complejidad. $3.5M para quirófanos + imágenes + consultorios. Validar con cotización de diseño específica para Access Point.",
  },
  leaseCostM2Month: {
    label: "Arriendo/m²/mes (oficina premium Medellín)",
    value: 45_000,
    unit: "COP/m²/mes",
    source: "Colliers, JLL — oficinas A+ El Poblado / Las Palmas 2026",
    validated: false,
    notes: "⚠️ Rango: $35K-$55K/m²/mes para A+ en El Poblado. Access Point en Km 7 podría negociar tarifa preferencial por volumen (1.5 pisos). Validar con administración del edificio.",
  },
  ebitdaMarginAmbulatory: {
    label: "Margen EBITDA operativo (ambulatorio)",
    value: 20,
    unit: "%",
    source: "Benchmark centros ambulatorios privados — ANDI Salud, Grupo Keralty, Christus Sinergia",
    validated: false,
    notes: "⚠️ Ambulatorio privado bien gestionado: 18-25% (vs 5-12% hospital con camas). Mayor margen por: sin UCI, sin urgencias 24h, menor nómina, alta rotación. Rango conservador 18-22%.",
  },
  fitoutMonths: {
    label: "Tiempo de adecuación (fit-out)",
    value: 21,
    unit: "meses",
    source: "Benchmark adecuaciones médicas de alta complejidad en edificios existentes — Colombia",
    validated: false,
    notes: "⚠️ Rango: 18-24 meses. Incluye diseño interior, obra civil, refuerzo estructural para MRI (15 ton), blindaje RF, instalación equipos, habilitación REPS, permisos INVIMA. Edificio ya existe — no hay obra gruesa, pero adecuación grado quirúrgico + imágenes pesadas toma más que un fit-out estándar. Ventaja vs 36+ meses de construcción hospitalaria.",
  },
  discountRate: generalParams.discountRate,
};

// ── Equipment detail (Phase 1) ──
// NOTE: PET-CT ($14.000M) moved to Phase 2 — requires FDG (fluorodeoxyglucose) logistics.
// Very few cyclotrons in Colombia. Viable as Phase 2 when oncology volume justifies investment.
const ambulatoryEquipment: AmbulatoryEquipment[] = [
  {
    id: "mri-3t",
    name: "Resonancia Magnética 3 Tesla",
    costMM: 10,
    notes: "Siemens MAGNETOM Vida o GE SIGNA Premier. Referencia regional para Oriente.",
  },
  {
    id: "ct-scanner",
    name: "Tomógrafo (CT Scanner)",
    costMM: 4,
    notes: "CT de 128+ cortes. Alta demanda desde 11 municipios del Oriente sin CT propio.",
  },
  {
    id: "surgical-suites",
    name: "Quirófanos ambulatorios (×4)",
    costMM: 12, // 4 × ~$3.000M COP each
    notes: "4 salas con equipamiento completo: ortopedia, urología, ginecología, ORL. ~$3.000M COP c/u.",
  },
  {
    id: "imaging-other",
    name: "Ecografía, mamografía, Rx, otros",
    costMM: 5,
    notes: "Equipamiento complementario de imágenes: 3 ecógrafos, mamógrafo digital, Rx digital, densitómetro.",
  },
];

// ── Phase 2 Equipment (future expansion) ──
export const phase2Equipment: AmbulatoryEquipment[] = [
  {
    id: "pet-ct",
    name: "PET-CT (Fase 2)",
    costMM: 14,
    notes: "PET-CT requiere logística FDG (fluorodeoxyglucosa) — muy pocos ciclotrones en Colombia. Viable como Fase 2 cuando volumen oncológico justifique inversión. Único en corredor Las Palmas-Oriente.",
  },
];

// ── Revenue streams at maturity ──
const ambulatoryRevenueStreams: AmbulatoryRevenueStream[] = [
  {
    id: "imaging",
    name: "Imágenes Diagnósticas (Fase 1)",
    annualRevenueMM: 15,
    description: "TAC multicorte, RMN 3T, ecografía avanzada, mamografía digital. Referencia regional para el corredor Las Palmas-Oriente. PET-CT programado para Fase 2.",
    keyMetric: "~12,000 estudios/año",
  },
  {
    id: "ambulatory-surgery",
    name: "Cirugía Ambulatoria",
    annualRevenueMM: 14,
    description: "4 quirófanos: ortopedia, urología, ginecología, ORL. Procedimientos de día sin hospitalización.",
    keyMetric: "~2,400 procedimientos/año (4 ORs)",
  },
  {
    id: "specialist-consults",
    name: "Consulta Especializada",
    annualRevenueMM: 8,
    description: "30+ subespecialidades médicas y quirúrgicas. Captura flujo Oriente que hoy viaja a Medellín.",
    keyMetric: "~40,000 consultas/año",
  },
  {
    id: "executive-wellness",
    name: "Chequeo Ejecutivo / Wellness",
    annualRevenueMM: 6,
    description: "Check-up premium para ejecutivos Zona Franca, turismo médico via JMC, bienestar corporativo.",
    keyMetric: "~3,000 chequeos/año",
  },
  {
    id: "rehab-oncology",
    name: "Rehabilitación + Oncología Ambulatoria",
    annualRevenueMM: 5,
    description: "Rehabilitación física/neuro/cardíaca + quimioterapia ambulatoria + seguimiento oncológico.",
    keyMetric: "~8,000 sesiones/año",
  },
  {
    id: "aesthetics-derm",
    name: "Estética Médica / Dermatología",
    annualRevenueMM: 3,
    description: "Procedimientos estéticos no invasivos, dermatología clínica y quirúrgica. Margen premium.",
    keyMetric: "~4,000 procedimientos/año",
  },
];

// ── Calculate ambulatory financials ──
function calcAmbulatory(): AmbulatoryFinancials {
  const totalAreaM2 = 6_000;
  const floorsUsed = 1.5;
  const leaseCostM2Month = ambulatoryParams.leaseCostM2Month.value;
  const annualLeaseCost = totalAreaM2 * leaseCostM2Month * 12; // ~$3.240M COP/year

  const fitoutCostM2 = ambulatoryParams.fitoutCostM2.value;
  const totalFitoutCost = totalAreaM2 * fitoutCostM2; // ~$21.000M COP

  const totalEquipmentCost = ambulatoryEquipment.reduce((s, e) => s + e.costMM, 0) * 1_000_000_000;
  // ~$31.000M COP (Phase 1 only — PET-CT $14.000M moved to Phase 2)

  const totalCapex = totalFitoutCost + totalEquipmentCost; // ~$21.000M fitout + ~$31.000M equip = $52.000M COP Phase 1
  // NOTE: Previously $81.000M with PET-CT. Now $67.000M target; actual calc yields ~$52.000M
  // The $67.000M figure assumes $3.5M/m² fitout ($21.000M) + Phase 1 equip ($31.000M) + contingency/soft costs (~$15.000M)

  const totalAnnualRevenueMature = ambulatoryRevenueStreams.reduce(
    (s, r) => s + r.annualRevenueMM, 0
  ) * 1_000_000_000; // ~$51.000M COP (Phase 1 — without PET-CT revenue)

  const rampUp = [
    { year: 1, pct: 40 },
    { year: 2, pct: 65 },
    { year: 3, pct: 85 },
    { year: 4, pct: 100 },
  ];

  const margin = ambulatoryParams.ebitdaMarginAmbulatory.value / 100; // 20%
  const annualEbitdaMature = totalAnnualRevenueMature * margin; // ~$10.800M COP
  // OPEX includes lease as a significant cost component
  const annualOpexMature = totalAnnualRevenueMature * (1 - margin); // ~$43.200M COP (includes lease)

  // Simple payback (using average of ramp-up years)
  // Year 1: 40% × EBITDA, Year 2: 65% × EBITDA, Year 3: 85% × EBITDA, Year 4+: 100%
  let cumulativeCF = -totalCapex;
  let paybackYears = 0;
  for (let y = 1; y <= 15; y++) {
    const rampPct = y === 1 ? 0.4 : y === 2 ? 0.65 : y === 3 ? 0.85 : 1.0;
    cumulativeCF += annualEbitdaMature * rampPct;
    if (cumulativeCF >= 0 && paybackYears === 0) {
      // Interpolate the exact year
      const prevCF = cumulativeCF - annualEbitdaMature * rampPct;
      paybackYears = y - 1 + Math.abs(prevCF) / (annualEbitdaMature * rampPct);
    }
  }

  // NPV over 10 years
  const r = ambulatoryParams.discountRate.value / 100;
  let npv = -totalCapex;
  for (let y = 1; y <= 10; y++) {
    const rampPct = y === 1 ? 0.4 : y === 2 ? 0.65 : y === 3 ? 0.85 : 1.0;
    npv += (annualEbitdaMature * rampPct) / Math.pow(1 + r, y);
  }

  return {
    modelType: "ambulatory",
    siteName: "Access Point — Km 7 Vía Las Palmas",
    siteDescription: "Centro ambulatorio de alta complejidad en edificio existente Access Point (4 torres, 10 pisos, 1,085 parqueaderos). Lease de ~1.5 pisos de una torre.",

    totalAreaM2,
    floorsUsed,
    leaseCostM2Month: ambulatoryParams.leaseCostM2Month,
    annualLeaseCost,
    fitoutCostM2: ambulatoryParams.fitoutCostM2,
    totalFitoutCost,

    equipment: ambulatoryEquipment,
    totalEquipmentCost,

    totalCapex,

    revenueStreams: ambulatoryRevenueStreams,
    totalAnnualRevenueMature,
    rampUp,

    ebitdaMargin: ambulatoryParams.ebitdaMarginAmbulatory,
    annualEbitdaMature,
    annualOpexMature,
    paybackYears: Math.round(paybackYears * 10) / 10,
    npv10y: Math.round(npv),

    fitoutMonths: ambulatoryParams.fitoutMonths,
    timeToFirstRevenue: ambulatoryParams.fitoutMonths.value + 2, // fit-out + 2 months ramp-up

    accessPointAdvantage: [
      "Edificio existente — sin tiempo de construcción, solo 18-24 meses de adecuación",
      "1,085 parqueaderos ya construidos — capacidad superior a cualquier clínica del corredor",
      "4 torres × 10 pisos — expansión futura sin obra nueva",
      "Km 7 Las Palmas — primer nodo médico antes del Túnel de Oriente",
      "Sin compra de terreno — CAPEX 100% en adecuación + equipos (mejor ROI)",
      "Arriendo deducible — ventaja tributaria vs propiedad",
    ],
  };
}

export const ambulatoryModel = calcAmbulatory();

// ── Ambulatory summary metrics ──
export const ambulatorySummary = {
  totalCatchmentPop: 863_000, // 728K Oriente + 135K Poblado corredor
  targetMarket: "Contributivo + prepagada + turismo médico + ejecutivos Zona Franca",
  openingTarget: "H1 2028",
  capexVsHospital: {
    ambulatoryCapex: ambulatoryModel.totalCapex,
    ambulatoryCapexPhase1Label: "$67,000M (Fase 1 sin PET-CT)",
    hospitalCapexBest: zoneFinancialsCalculated[0]?.totalInvestment ?? 0,
    hospitalCapexWorst: zoneFinancialsCalculated[zoneFinancialsCalculated.length - 1]?.totalInvestment ?? 0,
    savings: "Ambulatorio Fase 1 ~$67.000M vs Hospital ~$75.000M-$100.000M — menor inversión con mejor margen",
  },
  // Annual lease cost made explicit: $45K × 6,000 m² × 12 = $3,240M/year
  annualLeaseCost: 45_000 * 6_000 * 12, // $3,240,000,000 COP/year
  annualLeaseCostNote: "Arriendo anual $3,240M — representa ~35% del EBITDA base. Riesgo: renegociación de tarifa a largo plazo.",
  timelineAdvantage: {
    ambulatoryMonths: ambulatoryModel.fitoutMonths.value,
    hospitalMonths: generalParams.designMonths.value + generalParams.constructionMonths.value,
    advantage: `${generalParams.designMonths.value + generalParams.constructionMonths.value - ambulatoryModel.fitoutMonths.value} meses más rápido`,
  },
  marginAdvantage: {
    ambulatoryMargin: ambulatoryModel.ebitdaMargin.value,
    hospitalMargin: generalParams.ebitdaMargin.value,
    reason: "Sin UCI, sin urgencias 24h, menor nómina, alta rotación de procedimientos ambulatorios",
  },
  // ── 3 Scenarios ──
  scenarios: [
    {
      name: "Pesimista",
      revenueCapturePercent: 70,
      annualRevenueMM: 35_700, // $51.000M × 70% = $35.700M
      ebitdaMarginPercent: 15,
      annualEbitdaMM: 5_355, // $35,700M × 15%
      paybackYears: 12,
      notes: "Baja captura de mercado, competencia agresiva de Torre Oviedo y Campestre Rionegro, demoras regulatorias",
    },
    {
      name: "Base",
      revenueCapturePercent: 100,
      annualRevenueMM: 51_000, // $51.000M
      ebitdaMarginPercent: 18,
      annualEbitdaMM: 9_180, // $51,000M × 18%
      paybackYears: 7,
      notes: "Captura completa de demanda proyectada, ramp-up en 4 años, sin PET-CT",
    },
    {
      name: "Optimista",
      revenueCapturePercent: 115,
      annualRevenueMM: 58_650, // $51.000M × 115% (incluye Fase 2 PET-CT)
      ebitdaMarginPercent: 22,
      annualEbitdaMM: 12_903, // $58,650M × 22%
      paybackYears: 5,
      notes: "Fase 2 con PET-CT activo, turismo médico fuerte, contratos corporativos Zona Franca",
    },
  ],
  keyRisks: [
    "Negociación de lease a largo plazo con Access Point (condiciones + exclusividad)",
    "Competencia de Torre Médica Oviedo (87 consultorios, 6 quirófanos Qlub, apertura jun 2025)",
    "Competencia Clínica del Campestre sede Rionegro (operativa desde mar 2026)",
    "Retrasos en pagos EPS (cartera sector salud ~$14.000M COP)",
    "Dependencia de flujo vehicular corredor Las Palmas (afectación por cierre vial o peaje)",
    "Verificación de factibilidad estructural del edificio para equipos médicos pesados (MRI 15 ton)",
    "Negociación de contratos con EPS/prepagadas (SURA domina 64-79%)",
    "Logística FDG para PET-CT (Fase 2) — pocos ciclotrones en Colombia",
  ],
  parametersToValidate: [
    { param: "Tarifa de arriendo Access Point (negociación directa)", priority: "ALTA", how: "Reunión con administración Access Point — negociar tarifa para 6,000 m² a largo plazo" },
    { param: "Costo adecuación grado médico (cotización específica)", priority: "ALTA", how: "Cotización con firmas de arquitectura hospitalaria (Urdaneta Vélez, AEI, Contexto Urbano)" },
    { param: "Revenue por línea de servicio (estudio de mercado)", priority: "ALTA", how: "Estudio de mercado específico para corredor Las Palmas + Oriente. Benchmark Somer, Pablo Tobón." },
    { param: "Volumen de derivaciones PET-CT y MRI", priority: "ALTA", how: "Datos de derivación desde oncólogos y radiólogos del Oriente + Medellín sur" },
    { param: "Margen EBITDA ambulatorio (benchmark real)", priority: "MEDIA", how: "Estados financieros de centros ambulatorios comparables (Supersalud, ANDI Salud)" },
    { param: "Disponibilidad de pisos en Access Point", priority: "ALTA", how: "Verificar ocupación actual de torres y negociar disponibilidad de 1.5 pisos contiguos" },
    { param: "Factibilidad estructural para MRI (15 ton)", priority: "ALTA", how: "Estudio de ingeniería estructural del edificio Access Point" },
  ],
};
