"""
HPTU Health Facility Data Processing Script
============================================
Processes REPS health facility data and OSM POIs for the HPTU study area.
Study focus: El Poblado / Las Palmas corridor (Medellín, Envigado, Itagüí, Sabaneta).

Outputs:
  - data/processed/health_facilities.json
  - data/processed/osm_pois_filtered.json
"""

import json
import math
import os
from collections import defaultdict, Counter

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE = "/Users/cristianespinal/hptu-localizacion"
RAW  = os.path.join(BASE, "data", "raw")
OUT  = os.path.join(BASE, "data", "processed")

os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------------------
# Study-area constants
# ---------------------------------------------------------------------------
STUDY_LAT  = (6.14, 6.28)
STUDY_LON  = (-75.62, -75.50)

# Las Palmas / El Poblado corridor
CORRIDOR_LAT = (6.17, 6.22)
CORRIDOR_LON = (-75.57, -75.52)

# Candidate zones (approximate centroids for distance estimation)
CANDIDATE_ZONES = {
    "zona_A_las_palmas_km7": {"lat": 6.1950, "lon": -75.5490, "label": "Las Palmas km 7 (vía Las Palmas)"},
    "zona_B_el_tesoro":       {"lat": 6.2050, "lon": -75.5580, "label": "El Tesoro / Loma Los Bernal"},
    "zona_C_envigado_norte":  {"lat": 6.1750, "lon": -75.5650, "label": "Envigado Norte (Av. El Poblado)"},
    "zona_D_sabaneta":        {"lat": 6.1510, "lon": -75.6180, "label": "Sabaneta (Av. Poblado Sur)"},
}

TARGET_MUNIS = {"MEDELLÍN", "ENVIGADO", "ITAGUI", "SABANETA", "ITAGÜÍ"}

# Hospital / clinic keywords to flag inpatient-capable facilities
HOSPITAL_KEYWORDS = [
    "HOSPITAL", "CLÍNICA", "CLINICA", "CENTRO MÉDICO", "CENTRO MEDICO",
    "UNIDAD HOSPITALARIA", "SANATORIO", "ESE ", "E.S.E."
]

# High-complexity service indicators in capacity_instalada
HIGH_COMPLEXITY_CAPS = {
    "INTENSIVA ADULTOS", "CUIDADO INTENSIVO ADULTO", "CUIDADO INTENSIVO NEONATAL",
    "INTERMEDIA ADULTOS", "CUIDADO INTERMEDIO ADULTO", "CUIDADO INTERMEDIO NEONATAL",
    "SALA DE CIRUGÍA", "QUIRÓFANO", "PARTOS", "OBSTETRICIA",
    "INCUBADORA INTENSIVA NEONATAL",
}
MED_COMPLEXITY_CAPS = {
    "URGENCIAS", "OBSERVACIÓN ADULTOS HOMBRES", "OBSERVACIÓN ADULTOS MUJERES",
    "OBSERVACIÓN PEDIÁTRICA", "PEDIÁTRICA", "SALUD MENTAL ADULTO",
}

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def haversine_km(lat1, lon1, lat2, lon2):
    """Return great-circle distance in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2))
         * math.sin(dlon / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def in_bbox(lat, lon, lat_range, lon_range):
    return lat_range[0] <= lat <= lat_range[1] and lon_range[0] <= lon <= lon_range[1]


def in_study_area(lat, lon):
    return in_bbox(lat, lon, STUDY_LAT, STUDY_LON)


def in_corridor(lat, lon):
    return in_bbox(lat, lon, CORRIDOR_LAT, CORRIDOR_LON)


def distances_to_zones(lat, lon):
    """Return dict of {zone_id: distance_km} for all candidate zones."""
    return {
        zid: round(haversine_km(lat, lon, z["lat"], z["lon"]), 3)
        for zid, z in CANDIDATE_ZONES.items()
    }


def infer_complexity(cap_list, nombre=""):
    """Infer complexity from capacity_instalada descriptors."""
    descs = {c.get("descripcion", "").strip().upper() for c in cap_list}
    grupos = {c.get("grupo", "").strip().upper() for c in cap_list}

    if descs & HIGH_COMPLEXITY_CAPS:
        return "Alta complejidad"
    if descs & MED_COMPLEXITY_CAPS or "URGENCIAS" in descs:
        return "Mediana complejidad"
    if "CAMAS" in grupos:
        return "Mediana complejidad (internación)"
    if "AMBULANCIAS" in grupos:
        return "Atención prehospitalaria"
    return "Baja complejidad / Consulta externa"


def extract_beds(cap_list):
    """Return dict with bed counts by type."""
    beds = {}
    total = 0
    for c in cap_list:
        if c.get("grupo", "").upper() == "CAMAS":
            desc = c.get("descripcion", "Hospitalización")
            qty  = int(c.get("cantidad", 0) or 0)
            beds[desc] = beds.get(desc, 0) + qty
            total += qty
    return {"detalle": beds, "total": total}


def is_hospital_like(nombre):
    nombre_up = nombre.upper()
    return any(kw in nombre_up for kw in HOSPITAL_KEYWORDS)


def fuzzy_name_match(name_a, name_b, threshold=0.35):
    """Very simple token-overlap match for cross-referencing names."""
    def tokens(s):
        return set(
            w for w in s.upper().replace(",", " ").replace(".", " ").split()
            if len(w) > 3
        )
    ta, tb = tokens(name_a), tokens(name_b)
    if not ta or not tb:
        return False
    overlap = len(ta & tb)
    return overlap / max(len(ta), len(tb)) >= threshold


# ---------------------------------------------------------------------------
# 1. Load raw data
# ---------------------------------------------------------------------------
print("Loading raw data...")

with open(os.path.join(RAW, "reps_IPS_valley_aburra_unified.json"), encoding="utf-8") as f:
    reps_unified = json.load(f)

with open(os.path.join(RAW, "reps_key_facilities_summary.json"), encoding="utf-8") as f:
    reps_key = json.load(f)

with open(os.path.join(RAW, "osm_pois_summary.json"), encoding="utf-8") as f:
    osm_data = json.load(f)

with open(os.path.join(RAW, "ese_hospitales_antioquia_coords.json"), encoding="utf-8") as f:
    ese_coords_raw = json.load(f)

print(f"  REPS unified: {len(reps_unified)} records")
print(f"  REPS key facilities: {len(reps_key['facilities'])} facilities")
print(f"  OSM POIs: {osm_data['metadata']['total_pois']} POIs")
print(f"  ESE hospitals with coords: {len(ese_coords_raw)}")

# ---------------------------------------------------------------------------
# 2. Build ESE coordinate lookup (name -> {lat, lon})
# ---------------------------------------------------------------------------
ese_lookup = {}
for ese in ese_coords_raw:
    muni = ese.get("nombre_municipio", "").upper()
    if muni not in TARGET_MUNIS and muni not in {"MEDELLÍN", "ENVIGADO", "ITAGÜÍ", "SABANETA"}:
        # Normalize Itagüí
        if "ITAGUI" in muni or "ITAGÜÍ" in muni:
            pass
        else:
            continue
    name = ese.get("raz_n_social_organizaci_n", "")
    punto = ese.get("punto", {})
    try:
        lat = float(punto.get("latitude", 0))
        lon = float(punto.get("longitude", 0))
        if lat and lon:
            ese_lookup[name] = {"lat": lat, "lon": lon, "fuente": "ESE Antioquia datos.gov.co"}
            # Also index by short name / sede
            sede = ese.get("nombre_sede", "")
            if sede and sede != name:
                ese_lookup[sede] = {"lat": lat, "lon": lon, "fuente": "ESE Antioquia datos.gov.co"}
    except (ValueError, TypeError):
        pass

print(f"  ESE coord lookup built: {len(ese_lookup)} entries")

# Build lookup also from reps_key ese_with_coordinates
for ese in reps_key.get("ese_with_coordinates", []):
    muni = ese.get("nombre_municipio", "").upper()
    name = ese.get("raz_n_social_organizaci_n", "")
    sede = ese.get("nombre_sede", "")
    punto = ese.get("punto", {})
    try:
        lat = float(punto.get("latitude", 0))
        lon = float(punto.get("longitude", 0))
        if lat and lon:
            for n in [name, sede]:
                if n and n not in ese_lookup:
                    ese_lookup[n] = {"lat": lat, "lon": lon, "fuente": "ESE Antioquia datos.gov.co (reps_key)"}
    except (ValueError, TypeError):
        pass

print(f"  ESE coord lookup after reps_key merge: {len(ese_lookup)} entries")

# ---------------------------------------------------------------------------
# 3. Build OSM hospital/clinic lookup for cross-referencing
# ---------------------------------------------------------------------------
osm_health = [p for p in osm_data["pois"] if p["category"] == "health"]
osm_hospitals_list = [p for p in osm_health if p["subcategory"] == "hospital"]
osm_clinics_list   = [p for p in osm_health if p["subcategory"] == "clinic"]

# Name-to-coord lookup for OSM
osm_name_lookup = {
    p["name"].upper(): {"lat": p["lat"], "lon": p["lon"], "fuente": "OpenStreetMap"}
    for p in osm_health
    if p["name"] and p["name"] not in ("Sin nombre", "HOSPITAL")
}
print(f"  OSM health name lookup: {len(osm_name_lookup)} entries")


def find_osm_coords(nombre):
    """Try to match a REPS name to an OSM entry."""
    key = nombre.upper()
    if key in osm_name_lookup:
        return osm_name_lookup[key]
    # Fuzzy match
    for osm_name, coords in osm_name_lookup.items():
        if fuzzy_name_match(nombre, osm_name):
            return coords
    return None


def find_ese_coords(nombre):
    """Try to match a REPS name to an ESE entry."""
    if nombre in ese_lookup:
        return ese_lookup[nombre]
    for ese_name, coords in ese_lookup.items():
        if fuzzy_name_match(nombre, ese_name):
            return coords
    return None


# ---------------------------------------------------------------------------
# 4. Filter REPS unified records for target municipalities
# ---------------------------------------------------------------------------
print("\nFiltering REPS unified records...")

target_records = [
    r for r in reps_unified
    if r.get("municipio", "").upper() in TARGET_MUNIS
]
print(f"  Records in target municipalities: {len(target_records)}")

# De-duplicate by codigo_habilitacion + nombre_prestador
# (same NIT may have multiple sedes — keep all sedes but aggregate)
by_prestador = defaultdict(list)
for r in target_records:
    key = r.get("codigo_habilitacion", r.get("nit", "")) + "|" + r.get("nombre_prestador", "")
    by_prestador[key].append(r)

print(f"  Unique prestadores: {len(by_prestador)}")

# Also load key_facilities for richer complexity/bed data
key_by_hab = {}
for f in reps_key["facilities"]:
    hab = f.get("codigo_habilitacion", "")
    if hab:
        key_by_hab[hab] = f

# ---------------------------------------------------------------------------
# 5. Build consolidated health facilities list
# ---------------------------------------------------------------------------
print("\nBuilding consolidated health facilities...")

facilities = []
seen_habilitacion = set()

for key_id, recs in by_prestador.items():
    # Use the first record as primary; merge capacity across sedes
    primary = recs[0]
    nombre  = primary.get("nombre_prestador", "")
    hab_code = primary.get("codigo_habilitacion", "")
    muni     = primary.get("municipio", "")

    # Skip duplicates (same habilitacion already processed)
    if hab_code and hab_code in seen_habilitacion:
        continue
    if hab_code:
        seen_habilitacion.add(hab_code)

    # Aggregate capacity from all sedes
    all_cap = []
    all_sedes = []
    for r in recs:
        all_cap.extend(r.get("capacidad_instalada", []))
        sede_info = {
            "nombre_sede": r.get("nombre_sede", ""),
            "barrio": r.get("barrio", ""),
            "direccion": r.get("direccion", ""),
            "tipo_zona": r.get("tipo_zona", ""),
        }
        all_sedes.append(sede_info)

    # Beds
    beds_info = extract_beds(all_cap)

    # Complexity
    nivel_raw = primary.get("nivel", "Sin Dato")
    if nivel_raw not in ("Sin Dato", "", None):
        nivel_map = {"1": "Baja complejidad", "2": "Mediana complejidad", "3": "Alta complejidad"}
        complejidad = nivel_map.get(str(nivel_raw), nivel_raw)
    else:
        # Check key_facilities for enriched data
        kf = key_by_hab.get(hab_code, {})
        kf_nivel = kf.get("nivel_complejidad", "No reportado")
        if kf_nivel not in ("No reportado", "", None):
            nivel_map2 = {"1": "Baja complejidad", "2": "Mediana complejidad", "3": "Alta complejidad"}
            complejidad = nivel_map2.get(str(kf_nivel), kf_nivel)
        else:
            complejidad = infer_complexity(all_cap, nombre)

    # Beds from key_facilities if available
    if hab_code in key_by_hab:
        kf = key_by_hab[hab_code]
        kf_beds = kf.get("camas", {})
        kf_total = kf.get("total_camas", 0)
        if kf_total > 0 and beds_info["total"] == 0:
            beds_info = {"detalle": kf_beds, "total": kf_total}

    # Is it hospital-like?
    hospital_flag = (
        is_hospital_like(nombre)
        or beds_info["total"] > 0
        or "hospital" in complejidad.lower()
        or complejidad in ("Alta complejidad", "Mediana complejidad", "Mediana complejidad (internación)")
    )

    # Coordinates: try ESE → OSM → None
    coords = find_ese_coords(nombre)
    coord_fuente = coords["fuente"] if coords else None
    if not coords:
        osm_coords = find_osm_coords(nombre)
        if osm_coords:
            coords = osm_coords
            coord_fuente = "OpenStreetMap"

    lat = coords["lat"] if coords else None
    lon = coords["lon"] if coords else None

    # Distance to zones (only if coords available)
    dist_to_zones = distances_to_zones(lat, lon) if lat and lon else None

    # In study area / corridor flags
    in_study = in_study_area(lat, lon) if lat and lon else None
    in_corr  = in_corridor(lat, lon) if lat and lon else None

    # Services summary
    cap_descriptions = list({c.get("descripcion", "") for c in all_cap if c.get("descripcion")})
    services = sorted(cap_descriptions)

    # Nearest zone
    nearest_zone = None
    nearest_km   = None
    if dist_to_zones:
        nearest_zone = min(dist_to_zones, key=dist_to_zones.get)
        nearest_km   = dist_to_zones[nearest_zone]

    fac = {
        "nombre": nombre,
        "sedes": all_sedes,
        "municipio": muni,
        "direccion_principal": primary.get("direccion", ""),
        "barrio_principal": primary.get("barrio", ""),
        "telefono": primary.get("telefono", ""),
        "email": primary.get("email", ""),
        "nit": primary.get("nit", ""),
        "codigo_habilitacion": hab_code,
        "naturaleza": primary.get("naturaleza", ""),
        "ese": primary.get("ese", "NO"),
        "caracter": primary.get("caracter", "Sin Dato"),
        "complejidad": complejidad,
        "es_hospital": hospital_flag,
        "camas": beds_info,
        "servicios": services,
        "coordenadas": {
            "lat": lat,
            "lon": lon,
            "fuente": coord_fuente,
        },
        "en_area_estudio": in_study,
        "en_corredor_las_palmas": in_corr,
        "distancias_km": dist_to_zones,
        "zona_mas_cercana": nearest_zone,
        "distancia_zona_mas_cercana_km": nearest_km,
        "fecha_apertura": primary.get("fecha_apertura", ""),
    }
    facilities.append(fac)

print(f"  Total consolidated facilities: {len(facilities)}")
hospitals_only = [f for f in facilities if f["es_hospital"]]
print(f"  Hospital-like facilities: {len(hospitals_only)}")
with_coords = [f for f in facilities if f["coordenadas"]["lat"]]
print(f"  Facilities with coordinates: {len(with_coords)}")
in_study_count = [f for f in facilities if f.get("en_area_estudio")]
print(f"  In study area (with coords): {len(in_study_count)}")
in_corr_count = [f for f in facilities if f.get("en_corredor_las_palmas")]
print(f"  In Las Palmas corridor (with coords): {len(in_corr_count)}")

# Sort: hospitals first, then by municipality, then by name
facilities.sort(key=lambda x: (
    0 if x["es_hospital"] else 1,
    x["municipio"],
    x["nombre"]
))

# ---------------------------------------------------------------------------
# 6. Filter OSM POIs for study area and corridor
# ---------------------------------------------------------------------------
print("\nFiltering OSM POIs...")

osm_filtered = {
    "metadata": {
        "source": "OpenStreetMap via Overpass API",
        "original_bbox": osm_data["metadata"]["bbox"],
        "study_area_bbox": {
            "south": STUDY_LAT[0], "north": STUDY_LAT[1],
            "west":  STUDY_LON[0], "east":  STUDY_LON[1],
        },
        "corridor_bbox": {
            "south": CORRIDOR_LAT[0], "north": CORRIDOR_LAT[1],
            "west":  CORRIDOR_LON[0], "east":  CORRIDOR_LON[1],
        },
        "candidate_zones": CANDIDATE_ZONES,
    },
    "hospitals_clinics": [],
    "corridor_hospitals_clinics": [],
    "corridor_schools_universities": [],
    "corridor_commercial": [],
    "all_health_study_area": [],
}

for p in osm_data["pois"]:
    lat, lon = p["lat"], p["lon"]
    dist_zones = distances_to_zones(lat, lon)
    nearest_z  = min(dist_zones, key=dist_zones.get)
    nearest_d  = dist_zones[nearest_z]

    enriched = dict(p)
    enriched["distancias_km"] = dist_zones
    enriched["zona_mas_cercana"] = nearest_z
    enriched["distancia_zona_mas_cercana_km"] = nearest_d
    enriched["en_corredor"] = in_corridor(lat, lon)

    if not in_study_area(lat, lon):
        continue

    cat = p.get("category", "")
    sub = p.get("subcategory", "")

    if cat == "health":
        osm_filtered["all_health_study_area"].append(enriched)
        if sub in ("hospital", "clinic"):
            osm_filtered["hospitals_clinics"].append(enriched)
            if in_corridor(lat, lon):
                osm_filtered["corridor_hospitals_clinics"].append(enriched)

    elif cat == "education" and in_corridor(lat, lon):
        osm_filtered["corridor_schools_universities"].append(enriched)

    elif cat == "commercial" and in_corridor(lat, lon):
        osm_filtered["corridor_commercial"].append(enriched)

# Sort each list by distance to zona_B (most central to corridor)
for key in osm_filtered:
    if isinstance(osm_filtered[key], list):
        osm_filtered[key].sort(key=lambda x: x.get("distancias_km", {}).get("zona_B_el_tesoro", 999))

# Add counts to metadata
osm_filtered["metadata"]["counts"] = {
    k: len(v) for k, v in osm_filtered.items() if isinstance(v, list)
}

print(f"  All health (study area): {len(osm_filtered['all_health_study_area'])}")
print(f"  Hospitals/clinics (study area): {len(osm_filtered['hospitals_clinics'])}")
print(f"  Corridor hospitals/clinics: {len(osm_filtered['corridor_hospitals_clinics'])}")
print(f"  Corridor schools/universities: {len(osm_filtered['corridor_schools_universities'])}")
print(f"  Corridor commercial: {len(osm_filtered['corridor_commercial'])}")

# ---------------------------------------------------------------------------
# 7. Cross-reference: enrich OSM hospital list with REPS data
# ---------------------------------------------------------------------------
print("\nCross-referencing REPS with OSM hospitals...")

# Build a quick name lookup for REPS facilities
reps_name_lookup = {f["nombre"].upper(): f for f in facilities}

matched = 0
for osm_h in osm_filtered["hospitals_clinics"]:
    osm_name_up = osm_h["name"].upper()
    reps_match = reps_name_lookup.get(osm_name_up)
    if not reps_match:
        for reps_name, reps_f in reps_name_lookup.items():
            if fuzzy_name_match(osm_name_up, reps_name):
                reps_match = reps_f
                break
    if reps_match:
        osm_h["reps_match"] = {
            "nombre": reps_match["nombre"],
            "codigo_habilitacion": reps_match["codigo_habilitacion"],
            "complejidad": reps_match["complejidad"],
            "camas_total": reps_match["camas"]["total"],
            "naturaleza": reps_match["naturaleza"],
        }
        matched += 1
    else:
        osm_h["reps_match"] = None

print(f"  OSM hospitals matched to REPS: {matched} / {len(osm_filtered['hospitals_clinics'])}")

# ---------------------------------------------------------------------------
# 8. Also update REPS facilities with OSM coords where missing
# ---------------------------------------------------------------------------
print("\nBack-filling REPS coordinates from OSM cross-reference...")
backfill_count = 0
for fac in facilities:
    if fac["coordenadas"]["lat"]:
        continue
    osm_coords = find_osm_coords(fac["nombre"])
    if osm_coords:
        fac["coordenadas"]["lat"] = osm_coords["lat"]
        fac["coordenadas"]["lon"] = osm_coords["lon"]
        fac["coordenadas"]["fuente"] = "OpenStreetMap (cross-referencia)"
        fac["distancias_km"] = distances_to_zones(osm_coords["lat"], osm_coords["lon"])
        fac["en_area_estudio"] = in_study_area(osm_coords["lat"], osm_coords["lon"])
        fac["en_corredor_las_palmas"] = in_corridor(osm_coords["lat"], osm_coords["lon"])
        nearest_z = min(fac["distancias_km"], key=fac["distancias_km"].get)
        fac["zona_mas_cercana"] = nearest_z
        fac["distancia_zona_mas_cercana_km"] = fac["distancias_km"][nearest_z]
        backfill_count += 1

print(f"  Back-filled: {backfill_count} facilities")

# ---------------------------------------------------------------------------
# 9. Summary statistics
# ---------------------------------------------------------------------------
muni_counts = Counter(f["municipio"] for f in facilities)
complexity_counts = Counter(f["complejidad"] for f in facilities)
hospital_with_coords = [f for f in facilities if f["es_hospital"] and f["coordenadas"]["lat"]]
high_med = [f for f in facilities if f["complejidad"] in (
    "Alta complejidad", "Mediana complejidad", "Mediana complejidad (internación)"
)]

summary = {
    "metadata": {
        "descripcion": "Establecimientos de salud IPS en Medellín, Envigado, Itagüí y Sabaneta",
        "fuentes": [
            "REPS Antioquia - datos.gov.co/resource/b4dp-ximh (actualizado 2025-03-19)",
            "ESE Hospitales Antioquia - datos.gov.co/resource/pi36-fdpk",
            "OpenStreetMap Overpass API",
            "IPS complejidad nacional - datos.gov.co/resource/ugc5-acjp",
        ],
        "area_estudio": "El Poblado / Las Palmas / Envigado corredor",
        "bbox_estudio": {
            "sur": STUDY_LAT[0], "norte": STUDY_LAT[1],
            "oeste": STUDY_LON[0], "este": STUDY_LON[1],
        },
        "bbox_corredor": {
            "sur": CORRIDOR_LAT[0], "norte": CORRIDOR_LAT[1],
            "oeste": CORRIDOR_LON[0], "este": CORRIDOR_LON[1],
        },
        "zonas_candidatas": CANDIDATE_ZONES,
        "fecha_procesamiento": "2026-02-27",
        "estadisticas": {
            "total_prestadores": len(facilities),
            "hospitales_clinicas_inpatient": len(hospitals_only),
            "con_coordenadas": len([f for f in facilities if f["coordenadas"]["lat"]]),
            "en_area_estudio": len([f for f in facilities if f.get("en_area_estudio")]),
            "en_corredor_las_palmas": len([f for f in facilities if f.get("en_corredor_las_palmas")]),
            "por_municipio": dict(muni_counts),
            "por_complejidad": dict(complexity_counts),
            "alta_mediana_complejidad": len(high_med),
            "hospitales_con_coordenadas": len(hospital_with_coords),
        },
    },
    "facilities": facilities,
}

# ---------------------------------------------------------------------------
# 10. Save outputs
# ---------------------------------------------------------------------------
print("\nSaving outputs...")

health_out = os.path.join(OUT, "health_facilities.json")
with open(health_out, "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)
print(f"  Saved: {health_out}")

osm_out = os.path.join(OUT, "osm_pois_filtered.json")
with open(osm_out, "w", encoding="utf-8") as f:
    json.dump(osm_filtered, f, ensure_ascii=False, indent=2)
print(f"  Saved: {osm_out}")

# ---------------------------------------------------------------------------
# 11. Print final results summary
# ---------------------------------------------------------------------------
print("\n" + "="*70)
print("RESULTS SUMMARY")
print("="*70)

print(f"\nTotal IPS prestadores procesados: {len(facilities)}")
print(f"  Hospitales/clínicas (inpatient): {len(hospitals_only)}")
print(f"  Alta/mediana complejidad: {len(high_med)}")
print(f"  Con coordenadas: {len([f for f in facilities if f['coordenadas']['lat']])}")
print(f"  En área estudio: {len([f for f in facilities if f.get('en_area_estudio')])}")
print(f"  En corredor Las Palmas: {len([f for f in facilities if f.get('en_corredor_las_palmas')])}")

print("\n--- Por municipio ---")
for m, c in sorted(muni_counts.items()):
    print(f"  {m}: {c}")

print("\n--- Por complejidad ---")
for cx, c in sorted(complexity_counts.items(), key=lambda x: -x[1]):
    print(f"  {cx}: {c}")

print("\n--- Hospitales con coordenadas en área de estudio ---")
hospitals_study = [
    f for f in facilities
    if f["es_hospital"] and f.get("en_area_estudio") and f["coordenadas"]["lat"]
]
hospitals_study.sort(key=lambda x: x.get("distancia_zona_mas_cercana_km", 999))
for h in hospitals_study:
    coord = h["coordenadas"]
    camas = h["camas"]["total"]
    dists = h.get("distancias_km", {})
    dA = dists.get("zona_A_las_palmas_km7", "?")
    dB = dists.get("zona_B_el_tesoro", "?")
    dC = dists.get("zona_C_envigado_norte", "?")
    print(
        f"  {h['nombre'][:45]:<45} | {h['municipio']:<10} | camas:{camas:>3} | "
        f"cx:{h['complejidad'][:8]} | "
        f"ZA:{dA:>5}km ZB:{dB:>5}km ZC:{dC:>5}km"
    )

print("\n--- OSM Hospitals/Clínicas en corredor Las Palmas ---")
for p in osm_filtered["corridor_hospitals_clinics"]:
    reps = p.get("reps_match")
    reps_str = f" [REPS: {reps['complejidad'][:8]}, {reps['camas_total']} camas]" if reps else ""
    print(f"  {p['name']:<40} | {p['subcategory']:<8} | lat:{p['lat']:.5f} lon:{p['lon']:.5f}{reps_str}")

print("\n--- OSM Escuelas/Universidades en corredor ---")
for p in osm_filtered["corridor_schools_universities"][:15]:
    print(f"  {p['name']:<40} | {p['subcategory']:<10} | lat:{p['lat']:.5f} lon:{p['lon']:.5f}")

print("\n--- OSM Comercial (malls) en corredor ---")
for p in osm_filtered["corridor_commercial"]:
    if "mall" in p.get("subcategory", "").lower():
        dB = p.get("distancias_km", {}).get("zona_B_el_tesoro", "?")
        print(f"  {p['name']:<40} | lat:{p['lat']:.5f} lon:{p['lon']:.5f} | dist ZB:{dB}km")

print("\n--- Distancias resumen (hospitales con camas > 0 al corredor) ---")
beds_facs = sorted(
    [f for f in facilities if f["camas"]["total"] > 0 and f["coordenadas"]["lat"]],
    key=lambda x: x.get("distancia_zona_mas_cercana_km", 999)
)
for h in beds_facs:
    dists = h.get("distancias_km", {})
    print(
        f"  {h['nombre'][:45]:<45} | camas:{h['camas']['total']:>4} | "
        f"zona más cercana: {h['zona_mas_cercana']} ({h['distancia_zona_mas_cercana_km']}km)"
    )

print("\n" + "="*70)
print(f"Output files:")
print(f"  {health_out}")
print(f"  {osm_out}")
print("="*70)
