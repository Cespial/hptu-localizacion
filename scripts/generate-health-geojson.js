#!/usr/bin/env node
/**
 * Generate health-facilities.geojson from health_facilities.json
 * Filters to alta/mediana complejidad facilities with coordinates
 * Marks 8 key healthNodes as "primary"
 */
const fs = require("fs");
const path = require("path");

const input = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/processed/health_facilities.json"),
    "utf-8"
  )
);

// Key health nodes to mark as primary (by partial name match)
const healthNodePatterns = [
  "PABLO TOBON URIBE",
  "CLINICA LAS VEGAS",
  "ROSARIO",
  "CLINICA MEDELLIN",
  "CES",
  "URIBE ANGEL",
  "SAN VICENTE",
  "GENERAL DE MEDELLIN",
];

function isPrimary(name) {
  const upper = name.toUpperCase();
  return healthNodePatterns.some((p) => upper.includes(p));
}

const complexities = [
  "Alta complejidad",
  "Mediana complejidad",
  "Mediana complejidad (internación)",
];

const features = [];

input.facilities.forEach((fac) => {
  // Must have coordinates
  if (!fac.coordenadas || fac.coordenadas.lat == null || fac.coordenadas.lon == null) return;

  // Filter to alta/mediana complejidad OR hospitals with beds
  const isComplex = complexities.includes(fac.complejidad);
  const hasBeds = fac.camas && fac.camas.total > 0;
  if (!isComplex && !hasBeds) return;

  const primary = isPrimary(fac.nombre);

  features.push({
    type: "Feature",
    properties: {
      name: fac.nombre,
      municipality: fac.municipio,
      complexity: fac.complejidad,
      beds: fac.camas ? fac.camas.total : 0,
      nature: fac.naturaleza,
      primary: primary,
      address: fac.direccion_principal,
      neighborhood: fac.barrio_principal,
      inCorridor: fac.en_corredor_las_palmas || false,
      nearestZone: fac.zona_mas_cercana || null,
      nearestZoneKm: fac.distancia_zona_mas_cercana_km || null,
    },
    geometry: {
      type: "Point",
      coordinates: [fac.coordenadas.lon, fac.coordenadas.lat],
    },
  });
});

const geojson = {
  type: "FeatureCollection",
  features,
};

const outPath = path.join(__dirname, "../public/geojson/health-facilities.geojson");
fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
console.log(`Written ${features.length} health facilities to ${outPath}`);
console.log(`  Primary (healthNodes): ${features.filter((f) => f.properties.primary).length}`);
console.log(`  With beds: ${features.filter((f) => f.properties.beds > 0).length}`);
