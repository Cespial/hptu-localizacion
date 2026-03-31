#!/usr/bin/env node
/**
 * ingest-palmas-bajo-deep.js
 * Ultra-zoom data collection for Palmas Bajo zone
 * Uses Google Places API to capture every POI within the zone
 *
 * Zone: Triangle defined by:
 *   - Transversal intermedia: 6.215323, -75.562567
 *   - Calle 10: 6.209103, -75.564763
 *   - Transversal inferior: 6.208965, -75.559180
 *   - Centroid: ~6.2111, -75.5622
 */

const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyCDtpnJoftns_RXlJhDkLrLwOmdDPoQy10';
const CENTER = { lat: 6.2111, lng: -75.5622 };
const RADII = [300, 500, 1000]; // meters

// Also scan Milla de Oro for comparison
const MILLA_ORO = { lat: 6.2086, lng: -75.5696 };

const POI_TYPES = [
  // Esperas Productivas
  'restaurant', 'cafe', 'bar', 'bakery',
  'bank', 'atm',
  'pharmacy', 'drugstore',
  'supermarket', 'grocery_or_supermarket',
  'shopping_mall', 'clothing_store', 'department_store',
  'gym', 'spa', 'beauty_salon',
  'parking',
  // Competencia (health)
  'hospital', 'doctor', 'dentist', 'physiotherapist',
  // Demanda/Context
  'school', 'university',
  'lodging',
  'real_estate_agency',
  // Visibilidad
  'gas_station', 'transit_station', 'bus_station',
  // Marca/Entertainment
  'movie_theater', 'park', 'church',
];

async function fetchPlaces(location, radius, type) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${type}&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
      return data.results || [];
    }
    console.error(`  API error for ${type}@${radius}m: ${data.status}`);
    return [];
  } catch (err) {
    console.error(`  Fetch error for ${type}: ${err.message}`);
    return [];
  }
}

async function fetchPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,formatted_address,opening_hours,price_level,types,geometry&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.result || null;
  } catch {
    return null;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scanZone(name, location, radius) {
  console.log(`\n=== Scanning ${name} (${radius}m radius) ===`);
  const results = {};
  const allPlaces = new Map(); // deduplicate by place_id

  for (const type of POI_TYPES) {
    process.stdout.write(`  ${type}...`);
    const places = await fetchPlaces(location, radius, type);
    results[type] = places.length;

    for (const p of places) {
      if (!allPlaces.has(p.place_id)) {
        allPlaces.set(p.place_id, {
          place_id: p.place_id,
          name: p.name,
          types: p.types,
          rating: p.rating || null,
          user_ratings_total: p.user_ratings_total || 0,
          vicinity: p.vicinity || '',
          lat: p.geometry?.location?.lat,
          lng: p.geometry?.location?.lng,
          price_level: p.price_level || null,
          business_status: p.business_status || 'OPERATIONAL',
        });
      }
    }

    process.stdout.write(` ${places.length}\n`);
    await sleep(100); // rate limit
  }

  return { counts: results, places: [...allPlaces.values()], totalUnique: allPlaces.size };
}

async function getHealthDetails(places) {
  console.log('\n=== Getting details for health facilities ===');
  const healthTypes = ['hospital', 'doctor', 'dentist', 'health', 'physiotherapist'];
  const healthPlaces = places.filter(p =>
    p.types.some(t => healthTypes.includes(t))
  );

  const detailed = [];
  for (const hp of healthPlaces.slice(0, 20)) { // limit to 20 for API quota
    process.stdout.write(`  ${hp.name.substring(0, 40)}...`);
    const details = await fetchPlaceDetails(hp.place_id);
    if (details) {
      detailed.push({
        ...hp,
        formatted_address: details.formatted_address,
        opening_hours: details.opening_hours?.weekday_text || null,
        is_open_now: details.opening_hours?.open_now || null,
      });
      process.stdout.write(` OK\n`);
    } else {
      detailed.push(hp);
      process.stdout.write(` (no details)\n`);
    }
    await sleep(150);
  }
  return detailed;
}

async function getDirectionsTimes(origin) {
  console.log('\n=== Travel times from zone ===');
  const destinations = [
    { name: 'Milla de Oro', lat: 6.2086, lng: -75.5696 },
    { name: 'HPTU Robledo', lat: 6.2773, lng: -75.5797 },
    { name: 'Parque El Poblado', lat: 6.2105, lng: -75.5675 },
    { name: 'Envigado Centro', lat: 6.1711, lng: -75.5867 },
    { name: 'CC El Tesoro', lat: 6.1996, lng: -75.5589 },
    { name: 'Laureles', lat: 6.2456, lng: -75.5916 },
    { name: 'Aeropuerto JMC', lat: 6.1646, lng: -75.4231 },
    { name: 'Itagui Centro', lat: 6.1848, lng: -75.6063 },
    { name: 'CC Oviedo', lat: 6.2050, lng: -75.5660 },
    { name: 'Rionegro', lat: 6.1553, lng: -75.3744 },
  ];

  const times = [];
  for (const dest of destinations) {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lng}&mode=driving&departure_time=now&key=${API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const leg = data.routes[0].legs[0];
        times.push({
          destination: dest.name,
          duration_text: leg.duration.text,
          duration_seconds: leg.duration.value,
          duration_in_traffic_text: leg.duration_in_traffic?.text || leg.duration.text,
          duration_in_traffic_seconds: leg.duration_in_traffic?.value || leg.duration.value,
          distance_text: leg.distance.text,
          distance_meters: leg.distance.value,
        });
        console.log(`  → ${dest.name}: ${leg.duration_in_traffic?.text || leg.duration.text} (${leg.distance.text})`);
      }
    } catch (err) {
      console.log(`  → ${dest.name}: ERROR (${err.message})`);
    }
    await sleep(100);
  }
  return times;
}

async function main() {
  console.log('=== ULTRA-ZOOM: PALMAS BAJO ===');
  console.log(`Center: ${CENTER.lat}, ${CENTER.lng}`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const output = {
    metadata: {
      zone: 'Palmas Bajo',
      center: CENTER,
      polygon: [
        { name: 'Transversal intermedia', lat: 6.215323, lng: -75.562567 },
        { name: 'Calle 10', lat: 6.209103, lng: -75.564763 },
        { name: 'Transversal inferior', lat: 6.208965, lng: -75.559180 },
      ],
      timestamp: new Date().toISOString(),
      apiSource: 'Google Places API + Google Directions API',
    },
    palmasBajo: {},
    millaDeOro: {},
    travelTimes: [],
    healthFacilities: [],
  };

  // 1. Scan Palmas Bajo at 300m, 500m
  for (const radius of [300, 500]) {
    const scan = await scanZone('Palmas Bajo', CENTER, radius);
    output.palmasBajo[`r${radius}`] = scan;
  }

  // 2. Scan Milla de Oro at 500m for comparison
  const mdoScan = await scanZone('Milla de Oro', MILLA_ORO, 500);
  output.millaDeOro['r500'] = mdoScan;

  // 3. Health facility details (from 1km scan)
  const healthScan = await scanZone('Palmas Bajo Health', CENTER, 1000);
  output.palmasBajo['r1000_health'] = { counts: healthScan.counts, totalUnique: healthScan.totalUnique };
  output.healthFacilities = await getHealthDetails(healthScan.places);

  // 4. Travel times from Palmas Bajo
  output.travelTimes = await getDirectionsTimes(CENTER);

  // 5. Summary comparison
  const pb500 = output.palmasBajo.r500;
  const mdo500 = output.millaDeOro.r500;

  output.summary = {
    palmasBajo: {
      totalPOIs_300m: output.palmasBajo.r300.totalUnique,
      totalPOIs_500m: pb500.totalUnique,
      restaurants: pb500.counts.restaurant || 0,
      cafes: pb500.counts.cafe || 0,
      banks: pb500.counts.bank || 0,
      pharmacies: pb500.counts.pharmacy || 0,
      supermarkets: pb500.counts.supermarket || 0,
      gyms: pb500.counts.gym || 0,
      hospitals: pb500.counts.hospital || 0,
      doctors: pb500.counts.doctor || 0,
      schools: pb500.counts.school || 0,
      parking: pb500.counts.parking || 0,
    },
    millaDeOro: {
      totalPOIs_500m: mdo500.totalUnique,
      restaurants: mdo500.counts.restaurant || 0,
      cafes: mdo500.counts.cafe || 0,
      banks: mdo500.counts.bank || 0,
      pharmacies: mdo500.counts.pharmacy || 0,
      supermarkets: mdo500.counts.supermarket || 0,
      gyms: mdo500.counts.gym || 0,
      hospitals: mdo500.counts.hospital || 0,
      doctors: mdo500.counts.doctor || 0,
      schools: mdo500.counts.school || 0,
      parking: mdo500.counts.parking || 0,
    },
    healthFacilities_1km: output.healthFacilities.length,
    travelDestinations: output.travelTimes.length,
  };

  // Save
  const outPath = path.join(__dirname, '..', 'data', 'processed', 'palmas-bajo-ultra-zoom.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\n=== SAVED to ${outPath} ===`);

  // Print summary
  console.log('\n=== SUMMARY ===');
  console.log(`Palmas Bajo 300m: ${output.summary.palmasBajo.totalPOIs_300m} unique POIs`);
  console.log(`Palmas Bajo 500m: ${output.summary.palmasBajo.totalPOIs_500m} unique POIs`);
  console.log(`Milla de Oro 500m: ${output.summary.millaDeOro.totalPOIs_500m} unique POIs`);
  console.log(`Health facilities (1km): ${output.summary.healthFacilities_1km}`);
  console.log(`Travel destinations: ${output.summary.travelDestinations}`);

  console.log('\n--- Palmas Bajo vs Milla de Oro (500m) ---');
  for (const key of ['restaurants', 'cafes', 'banks', 'pharmacies', 'supermarkets', 'gyms', 'hospitals', 'doctors']) {
    const pb = output.summary.palmasBajo[key];
    const mdo = output.summary.millaDeOro[key];
    console.log(`  ${key.padEnd(15)} PB: ${String(pb).padStart(3)}  MdO: ${String(mdo).padStart(3)}  ${pb > mdo ? '← PB wins' : mdo > pb ? '→ MdO wins' : '= tie'}`);
  }
}

main().catch(console.error);
