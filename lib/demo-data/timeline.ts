export type TimelineWeek = {
  week: number;
  title: string;
  phase: string;
  color: string;
  activities: string[];
};

export const timeline: TimelineWeek[] = [
  {
    week: 1,
    title: "Mapeo de Demanda",
    phase: "Fase 1",
    color: "#0d9488",
    activities: [
      "Georreferenciacion de poblacion estratos 5 y 6 del Valle de Aburra",
      "Identificacion y clasificacion de POIs relevantes (clinicas, colegios, clubes)",
      "Analisis de isocronas base desde puntos de interes clave",
      "Recopilacion de datos censales DANE y catastro municipal",
      "Construccion de mapa de calor de densidad poblacional objetivo",
    ],
  },
  {
    week: 2,
    title: "Flujos y Nodos",
    phase: "Fase 2",
    color: "#00549f",
    activities: [
      "Mapeo de flujos viales principales y secundarios (AM/PM peak)",
      "Analisis de nodos de salud existentes y sus areas de influencia",
      "Modelado de accesibilidad multimodal (vehiculo, transporte publico, peatonal)",
      "Evaluacion de tiempos de desplazamiento con datos de trafico en tiempo real",
      "Identificacion de cuellos de botella viales y corredores subutilizados",
    ],
  },
  {
    week: 3,
    title: "Competencia y Normativa",
    phase: "Fase 3",
    color: "#f59e0b",
    activities: [
      "Mapeo exhaustivo de competidores directos e indirectos en area de estudio",
      "Revision del Plan de Ordenamiento Territorial (POT) y usos del suelo",
      "Analisis de normativa sanitaria y requisitos de habilitacion",
      "Estudio de mercado inmobiliario: precios, disponibilidad y tendencias",
      "Evaluacion de restricciones ambientales y de construccion por zona",
    ],
  },
  {
    week: 4,
    title: "Sintesis MCDA",
    phase: "Fase 4",
    color: "#10b981",
    activities: [
      "Calibracion del modelo multicriterio (MCDA) con pesos validados por expertos",
      "Scoring cuantitativo de las zonas candidatas en cada dimension",
      "Analisis de sensibilidad para evaluar robustez de los resultados",
      "Generacion de escenarios optimista, base y conservador",
      "Validacion cruzada de resultados con datos de campo y entrevistas",
    ],
  },
  {
    week: 5,
    title: "Entregables",
    phase: "Cierre",
    color: "#8b5cf6",
    activities: [
      "Despliegue de plataforma interactiva con mapas y dashboards",
      "Redaccion del reporte ejecutivo con recomendaciones estrategicas",
      "Preparacion de la presentacion de resultados para la junta directiva",
      "Documentacion tecnica del modelo y fuentes de datos utilizadas",
      "Sesion de transferencia de conocimiento y capacitacion al equipo HPTU",
    ],
  },
];
