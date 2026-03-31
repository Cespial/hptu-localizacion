#!/usr/bin/env node
/**
 * ingest-oriente-strata.js
 * ---------------------------------------------------------------
 * Intenta obtener datos de estratificacion para el Oriente Antioqueno
 * desde datos.gov.co. Si no hay dataset directo, usa proxy basado
 * en afiliacion contributiva + dato de Rionegro (Decreto 096/2021).
 *
 * Datasets explorados (marzo 2026):
 * 1. CNPV 2018 (evm3-92yw) — NO tiene campo de estrato
 * 2. EPM Subsidios (av6t-m6ju) — Solo tarifas, no conteos
 * 3. EPM Acueducto (nfrm-mmfe) — Solo tarifas, no conteos
 * 4. SUI Historico Consumo (cuit-be64) — Solo Empocaldas (Caldas), no Antioquia
 * 5. SISBEN Vivienda (np8m-kdhq) — No tiene estrato catastral
 *
 * Conclusion: No existe dataset directo. Se usa proxy contributivo.
 * ---------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const DATOS_GOV_TOKEN = process.env.DATOS_GOV_TOKEN || '';
const BASE_URL = 'https://www.datos.gov.co/resource';

// Rionegro dato directo (Decreto 096/2021, DiariOriente)
const RIONEGRO_DIRECTO = {
  municipio: 'Rionegro',
  totalViviendas: 44805,
  estratos: { E1: 1879, E2: 7221, E3: 16853, E4: 15633, E5: 2723, E6: 496 },
  fuente: 'Decreto 096/2021 Rionegro, DiariOriente',
  pctE4Plus: 42.1, // (15633+2723+496)/44805 * 100
};

// RUAF Aseguramiento Oriente (datos ya en oriente-data.ts)
const ORIENTE_CONTRIBUTIVO = [
  { municipio: 'Rionegro', contributivo: 69432, subsidiado: 56978 },
  { municipio: 'La Ceja', contributivo: 26920, subsidiado: 25432 },
  { municipio: 'El Retiro', contributivo: 10845, subsidiado: 8260 },
  { municipio: 'Guarne', contributivo: 22100, subsidiado: 29430 },
  { municipio: 'Marinilla', contributivo: 22900, subsidiado: 32780 },
  { municipio: 'El Santuario', contributivo: 8450, subsidiado: 18920 },
  { municipio: 'El Carmen de Viboral', contributivo: 15200, subsidiado: 33100 },
  { municipio: 'El Penol', contributivo: 4830, subsidiado: 11980 },
  { municipio: 'San Vicente Ferrer', contributivo: 3950, subsidiado: 14320 },
  { municipio: 'La Union', contributivo: 6200, subsidiado: 13050 },
  { municipio: 'Sonson', contributivo: 8900, subsidiado: 26800 },
];

async function tryDatosGov(datasetId, params) {
  const url = new URL(`${BASE_URL}/${datasetId}.json`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const headers = {};
  if (DATOS_GOV_TOKEN) {
    headers['X-App-Token'] = DATOS_GOV_TOKEN;
  }

  try {
    const res = await fetch(url.toString(), { headers });
    const data = await res.json();
    return { ok: !data.error, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('=== Ingest Oriente Strata ===\n');

  // Attempt 1: CNPV 2018 microdatos
  console.log('1. CNPV 2018 (evm3-92yw)...');
  const cnpv = await tryDatosGov('evm3-92yw', { '$limit': '2', '$select': '*' });
  if (cnpv.ok && cnpv.data.length > 0) {
    const cols = Object.keys(cnpv.data[0]);
    const hasEstrato = cols.some(c => c.toLowerCase().includes('estrato'));
    console.log(`   Columns: ${cols.join(', ')}`);
    console.log(`   Has estrato field: ${hasEstrato}`);
    if (!hasEstrato) {
      console.log('   SKIP: No tiene campo de estrato\n');
    }
  } else {
    console.log('   SKIP: Dataset no accesible o vacio\n');
  }

  // Attempt 2: EPM Subsidios
  console.log('2. EPM Subsidios (av6t-m6ju)...');
  const epm = await tryDatosGov('av6t-m6ju', {
    '$limit': '5',
    '$where': "municipio_o_sector='Rionegro' AND estrato='4'"
  });
  if (epm.ok) {
    console.log(`   Records for Rionegro E4: ${epm.data.length}`);
    if (epm.data.length > 0) {
      console.log(`   Fields: ${Object.keys(epm.data[0]).join(', ')}`);
      console.log('   NOTE: Solo contiene tarifas, NO conteos de suscriptores');
    }
  }
  console.log('   SKIP: Solo tarifas, no conteos\n');

  // Fallback: Proxy basado en contributivo + Rionegro
  console.log('3. FALLBACK: Proxy contributivo + dato Rionegro\n');

  const rioRatio = RIONEGRO_DIRECTO.pctE4Plus /
    (ORIENTE_CONTRIBUTIVO[0].contributivo /
     (ORIENTE_CONTRIBUTIVO[0].contributivo + ORIENTE_CONTRIBUTIVO[0].subsidiado) * 100);

  console.log(`   Rionegro E4+ = ${RIONEGRO_DIRECTO.pctE4Plus}%`);
  console.log(`   Rionegro contributivo = ${(ORIENTE_CONTRIBUTIVO[0].contributivo / (ORIENTE_CONTRIBUTIVO[0].contributivo + ORIENTE_CONTRIBUTIVO[0].subsidiado) * 100).toFixed(1)}%`);
  console.log(`   Ratio E4+/contributivo = ${rioRatio.toFixed(3)}\n`);

  const results = ORIENTE_CONTRIBUTIVO.map(m => {
    const total = m.contributivo + m.subsidiado;
    const pctContrib = (m.contributivo / total * 100);
    const proxyE4Plus = m.municipio === 'Rionegro'
      ? RIONEGRO_DIRECTO.estratos.E4 + RIONEGRO_DIRECTO.estratos.E5 + RIONEGRO_DIRECTO.estratos.E6
      : Math.round(pctContrib * rioRatio * total / 100 * 0.35); // factor viviendas/poblacion

    return {
      municipio: m.municipio,
      contributivo: m.contributivo,
      subsidiado: m.subsidiado,
      pctContributivo: pctContrib.toFixed(1),
      proxyE4Plus,
      datoDireto: m.municipio === 'Rionegro',
    };
  });

  console.log('   Resultados proxy:');
  results.forEach(r => {
    const tag = r.datoDireto ? '[DIRECTO]' : '[PROXY]  ';
    console.log(`   ${tag} ${r.municipio.padEnd(22)} contrib=${r.pctContributivo}% E4+=${r.proxyE4Plus.toLocaleString()}`);
  });

  const totalE4Plus = results.reduce((s, r) => s + r.proxyE4Plus, 0);
  console.log(`\n   TOTAL E4+ estimado: ${totalE4Plus.toLocaleString()}`);
  console.log(`   Nota: Solo Rionegro tiene dato directo (Decreto 096/2021)`);
  console.log(`   Metodologia: proxy basado en ratio E4+/contributivo de Rionegro`);

  // Save to processed
  const output = {
    timestamp: new Date().toISOString(),
    methodology: 'Proxy: ratio E4+/contributivo de Rionegro (unico dato directo)',
    rionegro_reference: RIONEGRO_DIRECTO,
    ratio_e4plus_contributivo: rioRatio,
    datasets_explored: [
      { id: 'evm3-92yw', name: 'CNPV 2018', result: 'No tiene campo estrato' },
      { id: 'av6t-m6ju', name: 'EPM Subsidios', result: 'Solo tarifas, no conteos' },
      { id: 'nfrm-mmfe', name: 'EPM Acueducto', result: 'Solo tarifas, no conteos' },
      { id: 'cuit-be64', name: 'SUI Historico', result: 'Solo Caldas, no Antioquia' },
    ],
    results,
  };

  const outPath = path.join(__dirname, '..', 'data', 'processed', 'oriente-strata-proxy.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\n   Saved to: ${outPath}`);
}

main().catch(console.error);
