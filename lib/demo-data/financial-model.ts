/**
 * Modelo Financiero Preliminar — Hospital de Alta Complejidad
 * NOTA: Parámetros marcados con ⚠️ requieren validación con datos reales
 *
 * Fuentes:
 * - Costos construcción: Scielo/Univ. Militar Nueva Granada, DNP Proyectos Tipo
 * - Benchmarks hospitalarios: HUSI Estados Financieros 2024, DANE, MinSalud
 * - Precios suelo: Fincaraíz, Metrocuadrado, Espacio Urbano (Mar 2026)
 * - POT: Acuerdo 48 de 2014, Batería Indicadores POT Medellín
 * - Población: DANE CNPV 2018, Proyecciones 2025-2037
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

// ── Summary metrics ──
export const financialSummary = {
  totalCatchmentPop2025: 800_000,
  totalCatchmentPop2030: 835_000,
  bedsPerThousand: 1.7,
  bedsDeficit: "Colombia: 1.7 camas/1000 hab vs OCDE: 4.3 — déficit de 2.6 camas/1000",
  constructionTimeline: `${generalParams.designMonths.value} meses diseño + ${generalParams.constructionMonths.value} meses construcción = ${generalParams.designMonths.value + generalParams.constructionMonths.value} meses total`,
  keyRisks: [
    "Demoras en licenciamiento urbanístico (POT Acuerdo 48 de 2014)",
    "Volatilidad en costos de construcción (inflación materiales)",
    "Retrasos en pagos EPS (cartera sector salud ~$14B COP)",
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
