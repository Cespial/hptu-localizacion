export type CandidateZone = {
  id: string;
  name: string;
  subtitle: string;
  coordinates: [number, number]; // center [lng, lat]
  score: number;
  scores: {
    accesibilidad: number;
    demanda: number;
    competencia: number;
    valorInmobiliario: number;
  };
  color: string;
  description: string;
  highlights: string[];
};

export const candidateZones: CandidateZone[] = [
  {
    id: "poblado",
    name: "El Poblado - Las Palmas",
    subtitle: "Zona Premium Medellin",
    coordinates: [-75.556, 6.201],
    score: 82,
    scores: {
      accesibilidad: 78,
      demanda: 92,
      competencia: 75,
      valorInmobiliario: 80,
    },
    color: "#0d9488",
    description:
      "El Poblado concentra la mayor densidad de poblacion estratos 5 y 6 del Valle de Aburra. El corredor de la Avenida Las Vegas ofrece conectividad directa con clinicas de alta complejidad, centros corporativos y colegios premium. La presencia de la Clinica Las Vegas y la Clinica El Rosario Tesoro genera sinergias naturales de referencia medica. El valor del metro cuadrado se mantiene entre los mas altos de la ciudad, lo que valida la capacidad de pago del mercado objetivo.",
    highlights: [
      "Mayor concentracion de poblacion E5/E6 del area metropolitana",
      "Corredor Las Vegas con acceso directo a la Milla de Oro",
      "Proximidad a clinicas premium (Las Vegas, El Rosario, Medellin)",
      "Red vial consolidada: Transversal Inferior, Las Palmas, El Poblado",
      "Ecosistema de servicios complementarios ya establecido",
    ],
  },
  {
    id: "envigado",
    name: "Envigado - Zuniga",
    subtitle: "Expansion Sur",
    coordinates: [-75.578, 6.168],
    score: 75,
    scores: {
      accesibilidad: 70,
      demanda: 85,
      competencia: 68,
      valorInmobiliario: 72,
    },
    color: "#3b82f6",
    description:
      "Envigado presenta el mayor crecimiento poblacional de estratos altos en el corredor sur del Valle de Aburra. La zona de Zuniga y alrededores ha experimentado un boom inmobiliario con mas de 15 proyectos residenciales de alta gama en los ultimos 5 anos. La menor presencia de competencia directa en servicios de salud especializados representa una ventana de oportunidad significativa. La conectividad vial con Sabaneta e Itagui amplia el area de influencia potencial.",
    highlights: [
      "Crecimiento poblacional alto en estratos 5 y 6",
      "Menor competencia directa en salud especializada",
      "Corredor Envigado-Sabaneta en plena expansion",
      "Valor del suelo 15-20% menor que El Poblado (mayor retorno potencial)",
      "Proyecto via distribuidora sur mejorara accesibilidad futura",
    ],
  },
  {
    id: "llanogrande",
    name: "Rionegro - Llanogrande",
    subtitle: "Polo de Desarrollo Oriente",
    coordinates: [-75.42, 6.08],
    score: 62,
    scores: {
      accesibilidad: 55,
      demanda: 65,
      competencia: 72,
      valorInmobiliario: 58,
    },
    color: "#f59e0b",
    description:
      "El Oriente antioqueno se consolida como el segundo polo de desarrollo del departamento gracias al Aeropuerto Jose Maria Cordova, la Zona Franca y el corredor de parcelaciones de Llanogrande. La poblacion flotante de fines de semana y la creciente residencia permanente generan demanda insatisfecha de servicios de salud de alta complejidad. Sin embargo, la distancia al casco urbano de Medellin (45 min en condiciones normales, hasta 90 min en horas pico por el tunel de Oriente) limita la puntuacion de accesibilidad.",
    highlights: [
      "Poblacion flotante alta en fines de semana y festivos",
      "Proximidad al Aeropuerto Internacional Jose Maria Cordova",
      "Desarrollo inmobiliario acelerado en parcelaciones de lujo",
      "Zona Franca y corredor industrial generan demanda corporativa",
      "Tunel de Oriente reduce tiempos de desplazamiento desde Medellin",
    ],
  },
];
