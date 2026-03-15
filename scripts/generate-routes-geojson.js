#!/usr/bin/env node
/**
 * Generate alternate-routes.geojson from alternate_routes_analysis.json
 * 6 routes from origins to Las Palmas Bajo centroid
 */
const fs = require("fs");
const path = require("path");

const input = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/processed/alternate_routes_analysis.json"),
    "utf-8"
  )
);

// Destination: Las Palmas Bajo centroid
const DEST = [-75.549, 6.195];

const originCoords = {
  milla_de_oro: [-75.569, 6.208],
  el_poblado_parque: [-75.57, 6.21],
  envigado_centro: [-75.58, 6.17],
  itagui_centro: [-75.61, 6.165],
  laureles: [-75.59, 6.245],
  san_diego_centro: [-75.564, 6.247],
};

const originLabels = {
  milla_de_oro: "Milla de Oro",
  el_poblado_parque: "El Poblado (Parque)",
  envigado_centro: "Envigado Centro",
  itagui_centro: "Itagüí Centro",
  laureles: "Laureles",
  san_diego_centro: "San Diego / Centro",
};

function routeColor(timeMin) {
  if (timeMin < 20) return "#22c55e";
  if (timeMin <= 30) return "#f59e0b";
  return "#ef4444";
}

const features = [];

for (const [key, data] of Object.entries(input.rutas_por_origen)) {
  const origin = originCoords[key];
  if (!origin) continue;

  const timeMin = Math.round(data.mejor_tiempo_s / 60 * 10) / 10;
  const bestRoute = data.mejor_ruta;
  const bestSource = data.mejor_fuente;

  // Create a simplified line from origin to destination
  // Add a midpoint with slight curve for visual distinction
  const midLng = (origin[0] + DEST[0]) / 2 + (Math.random() - 0.5) * 0.005;
  const midLat = (origin[1] + DEST[1]) / 2 + (Math.random() - 0.5) * 0.005;

  features.push({
    type: "Feature",
    properties: {
      id: key,
      origin: originLabels[key],
      time_min: timeMin,
      best_route: bestRoute,
      best_source: bestSource,
      color: routeColor(timeMin),
    },
    geometry: {
      type: "LineString",
      coordinates: [origin, [midLng, midLat], DEST],
    },
  });
}

const geojson = {
  type: "FeatureCollection",
  features,
};

const outPath = path.join(__dirname, "../public/geojson/alternate-routes.geojson");
fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
console.log(`Written ${features.length} alternate routes to ${outPath}`);
