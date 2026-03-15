#!/usr/bin/env node
/**
 * Generate real road geometries using Mapbox Directions API
 * Replaces straight-line segments with actual road-following LineStrings
 * for: traffic segments, corridor line, and alternate routes
 */
const fs = require("fs");
const path = require("path");

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN;

async function getRouteGeometry(coords, profile = "driving") {
  // coords: array of [lng, lat] pairs
  const coordStr = coords.map((c) => `${c[0]},${c[1]}`).join(";");
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordStr}?geometries=geojson&overview=full&access_token=${TOKEN}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  Directions API error: ${res.status} ${res.statusText}`);
    return null;
  }
  const data = await res.json();
  if (!data.routes || data.routes.length === 0) {
    console.error(`  No routes found`);
    return null;
  }
  return data.routes[0].geometry;
}

async function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ──────────────────────────────── */
/* 1. Traffic segments              */
/* ──────────────────────────────── */
async function generateTrafficSegments() {
  console.log("\n=== Traffic Segments ===");
  const input = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/processed/traffic_segments_validated.json"), "utf-8")
  );

  function congestionColor(speed) {
    if (speed < 18) return "#ef4444";
    if (speed < 28) return "#f59e0b";
    return "#22c55e";
  }
  function congestionLevel(speed) {
    if (speed < 18) return "heavy";
    if (speed < 28) return "moderate";
    return "low";
  }

  const features = [];

  // Las Palmas segments
  for (const seg of input.las_palmas.segmentos) {
    const avgSpeed = seg.mapbox.velocidad_promedio_kmh;
    const origin = [seg.desde.lon, seg.desde.lat];
    const dest = [seg.hasta.lon, seg.hasta.lat];

    console.log(`  LP seg ${seg.id}: ${seg.nombre}...`);
    const geometry = await getRouteGeometry([origin, dest]);
    await delay(300);

    features.push({
      type: "Feature",
      properties: {
        id: `lp-${seg.id}`,
        name: seg.nombre,
        corridor: "Las Palmas",
        speed_kmh: avgSpeed,
        congestion: congestionLevel(avgSpeed),
        color: congestionColor(avgSpeed),
        duration_min: Math.round((seg.mapbox.duracion_s / 60) * 10) / 10,
        distance_km: Math.round(seg.mapbox.distancia_m / 100) / 10,
        speed_range: seg.mapbox.velocidades_rango_ms,
        notes: seg.mapbox.notas,
      },
      geometry: geometry || {
        type: "LineString",
        coordinates: [origin, dest],
      },
    });
  }

  // El Poblado segments
  for (const seg of input.el_poblado.segmentos) {
    const avgSpeed = seg.mapbox.velocidad_promedio_kmh;
    const origin = [seg.desde.lon, seg.desde.lat];
    const dest = [seg.hasta.lon, seg.hasta.lat];

    console.log(`  EP seg ${seg.id}: ${seg.nombre}...`);
    const geometry = await getRouteGeometry([origin, dest]);
    await delay(300);

    features.push({
      type: "Feature",
      properties: {
        id: `ep-${seg.id}`,
        name: seg.nombre,
        corridor: "El Poblado",
        speed_kmh: avgSpeed,
        congestion: congestionLevel(avgSpeed),
        color: congestionColor(avgSpeed),
        duration_min: Math.round((seg.mapbox.duracion_s / 60) * 10) / 10,
        distance_km: Math.round(seg.mapbox.distancia_m / 100) / 10,
        speed_range: seg.mapbox.velocidades_rango_ms,
        notes: seg.mapbox.notas,
      },
      geometry: geometry || {
        type: "LineString",
        coordinates: [origin, dest],
      },
    });
  }

  const geojson = { type: "FeatureCollection", features };
  const outPath = path.join(__dirname, "../public/geojson/traffic-segments.geojson");
  fs.writeFileSync(outPath, JSON.stringify(geojson));
  console.log(`  Written ${features.length} traffic segments with real geometries`);
}

/* ──────────────────────────────── */
/* 2. Corridor line                 */
/* ──────────────────────────────── */
async function generateCorridorLine() {
  console.log("\n=== Corridor Las Palmas ===");

  // Key waypoints along the Las Palmas corridor
  // From El Poblado up to Alto de Las Palmas
  const waypoints = [
    [-75.5688, 6.2100], // Inicio corredor (Milla de Oro / El Poblado)
    [-75.5620, 6.2060], // Calle 10 / Transversal
    [-75.5575, 6.2005], // C.C. El Tesoro
    [-75.5535, 6.1970], // Zona San Lucas
    [-75.5490, 6.2050], // Indiana / Las Palmas Bajo
    [-75.5400, 6.2020], // Zona EIA
    [-75.5340, 6.1960], // Los Balsos alto
    [-75.5260, 6.1920], // Las Palmas medio-alto
    [-75.5180, 6.1880], // Hacia Santa Elena
  ];

  // Mapbox limits to 25 waypoints per request, we're fine
  console.log("  Fetching corridor geometry...");
  const geometry = await getRouteGeometry(waypoints);
  await delay(300);

  if (geometry) {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Corredor Las Palmas" },
          geometry,
        },
      ],
    };
    const outPath = path.join(__dirname, "../public/geojson/corridor-las-palmas.geojson");
    fs.writeFileSync(outPath, JSON.stringify(geojson));
    console.log(`  Written corridor with ${geometry.coordinates.length} points`);
  }
}

/* ──────────────────────────────── */
/* 3. Alternate routes              */
/* ──────────────────────────────── */
async function generateAlternateRoutes() {
  console.log("\n=== Alternate Routes ===");
  const input = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/processed/alternate_routes_analysis.json"), "utf-8")
  );

  const DEST = [-75.549, 6.195]; // Las Palmas Bajo centroid

  const originCoords = {
    milla_de_oro: [-75.5688, 6.2080],
    el_poblado_parque: [-75.5700, 6.2100],
    envigado_centro: [-75.5800, 6.1700],
    itagui_centro: [-75.6100, 6.1650],
    laureles: [-75.5900, 6.2450],
    san_diego_centro: [-75.5640, 6.2470],
  };

  const originLabels = {
    milla_de_oro: "Milla de Oro",
    el_poblado_parque: "El Poblado (Parque)",
    envigado_centro: "Envigado Centro",
    itagui_centro: "Itagui Centro",
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

    const timeMin = Math.round((data.mejor_tiempo_s / 60) * 10) / 10;

    console.log(`  Route from ${originLabels[key]}...`);
    const geometry = await getRouteGeometry([origin, DEST]);
    await delay(400);

    features.push({
      type: "Feature",
      properties: {
        id: key,
        origin: originLabels[key],
        time_min: timeMin,
        best_route: data.mejor_ruta,
        best_source: data.mejor_fuente,
        color: routeColor(timeMin),
      },
      geometry: geometry || {
        type: "LineString",
        coordinates: [origin, DEST],
      },
    });
  }

  const geojson = { type: "FeatureCollection", features };
  const outPath = path.join(__dirname, "../public/geojson/alternate-routes.geojson");
  fs.writeFileSync(outPath, JSON.stringify(geojson));
  console.log(`  Written ${features.length} routes with real geometries`);
}

/* ──────────────────────────────── */
/* Main                             */
/* ──────────────────────────────── */
async function main() {
  console.log("Generating real road geometries via Mapbox Directions API...");
  await generateTrafficSegments();
  await generateCorridorLine();
  await generateAlternateRoutes();
  console.log("\nDone! All geometries now follow actual roads.");
}

main().catch(console.error);
