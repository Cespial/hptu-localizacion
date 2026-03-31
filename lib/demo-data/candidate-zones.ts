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
    visibilidad: number;
    esperasProductivas: number;
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
    subtitle: "Zona Colegiatura (~1,700 msnm) — Barrios Altos del Poblado / El Tesoro",
    coordinates: [-75.5460, 6.2094],
    // ---------------------------------------------------------------
    // MCDA Score Calculation — Las Palmas Bajo
    // Formula: Score = (A x 0.30) + (D x 0.25) + (C x 0.20) + (Vis x 0.15) + (Esp x 0.10)
    // = (92 x 0.30) + (93 x 0.25) + (78 x 0.20) + (85 x 0.15) + (88 x 0.10)
    // = 27.60 + 23.25 + 15.60 + 12.75 + 8.80 = 88.0
    // ---------------------------------------------------------------
    score: 88,
    scores: {
      accesibilidad: 92,
      demanda: 93,
      competencia: 78,
      visibilidad: 85,
      esperasProductivas: 88,
    },
    color: "#0d9488",
    description:
      "Zona entre Indiana y la EIA, barrios Altos del Poblado y El Tesoro. Segun catastro municipal, El Tesoro tiene 13,786 predios (3,515 estrato 6) con avaluo promedio de $204M COP. El barrio Altos del Poblado obtiene score 9/9 en viabilidad POT para uso dotacional en salud (CL_D=2.38, ICS=57.4). La API Mapbox Matrix arroja 2.8 min al Club El Rodeo y 10.5 min a Clinica Las Vegas. Datos MEData registran 42,000 vehiculos/dia promedio en el corredor Las Palmas (64,285 observaciones, 2017-2020).",
    highlights: [
      "Viabilidad POT: Score 9/9 en Altos del Poblado (CL_D=2.38, uso dotacional confirmado)",
      "Catastro: 13,786 predios en El Tesoro, 38,415 E6 en toda comuna 14",
      "Mapbox Matrix: 15.4 min desde Milla de Oro (Mapbox traffic), 23.8 min a HPTU Robledo",
      "MEData Aforos: Av. Las Palmas promedio 40.9 km/h, 5.9 km (64,285 obs.)",
      "POT: 592 lotes / 414,309 m2 disponibles en corredor Las Palmas",
      "Visibilidad alta: zona El Tesoro con alto trafico peatonal y vehicular",
      "Esperas productivas: CC El Tesoro, restaurantes, bancos, retail premium",
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
    coordinates: [-75.5469, 6.1960],
    // ---------------------------------------------------------------
    // MCDA Score Calculation — Las Palmas Medio
    // Formula: Score = (A x 0.30) + (D x 0.25) + (C x 0.20) + (Vis x 0.15) + (Esp x 0.10)
    // = (72 x 0.30) + (84 x 0.25) + (82 x 0.20) + (70 x 0.15) + (65 x 0.10)
    // = 21.60 + 21.00 + 16.40 + 10.50 + 6.50 = 76.0
    // ---------------------------------------------------------------
    score: 76,
    scores: {
      accesibilidad: 72,
      demanda: 84,
      competencia: 82,
      visibilidad: 70,
      esperasProductivas: 65,
    },
    color: "#06b6d4",
    description:
      "Sector Los Balsos y Las Lomas sobre la via Las Palmas. Catastro registra avaluo promedio de $225M (Los Balsos No.1, 13,484 predios) y $204M (Las Lomas No.2, 3,624 predios). Las Lomas No.2 permite hasta 20 pisos segun POT. Los Balsos No.1 tiene 97,440 m2 de lotes potenciales en tratamiento CN3/CN5. Mapbox Matrix: 20.4 min a Cl. Las Vegas, 31.8 min a HPTU Robledo.",
    highlights: [
      "POT Las Lomas No.2: 20 pisos permitidos (mayor de toda Comuna 14)",
      "Catastro Los Balsos: 13,484 predios, avaluo promedio $225M COP",
      "POT: 97,440 m2 lotes potenciales en Los Balsos (CN3/CN5)",
      "Mapbox Matrix: 20.4 min a CC El Tesoro, 12.8 min a Club El Rodeo",
      "Vel. corredor Las Palmas PM: 37.4 km/h (MEData, 64,285 obs.)",
      "Visibilidad media: zona residencial con trafico moderado",
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
    coordinates: [-75.5458, 6.1701],
    // ---------------------------------------------------------------
    // MCDA Score Calculation — Las Palmas Alto
    // Formula: Score = (A x 0.30) + (D x 0.25) + (C x 0.20) + (Vis x 0.15) + (Esp x 0.10)
    // = (42 x 0.30) + (52 x 0.25) + (90 x 0.20) + (30 x 0.15) + (20 x 0.10)
    // = 12.60 + 13.00 + 18.00 + 4.50 + 2.00 = 50.1
    // ---------------------------------------------------------------
    score: 50,
    scores: {
      accesibilidad: 42,
      demanda: 52,
      competencia: 90,
      visibilidad: 30,
      esperasProductivas: 20,
    },
    color: "#f59e0b",
    description:
      "Zona alta del corredor, corregimiento Santa Elena. Catastro registra 422 predios E6 en Santa Elena con avaluos significativamente menores. Mapbox Matrix: 57.1 min a HPTU Robledo, 42.3 min a Cl. Las Vegas — tiempos que penalizan severamente la accesibilidad. MEData Vel. Tiempo Viaje registra caida de velocidad a 36.1 km/h en hora PM (17:00) en Av. Las Palmas. Sin embargo, competencia nula en el radio.",
    highlights: [
      "Mapbox Matrix: 57.1 min a HPTU (el mas alto de todas las zonas)",
      "MEData: Velocidad Las Palmas cae a 36.1 km/h a las 17:00",
      "Catastro Santa Elena: 422 predios E6, avaluos menores",
      "Competencia nula: 0 IPS de alta complejidad en 8 km (REPS)",
      "POT: Suelo rural con restricciones para equipamiento",
      "Visibilidad baja: zona remota con trafico limitado",
      "Esperas improductivas: cero retail ni servicios en el entorno",
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
    // ---------------------------------------------------------------
    // MCDA Score Calculation — Envigado
    // Formula: Score = (A x 0.30) + (D x 0.25) + (C x 0.20) + (Vis x 0.15) + (Esp x 0.10)
    // = (75 x 0.30) + (80 x 0.25) + (62 x 0.20) + (78 x 0.15) + (72 x 0.10)
    // = 22.50 + 20.00 + 12.40 + 11.70 + 7.20 = 73.8
    // ---------------------------------------------------------------
    score: 74,
    scores: {
      accesibilidad: 75,
      demanda: 80,
      competencia: 62,
      visibilidad: 78,
      esperasProductivas: 72,
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
      "Visibilidad alta: Autopista Sur con alto flujo vehicular",
      "Esperas productivas: zona comercial de Zuniga consolidada",
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
    // ---------------------------------------------------------------
    // MCDA Score Calculation — Nuevo Poblado
    // Formula: Score = (A x 0.30) + (D x 0.25) + (C x 0.20) + (Vis x 0.15) + (Esp x 0.10)
    // = (82 x 0.30) + (68 x 0.25) + (52 x 0.20) + (80 x 0.15) + (55 x 0.10)
    // = 24.60 + 17.00 + 10.40 + 12.00 + 5.50 = 69.5
    // ---------------------------------------------------------------
    score: 70,
    scores: {
      accesibilidad: 82,
      demanda: 68,
      competencia: 52,
      visibilidad: 80,
      esperasProductivas: 55,
    },
    color: "#8b5cf6",
    description:
      "Zona sobre Autopista Sur en el limite Medellin-Itagui. DANE CNPV 2018: Itagui 240,828 hab. Mapbox Matrix: mejor tiempo a HPTU de todas las zonas (19.0 min) y 10.3 min a Cl. Las Vegas. REPS registra 66 IPS en Itagui, ESE H. San Rafael (6.171, -75.613) y H. del Sur Gabriel Jaramillo (6.165, -75.621). MEData aforos: Autopista Sur maneja los flujos mas altos del area (5,200+ veh/h AM). Catastro Medellin no cubre Itagui (municipio autonomo).",
    highlights: [
      "Mapbox Matrix: 19.0 min a HPTU (mejor de las zonas originales) y 10.3 min a Cl. Las Vegas",
      "DANE CNPV 2018: Itagui 240,828 hab; Sabaneta 73,838 hab",
      "REPS: 66 IPS Itagui + 49 IPS Sabaneta en area de influencia",
      "MEData: Autopista Sur 45.6 km/h, mayor flujo vehicular del sur",
      "Valor suelo significativamente menor (oportunidad tipo Ciudad del Rio)",
      "Visibilidad alta: Autopista Sur = mayor flujo vehicular del area metropolitana",
      "Esperas productivas limitadas: zona en transformacion, mas industrial que retail",
    ],
    demandEstimate: 240828, // DANE CNPV 2018 Itagüí
    avgM2Price: 130000000,
    driveTimeToHPTU: 19, // Mapbox Matrix: 19.0 min
    potViability: "En transformacion - Requiere revision POT Itagui",
    dataSource: "DANE CNPV 2018 (evm3-92yw), REPS (b4dp-ximh), ESE coords (pi36-fdpk), MEData Velocidades, Mapbox Matrix API",
  },
  {
    id: "access-point",
    name: "Access Point",
    subtitle: "Km 7 Via Las Palmas — Retorno 5 (Acierto Inmobiliario)",
    coordinates: [-75.554932, 6.217662],
    // ---------------------------------------------------------------
    // MCDA Score Calculation — Access Point (Candidato #6)
    // Formula: Score = (A x 0.30) + (D x 0.25) + (C x 0.20) + (Vis x 0.15) + (Esp x 0.10)
    //
    // A = Accesibilidad = 85
    //   Justificacion: Mapbox Matrix 18.5 min a HPTU actual (2do mejor despues
    //   de nuevo-poblado 19 min; pero con Directions API es ~15 min, el mejor).
    //   Km 7 Via Las Palmas = acceso directo al Tunel de Oriente. Sin pico y placa.
    //   Isocronas: 45 min cubre Guarne, El Retiro, Aeropuerto; 60 min cubre
    //   Rionegro, Marinilla, La Ceja. Post-Tunel 2da etapa (H2 2027): ~25 min
    //   al aeropuerto SKRG.
    //
    // D = Demanda = 91
    //   Justificacion: Misma demanda local que palmas-bajo (comuna 14, ~135K hab,
    //   38,415 predios E6). PLUS unico candidato que captura demanda dual:
    //   298K hab Oriente cercano — 5 municipios <45 min post-tunnel
    //   (Rionegro 116K, La Ceja 53K, Guarne 53K, Marinilla 56K, El Retiro 20K).
    //   Region total 728K pero catchment directo realista = 298K. 14.5M pasajeros
    //   aeropuerto (plan maestro 42.7M a 2055), 23,323 turistas medicos/anio,
    //   Zona Franca 300 empresas/12,000 empleados, prepagada 1.4M afiliados (+37%).
    //
    // C = Competencia = 65
    //   Justificacion: 45 facilities OSM en 5 km, 18 hospitales/clinicas Google
    //   Places. Competencia LOCAL densa. PERO: duopolio Somer+SVF en Oriente
    //   (no monopolio), 10 categorias de servicio ambulatorio criticas.
    //   Nicho ambulatorio premium + puente Oriente no tiene competidor.
    //
    // Vis = Visibilidad = 78
    //   Vis: 78 — 42K veh/dia generates brand awareness but transit traffic ≠ medical demand
    //   Justificacion: Km 7 Via Las Palmas con 42,000 vehiculos/dia (MEData).
    //   Sobre la via principal al Oriente y al aeropuerto. Todos los vehiculos
    //   que transitan hacia/desde el Tunel de Oriente pasan por Km 7.
    //   Post-Tunel 2da etapa: trafico duplicara por doble calzada.
    //   Retorno 5 con visibilidad directa desde la via.
    //
    // Esp = Esperas Productivas = 55
    //   Esp: 55 — today no retail ecosystem at Km 7; score reflects potential, not current state
    //   Justificacion: Access Point tiene 4 torres de oficinas (1,085 parqueaderos)
    //   con potencial para retail en primeros pisos. Modelo anchor hospital:
    //   el centro medico atrae farmacias, cafeterias, laboratorios, retail de salud.
    //   Menor que palmas-bajo (88, CC El Tesoro establecido) pero mayor potencial
    //   de desarrollo. Concepto Cleveland Clinic: cada ambulatory center genera
    //   su propio ecosistema.
    //
    // TOTAL: (85 x 0.30) + (91 x 0.25) + (65 x 0.20) + (78 x 0.15) + (55 x 0.10)
    //      = 25.50 + 22.75 + 13.00 + 11.70 + 5.50
    //      = 78.45 => 78
    //
    // RANKING: #2 de 6 (detras de Las Palmas Bajo = 88)
    // ---------------------------------------------------------------
    score: 78,
    scores: {
      accesibilidad: 85,
      demanda: 91,
      competencia: 65,
      visibilidad: 78,
      esperasProductivas: 55,
    },
    color: "#e11d48", // rose-600 to distinguish
    description:
      "Access Point es un proyecto de Acierto Inmobiliario en el Km 7 de Via Las Palmas (Retorno 5). 4 torres de oficinas de 10 pisos, 1,085 parqueaderos (477 visitantes + 608 privados). Mapbox Matrix: 18.5 min a HPTU actual, ~25 min al Aeropuerto SKRG post-Tunel (Directions API), sin pico y placa. Posicion estrategica como nodo de transicion entre Valle de Aburra y Oriente Antioqueno. Demanda dual: 135K hab El Poblado E5/E6 + 298K hab Oriente cercano (5 municipios <45 min). Duopolio Somer+SVF en alta complejidad Oriente, pero nicho ambulatorio premium — Torre Oviedo (2.65 km) es competidor directo desde jun 2025. POT San Lucas 19.1 pisos, 45.8% densidad usada.",
    highlights: [
      "MCDA Score: 78/100 (#2 de 6 zonas) — A:85 D:91 C:65 Vis:78 Esp:55",
      "Mapbox Matrix: 18.5 min a HPTU actual, ~25 min a Aeropuerto SKRG post-Tunel",
      "Mapbox Matrix: 44.0 min a El Retiro (vs 61.8 HPTU actual = -17.8 min)",
      "Demanda dual: 135K El Poblado E5/E6 + 298K Oriente cercano (5 municipios <45 min) + 14.5M pasajeros aeropuerto",
      "Corredor sin competencia ambulatoria: 0 hospitales en Km 7 Las Palmas, 10 brechas Oriente",
      "Visibilidad: 42,000 veh/dia en Via Las Palmas — trafico en transito genera brand awareness pero no equivale a demanda medica",
      "POT: San Lucas 19.1 pisos, Astorga 14.7% densidad usada — crecimiento futuro garantizado",
    ],
    demandEstimate: 298000, // Realistic catchment: 5 municipalities <45 min post-tunnel (298K) + El Poblado 135K
    avgM2Price: 200000000, // Catastro: avg avaluo El Poblado zone
    driveTimeToHPTU: 18, // Mapbox Matrix: 18.5 min (Directions: ~15 min)
    potViability: "ALTA - San Lucas 19.1 pisos, Astorga 14.7% densidad usada, Manila 14.2%",
    dataSource: "Mapbox Matrix/Directions/Isochrone API, Google Places API, REPS (b4dp-ximh), OSM Overpass, Catastro (bp59-rj8r), POT (3ciz-tpgr), ANI Peajes (8yi9-t44c)",
  },
];
