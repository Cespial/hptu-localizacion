#!/usr/bin/env node
// ---------------------------------------------------------------
// Ingest IPS Capacidad Instalada from datos.gov.co (s2ru-bqt6)
// Extracts: camas, consultorios, quirófanos per municipio
// Scope: 7 municipios Oriente + Medellín (benchmark)
// Output: data/processed/ips-capacity-catchment.json
// Fallback: data/raw/reps_oriente_capacidad.json
// ---------------------------------------------------------------

const fs = require("fs");
const path = require("path");

const DATASET_ID = "s2ru-bqt6";
const BASE_URL = `https://www.datos.gov.co/resource/${DATASET_ID}.json`;

// 7 Oriente municipios + Medellín benchmark
const MUNICIPIOS = {
  RIONEGRO: { daneCode: "05615", population: 135100 },
  GUARNE: { daneCode: "05318", population: 49300 },
  MARINILLA: { daneCode: "05440", population: 64100 },
  "LA CEJA": { daneCode: "05376", population: 68900 },
  "EL RETIRO": { daneCode: "05607", population: 24000 },
  "EL CARMEN DE VIBORAL": { daneCode: "05148", population: 62600 },
  "EL SANTUARIO": { daneCode: "05697", population: 35200 },
  "MEDELLÍN": { daneCode: "05001", population: 2533424 },
};

// OMS recommended minimums per 1,000 inhabitants
const OMS_STANDARDS = {
  camas: 2.5, // beds per 1,000
  consultorios: 1.0, // outpatient rooms per 1,000
  quirofanos: 0.04, // operating rooms per 1,000
};

const CAPACITY_GROUPS = {
  CAMAS: "camas",
  CONSULTORIOS: "consultorios",
  SALAS: "salas",
  QUIROFANOS: "quirofanos",
  AMBULANCIAS: "ambulancias",
};

const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "data",
  "processed",
  "ips-capacity-catchment.json"
);
const FALLBACK_PATH = path.join(
  __dirname,
  "..",
  "data",
  "raw",
  "reps_oriente_capacidad.json"
);

async function fetchFromAPI() {
  const municipioNames = Object.keys(MUNICIPIOS);
  const whereClause = municipioNames
    .map((m) => `upper(municipio)='${m}'`)
    .join(" OR ");

  const url = `${BASE_URL}?$where=${encodeURIComponent(
    whereClause
  )}&$limit=5000&departamento=Antioquia`;

  console.log(`Fetching from datos.gov.co (${DATASET_ID})...`);
  console.log(`URL: ${url.substring(0, 120)}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API responded ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Received ${data.length} records from API`);
  return data;
}

function loadFallback() {
  console.log(`API failed, loading fallback: ${FALLBACK_PATH}`);
  if (!fs.existsSync(FALLBACK_PATH)) {
    throw new Error(`Fallback file not found: ${FALLBACK_PATH}`);
  }
  const raw = fs.readFileSync(FALLBACK_PATH, "utf-8");
  return JSON.parse(raw);
}

function normalizeGroupName(group) {
  const upper = (group || "").toUpperCase().trim();
  if (upper.includes("CAMA")) return "camas";
  if (upper.includes("CONSULTORIO")) return "consultorios";
  if (upper.includes("QUIR")) return "quirofanos";
  if (upper.includes("SALA")) return "salas";
  if (upper.includes("AMBULANCIA")) return "ambulancias";
  return "otros";
}

function normalizeMunicipioName(name) {
  const upper = (name || "").toUpperCase().trim();
  // Handle accented chars
  const normalized = upper
    .replace(/É/g, "E")
    .replace(/Ó/g, "O")
    .replace(/Á/g, "A")
    .replace(/Í/g, "I")
    .replace(/Ú/g, "U")
    .replace(/Ñ/g, "N");

  // Map to canonical names
  for (const canonical of Object.keys(MUNICIPIOS)) {
    const canonNorm = canonical
      .replace(/É/g, "E")
      .replace(/Ó/g, "O")
      .replace(/Á/g, "A")
      .replace(/Í/g, "I")
      .replace(/Ú/g, "U")
      .replace(/Ñ/g, "N");
    if (normalized === canonNorm || normalized.includes(canonNorm)) {
      return canonical;
    }
  }

  // Special cases
  if (normalized.includes("RETIRO")) return "EL RETIRO";
  if (normalized.includes("CARMEN")) return "EL CARMEN DE VIBORAL";
  if (normalized.includes("SANTUARIO")) return "EL SANTUARIO";
  if (normalized.includes("CEJA")) return "LA CEJA";
  if (normalized.includes("MEDELLIN")) return "MEDELLÍN";

  return null; // not in our catchment
}

function processRecords(records) {
  // Aggregate capacity by municipality and group
  const aggregated = {};

  for (const rec of records) {
    const municipio = normalizeMunicipioName(rec.municipio);
    if (!municipio) continue;

    const group = normalizeGroupName(
      rec.nom_grupo_capacidad || rec.grupo_capacidad || ""
    );
    const quantity = parseInt(rec.num_cantidad_capacidad_instalada || "0", 10);
    if (isNaN(quantity)) continue;

    if (!aggregated[municipio]) {
      aggregated[municipio] = {
        camas: 0,
        consultorios: 0,
        quirofanos: 0,
        salas: 0,
        ambulancias: 0,
        otros: 0,
        ipsCount: new Set(),
      };
    }

    aggregated[municipio][group] =
      (aggregated[municipio][group] || 0) + quantity;
    if (rec.c_digo_prestador || rec.codigo_prestador) {
      aggregated[municipio].ipsCount.add(
        rec.c_digo_prestador || rec.codigo_prestador
      );
    }
  }

  // Build output with per-capita ratios and OMS gap
  const result = [];
  const orienteTotal = {
    camas: 0,
    consultorios: 0,
    quirofanos: 0,
    population: 0,
  };

  for (const [name, info] of Object.entries(MUNICIPIOS)) {
    const data = aggregated[name] || {
      camas: 0,
      consultorios: 0,
      quirofanos: 0,
      salas: 0,
      ambulancias: 0,
      otros: 0,
      ipsCount: new Set(),
    };

    const pop = info.population;
    const camasPer1000 = +((data.camas / pop) * 1000).toFixed(2);
    const consultoriosPer1000 = +((data.consultorios / pop) * 1000).toFixed(2);
    const quirofanosPer1000 = +((data.quirofanos / pop) * 1000).toFixed(4);

    const entry = {
      municipio: name,
      daneCode: info.daneCode,
      population: pop,
      camas: data.camas,
      consultorios: data.consultorios,
      quirofanos: data.quirofanos,
      salas: data.salas,
      ambulancias: data.ambulancias,
      ipsCount: data.ipsCount.size,
      // Per capita ratios
      camasPer1000,
      consultoriosPer1000,
      quirofanosPer1000,
      // Gap vs OMS
      gapCamas: +(OMS_STANDARDS.camas - camasPer1000).toFixed(2),
      gapConsultorios: +(
        OMS_STANDARDS.consultorios - consultoriosPer1000
      ).toFixed(2),
      gapQuirofanos: +(
        OMS_STANDARDS.quirofanos - quirofanosPer1000
      ).toFixed(4),
      // Deficiency flag
      deficitCamas: camasPer1000 < OMS_STANDARDS.camas,
      deficitConsultorios: consultoriosPer1000 < OMS_STANDARDS.consultorios,
    };

    result.push(entry);

    // Accumulate Oriente totals (exclude Medellín)
    if (name !== "MEDELLÍN") {
      orienteTotal.camas += data.camas;
      orienteTotal.consultorios += data.consultorios;
      orienteTotal.quirofanos += data.quirofanos;
      orienteTotal.population += pop;
    }
  }

  // Compute Oriente aggregate ratios
  const orienteSummary = {
    totalCamas: orienteTotal.camas,
    totalConsultorios: orienteTotal.consultorios,
    totalQuirofanos: orienteTotal.quirofanos,
    totalPopulation: orienteTotal.population,
    camasPer1000: +(
      (orienteTotal.camas / orienteTotal.population) *
      1000
    ).toFixed(2),
    consultoriosPer1000: +(
      (orienteTotal.consultorios / orienteTotal.population) *
      1000
    ).toFixed(2),
    omsStandards: OMS_STANDARDS,
    gapCamas: +(
      OMS_STANDARDS.camas -
      (orienteTotal.camas / orienteTotal.population) * 1000
    ).toFixed(2),
  };

  return {
    metadata: {
      source: `datos.gov.co/${DATASET_ID}`,
      description: "IPS Capacidad Instalada — catchment Oriente + Medellín",
      generatedAt: new Date().toISOString(),
      recordsProcessed: records.length,
    },
    municipios: result,
    orienteSummary,
  };
}

async function main() {
  let records;

  try {
    records = await fetchFromAPI();
  } catch (err) {
    console.warn(`API fetch failed: ${err.message}`);
    try {
      records = loadFallback();
    } catch (fbErr) {
      console.error(`Fallback also failed: ${fbErr.message}`);
      process.exit(1);
    }
  }

  if (!records || records.length === 0) {
    console.warn("No records from API, trying fallback...");
    records = loadFallback();
  }

  const output = processRecords(records);

  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\nOutput written to: ${OUTPUT_PATH}`);
  console.log(`  Municipios: ${output.municipios.length}`);
  console.log(
    `  Oriente total camas: ${output.orienteSummary.totalCamas} (${output.orienteSummary.camasPer1000}/1000 hab)`
  );
  console.log(
    `  Oriente gap vs OMS (2.5/1000): ${output.orienteSummary.gapCamas} camas/1000`
  );
}

main();
