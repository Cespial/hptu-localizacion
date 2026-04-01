// ---------------------------------------------------------------
// Benchmark CEDIMED + Tendencias Ambulatorias Globales
// Sources: cedimed.com.co, Google Places API, Quironsalud,
//          HCD Magazine, KI Healthcare, ASC News, Cleveland Clinic
// ---------------------------------------------------------------

export type CedimedSede = {
  name: string;
  address: string;
  location: string; // dentro de qué centro comercial / torre
  services: string[];
  hours: string;
};

export const cedimedProfile = {
  name: "CEDIMED — Centro de Diagnostico Medico",
  founded: 1996,
  years: 30,
  employees: 500,
  sedes: 9,
  coverage: "365 dias/ano",
  owner: "Quironsalud (Fresenius Helios)",
  keyTech: ["RMN 3T Siemens Lumina", "PET-CT con FDG", "SPECT-CT", "Mamografia 3D", "Tomografia multicorte"],
  services: ["Imagenologia", "Laboratorio Clinico", "Chequeo Ejecutivo (CediMed Vital)", "Medicina Nuclear"],
  competitiveAdvantages: [
    "9 sedes en Medellin — el paciente va al mas cercano",
    "Todas las sedes DENTRO de ecosistemas comerciales (CC El Tesoro, CC Oviedo, Torres Medicas)",
    "Horarios extendidos: algunas sedes hasta medianoche",
    "Todo en uno: imagenes + laboratorio + chequeo en un solo lugar",
    "CediMed Vital: chequeo ejecutivo con acompanamiento bilingue y alianzas hoteleras",
    "Unico centro en Medellin con TODAS las modalidades diagnosticas en imagenologia",
  ],
  keyInsight:
    "CEDIMED demuestra que el modelo ambulatorio multisede funciona en Medellin. " +
    "La clave: ubicarse DENTRO de ecosistemas de alto trafico (centros comerciales, torres medicas), " +
    "nunca en edificios aislados. Esperas productivas naturales.",
};

export const cedimedSedes: CedimedSede[] = [
  { name: "Sede Poblado", address: "Calle 7 #39-290 Piso 3", location: "Clinica Medellin", services: ["Imagenologia", "Lab", "Medicina Nuclear"], hours: "24 horas" },
  { name: "Sede Intermedica", address: "Calle 7 #39-197 Local 119", location: "Edificio Intermedica", services: ["Imagenologia", "Lab"], hours: "5am-12am" },
  { name: "Sede Tesoro I", address: "Torre Medica I, Piso 1", location: "CC El Tesoro", services: ["Imagenologia", "Lab"], hours: "5am-12am" },
  { name: "Sede Tesoro II", address: "Torre Medica II, Nivel -2", location: "CC El Tesoro", services: ["RMN 3T", "Ecografia", "Lab"], hours: "5am-12am" },
  { name: "Sede Laureles", address: "Calle 33 #74E-91", location: "Zona Laureles", services: ["Imagenologia", "Lab"], hours: "6am-12am" },
  { name: "Sede Almacentro", address: "Carrera 43A #34-95 Local 114", location: "CC Almacentro", services: ["Imagenologia", "Lab"], hours: "6am-9pm" },
  { name: "Sede Medical", address: "Calle 7 #39-107 Local 104", location: "Torre Medical", services: ["Imagenologia", "Lab"], hours: "7am-7pm" },
  { name: "Sede Medicina Nuclear", address: "Calle 7 #39-290 Piso 13", location: "Clinica Medellin", services: ["SPECT-CT", "Medicina Nuclear"], hours: "6am-7pm" },
  { name: "Sede Oviedo", address: "Cra 43a #6s-115 Nivel 3 Local 375", location: "Torre Medica CC Oviedo", services: ["Imagenologia", "Lab"], hours: "6am-7pm" },
];

// Tendencias globales 2025-2026
export const ambulatoryTrends = [
  {
    trend: "Salas de espera → Lounges",
    description: "Espacios tipo sala de estar con sofas, no sillas plasticas. El paciente no debe sentir que esta en un hospital.",
    source: "HCD Magazine, ASC News 2025",
  },
  {
    trend: "Diseno tipo spa/hotel",
    description: "Interiores que evocan boutique hotels. Lobbies con mecedoras, vistas a jardines. Colores de la naturaleza.",
    source: "Healthcare Design Trends 2025",
  },
  {
    trend: "Cafeterias y retail integrado",
    description: "Grab-and-go, playrooms para ninos. El acompanante puede ir al banco o al cafe mientras el paciente esta en consulta.",
    source: "HFM Magazine, KI Healthcare",
  },
  {
    trend: "Diseno biofilico",
    description: "Luz natural, plantas, materiales organicos. Reduce ansiedad del paciente y mejora satisfaccion del staff.",
    source: "IIDA, Healthcare Facilities Today",
  },
  {
    trend: "Espacios modulares",
    description: "Consultorios que se convierten en salas de telemedicina. Muebles que se adaptan de consulta privada a discusion grupal.",
    source: "KI Healthcare Insights 2026",
  },
  {
    trend: "Cleveland Clinic: clinical neighbourhoods",
    description: "276 ambulatory facilities. Servicios agrupados en 'vecindarios clinicos'. Expansion 4x en Palm Beach. Nuevo ASC con Regent Surgical.",
    source: "Cleveland Clinic Newsroom 2026",
  },
];

// Milla de Oro datos corporativos
export const millaDeOroData = {
  totalPOIs_500m: 396,
  healthFacilities: 112,
  retail: 85,
  gastronomia: 71,
  financiero: 38,
  spas: 27,
  hoteles: 21,
  parqueaderos: 20,
  inmobiliarias: 20,
  hotelesDestacados: [
    { name: "Dann Carlton", reviews: 9476, rating: 4.6 },
    { name: "Hotel Du Parc", reviews: 1208, rating: 4.6 },
    { name: "Art Hotel Boutique", reviews: 1183, rating: 4.1 },
    { name: "Hotel Acqua", reviews: 648, rating: 4.3 },
  ],
  distritoNegocios: {
    oficinas: 132,
    localesComerciales: 38,
    parqueaderos: 880,
    certificacion: "LEED Oro (2017)",
    sedeBancolombia: "Direccion General — miles de empleados diarios",
  },
  bancos: ["Bancolombia (Dir. General)", "BBVA", "Itau", "Davivienda", "Banco Popular", "Caja Social", "Cotrafa"],
  keyInsight:
    "La gente ya esta ahi — no tiene que llegar. Pero la competencia es feroz: " +
    "112 health facilities en 500m. Score Competencia: 35/100, la zona mas saturada de IPS.",
};
