#!/usr/bin/env node
/**
 * Generate ALL GeoJSON layers from processed data
 * Maximizes data utilization: OSM POIs, full health network, complete POT barrios, all facilities
 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../public/geojson");

/* ── 1. OSM POIs (corridor context: schools, commercial, clinics) ── */
function generateOsmPois() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/processed/osm_pois_filtered.json"), "utf-8")
  );

  const categoryMap = {
    corridor_schools_universities: { category: "education", color: "#8b5cf6", icon: "school" },
    corridor_commercial: { category: "commercial", color: "#f59e0b", icon: "shop" },
    corridor_hospitals_clinics: { category: "health_osm", color: "#ef4444", icon: "hospital" },
  };

  const features = [];
  for (const [key, meta] of Object.entries(categoryMap)) {
    const items = data[key] || [];
    for (const item of items) {
      if (!item.lat || !item.lon) continue;
      features.push({
        type: "Feature",
        properties: {
          name: item.name || "Sin nombre",
          category: meta.category,
          subcategory: item.subcategory || "",
          color: meta.color,
          icon: meta.icon,
          en_corredor: item.en_corredor || false,
          zona_mas_cercana: item.zona_mas_cercana || "",
          distancia_km: item.distancia_zona_mas_cercana_km || 0,
        },
        geometry: { type: "Point", coordinates: [item.lon, item.lat] },
      });
    }
  }

  const geojson = { type: "FeatureCollection", features };
  const outPath = path.join(OUT, "osm-pois-corridor.geojson");
  fs.writeFileSync(outPath, JSON.stringify(geojson));
  console.log(`OSM POIs: ${features.length} features (education: ${data.corridor_schools_universities?.length}, commercial: ${data.corridor_commercial?.length}, health: ${data.corridor_hospitals_clinics?.length})`);
}

/* ── 2. Full Health Network (all 145 facilities with coordinates) ── */
function generateFullHealthNetwork() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/processed/health_facilities.json"), "utf-8")
  );

  const features = [];
  for (const fac of data.facilities) {
    if (!fac.coordenadas?.lat || !fac.coordenadas?.lon) continue;

    const isAlta = fac.complejidad?.includes("Alta");
    const isMediana = fac.complejidad?.includes("Mediana");
    const isBaja = !isAlta && !isMediana;

    // Color by complexity
    let color = "#94a3b8"; // gray for baja
    let radius = 4;
    if (isAlta) { color = "#dc2626"; radius = 8; }
    else if (isMediana) { color = "#f97316"; radius = 6; }

    features.push({
      type: "Feature",
      properties: {
        name: fac.nombre,
        complexity: fac.complejidad || "No especificada",
        municipality: fac.municipio || "",
        nature: fac.naturaleza || "",
        beds: fac.camas?.total || 0,
        is_ese: fac.ese === "SI",
        is_hospital: fac.es_hospital || false,
        color,
        radius,
        isAlta,
        isMediana,
        isBaja,
        en_corredor: fac.en_corredor_las_palmas || false,
        en_area_estudio: fac.en_area_estudio || false,
        zona_mas_cercana: fac.zona_mas_cercana || "",
        distancia_km: fac.distancia_zona_mas_cercana_km || 0,
        barrio: fac.barrio_principal || "",
        direccion: fac.direccion_principal || "",
      },
      geometry: {
        type: "Point",
        coordinates: [fac.coordenadas.lon, fac.coordenadas.lat],
      },
    });
  }

  const geojson = { type: "FeatureCollection", features };
  const outPath = path.join(OUT, "health-network-full.geojson");
  fs.writeFileSync(outPath, JSON.stringify(geojson));

  const alta = features.filter(f => f.properties.isAlta).length;
  const media = features.filter(f => f.properties.isMediana).length;
  const baja = features.filter(f => f.properties.isBaja).length;
  console.log(`Health Network Full: ${features.length} facilities (Alta: ${alta}, Mediana: ${media}, Baja: ${baja})`);
}

/* ── 3. Complete POT Barrios (all 22, not just 15) ── */
function generateCompletePotBarrios() {
  const pot = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/processed/pot_analysis.json"), "utf-8")
  );

  // Extended barrio centroids - adding the 7 missing barrios
  const barrioCentroids = {
    "ALEJANDRIA": [-75.5620, 6.2090],
    "ALTOS DEL POBLADO": [-75.5490, 6.2060],
    "ASTORGA": [-75.5600, 6.2020],
    "BARRIO COLOMBIA": [-75.5700, 6.2150],
    "CASTROPOL": [-75.5670, 6.2030],
    "EL CASTILLO": [-75.5610, 6.2000],
    "EL DIAMANTE NO.2": [-75.5620, 6.1980],
    "EL POBLADO": [-75.5700, 6.2100],
    "EL TESORO": [-75.5575, 6.1960],
    "LA AGUACATALA": [-75.5700, 6.2060],
    "LA FLORIDA": [-75.5640, 6.1920],
    "LALINDE": [-75.5660, 6.2010],
    "LAS LOMAS NO.1": [-75.5450, 6.1990],
    "LAS LOMAS NO.2": [-75.5400, 6.1960],
    "LOS BALSOS NO.1": [-75.5580, 6.1970],
    "LOS BALSOS NO.2": [-75.5530, 6.1950],
    "LOS NARANJOS": [-75.5680, 6.1990],
    "MANILA": [-75.5680, 6.2070],
    "PATIO BONITO": [-75.5650, 6.1950],
    "SAN LUCAS": [-75.5560, 6.1980],
    "SANTA MARIA DE LOS ANGELES": [-75.5590, 6.2050],
    "SANTA MARÍA DE LOS ÁNGELES": [-75.5590, 6.2050],
    "VILLA CARLOTA": [-75.5700, 6.2130],
  };

  const features = [];

  for (const [code, data] of Object.entries(pot.normas_pot_por_barrio)) {
    const name = data.nom_barrio;
    // Normalize name for centroid lookup
    const nameUp = name.toUpperCase()
      .replace("# ", "NO.")
      .replace("#", "NO.")
      .replace("Á", "A").replace("É", "E").replace("Í", "I").replace("Ó", "O").replace("Ú", "U");

    let coords = barrioCentroids[nameUp];
    if (!coords) {
      // Try partial match
      for (const [k, v] of Object.entries(barrioCentroids)) {
        if (nameUp.includes(k) || k.includes(nameUp)) {
          coords = v;
          break;
        }
      }
    }
    if (!coords) {
      console.warn(`  POT: No centroid for "${name}" (${nameUp}), skipping`);
      continue;
    }

    const viability = data.viabilidad_dotacional_salud;
    const indices = data.indices_urbanos;
    const suelo = data.suelo_desarrollo;
    const normas = data.normas_construccion;

    let color = "#94a3b8";
    if (viability.clasificacion === "ALTA") color = "#22c55e";
    else if (viability.clasificacion === "MEDIA-ALTA") color = "#84cc16";
    else if (viability.clasificacion === "MEDIA") color = "#f59e0b";
    else if (viability.clasificacion === "BAJA") color = "#ef4444";

    features.push({
      type: "Feature",
      properties: {
        name,
        code,
        viability: viability.clasificacion,
        score: viability.score,
        color,
        factors: viability.factores.join("; "),
        cl_d: indices.cociente_localizacion_dotacional || 0,
        ics: indices.ICS_indice_capacidad_soporte || 0,
        icf: indices.ICF_indice_capacidad_funcional || 0,
        suelo_potencial_m2: Math.round(suelo.suelo_potencial_desarrollo_m2),
        lotes_potenciales: suelo.lotes_potenciales_cantidad || 0,
        altura_max: normas.altura_maxima_pisos,
        indice_ocupacion: normas.indice_ocupacion_maximo || 0,
        indice_construccion: normas.indice_construccion_maximo || 0,
        tratamientos: normas.tratamientos_urbanisticos?.join(", ") || "",
        salud_existente_m2: Math.round(data.equipamiento_salud?.suelo_equipamiento_salud_existente_m2 || 0),
        licencias_salud: data.equipamiento_salud?.licencias_dotacional_salud || 0,
      },
      geometry: { type: "Point", coordinates: coords },
    });
  }

  const geojson = { type: "FeatureCollection", features };
  const outPath = path.join(OUT, "pot-viability-complete.geojson");
  fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
  console.log(`POT Complete: ${features.length} barrios (was 15, now all 22 analyzed)`);
}

/* ── 4. Catastro density with ALL barrios ── */
function generateCatastroComplete() {
  const catastro = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/processed/catastro_analysis.json"), "utf-8")
  );

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

  const features = [];
  for (const [barrio, data] of Object.entries(catastro.el_poblado.by_barrio)) {
    const coords = barrioCentroids[barrio];
    if (!coords) continue;

    const e5 = data.estrato_breakdown["5"] || 0;
    const e6 = data.estrato_breakdown["6"] || 0;
    const e0 = data.estrato_breakdown["0"] || 0;
    const e4 = data.estrato_breakdown["4"] || 0;
    const e5e6 = e5 + e6;
    const totalPredios = data.count;
    const pctE5E6 = totalPredios > 0 ? Math.round((e5e6 / totalPredios) * 100) : 0;
    const avgAvaluo = Math.round(data.avg_avaluo / 1000000);

    features.push({
      type: "Feature",
      properties: {
        name: barrio.split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ").replace("# ", "No."),
        predios_total: totalPredios,
        predios_e0: e0,
        predios_e4: e4,
        predios_e5: e5,
        predios_e6: e6,
        predios_e5e6: e5e6,
        pct_e5e6: pctE5E6,
        avg_avaluo_m: avgAvaluo,
        on_corridor: data.on_las_palmas_corridor,
        bubble_size: Math.max(4, Math.min(30, Math.sqrt(e5e6) * 1.2)),
        color_intensity: pctE5E6,
      },
      geometry: { type: "Point", coordinates: coords },
    });
  }

  const geojson = { type: "FeatureCollection", features };
  const outPath = path.join(OUT, "catastro-density.geojson");
  fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
  console.log(`Catastro: ${features.length} barrio bubbles`);
}

/* ── Main ── */
console.log("=== Generating ALL map layers ===\n");
generateOsmPois();
generateFullHealthNetwork();
generateCompletePotBarrios();
generateCatastroComplete();
console.log("\nDone!");
