#!/usr/bin/env node
/**
 * Generate traffic-segments.geojson from traffic_segments_validated.json
 * 8 segments (6 Las Palmas + 2 El Poblado) as LineStrings
 */
const fs = require("fs");
const path = require("path");

const input = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/processed/traffic_segments_validated.json"),
    "utf-8"
  )
);

function congestionColor(speed) {
  if (speed < 18) return "#ef4444"; // heavy
  if (speed < 28) return "#f59e0b"; // moderate
  return "#22c55e"; // low
}

function congestionLevel(speed) {
  if (speed < 18) return "heavy";
  if (speed < 28) return "moderate";
  return "low";
}

const features = [];

// Las Palmas segments
input.las_palmas.segmentos.forEach((seg) => {
  const avgSpeed = seg.mapbox.velocidad_promedio_kmh;
  features.push({
    type: "Feature",
    properties: {
      id: `lp-${seg.id}`,
      name: seg.nombre,
      corridor: "Las Palmas",
      speed_kmh: avgSpeed,
      congestion: congestionLevel(avgSpeed),
      color: congestionColor(avgSpeed),
      duration_min: Math.round(seg.mapbox.duracion_s / 60 * 10) / 10,
      distance_km: Math.round(seg.mapbox.distancia_m / 100) / 10,
      speed_range: seg.mapbox.velocidades_rango_ms,
      notes: seg.mapbox.notas,
    },
    geometry: {
      type: "LineString",
      coordinates: [
        [seg.desde.lon, seg.desde.lat],
        [seg.hasta.lon, seg.hasta.lat],
      ],
    },
  });
});

// El Poblado segments
input.el_poblado.segmentos.forEach((seg) => {
  const avgSpeed = seg.mapbox.velocidad_promedio_kmh;
  features.push({
    type: "Feature",
    properties: {
      id: `ep-${seg.id}`,
      name: seg.nombre,
      corridor: "El Poblado",
      speed_kmh: avgSpeed,
      congestion: congestionLevel(avgSpeed),
      color: congestionColor(avgSpeed),
      duration_min: Math.round(seg.mapbox.duracion_s / 60 * 10) / 10,
      distance_km: Math.round(seg.mapbox.distancia_m / 100) / 10,
      speed_range: seg.mapbox.velocidades_rango_ms,
      notes: seg.mapbox.notas,
    },
    geometry: {
      type: "LineString",
      coordinates: [
        [seg.desde.lon, seg.desde.lat],
        [seg.hasta.lon, seg.hasta.lat],
      ],
    },
  });
});

const geojson = {
  type: "FeatureCollection",
  features,
};

const outPath = path.join(__dirname, "../public/geojson/traffic-segments.geojson");
fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
console.log(`Written ${features.length} traffic segments to ${outPath}`);
