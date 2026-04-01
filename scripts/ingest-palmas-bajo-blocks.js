#!/usr/bin/env node
/**
 * ingest-palmas-bajo-blocks.js
 * Block-by-block (manzana a manzana) analysis of Palmas Bajo triangle
 *
 * Triangle vertices:
 *   A: 6.215323, -75.562567 (Transversal Intermedia)
 *   B: 6.209103, -75.564763 (Calle 10)
 *   C: 6.208965, -75.559180 (Transversal Inferior)
 *
 * Grid: ~25 points at ~100m spacing, 100m radius per point
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
if (!API_KEY) {
  console.error('ERROR: Set GOOGLE_PLACES_API_KEY environment variable');
  process.exit(1);
}

// Triangle vertices
const A = { lat: 6.215323, lng: -75.562567 };
const B = { lat: 6.209103, lng: -75.564763 };
const C = { lat: 6.208965, lng: -75.559180 };

const RADIUS = 100; // meters per point
const STEP = 0.001; // ~111m in latitude

const POI_TYPES = [
  'restaurant', 'cafe', 'bank', 'pharmacy',
  'hospital', 'doctor', 'gym', 'store',
];

function pointInTriangle(p, a, b, c) {
  const sign = (p1, p2, p3) =>
    (p1.lat - p3.lat) * (p2.lng - p3.lng) - (p2.lat - p3.lat) * (p1.lng - p3.lng);
  const d1 = sign(p, a, b);
  const d2 = sign(p, b, c);
  const d3 = sign(p, c, a);
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(hasNeg && hasPos);
}

function generateGrid() {
  const minLat = Math.min(A.lat, B.lat, C.lat) - 0.0005;
  const maxLat = Math.max(A.lat, B.lat, C.lat) + 0.0005;
  const minLng = Math.min(A.lng, B.lng, C.lng) - 0.0005;
  const maxLng = Math.max(A.lng, B.lng, C.lng) + 0.0005;

  const points = [];
  for (let lat = minLat; lat <= maxLat; lat += STEP) {
    for (let lng = minLng; lng <= maxLng; lng += STEP) {
      const p = { lat: +lat.toFixed(6), lng: +lng.toFixed(6) };
      if (pointInTriangle(p, A, B, C)) {
        points.push(p);
      }
    }
  }
  return points;
}

async function fetchPlaces(lat, lng, radius, type) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return (data.results || []).length;
  } catch {
    return 0;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('=== MANZANA A MANZANA: PALMAS BAJO ===');

  const grid = generateGrid();
  console.log(`Grid points inside triangle: ${grid.length}`);
  console.log(`API calls needed: ${grid.length} × ${POI_TYPES.length} = ${grid.length * POI_TYPES.length}`);
  console.log(`Radius per point: ${RADIUS}m\n`);

  const blocks = [];

  for (let i = 0; i < grid.length; i++) {
    const pt = grid[i];
    process.stdout.write(`Block ${i+1}/${grid.length} (${pt.lat}, ${pt.lng}): `);

    const counts = {};
    let total = 0;
    for (const type of POI_TYPES) {
      const count = await fetchPlaces(pt.lat, pt.lng, RADIUS, type);
      counts[type] = count;
      total += count;
      await sleep(80);
    }

    // Density scores (0-100)
    const healthScore = Math.min(100, (counts.hospital + counts.doctor) * 10);
    const retailScore = Math.min(100, counts.store * 5);
    const foodScore = Math.min(100, (counts.restaurant + counts.cafe) * 5);
    const financeScore = Math.min(100, counts.bank * 15);
    const wellnessScore = Math.min(100, (counts.gym + counts.pharmacy) * 10);
    const totalScore = Math.round((healthScore + retailScore + foodScore + financeScore + wellnessScore) / 5);

    blocks.push({
      id: `block-${i+1}`,
      lat: pt.lat,
      lng: pt.lng,
      counts,
      total,
      scores: { health: healthScore, retail: retailScore, food: foodScore, finance: financeScore, wellness: wellnessScore, total: totalScore },
    });

    console.log(`total=${total} | H:${healthScore} R:${retailScore} F:${foodScore} Fi:${financeScore} W:${wellnessScore} → ${totalScore}`);
  }

  // Find best/worst blocks
  const sorted = [...blocks].sort((a, b) => b.scores.total - a.scores.total);
  console.log(`\n=== TOP 5 MANZANAS ===`);
  sorted.slice(0, 5).forEach((b, i) => {
    console.log(`  #${i+1} (${b.lat}, ${b.lng}): Score ${b.scores.total} | ${b.total} POIs`);
  });

  console.log(`\n=== BOTTOM 3 MANZANAS ===`);
  sorted.slice(-3).forEach((b, i) => {
    console.log(`  #${sorted.length - 2 + i} (${b.lat}, ${b.lng}): Score ${b.scores.total} | ${b.total} POIs`);
  });

  // Save raw data
  const output = {
    metadata: {
      zone: 'Palmas Bajo',
      triangle: { A, B, C },
      gridPoints: grid.length,
      radiusPerPoint: RADIUS,
      timestamp: new Date().toISOString(),
      apiSource: 'Google Places API',
    },
    blocks,
    summary: {
      totalBlocks: blocks.length,
      avgScore: Math.round(blocks.reduce((s, b) => s + b.scores.total, 0) / blocks.length),
      maxScore: sorted[0].scores.total,
      minScore: sorted[sorted.length - 1].scores.total,
      bestBlock: { lat: sorted[0].lat, lng: sorted[0].lng, score: sorted[0].scores.total },
      worstBlock: { lat: sorted[sorted.length-1].lat, lng: sorted[sorted.length-1].lng, score: sorted[sorted.length-1].scores.total },
    },
  };

  const outPath = path.join(__dirname, '..', 'data', 'processed', 'palmas-bajo-block-grid.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\nSaved to ${outPath}`);

  // Generate GeoJSON heatmap
  const geojson = {
    type: 'FeatureCollection',
    features: blocks.map(b => ({
      type: 'Feature',
      properties: {
        id: b.id,
        total_pois: b.total,
        health_score: b.scores.health,
        retail_score: b.scores.retail,
        food_score: b.scores.food,
        finance_score: b.scores.finance,
        wellness_score: b.scores.wellness,
        total_score: b.scores.total,
        ...b.counts,
      },
      geometry: { type: 'Point', coordinates: [b.lng, b.lat] },
    })),
  };

  const geoPath = path.join(__dirname, '..', 'public', 'geojson', 'palmas-bajo-heatmap.geojson');
  fs.writeFileSync(geoPath, JSON.stringify(geojson, null, 2));
  console.log(`GeoJSON heatmap saved to ${geoPath}`);

  // Generate polygon GeoJSON
  const polygon = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: { name: 'Palmas Bajo - Zona Candidata', zone: 'palmas-bajo' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [A.lng, A.lat],
          [B.lng, B.lat],
          [C.lng, C.lat],
          [A.lng, A.lat], // close
        ]],
      },
    }],
  };

  const polyPath = path.join(__dirname, '..', 'public', 'geojson', 'palmas-bajo-polygon.geojson');
  fs.writeFileSync(polyPath, JSON.stringify(polygon, null, 2));
  console.log(`Polygon saved to ${polyPath}`);
}

main().catch(console.error);
