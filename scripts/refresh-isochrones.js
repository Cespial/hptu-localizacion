#!/usr/bin/env node
/**
 * Refresh isochrones from Mapbox Isochrone API for 5 candidate zones
 * Generates 10/20/30 min driving isochrones
 */
const fs = require("fs");
const path = require("path");

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN;

const zones = [
  { id: "palmas-bajo", lng: -75.5465, lat: 6.208 },
  { id: "palmas-medio", lng: -75.538, lat: 6.198 },
  { id: "palmas-alto", lng: -75.526, lat: 6.192 },
  { id: "envigado", lng: -75.578, lat: 6.168 },
  { id: "nuevo-poblado", lng: -75.592, lat: 6.195 },
];

const MINUTES = [10, 20, 30];

async function fetchIsochrone(zone) {
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/driving/${zone.lng},${zone.lat}?contours_minutes=${MINUTES.join(",")}&polygons=true&access_token=${TOKEN}`;

  console.log(`Fetching isochrones for ${zone.id}...`);

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  Failed for ${zone.id}: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();

  // Add minutes property to each feature
  data.features.forEach((feature, i) => {
    feature.properties.minutes = MINUTES[MINUTES.length - 1 - i]; // API returns largest first
    feature.properties.zone = zone.id;
  });

  return data;
}

async function main() {
  const outDir = path.join(__dirname, "../public/geojson");

  for (const zone of zones) {
    const data = await fetchIsochrone(zone);
    if (!data) continue;

    const outPath = path.join(outDir, `isochrones-${zone.id}.geojson`);
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log(`  Written ${data.features.length} isochrone polygons to ${outPath}`);

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("Done refreshing all isochrones.");
}

main().catch(console.error);
