// ---------------------------------------------------------------
// Prospectiva Estrategica — data layer for HPTU localizacion dashboard
// Sources: Gobernacion de Antioquia, INVIAS, ANI, Aerocivil,
//          Plan Maestro JMC 2055, DANE proyecciones, POT Rionegro,
//          REPS (b4dp-ximh), Supersalud, Cuentas municipales,
//          ProColombia, MinSalud SISPRO, prensa verificada
// ---------------------------------------------------------------

export type InfrastructureProject = {
  id: string;
  name: string;
  investment: string; // COP formatted
  investmentBillions: number; // for charts
  status: "construccion" | "planeado" | "estudios" | "pausado" | "completado";
  timeline: string;
  description: string;
  impactOnAccessPoint: string;
};

export type CompetitorProfile = {
  id: string;
  name: string;
  beds: number | null;
  icuBeds: number | null;
  location: string;
  complexity: "alta" | "media-alta" | "media";
  recentMove: string;
  investment: string;
  threat: "alta" | "media" | "baja";
  differentiator: string;
};

export type AmbulatoryGap = {
  service: string;
  statusOriente: string;
  level: "critico" | "limitado" | "basico" | "inexistente";
  opportunity: string;
};

export type AirportProjection = {
  year: number;
  passengers: number; // millions
  phase: string;
};

// Infrastructure projects data
export const infrastructureProjects: InfrastructureProject[] = [
  {
    id: "tunel-2",
    name: "2da Etapa Tunel de Oriente",
    investment: "COP $1.8 billones",
    investmentBillions: 1800,
    status: "construccion",
    timeline: "H2 2027",
    description:
      "Doble calzada del Tunel de Oriente (14.9 km). Tunel Santa Elena 2 (8.2 km) excavado. Puentes Sajonia 2 y Bocana 2 con cimentacion completa. 19% de avance general.",
    impactOnAccessPoint:
      "CRITICO — Reduce drasticamente tiempos Medellin-Oriente. Access Point en Km 7 queda como nodo de entrada al corredor de doble calzada.",
  },
  {
    id: "intercambio-palmas",
    name: "Intercambio Vial Alto de Las Palmas",
    investment: "COP $18,000M",
    investmentBillions: 18,
    status: "planeado",
    timeline: "Q2 2026",
    description:
      "Puente vehicular metalico en la interseccion critica donde converge trafico de Las Palmas con trafico del Aeropuerto y El Retiro.",
    impactOnAccessPoint:
      "DIRECTO — Elimina congestion aguas arriba de Km 7. Mejora flujo vehicular hacia y desde Access Point.",
  },
  {
    id: "via-sika",
    name: "Via Aeropuerto-Belen (Sika)",
    investment: "COP $120,000M",
    investmentBillions: 120,
    status: "planeado",
    timeline: "Q2 2026",
    description:
      "Acorta ruta al aeropuerto en 12 km, ahorra 20-25 min. Completa circuito Medellin-Tunel-Aeropuerto-Autopista Medellin-Bogota. 6,000-7,000 vehiculos/dia esperados.",
    impactOnAccessPoint:
      "ALTO — Crea circuito vial que aumenta area de captacion desde Km 7. Fortalece ruta hospital-aeropuerto.",
  },
  {
    id: "llanogrande-canada",
    name: "Via Llanogrande-Canada",
    investment: "COP $120,000M",
    investmentBillions: 120,
    status: "planeado",
    timeline: "2026+",
    description:
      "12 km de via nueva conectando El Santuario, El Carmen, Canada, Llanogrande y Tunel de Oriente. La Ceja quedaria a 10 min de conexion Medellin. ~9,500 vehiculos/dia.",
    impactOnAccessPoint:
      "ALTO — Alimenta mas trafico por el corredor del tunel, aumentando poblacion que transita cerca de Km 7.",
  },
  {
    id: "doble-calzada-ceja",
    name: "Doble Calzada La Ceja-Rionegro",
    investment: "N/D",
    investmentBillions: 0,
    status: "construccion",
    timeline: "Marzo 2026",
    description:
      "2.68 km de doble calzada. Beneficia 16,000+ vehiculos/dia. Mejora conectividad intra-Oriente.",
    impactOnAccessPoint:
      "MEDIO — Mejora flujo interno del Oriente hacia centros de salud.",
  },
  {
    id: "via-santa-elena",
    name: "Mejoramiento Via Santa Elena",
    investment: "COP $5,500M",
    investmentBillions: 5.5,
    status: "planeado",
    timeline: "2026",
    description:
      "Rehabilitacion de pavimento, iluminacion, estabilizacion de taludes en via alternativa Medellin-Oriente.",
    impactOnAccessPoint:
      "BAJO — Ruta alternativa secundaria. Beneficio marginal.",
  },
  {
    id: "tren-oriente",
    name: "Tren de Pasajeros Medellin-Oriente",
    investment: "COP $3,421M (estudios)",
    investmentBillions: 3.4,
    status: "estudios",
    timeline: "Largo plazo",
    description:
      "~140 km conectando Medellin con 8 municipios del Oriente via El Retiro, El Santuario, La Union. Prefactibilidad contratada 2022.",
    impactOnAccessPoint:
      "POTENCIAL — Si se construye, Km 7 podria ser cercano a estacion intermodal.",
  },
  {
    id: "tren-ligero-rionegro",
    name: "Tren Ligero de Rionegro",
    investment: "COP $5 billones (original)",
    investmentBillions: 5000,
    status: "pausado",
    timeline: "Indefinido",
    description:
      "Proyecto anulado por fallo judicial. Rionegro sin capacidad de endeudamiento para financiarlo. Requiere nuevo marco legal (8-10 anos).",
    impactOnAccessPoint: "NULO a mediano plazo.",
  },
];

// Airport expansion
export const airportProjections: AirportProjection[] = [
  { year: 2024, passengers: 14.5, phase: "Actual (32% sobre capacidad)" },
  { year: 2030, passengers: 22, phase: "Fase 1 — Ampliacion plataforma" },
  { year: 2040, passengers: 32, phase: "Fase 2 — Segunda pista + terminal" },
  {
    year: 2055,
    passengers: 42.7,
    phase: "Fase 3 — 87 posiciones, biometria, vertiport",
  },
];

export const airportInvestment = "COP $22 billones";
export const airportMasterPlanYear = 2055;

// Competitor profiles
export const competitors: CompetitorProfile[] = [
  {
    id: "hsvf-medellin",
    name: "San Vicente Fundacion — Medellin",
    beds: 525,
    icuBeds: 208,
    location: "Centro, Medellin",
    complexity: "alta",
    recentMove: "Expansion unidad quemados (534->1,439 m2)",
    investment: "N/D",
    threat: "media",
    differentiator:
      "Docencia (39 programas), quemados, 70+ especialidades, 19,000 cirugias/ano",
  },
  {
    id: "hsvf-rionegro",
    name: "San Vicente Fundacion — Rionegro",
    beds: 152,
    icuBeds: null,
    location: "Rionegro (2.3 km aeropuerto)",
    complexity: "alta",
    recentMove:
      "Expansion a 500 camas (100,000+ m2), helipuerto, trasplantes",
    investment: "Multifase (>COP $200,000M est.)",
    threat: "alta",
    differentiator:
      "Centro referencia 23 municipios, helipuerto, near-airport, trasplantes",
  },
  {
    id: "somer",
    name: "Clinica Somer",
    beds: 200,
    icuBeds: 19,
    location: "Rionegro + Reserva Plaza",
    complexity: "alta",
    recentMove:
      "Trasplante cardiaco (2023), oncologia pediatrica, sede Reserva Plaza",
    investment: "COP $3,000M sostenibilidad",
    threat: "alta",
    differentiator:
      "Unica UFCA Antioquia, unica radioterapia Oriente, 129+ servicios",
  },
  {
    id: "auna",
    name: "Las Americas AUNA (Main + Sur)",
    beds: 492,
    icuBeds: null,
    location: "Medellin + Envigado",
    complexity: "alta",
    recentMove:
      "Sede Sur 168 camas (2022), alta complejidad (2024), cirugia oncologica",
    investment: "COP $90,000M expansion",
    threat: "media",
    differentiator: "Red AUNA LatAm, CAP certified, 6 quirofanos Sur",
  },
  {
    id: "quironsalud",
    name: "Quironsalud Colombia (6 hospitales)",
    beds: 812,
    icuBeds: null,
    location: "Varios, Medellin",
    complexity: "alta",
    recentMove: "Adquisicion COA (oncologia) + Clofan (oftalmologia)",
    investment: "Consolidacion agresiva",
    threat: "media",
    differentiator:
      "Respaldo Fresenius/Quironsalud, #17 LatAm, 53 quirofanos",
  },
  {
    id: "rosario-tesoro",
    name: "Clinica El Rosario — Tesoro",
    beds: 140,
    icuBeds: 60,
    location: "El Poblado (mas cercano a Access Point)",
    complexity: "alta",
    recentMove:
      "Oncologia integral, chequeo ejecutivo, habitaciones individuales",
    investment: "N/D",
    threat: "alta",
    differentiator:
      "Mas cercano geograficamente a Access Point, premium, 43 servicios",
  },
  {
    id: "campestre",
    name: "Clinica del Campestre",
    beds: null,
    icuBeds: null,
    location: "El Poblado + Rionegro (nuevo)",
    complexity: "media-alta",
    recentMove:
      "Nueva torre de 15 pisos en Medellin (construccion). Sede Rionegro abierta marzo 2026 (250 pac/dia). Expansion agresiva ambulatorio premium.",
    investment: "COP $30,000M Rionegro + Torre 15 pisos Medellin",
    threat: "alta",
    differentiator:
      "Ambulatorio especializado, ortopedia, ya entro a Oriente. Torre 15 pisos valida demanda premium corredor.",
  },
  {
    id: "torre-oviedo",
    name: "Clinica Ojo Oviedo / Torre Medica Oviedo",
    beds: null,
    icuBeds: null,
    location: "El Poblado (CC Oviedo)",
    complexity: "media-alta",
    recentMove:
      "Abrio junio 2025. Qlub Quirofanos (6 quirofanos ambulatorios), Cedimed, CES. Oftalmologia avanzada como ancla.",
    investment: "COP $100,000M",
    threat: "media",
    differentiator:
      "87 consultorios, 200+ profesionales, cirugia ambulatoria, oftalmologia subespecializada",
  },
  {
    id: "proyecto-alto-palmas",
    name: "Proyecto Clinica Alto de Las Palmas",
    beds: null,
    icuBeds: null,
    location: "Alto de Las Palmas (por confirmar)",
    complexity: "media",
    recentMove:
      "En evaluacion / rumores de desarrollo. Requiere visita de sitio y confirmacion de viabilidad POT.",
    investment: "N/D (en estudios)",
    threat: "media",
    differentiator:
      "Si se concreta, seria competencia directa en corredor Las Palmas. POT restrictivo en zona rural podria limitar alcance.",
  },
  {
    id: "ips-universitaria",
    name: "IPS Universitaria (UdeA)",
    beds: 604,
    icuBeds: 141,
    location: "Varios, Medellin",
    complexity: "alta",
    recentMove: "N/D",
    investment: "N/D",
    threat: "baja",
    differentiator: "Mayor # camas en Medellin, docencia UdeA",
  },
  {
    id: "cardiovid",
    name: "Clinica CardioVID",
    beds: 200,
    icuBeds: null,
    location: "Medellin",
    complexity: "alta",
    recentMove: "Planes expansion (sin timeline confirmado)",
    investment: "N/D",
    threat: "baja",
    differentiator:
      "592 trasplantes cardiacos, pionero pulmon, lider cardiovascular",
  },
  {
    id: "vitha",
    name: "Clinica Vitha (nueva)",
    beds: 201,
    icuBeds: 36,
    location: "Laureles, Medellin",
    complexity: "alta",
    recentMove:
      "Inaugurada 2024 — primera alta complejidad en occidente",
    investment: "N/D",
    threat: "baja",
    differentiator: "128 consultorios, 6 quirofanos, zona oeste",
  },
  {
    id: "hsanjuandios",
    name: "Hospital San Juan de Dios — Rionegro",
    beds: null,
    icuBeds: null,
    location: "Rionegro",
    complexity: "media",
    recentMove:
      "Torre medica COP $120,000M en estudios, transicion a Nivel 3",
    investment: "COP $10,500M equipos + $120,000M torre",
    threat: "media",
    differentiator:
      "Hospital publico referencia 23 municipios, 70% pacientes regionales",
  },
];

// Ambulatory service gaps in Oriente
export const ambulatoryGaps: AmbulatoryGap[] = [
  {
    service: "Cirugia Ambulatoria Avanzada",
    statusOriente: "Solo Campestre (recien llego)",
    level: "critico",
    opportunity:
      "HPTU hub quirurgico ambulatorio: ortopedia, urologia, ginecologia, ORL",
  },
  {
    service: "Imagenes Diagnosticas Avanzadas",
    statusOriente: "IMEDI + Somer (limitado)",
    level: "limitado",
    opportunity: "Centro de excelencia en TAC, RMN, PET-CT",
  },
  {
    service: "Oncologia Ambulatoria",
    statusOriente: "Solo Somer (unica UFCA)",
    level: "critico",
    opportunity:
      "Quimioterapia ambulatoria, segunda opinion oncologica",
  },
  {
    service: "Radioterapia",
    statusOriente: "Solo Somer (unico equipo)",
    level: "critico",
    opportunity: "Segundo centro de radioterapia para la region",
  },
  {
    service: "Rehabilitacion Especializada",
    statusOriente: "Basica unicamente",
    level: "inexistente",
    opportunity: "Neuro-rehab, cardiaca, post-quirurgica, deportiva",
  },
  {
    service: "Chequeo Ejecutivo",
    statusOriente: "Inexistente",
    level: "inexistente",
    opportunity:
      "Check-up premium para ejecutivos Zona Franca + aeropuerto",
  },
  {
    service: "Turismo Medico",
    statusOriente: "Cero infraestructura",
    level: "inexistente",
    opportunity:
      "23,323 pac internacionales/ano en Medellin, 0 cerca del aeropuerto",
  },
  {
    service: "Pediatria Subespecializada",
    statusOriente: "Concentrada en Medellin",
    level: "inexistente",
    opportunity: "Consulta pediatrica especializada ambulatoria",
  },
  {
    service: "Hemodialisis",
    statusOriente: "RCS Rionegro (22 puntos, 41% cobertura)",
    level: "limitado",
    opportunity: "Expansion de puntos de dialisis",
  },
  {
    service: "Cardiologia Intervencionista",
    statusOriente: "Solo Somer Incare",
    level: "limitado",
    opportunity: "Segundo centro cardiovascular ambulatorio",
  },
];

// Market data
export const marketData = {
  prepagadaAfiliados: 1_400_000,
  prepagadaGrowth: 37, // % since 2022
  prepagadaRevenue2025: 7.2, // COP billones
  medicalTourists2024: 23_323,
  medicalTourismRevenue: 100, // COP billion
  medicalTourismCAGR: 15, // %
  ambulatorySurgeries2024: 490_944,
  ambulatorySurgeriesGrowth: 10, // % YoY
  globalASCMarket2024: 99.6, // USD billion
  globalASCMarket2034: 155.4, // USD billion
  surgeriesAmbulatory: 80, // % of all surgeries now ambulatory
  orientePopulation2023: 728_581,
  orienteGrowthRate: 1.64, // % annual
  orienteMigrationRate: 5.2, // per 100 inhabitants/year
  orienteGDPShareAntioquia: 10.4, // %
  rionegroPlanDesarrolloBudget2025: 705_254, // COP million
  areaMetropolitanaConsulta: "2026-07-26",
  areaMetropolitanaMunicipios: 8,
  xOrienteInvestment: 400_000, // COP million

  // Access Point market (backward compat with competitive-landscape-section)
  zoneFrancaCompanies: 300, // empresas en Zona Franca Rionegro
  zoneFrancaEmployees: 12_000, // empleados estimados
  airportPassengers2024: 9_800_000, // pasajeros SKRG 2024
  corredorPopulation: 493_800, // poblacion total Oriente (11 municipios)

  // Market segments COP millones
  marketSegments: [
    { name: "Prepagada Antioquia", value: 7_200_000, fill: "#0d9488" },
    { name: "Turismo Medico", value: 100_000, fill: "#3b82f6" },
    { name: "Cirugia Ambulatoria", value: 2_500_000, fill: "#f59e0b" },
    { name: "Imagenes Diagnosticas", value: 850_000, fill: "#8b5cf6" },
    { name: "Rehabilitacion Premium", value: 320_000, fill: "#ec4899" },
  ],
};
