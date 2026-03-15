#!/usr/bin/env node
/**
 * generate-oriente-layers.js
 *
 * Processes raw Mapbox / OSM / Google Places data for the Oriente Antioqueno
 * analysis and generates GeoJSON files for the map layers.
 *
 * Outputs (in public/geojson/):
 *   1. oriente_health_facilities.geojson
 *   2. access_point_isochrones.geojson
 *   3. access_point_routes.geojson
 *   4. medical_projects.geojson
 *   5. oriente_municipalities.geojson
 */

const fs = require("fs");
const path = require("path");

const RAW = path.join(__dirname, "..", "data", "raw");
const OUT = path.join(__dirname, "..", "public", "geojson");

// Ensure output dir exists
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

/* ─────────────────────────────────────────────────────── */
/* 1. Oriente Health Facilities                            */
/* ─────────────────────────────────────────────────────── */
function generateHealthFacilities() {
  const raw = JSON.parse(fs.readFileSync(path.join(RAW, "osm_health_facilities_oriente.json"), "utf8"));

  // Municipality centroids for reverse-geocoding approximation
  const municipalityBounds = {
    "Rionegro":     { minLat: 6.12, maxLat: 6.20, minLon: -75.42, maxLon: -75.34 },
    "Guarne":       { minLat: 6.26, maxLat: 6.32, minLon: -75.48, maxLon: -75.41 },
    "Marinilla":    { minLat: 6.15, maxLat: 6.22, minLon: -75.36, maxLon: -75.30 },
    "El Carmen":    { minLat: 6.04, maxLat: 6.12, minLon: -75.37, maxLon: -75.30 },
    "La Ceja":      { minLat: 5.98, maxLat: 6.06, minLon: -75.46, maxLon: -75.40 },
    "El Retiro":    { minLat: 6.02, maxLat: 6.10, minLon: -75.53, maxLon: -75.47 },
    "Santuario":    { minLat: 6.10, maxLat: 6.18, minLon: -75.30, maxLon: -75.23 },
    "San Vicente":  { minLat: 6.24, maxLat: 6.34, minLon: -75.37, maxLon: -75.28 },
    "Bello":        { minLat: 6.30, maxLat: 6.40, minLon: -75.58, maxLon: -75.50 },
    "Medellín":     { minLat: 6.19, maxLat: 6.35, minLon: -75.62, maxLon: -75.52 },
    "Envigado":     { minLat: 6.14, maxLat: 6.19, minLon: -75.60, maxLon: -75.52 },
    "Cocorná":      { minLat: 5.92, maxLat: 6.10, minLon: -75.24, maxLon: -75.14 },
    "El Peñol":     { minLat: 6.18, maxLat: 6.28, minLon: -75.26, maxLon: -75.18 },
    "Granada":      { minLat: 6.08, maxLat: 6.20, minLon: -75.22, maxLon: -75.14 },
  };

  function guessMunicipality(lat, lon) {
    for (const [name, b] of Object.entries(municipalityBounds)) {
      if (lat >= b.minLat && lat <= b.maxLat && lon >= b.minLon && lon <= b.maxLon) return name;
    }
    return "Oriente Antioqueño";
  }

  const features = [];

  for (const el of raw.elements) {
    // Only process elements with healthcare-related tags
    const tags = el.tags || {};
    if (!tags.amenity && !tags.healthcare) continue;

    let lat, lon;
    if (el.type === "node") {
      lat = el.lat;
      lon = el.lon;
    } else if (el.type === "way" && el.center) {
      lat = el.center.lat;
      lon = el.center.lon;
    } else {
      continue;
    }

    // Determine facility type
    const amenity = tags.amenity || "";
    const healthcare = tags.healthcare || "";
    let type = "otro";
    if (amenity === "hospital" || healthcare === "hospital") type = "hospital";
    else if (amenity === "clinic" || healthcare === "clinic") type = "clínica";
    else if (amenity === "doctors" || healthcare === "doctor" || healthcare === "yes") type = "consultorio";
    else if (amenity === "pharmacy" || healthcare === "pharmacy") type = "farmacia";
    else if (amenity === "dentist" || healthcare === "dentist") type = "odontología";
    else if (healthcare === "laboratory") type = "laboratorio";
    else if (healthcare === "rehabilitation") type = "rehabilitación";
    else if (healthcare === "eps") type = "eps";

    const name = tags.name || tags["name:es"] || `${type} (sin nombre)`;
    const municipality = guessMunicipality(lat, lon);

    features.push({
      type: "Feature",
      properties: {
        name,
        type,
        municipality,
        amenity,
        healthcare,
        emergency: tags.emergency || "",
      },
      geometry: { type: "Point", coordinates: [lon, lat] },
    });
  }

  const geojson = { type: "FeatureCollection", features };
  fs.writeFileSync(path.join(OUT, "oriente_health_facilities.geojson"), JSON.stringify(geojson));
  console.log(`  oriente_health_facilities.geojson — ${features.length} facilities`);
}

/* ─────────────────────────────────────────────────────── */
/* 2. Access Point Isochrones                               */
/* ─────────────────────────────────────────────────────── */
function generateIsochrones() {
  const raw = JSON.parse(fs.readFileSync(path.join(RAW, "isochrone_access_point_driving.json"), "utf8"));

  // The raw data already has contour properties — sort by contour descending so larger ones draw first
  const features = raw.features
    .map((f) => ({
      type: "Feature",
      properties: {
        contour: f.properties.contour,
        metric: f.properties.metric || "time",
        color: f.properties.color || f.properties.fill,
      },
      geometry: f.geometry,
    }))
    .sort((a, b) => b.properties.contour - a.properties.contour);

  const geojson = { type: "FeatureCollection", features };
  fs.writeFileSync(path.join(OUT, "access_point_isochrones.geojson"), JSON.stringify(geojson));
  console.log(`  access_point_isochrones.geojson — ${features.length} contours`);
}

/* ─────────────────────────────────────────────────────── */
/* 3. Access Point Routes                                    */
/* ─────────────────────────────────────────────────────── */
function generateRoutes() {
  const routeFiles = [
    { file: "route_access_point_to_rionegro.json",    dest: "Rionegro",      color: "#e11d48" },
    { file: "route_access_point_to_aeropuerto.json",   dest: "Aeropuerto JMC", color: "#f97316" },
    { file: "route_access_point_to_laceja.json",       dest: "La Ceja",       color: "#8b5cf6" },
    { file: "route_access_point_to_marinilla.json",    dest: "Marinilla",     color: "#06b6d4" },
    { file: "route_access_point_to_guarne.json",       dest: "Guarne",        color: "#10b981" },
  ];

  const features = [];

  for (const r of routeFiles) {
    const filePath = path.join(RAW, r.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  WARN: ${r.file} not found, skipping`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const route = raw.routes?.[0];
    if (!route) continue;

    const durationMin = Math.round(route.duration / 60);
    const distanceKm = (route.distance / 1000).toFixed(1);

    features.push({
      type: "Feature",
      properties: {
        destination: r.dest,
        duration_min: durationMin,
        distance_km: parseFloat(distanceKm),
        color: r.color,
        origin: "Access Point (Km 7 Via Las Palmas)",
      },
      geometry: route.geometry,
    });
  }

  const geojson = { type: "FeatureCollection", features };
  fs.writeFileSync(path.join(OUT, "access_point_routes.geojson"), JSON.stringify(geojson));
  console.log(`  access_point_routes.geojson — ${features.length} routes`);
}

/* ─────────────────────────────────────────────────────── */
/* 4. Medical Projects (key clinics in Oriente)            */
/* ─────────────────────────────────────────────────────── */
function generateMedicalProjects() {
  const projects = [
    {
      name: "Clínica Campestre",
      coordinates: [-75.4285, 6.1528],
      type: "Clínica privada",
      municipality: "Rionegro",
      description: "Clínica privada de alta complejidad, servicios especializados",
      status: "Operando",
    },
    {
      name: "Clínica SOMER",
      coordinates: [-75.3734, 6.1549],
      type: "Clínica privada",
      municipality: "Rionegro",
      description: "Centro de alta complejidad con urgencias, UCI y especialidades",
      status: "Operando",
    },
    {
      name: "Auna Clínica del Sur",
      coordinates: [-75.5780, 6.1680],
      type: "Red Auna",
      municipality: "Envigado",
      description: "Red AUNA — Clínica de las Américas grupo",
      status: "Operando",
    },
    {
      name: "Hospital San Vicente Rionegro",
      coordinates: [-75.4345, 6.1523],
      type: "Hospital público",
      municipality: "Rionegro",
      description: "Sede del Hospital San Vicente Fundación en el Oriente",
      status: "Operando",
    },
    {
      name: "Hospital Gilberto Mejía Mejía",
      coordinates: [-75.3899, 6.1488],
      type: "Hospital público",
      municipality: "Rionegro",
      description: "ESE Hospital municipal de Rionegro",
      status: "Operando",
    },
    {
      name: "Clínica del Norte",
      coordinates: [-75.5459, 6.3429],
      type: "Clínica privada",
      municipality: "Bello",
      description: "Clínica del Norte — alta complejidad norte del Valle",
      status: "Operando",
    },
    {
      name: "Hospital La Ceja",
      coordinates: [-75.4314, 6.0282],
      type: "Hospital público",
      municipality: "La Ceja",
      description: "ESE Hospital municipal de La Ceja del Tambo",
      status: "Operando",
    },
    {
      name: "Hospital San Juan de Dios (El Retiro)",
      coordinates: [-75.5036, 6.0560],
      type: "Hospital público",
      municipality: "El Retiro",
      description: "ESE Hospital municipal de El Retiro",
      status: "Operando",
    },
  ];

  const features = projects.map((p) => ({
    type: "Feature",
    properties: {
      name: p.name,
      type: p.type,
      municipality: p.municipality,
      description: p.description,
      status: p.status,
    },
    geometry: { type: "Point", coordinates: p.coordinates },
  }));

  const geojson = { type: "FeatureCollection", features };
  fs.writeFileSync(path.join(OUT, "medical_projects.geojson"), JSON.stringify(geojson));
  console.log(`  medical_projects.geojson — ${features.length} projects`);
}

/* ─────────────────────────────────────────────────────── */
/* 5. Oriente Municipalities                                */
/* ─────────────────────────────────────────────────────── */
function generateMunicipalities() {
  // Key municipalities of Oriente Antioqueño with approximate centroids
  // Population from DANE CNPV 2018
  const municipalities = [
    { name: "Rionegro",        coordinates: [-75.3742, 6.1557], population: 120780, ips_count: 85,  dept_code: "05615" },
    { name: "Guarne",          coordinates: [-75.4434, 6.2814], population: 52640,  ips_count: 22,  dept_code: "05318" },
    { name: "Marinilla",       coordinates: [-75.3362, 6.1772], population: 55607,  ips_count: 30,  dept_code: "05440" },
    { name: "El Carmen",       coordinates: [-75.3345, 6.0830], population: 46704,  ips_count: 18,  dept_code: "05148" },
    { name: "La Ceja",         coordinates: [-75.4273, 6.0326], population: 53346,  ips_count: 35,  dept_code: "05376" },
    { name: "El Retiro",       coordinates: [-75.5036, 6.0560], population: 19597,  ips_count: 8,   dept_code: "05607" },
    { name: "Santuario",       coordinates: [-75.2625, 6.1380], population: 27576,  ips_count: 12,  dept_code: "05697" },
    { name: "San Vicente",     coordinates: [-75.3321, 6.2828], population: 17399,  ips_count: 6,   dept_code: "05674" },
    { name: "El Peñol",        coordinates: [-75.2434, 6.2224], population: 16458,  ips_count: 8,   dept_code: "05541" },
    { name: "La Unión",        coordinates: [-75.3634, 5.9746], population: 19587,  ips_count: 10,  dept_code: "05400" },
    { name: "Cocorná",         coordinates: [-75.1868, 6.0587], population: 15263,  ips_count: 5,   dept_code: "05197" },
  ];

  // Read matrix data for travel times from Access Point
  let matrixData = null;
  const matrixPath = path.join(RAW, "mapbox_matrix_access_point_oriente.json");
  if (fs.existsSync(matrixPath)) {
    matrixData = JSON.parse(fs.readFileSync(matrixPath, "utf8"));
  }

  const features = municipalities.map((m, i) => {
    const props = {
      name: m.name,
      population: m.population,
      ips_count: m.ips_count,
      dept_code: m.dept_code,
    };

    // Attach travel time from matrix if available
    if (matrixData?.durations?.[0]) {
      // Index 0 is the source (Access Point), destinations start at index 1
      // but we map by municipality name from the destination list
      const destNames = ["Rionegro", "Guarne", "Marinilla", "La Ceja", "El Retiro", "El Carmen", "Cocorná", "Aeropuerto", "San Vicente", "Medellín"];
      const dIdx = destNames.indexOf(m.name);
      if (dIdx >= 0 && matrixData.durations[0][dIdx + 1] != null) {
        props.time_from_access_point_min = Math.round(matrixData.durations[0][dIdx + 1] / 60);
      }
    }

    return {
      type: "Feature",
      properties: props,
      geometry: { type: "Point", coordinates: m.coordinates },
    };
  });

  const geojson = { type: "FeatureCollection", features };
  fs.writeFileSync(path.join(OUT, "oriente_municipalities.geojson"), JSON.stringify(geojson));
  console.log(`  oriente_municipalities.geojson — ${features.length} municipalities`);
}

/* ─────────────────────────────────────────────────────── */
/* Run all                                                  */
/* ─────────────────────────────────────────────────────── */
console.log("Generating Oriente Antioqueno layers...\n");
generateHealthFacilities();
generateIsochrones();
generateRoutes();
generateMedicalProjects();
generateMunicipalities();
console.log("\nDone!");
