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
  demandEstimate: number; // estimated target population within 20min
  avgM2Price: number; // COP avaluo promedio catastral
  driveTimeToHPTU: number; // minutes to current HPTU (Mapbox Matrix API)
  potViability: string; // POT land use viability
  dataSource: string; // primary data sources used
};

export const candidateZones: CandidateZone[] = [
  {
    id: "palmas-bajo",
    name: "Las Palmas Bajo",
    subtitle: "Indiana - EIA (Barrios Altos del Poblado / El Tesoro)",
    coordinates: [-75.5465, 6.2080],
    score: 88,
    scores: {
      accesibilidad: 92,
      demanda: 93,
      competencia: 78,
      valorInmobiliario: 80,
    },
    color: "#0d9488",
    description:
      "Zona entre Indiana y la EIA, barrios Altos del Poblado y El Tesoro. Segun catastro municipal, El Tesoro tiene 13,786 predios (3,515 estrato 6) con avaluo promedio de $204M COP. El barrio Altos del Poblado obtiene score 9/9 en viabilidad POT para uso dotacional en salud (CL_D=2.38, ICS=57.4). La API Mapbox Matrix arroja 2.8 min al Club El Rodeo y 10.5 min a Clinica Las Vegas. Datos MEData registran 42,000 vehiculos/dia promedio en el corredor Las Palmas (64,285 observaciones, 2017-2020).",
    highlights: [
      "Viabilidad POT: Score 9/9 en Altos del Poblado (CL_D=2.38, uso dotacional confirmado)",
      "Catastro: 13,786 predios en El Tesoro, 38,415 E6 en toda comuna 14",
      "Mapbox Matrix: 10.5 min a Cl. Las Vegas, 10.4 min a Milla de Oro, 23.8 min a HPTU",
      "MEData Aforos: Av. Las Palmas promedio 40.9 km/h, 5.9 km (64,285 obs.)",
      "POT: 592 lotes / 414,309 m2 disponibles en corredor Las Palmas",
    ],
    demandEstimate: 134873, // DANE: El Poblado comuna 14 total 2020
    avgM2Price: 204000000, // Catastro: avg avaluo El Tesoro
    driveTimeToHPTU: 24, // Mapbox Matrix: 23.8 min
    potViability: "ALTA (9/9) - CL_D=2.38, ICS=57.4, 68,020 m2 suelo potencial",
    dataSource: "DANE CNPV 2018, Catastro Medellin (bp59-rj8r), POT Bateria Indicadores (3ciz-tpgr), MEData Aforos (b9s9-jw7c), Mapbox Matrix API",
  },
  {
    id: "palmas-medio",
    name: "Las Palmas Medio",
    subtitle: "Los Balsos - Las Lomas (Zona de Transicion)",
    coordinates: [-75.5380, 6.1980],
    score: 77,
    scores: {
      accesibilidad: 72,
      demanda: 84,
      competencia: 82,
      valorInmobiliario: 70,
    },
    color: "#06b6d4",
    description:
      "Sector Los Balsos y Las Lomas sobre la via Las Palmas. Catastro registra avaluo promedio de $225M (Los Balsos No.1, 13,484 predios) y $204M (Las Lomas No.2, 3,624 predios). Las Lomas No.2 permite hasta 20 pisos segun POT. Los Balsos No.1 tiene 97,440 m2 de lotes potenciales en tratamiento CN3/CN5. Mapbox Matrix: 20.4 min a Cl. Las Vegas, 31.8 min a HPTU Prado.",
    highlights: [
      "POT Las Lomas No.2: 20 pisos permitidos (mayor de toda Comuna 14)",
      "Catastro Los Balsos: 13,484 predios, avaluo promedio $225M COP",
      "POT: 97,440 m2 lotes potenciales en Los Balsos (CN3/CN5)",
      "Mapbox Matrix: 20.4 min a CC El Tesoro, 12.8 min a Club El Rodeo",
      "Vel. corredor Las Palmas PM: 37.4 km/h (MEData, 64,285 obs.)",
    ],
    demandEstimate: 134873,
    avgM2Price: 225000000, // Catastro: Los Balsos avg
    driveTimeToHPTU: 32, // Mapbox Matrix: 31.8 min
    potViability: "ALTA (6/9) - Los Balsos: ICS=58.2, 132,161 m2 SPD, 16.7 pisos",
    dataSource: "Catastro (bp59-rj8r), POT (3ciz-tpgr), Lotes Potenciales (m4wi-nn8x), Mapbox Matrix API",
  },
  {
    id: "palmas-alto",
    name: "Las Palmas Alto",
    subtitle: "Alto de Las Palmas - Santa Elena (Corregimiento)",
    coordinates: [-75.5260, 6.1920],
    score: 58,
    scores: {
      accesibilidad: 42,
      demanda: 52,
      competencia: 90,
      valorInmobiliario: 62,
    },
    color: "#f59e0b",
    description:
      "Zona alta del corredor, corregimiento Santa Elena. Catastro registra 422 predios E6 en Santa Elena con avaluos significativamente menores. Mapbox Matrix: 57.1 min a HPTU Prado, 42.3 min a Cl. Las Vegas — tiempos que penalizan severamente la accesibilidad. MEData Vel. Tiempo Viaje registra caida de velocidad a 36.1 km/h en hora PM (17:00) en Av. Las Palmas. Sin embargo, competencia nula en el radio.",
    highlights: [
      "Mapbox Matrix: 57.1 min a HPTU (el mas alto de todas las zonas)",
      "MEData: Velocidad Las Palmas cae a 36.1 km/h a las 17:00",
      "Catastro Santa Elena: 422 predios E6, avaluos menores",
      "Competencia nula: 0 IPS de alta complejidad en 8 km (REPS)",
      "POT: Suelo rural con restricciones para equipamiento",
    ],
    demandEstimate: 18500,
    avgM2Price: 165000000,
    driveTimeToHPTU: 57, // Mapbox Matrix: 57.1 min
    potViability: "RESTRINGIDA - Suelo rural corregimiento, requiere concepto especial",
    dataSource: "Catastro (bp59-rj8r), REPS (b4dp-ximh), MEData Velocidades (7t5n-3b3w), Mapbox Matrix API",
  },
  {
    id: "envigado",
    name: "Envigado - Zuniga",
    subtitle: "Expansion Sur (Municipio de Envigado)",
    coordinates: [-75.5780, 6.1680],
    score: 74,
    scores: {
      accesibilidad: 75,
      demanda: 80,
      competencia: 62,
      valorInmobiliario: 74,
    },
    color: "#3b82f6",
    description:
      "Municipio de Envigado, sector Zuniga. DANE CNPV 2018 registra 210,705 habitantes; proyeccion 2026: ~246,874. REPS identifica 109 IPS en Envigado, con el ESE Hospital Manuel Uribe Angel (coords: 6.167, -75.580) como referente publico. Mapbox Matrix: 22.4 min a HPTU, 14.2 min a Cl. Las Vegas. Autopista Sur registra 45.6 km/h promedio (MEData). Menor competencia en alta complejidad vs El Poblado.",
    highlights: [
      "DANE CNPV 2018: 210,705 hab. Envigado; proy. 2026: 246,874",
      "REPS: 109 IPS en Envigado, ESE Hospital Manuel Uribe Angel",
      "Mapbox Matrix: 14.2 min a Cl. Las Vegas, 22.4 min a HPTU",
      "MEData: Autopista Sur avg 45.6 km/h, AM 43.2 km/h, PM 43.6 km/h",
      "EPM: Envigado no reporta desglose E5/E6 en datos abiertos",
    ],
    demandEstimate: 210705, // DANE CNPV 2018
    avgM2Price: 180000000,
    driveTimeToHPTU: 22, // Mapbox Matrix: 22.4 min
    potViability: "Requiere revision POT Envigado (municipio autonomo)",
    dataSource: "DANE CNPV 2018 (evm3-92yw), REPS (b4dp-ximh), ESE coords (pi36-fdpk), MEData Velocidades, Mapbox Matrix API",
  },
  {
    id: "nuevo-poblado",
    name: "Nuevo Poblado - Itagui",
    subtitle: "Oportunidad Estrategica (Autopista Sur / Itagui Norte)",
    coordinates: [-75.5920, 6.1950],
    score: 67,
    scores: {
      accesibilidad: 82,
      demanda: 68,
      competencia: 52,
      valorInmobiliario: 58,
    },
    color: "#8b5cf6",
    description:
      "Zona sobre Autopista Sur en el limite Medellin-Itagui. DANE CNPV 2018: Itagui 240,828 hab. Mapbox Matrix: mejor tiempo a HPTU de todas las zonas (19.0 min) y 10.3 min a Cl. Las Vegas. REPS registra 66 IPS en Itagui, ESE H. San Rafael (6.171, -75.613) y H. del Sur Gabriel Jaramillo (6.165, -75.621). MEData aforos: Autopista Sur maneja los flujos mas altos del area (5,200+ veh/h AM). Catastro Medellin no cubre Itagui (municipio autonomo).",
    highlights: [
      "Mapbox Matrix: 19.0 min a HPTU (MEJOR de las 5 zonas) y 10.3 min a Cl. Las Vegas",
      "DANE CNPV 2018: Itagui 240,828 hab; Sabaneta 73,838 hab",
      "REPS: 66 IPS Itagui + 49 IPS Sabaneta en area de influencia",
      "MEData: Autopista Sur 45.6 km/h, mayor flujo vehicular del sur",
      "Valor suelo significativamente menor (oportunidad tipo Ciudad del Rio)",
    ],
    demandEstimate: 240828, // DANE CNPV 2018 Itagüí
    avgM2Price: 130000000,
    driveTimeToHPTU: 19, // Mapbox Matrix: 19.0 min
    potViability: "En transformacion - Requiere revision POT Itagui",
    dataSource: "DANE CNPV 2018 (evm3-92yw), REPS (b4dp-ximh), ESE coords (pi36-fdpk), MEData Velocidades, Mapbox Matrix API",
  },
];
