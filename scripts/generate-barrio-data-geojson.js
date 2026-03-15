#!/usr/bin/env node
/**
 * Generate barrio-level data GeoJSON for catastro density and POT viability
 * Since we don't have barrio boundary polygons, we use centroid points
 * with proportional circle sizes (bubble map)
 */
const fs = require("fs");
const path = require("path");

// Approximate barrio centroids in El Poblado / corredor Las Palmas
// Source: OpenStreetMap + local knowledge
const barrioCentroids = {
  "ALEJANDRIA": [-75.5620, 6.2090],
  "ALTOS DEL POBLADO": [-75.5490, 6.2060],
  "ASTORGA": [-75.5600, 6.2020],
  "BARRIO COLOMBIA": [-75.5700, 6.2150],
  "CASTROPOL": [-75.5670, 6.2030],
  "EL CASTILLO": [-75.5610, 6.2000],
  "EL DIAMANTE # 2": [-75.5620, 6.1980],
  "EL POBLADO": [-75.5700, 6.2100],
  "EL TESORO": [-75.5575, 6.1960],
  "LA AGUACATALA": [-75.5700, 6.2060],
  "LA FLORIDA": [-75.5640, 6.1920],
  "LALINDE": [-75.5660, 6.2010],
  "LAS LOMAS # 1": [-75.5450, 6.1990],
  "LAS LOMAS # 2": [-75.5400, 6.1960],
  "LOS BALSOS # 1": [-75.5580, 6.1970],
  "LOS BALSOS # 2": [-75.5530, 6.1950],
  "LOS NARANJOS": [-75.5680, 6.1990],
  "MANILA": [-75.5680, 6.2070],
  "PATIO BONITO": [-75.5650, 6.1950],
  "SAN LUCAS": [-75.5560, 6.1980],
  "SANTA MARIA DE LOS ANGELES": [-75.5590, 6.2050],
  "VILLA CARLOTA": [-75.5700, 6.2130],
};

// Load catastro data
const catastro = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/processed/catastro_analysis.json"), "utf-8")
);

// Load POT data
const pot = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/processed/pot_analysis.json"), "utf-8")
);

// Build POT lookup by barrio name
const potByName = {};
for (const [code, data] of Object.entries(pot.normas_pot_por_barrio)) {
  potByName[data.nom_barrio.toUpperCase()] = data;
}

/* ── Catastro density GeoJSON ── */
const catastroFeatures = [];

for (const [barrio, data] of Object.entries(catastro.el_poblado.by_barrio)) {
  const coords = barrioCentroids[barrio];
  if (!coords) continue;

  const e5 = (data.estrato_breakdown["5"] || 0);
  const e6 = (data.estrato_breakdown["6"] || 0);
  const e5e6 = e5 + e6;
  const totalPredios = data.count;
  const pctE5E6 = totalPredios > 0 ? Math.round((e5e6 / totalPredios) * 100) : 0;
  const avgAvaluo = Math.round(data.avg_avaluo / 1000000); // In millions COP

  catastroFeatures.push({
    type: "Feature",
    properties: {
      name: barrio.split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ").replace("# ", "No."),
      predios_total: totalPredios,
      predios_e5: e5,
      predios_e6: e6,
      predios_e5e6: e5e6,
      pct_e5e6: pctE5E6,
      avg_avaluo_m: avgAvaluo,
      on_corridor: data.on_las_palmas_corridor,
      // Bubble size: proportional to E5/E6 count
      bubble_size: Math.max(4, Math.min(30, Math.sqrt(e5e6) * 1.2)),
      // Color intensity: pct of E5/E6
      color_intensity: pctE5E6,
    },
    geometry: {
      type: "Point",
      coordinates: coords,
    },
  });
}

const catastroGeoJson = { type: "FeatureCollection", features: catastroFeatures };
const catastroPath = path.join(__dirname, "../public/geojson/catastro-density.geojson");
fs.writeFileSync(catastroPath, JSON.stringify(catastroGeoJson, null, 2));
console.log(`Written ${catastroFeatures.length} barrio catastro points to ${catastroPath}`);

/* ── POT Viability GeoJSON ── */
const potFeatures = [];

for (const [code, data] of Object.entries(pot.normas_pot_por_barrio)) {
  const name = data.nom_barrio.toUpperCase();
  const coords = barrioCentroids[name];
  if (!coords) continue;

  const viability = data.viabilidad_dotacional_salud;
  const indices = data.indices_urbanos;
  const suelo = data.suelo_desarrollo;

  // Color by viability classification
  let color = "#94a3b8"; // default gray
  if (viability.clasificacion === "ALTA") color = "#22c55e";
  else if (viability.clasificacion === "MEDIA-ALTA") color = "#84cc16";
  else if (viability.clasificacion === "MEDIA") color = "#f59e0b";
  else if (viability.clasificacion === "BAJA") color = "#ef4444";

  potFeatures.push({
    type: "Feature",
    properties: {
      name: data.nom_barrio,
      code: code,
      viability: viability.clasificacion,
      score: viability.score,
      color: color,
      factors: viability.factores.join("; "),
      cl_d: indices.cociente_localizacion_dotacional || 0,
      ics: indices.ICS_indice_capacidad_soporte || 0,
      icf: indices.ICF_indice_capacidad_funcional || 0,
      suelo_potencial_m2: Math.round(suelo.suelo_potencial_desarrollo_m2),
      altura_max: data.normas_construccion.altura_maxima_pisos,
      salud_existente_m2: Math.round(data.equipamiento_salud.suelo_equipamiento_salud_existente_m2),
    },
    geometry: {
      type: "Point",
      coordinates: coords,
    },
  });
}

const potGeoJson = { type: "FeatureCollection", features: potFeatures };
const potPath = path.join(__dirname, "../public/geojson/pot-viability.geojson");
fs.writeFileSync(potPath, JSON.stringify(potGeoJson, null, 2));
console.log(`Written ${potFeatures.length} barrio POT viability points to ${potPath}`);
