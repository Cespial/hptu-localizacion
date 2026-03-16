#!/usr/bin/env node
// ---------------------------------------------------------------
// Ingest BDUA Contributivo por EPS from datos.gov.co (tq4m-hmg2)
// Extracts: afiliados contributivo por EPS por municipio
// Scope: 7 municipios del catchment Oriente
// Output: data/processed/bdua-eps-catchment.json
// Fallback: data/raw/aseguramiento_salud_oriente_antioqueno.json
// ---------------------------------------------------------------

const fs = require("fs");
const path = require("path");

const DATASET_ID = "tq4m-hmg2";
const BASE_URL = `https://www.datos.gov.co/resource/${DATASET_ID}.json`;

// 7 municipios Oriente catchment (DANE codes)
const CATCHMENT = {
  "05615": { name: "Rionegro", population: 135100 },
  "05318": { name: "Guarne", population: 49300 },
  "05440": { name: "Marinilla", population: 64100 },
  "05376": { name: "La Ceja", population: 68900 },
  "05607": { name: "El Retiro", population: 24000 },
  "05148": { name: "El Carmen de Viboral", population: 62600 },
  "05697": { name: "El Santuario", population: 35200 },
};

const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "data",
  "processed",
  "bdua-eps-catchment.json"
);
const FALLBACK_PATH = path.join(
  __dirname,
  "..",
  "data",
  "raw",
  "aseguramiento_salud_oriente_antioqueno.json"
);

async function fetchFromAPI() {
  const daneCodes = Object.keys(CATCHMENT);
  const whereClause = daneCodes
    .map((c) => `codmunicipio='${c}'`)
    .join(" OR ");

  const url = `${BASE_URL}?$where=${encodeURIComponent(
    whereClause
  )}&$limit=5000&coddepto=05`;

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

function normalizeDaneCode(code) {
  return (code || "").trim().padStart(5, "0");
}

function processRecords(records) {
  // Group by municipality
  const byMunicipio = {};

  for (const rec of records) {
    const daneCode = normalizeDaneCode(rec.codmunicipio);
    if (!CATCHMENT[daneCode]) continue;

    const regimen = (rec.idregimen || "").toUpperCase().trim();
    const cantidad = parseInt(rec.numpersonas || rec.cantidad || "0", 10);
    if (isNaN(cantidad) || cantidad <= 0) continue;

    if (!byMunicipio[daneCode]) {
      byMunicipio[daneCode] = {
        name: CATCHMENT[daneCode].name,
        population: CATCHMENT[daneCode].population,
        contributivo: 0,
        subsidiado: 0,
        especial: 0,
        epsByRegimen: {},
      };
    }

    const m = byMunicipio[daneCode];

    if (regimen === "C") {
      m.contributivo += cantidad;
    } else if (regimen === "S") {
      m.subsidiado += cantidad;
    } else if (regimen === "E") {
      m.especial += cantidad;
    }

    // Track EPS breakdown if available
    const epsName = (rec.entidad || rec.eps || "").trim();
    if (epsName) {
      const key = `${regimen}:${epsName}`;
      m.epsByRegimen[key] = (m.epsByRegimen[key] || 0) + cantidad;
    }
  }

  // Build output with computed ratios
  const municipios = [];
  let totalContributivo = 0;
  let totalSubsidiado = 0;
  let totalPopulation = 0;

  for (const [daneCode, info] of Object.entries(CATCHMENT)) {
    const data = byMunicipio[daneCode] || {
      name: info.name,
      population: info.population,
      contributivo: 0,
      subsidiado: 0,
      especial: 0,
      epsByRegimen: {},
    };

    const totalAfiliados = data.contributivo + data.subsidiado + data.especial;
    const pctContributivo =
      totalAfiliados > 0
        ? +((data.contributivo / totalAfiliados) * 100).toFixed(1)
        : 0;
    const pctSubsidiado =
      totalAfiliados > 0
        ? +((data.subsidiado / totalAfiliados) * 100).toFixed(1)
        : 0;
    const coverageRate =
      data.population > 0
        ? +((totalAfiliados / data.population) * 100).toFixed(1)
        : 0;

    // Extract top EPS for contributivo
    const epsContrib = {};
    for (const [key, val] of Object.entries(data.epsByRegimen)) {
      if (key.startsWith("C:")) {
        const epsName = key.substring(2);
        epsContrib[epsName] = (epsContrib[epsName] || 0) + val;
      }
    }
    const topEPS = Object.entries(epsContrib)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        afiliados: count,
        pct: +((count / (data.contributivo || 1)) * 100).toFixed(1),
      }));

    municipios.push({
      daneCode,
      name: data.name,
      population: data.population,
      contributivo: data.contributivo,
      subsidiado: data.subsidiado,
      especial: data.especial,
      totalAfiliados,
      pctContributivo,
      pctSubsidiado,
      coverageRate,
      ratioContribSubsid: +(
        data.contributivo / Math.max(data.subsidiado, 1)
      ).toFixed(2),
      topEPS,
    });

    totalContributivo += data.contributivo;
    totalSubsidiado += data.subsidiado;
    totalPopulation += data.population;
  }

  // Sort by contributivo descending
  municipios.sort((a, b) => b.contributivo - a.contributivo);

  return {
    metadata: {
      source: `datos.gov.co/${DATASET_ID}`,
      description:
        "BDUA afiliados por EPS por municipio — catchment Oriente Antioqueno",
      generatedAt: new Date().toISOString(),
      recordsProcessed: records.length,
    },
    municipios,
    catchmentSummary: {
      totalContributivo,
      totalSubsidiado,
      totalPopulation,
      pctContributivo: +(
        (totalContributivo / (totalContributivo + totalSubsidiado)) *
        100
      ).toFixed(1),
      ratioContribSubsid: +(totalContributivo / totalSubsidiado).toFixed(2),
      avgCoverageRate: +(
        ((totalContributivo + totalSubsidiado) / totalPopulation) *
        100
      ).toFixed(1),
    },
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
    `  Total contributivo: ${output.catchmentSummary.totalContributivo.toLocaleString()}`
  );
  console.log(
    `  Total subsidiado: ${output.catchmentSummary.totalSubsidiado.toLocaleString()}`
  );
  console.log(
    `  Ratio C/S: ${output.catchmentSummary.ratioContribSubsid}`
  );
}

main();
