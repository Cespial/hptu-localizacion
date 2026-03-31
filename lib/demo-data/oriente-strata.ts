// ---------------------------------------------------------------
// Estratificacion Oriente Antioqueno — proxy data layer
// Sources: Decreto 096/2021 Rionegro, DiariOriente, RUAF (ruaf-giye),
//          DANE CNPV 2018 (evm3-92yw)
// Nota: No existe dataset directo de estratificacion catastral para
//       todos los municipios del Oriente en datos.gov.co. Se usa proxy
//       de afiliacion contributiva como indicador de capacidad de pago.
// ---------------------------------------------------------------

export type OrienteStrataProxy = {
  municipio: string;
  poblacion2018: number;
  viviendas: number | null;
  afiliadosContributivo: number;
  afiliadosSubsidiado: number;
  pctContributivo: number;
  estratoDirecto: {
    e4: number | null;
    e5: number | null;
    e6: number | null;
    fuente: string | null;
  } | null;
  proxyE4Plus: number; // Estimacion de viviendas E4+ basada en % contributivo
  nota: string;
};

// Dato ancla: Rionegro (Decreto 096/2021, DiariOriente)
// Total viviendas: 44,805
// E1: 1,879 | E2: 7,221 | E3: 16,853 | E4: 15,633 | E5: 2,723 | E6: 496
// E4+: 18,852 / 44,805 = 42.1%
// Contributivo: 55% => ratio E4+/contributivo = 42.1/55 = 0.765

const RIONEGRO_E4_PLUS_RATIO = 0.765; // E4+ viviendas / % contributivo

export const orienteStrataData: OrienteStrataProxy[] = [
  {
    municipio: "Rionegro",
    poblacion2018: 124_160,
    viviendas: 44_805,
    afiliadosContributivo: 69_432,
    afiliadosSubsidiado: 56_978,
    pctContributivo: 54.9,
    estratoDirecto: {
      e4: 15_633,
      e5: 2_723,
      e6: 496,
      fuente: "Decreto 096/2021, DiariOriente",
    },
    proxyE4Plus: 18_852,
    nota: "Dato directo. E4=35%, E5=6.1%, E6=1.1%. Total E4+: 42.1% de viviendas.",
  },
  {
    municipio: "La Ceja",
    poblacion2018: 53_134,
    viviendas: null,
    afiliadosContributivo: 26_920,
    afiliadosSubsidiado: 25_432,
    pctContributivo: 51.4,
    estratoDirecto: null,
    proxyE4Plus: Math.round(53_134 * 0.514 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy: 51.4% contributivo × ratio Rionegro × factor viviendas (0.35). Mercado privado fuerte.",
  },
  {
    municipio: "El Retiro",
    poblacion2018: 19_695,
    viviendas: null,
    afiliadosContributivo: 10_845,
    afiliadosSubsidiado: 8_260,
    pctContributivo: 56.8,
    estratoDirecto: null,
    proxyE4Plus: Math.round(19_695 * 0.568 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Alto % contributivo (56.8%). Llanogrande = zona de fincas E5/E6.",
  },
  {
    municipio: "Guarne",
    poblacion2018: 52_570,
    viviendas: null,
    afiliadosContributivo: 22_100,
    afiliadosSubsidiado: 29_430,
    pctContributivo: 42.9,
    estratoDirecto: null,
    proxyE4Plus: Math.round(52_570 * 0.429 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Menor % contributivo (42.9%). Mas rural que Rionegro.",
  },
  {
    municipio: "Marinilla",
    poblacion2018: 56_399,
    viviendas: null,
    afiliadosContributivo: 22_900,
    afiliadosSubsidiado: 32_780,
    pctContributivo: 41.1,
    estratoDirecto: null,
    proxyE4Plus: Math.round(56_399 * 0.411 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Centro regional historico. Menor penetracion contributiva.",
  },
  {
    municipio: "El Santuario",
    poblacion2018: 27_981,
    viviendas: null,
    afiliadosContributivo: 8_450,
    afiliadosSubsidiado: 18_920,
    pctContributivo: 30.9,
    estratoDirecto: null,
    proxyE4Plus: Math.round(27_981 * 0.309 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Bajo % contributivo. Predomina subsidiado.",
  },
  {
    municipio: "El Carmen de Viboral",
    poblacion2018: 48_988,
    viviendas: null,
    afiliadosContributivo: 15_200,
    afiliadosSubsidiado: 33_100,
    pctContributivo: 31.5,
    estratoDirecto: null,
    proxyE4Plus: Math.round(48_988 * 0.315 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Predomina subsidiado. Sector ceramica artesanal.",
  },
  {
    municipio: "El Penol",
    poblacion2018: 17_200,
    viviendas: null,
    afiliadosContributivo: 4_830,
    afiliadosSubsidiado: 11_980,
    pctContributivo: 28.7,
    estratoDirecto: null,
    proxyE4Plus: Math.round(17_200 * 0.287 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Turismo embalse. Bajo contributivo.",
  },
  {
    municipio: "San Vicente Ferrer",
    poblacion2018: 18_780,
    viviendas: null,
    afiliadosContributivo: 3_950,
    afiliadosSubsidiado: 14_320,
    pctContributivo: 21.6,
    estratoDirecto: null,
    proxyE4Plus: Math.round(18_780 * 0.216 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Predominantemente rural y subsidiado.",
  },
  {
    municipio: "La Union",
    poblacion2018: 19_632,
    viviendas: null,
    afiliadosContributivo: 6_200,
    afiliadosSubsidiado: 13_050,
    pctContributivo: 32.2,
    estratoDirecto: null,
    proxyE4Plus: Math.round(19_632 * 0.322 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Sector floricultor. Contributivo moderado.",
  },
  {
    municipio: "Sonson",
    poblacion2018: 36_480,
    viviendas: null,
    afiliadosContributivo: 8_900,
    afiliadosSubsidiado: 26_800,
    pctContributivo: 24.9,
    estratoDirecto: null,
    proxyE4Plus: Math.round(36_480 * 0.249 * RIONEGRO_E4_PLUS_RATIO * 0.35),
    nota: "Proxy. Municipio mas lejano. Predomina subsidiado.",
  },
];

// Summary computed values
export const orienteStrataSummary = {
  totalPoblacion: orienteStrataData.reduce((s, m) => s + m.poblacion2018, 0),
  totalContributivo: orienteStrataData.reduce(
    (s, m) => s + m.afiliadosContributivo,
    0
  ),
  totalSubsidiado: orienteStrataData.reduce(
    (s, m) => s + m.afiliadosSubsidiado,
    0
  ),
  totalProxyE4Plus: orienteStrataData.reduce((s, m) => s + m.proxyE4Plus, 0),
  rionegroPctE4Plus: 42.1,
  rionegroDatoDirecto: true,
  metodologia:
    "Proxy basado en ratio E4+/contributivo de Rionegro (unico municipio con dato directo). " +
    "Rionegro: 42.1% viviendas E4+ con 54.9% contributivo → ratio 0.765. " +
    "Para otros municipios: poblacion × % contributivo × ratio × factor viviendas (0.35).",
  limitaciones: [
    "Solo Rionegro tiene estratificacion catastral publica verificable",
    "El proxy asume que la relacion estrato-regimen es similar entre municipios",
    "Municipios rurales pueden tener distribucion de estratos diferente a Rionegro",
    "datos.gov.co no tiene dataset directo de estratificacion para Oriente",
  ],
};
