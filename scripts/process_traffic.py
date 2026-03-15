#!/usr/bin/env python3
"""
Traffic data processing for HPTU Las Palmas / El Poblado corridor study.

Sources
-------
- aforos_vehiculares.csv     : ~75 K records, 15-min vehicle counts at intersections.
  Fields of interest (latin-1 encoding, accent chars in column names):
    NODO, COORDENADAX (lon), COORDENADAY (lat), HORA_A (hour 0-23), MINUTO_A,
    AUTOS, BUSES, CAMIONES, MOTOS, BICICLETAS (raw 15-min counts),
    EQUIV_X_15_MIN (PCE), NOMBRE_COMUNA, CODIGO, AÑO_ENTERO

- velocidad_tiempo_viaje_gt.csv : ~682 K records, per-observation corridor speeds.
  Fields: NOMBRE_CORREDOR, SENTIDO, INICIO, FIN, LONGITUD_KM,
          VELOCIDAD_KM/H, TV_MINUTOS, HORA, AÑO
"""

import csv
import json
import math
import os
from collections import defaultdict

# ── paths ─────────────────────────────────────────────────────────────────────
RAW_DIR        = "/Users/cristianespinal/hptu-localizacion/data/raw"
PROCESSED_DIR  = "/Users/cristianespinal/hptu-localizacion/data/processed"
AFOROS_FILE    = os.path.join(RAW_DIR, "aforos_vehiculares.csv")
VELOCIDAD_FILE = os.path.join(RAW_DIR, "velocidad_tiempo_viaje_gt.csv")
OUTPUT_FILE    = os.path.join(PROCESSED_DIR, "traffic_analysis.json")

os.makedirs(PROCESSED_DIR, exist_ok=True)

# ── study-area filter ─────────────────────────────────────────────────────────
LAT_MIN, LAT_MAX = 6.17, 6.22
LON_MIN, LON_MAX = -75.58, -75.52

CORRIDOR_KEYWORDS = [
    "palmas", "poblado", "transversal", "las vegas",
    "autopista", "guayabal", "regional", "san juan",
]

# Peak windows
AM_HOURS = {6, 7, 8}
PM_HOURS = {16, 17, 18}


# ════════════════════════════════════════════════════════════════════════════════
# Helper utilities
# ════════════════════════════════════════════════════════════════════════════════
def safe_int(v):
    """Convert a CSV cell to int; empty / quoted-empty / non-numeric → 0."""
    if v is None:
        return 0
    v = v.strip().strip('"')
    if not v:
        return 0
    try:
        return int(float(v))
    except (ValueError, TypeError):
        return 0


def safe_float(v):
    if v is None:
        return None
    v = v.strip().strip('"')
    if not v:
        return None
    try:
        return float(v)
    except (ValueError, TypeError):
        return None


def avg(total, count):
    return round(total / count, 2) if count > 0 else None


def find_key(fieldnames, fragment):
    """Return the actual column name that contains *fragment* (case-insensitive)."""
    for k in fieldnames:
        if fragment.lower() in k.lower():
            return k
    return None


# ════════════════════════════════════════════════════════════════════════════════
# 1. aforos_vehiculares  ── vehicle counts at intersections
# ════════════════════════════════════════════════════════════════════════════════
print("Processing aforos_vehiculares.csv …")

nodo_data = defaultdict(lambda: {
    # identity
    "nodo": None,
    "intersection": None,
    "via_principal": None,
    "via_secundaria": None,
    "lat": None, "lon": None,
    "codigo": None, "nombre_comuna": None,
    "years": set(),
    # raw 15-min cumulative counts
    "autos": 0, "buses": 0, "camiones": 0,
    "motos": 0, "bicicletas": 0,
    "pce_total": 0,           # EQUIV_X_15_MIN (passenger-car equivalents)
    "record_count": 0,        # number of 15-min intervals
    # peak breakdowns (raw vehicle sum)
    "am_total": 0, "pm_total": 0, "off_total": 0,
    # hourly accumulator  hour (int) → raw count
    "hourly": defaultdict(int),
})

total_read = 0
filtered_count = 0

with open(AFOROS_FILE, encoding="latin-1", newline="") as f:
    reader = csv.DictReader(f)
    fnames = reader.fieldnames

    # Resolve potentially mis-encoded column names once
    k_via1     = find_key(fnames, "A_PRINCIPAL")
    k_via2     = find_key(fnames, "A_SECUNDARIA")
    k_intersec = find_key(fnames, "NTERSEC")
    k_ano      = find_key(fnames, "O_ENTERO")
    k_pce      = "EQUIV_X_15_MIN"

    for row in reader:
        total_read += 1
        try:
            lat = float(row["COORDENADAY"])
            lon = float(row["COORDENADAX"])
        except (ValueError, TypeError):
            lat = lon = 0.0

        in_area = LAT_MIN <= lat <= LAT_MAX and LON_MIN <= lon <= LON_MAX
        if not in_area:
            continue
        filtered_count += 1

        nodo = row.get("NODO", "").strip()
        d = nodo_data[nodo]

        # Fill identity once
        if d["nodo"] is None:
            d["nodo"]          = nodo
            d["intersection"]  = row.get(k_intersec, "").strip() if k_intersec else ""
            d["via_principal"] = row.get(k_via1, "").strip() if k_via1 else ""
            d["via_secundaria"]= row.get(k_via2, "").strip() if k_via2 else ""
            d["lat"]           = lat
            d["lon"]           = lon
            d["codigo"]        = row.get("CODIGO", "").strip()
            d["nombre_comuna"] = row.get("NOMBRE_COMUNA", "").strip()

        # Year
        ano = safe_int(row.get(k_ano, "0") if k_ano else "0")
        if ano > 0:
            d["years"].add(ano)

        # Raw 15-min vehicle counts
        autos    = safe_int(row.get("AUTOS", "0"))
        buses    = safe_int(row.get("BUSES", "0"))
        camiones = safe_int(row.get("CAMIONES", "0"))
        motos    = safe_int(row.get("MOTOS", "0"))
        bici     = safe_int(row.get("BICICLETAS", "0"))
        pce      = safe_int(row.get(k_pce, "0"))
        total_veh = autos + buses + camiones + motos + bici

        d["autos"]      += autos
        d["buses"]      += buses
        d["camiones"]   += camiones
        d["motos"]      += motos
        d["bicicletas"] += bici
        d["pce_total"]  += pce
        d["record_count"] += 1

        # Hour classification
        hour = safe_int(row.get("HORA_A", "-1"))
        d["hourly"][hour] += total_veh

        if hour in AM_HOURS:
            d["am_total"] += total_veh
        elif hour in PM_HOURS:
            d["pm_total"] += total_veh
        else:
            d["off_total"] += total_veh

print(f"  Read {total_read:,} records; {filtered_count:,} in study area "
      f"({len(nodo_data)} unique nodes).")


# ── Serialise intersection records ────────────────────────────────────────────
def dominant_peak(d):
    a, p = d["am_total"], d["pm_total"]
    if a == 0 and p == 0:
        return "unknown"
    return "AM" if a >= p else "PM"


def peak_hour(hourly_dict, hour_set):
    candidates = {h: v for h, v in hourly_dict.items() if h in hour_set}
    if not candidates:
        return None
    return max(candidates, key=candidates.__getitem__)


aforos_records = []
for nodo_key, d in sorted(nodo_data.items(),
                           key=lambda x: -(x[1]["autos"] + x[1]["buses"] +
                                           x[1]["camiones"] + x[1]["motos"])):
    total_veh = d["autos"] + d["buses"] + d["camiones"] + d["motos"] + d["bicicletas"]
    hourly = {str(h): v for h, v in sorted(d["hourly"].items()) if h >= 0}

    # Derive typical daily volumes: data covers specific survey days, not a full year.
    # Report aggregate totals across all records as-is.
    record = {
        "nodo": nodo_key,
        "intersection": d["intersection"],
        "via_principal": d["via_principal"],
        "via_secundaria": d["via_secundaria"],
        "lat": d["lat"],
        "lon": d["lon"],
        "codigo_comuna": d["codigo"],
        "nombre_comuna": d["nombre_comuna"],
        "years_surveyed": sorted(d["years"]),
        "intervals_15min": d["record_count"],
        "vehicle_composition": {
            "autos": d["autos"],
            "buses": d["buses"],
            "camiones": d["camiones"],
            "motos": d["motos"],
            "bicicletas": d["bicicletas"],
            "total_vehicles": total_veh,
            "pce_total": d["pce_total"],
        },
        "mode_shares_pct": {
            "autos":    round(d["autos"]    / total_veh * 100, 1) if total_veh else 0,
            "motos":    round(d["motos"]    / total_veh * 100, 1) if total_veh else 0,
            "buses":    round(d["buses"]    / total_veh * 100, 1) if total_veh else 0,
            "camiones": round(d["camiones"] / total_veh * 100, 1) if total_veh else 0,
        },
        "peak_analysis": {
            "dominant_peak": dominant_peak(d),
            "am_total_vehicles": d["am_total"],
            "pm_total_vehicles": d["pm_total"],
            "off_peak_total": d["off_total"],
            "am_share_pct": round(d["am_total"] / total_veh * 100, 1) if total_veh else 0,
            "pm_share_pct": round(d["pm_total"] / total_veh * 100, 1) if total_veh else 0,
            "busiest_am_hour": peak_hour(d["hourly"], AM_HOURS),
            "busiest_pm_hour": peak_hour(d["hourly"], PM_HOURS),
            "peak_hour_of_day": (
                max(d["hourly"], key=d["hourly"].__getitem__)
                if d["hourly"] else None
            ),
            "hourly_profile": hourly,
        },
    }
    aforos_records.append(record)


# ════════════════════════════════════════════════════════════════════════════════
# 2. Aggregate peak patterns across the study area
# ════════════════════════════════════════════════════════════════════════════════
agg_hourly = defaultdict(int)
agg_am = agg_pm = agg_off = 0

for d in nodo_data.values():
    agg_am  += d["am_total"]
    agg_pm  += d["pm_total"]
    agg_off += d["off_total"]
    for h, v in d["hourly"].items():
        agg_hourly[h] += v

grand_total = agg_am + agg_pm + agg_off or 1

peak_patterns = {
    "study_area": "El Poblado / Las Palmas corridor "
                  "(lat 6.17–6.22, lon −75.58 to −75.52)",
    "intersections_analysed": len(nodo_data),
    "total_vehicles_all_intervals": agg_am + agg_pm + agg_off,
    "am_peak_total":   agg_am,
    "pm_peak_total":   agg_pm,
    "off_peak_total":  agg_off,
    "am_peak_share_pct": round(agg_am  / grand_total * 100, 1),
    "pm_peak_share_pct": round(agg_pm  / grand_total * 100, 1),
    "dominant_peak_study_area": "AM" if agg_am >= agg_pm else "PM",
    "busiest_hour_of_day": (
        max(agg_hourly, key=agg_hourly.__getitem__)
        if agg_hourly else None
    ),
    "peak_hour_AM": max(
        (h for h in agg_hourly if h in AM_HOURS),
        key=agg_hourly.__getitem__, default=None
    ),
    "peak_hour_PM": max(
        (h for h in agg_hourly if h in PM_HOURS),
        key=agg_hourly.__getitem__, default=None
    ),
    "hourly_profile": {
        str(h): v
        for h, v in sorted(agg_hourly.items()) if h >= 0
    },
}


# ════════════════════════════════════════════════════════════════════════════════
# 3. velocidad_tiempo_viaje_gt  ── corridor travel speeds
# ════════════════════════════════════════════════════════════════════════════════
print("Processing velocidad_tiempo_viaje_gt.csv …")


def matches_corridor(name):
    n = name.lower()
    return any(kw in n for kw in CORRIDOR_KEYWORDS)


corridor_accum = defaultdict(lambda: {
    "nombre": None, "corridor_id": None,
    "directions": set(),
    "segments": set(),
    "length_km": None,
    "years": set(),
    "speed_sum": 0.0, "speed_n": 0,
    "tv_sum": 0.0,    "tv_n": 0,
    "am_speed_sum": 0.0, "am_speed_n": 0,
    "pm_speed_sum": 0.0, "pm_speed_n": 0,
    "off_speed_sum": 0.0,"off_speed_n": 0,
    "min_speed": math.inf,
    "max_speed": -math.inf,
    "hourly_speeds": defaultdict(list),   # hour → [speed, …]
})

vel_read = vel_filtered = 0

with open(VELOCIDAD_FILE, encoding="latin-1", newline="") as f:
    reader = csv.DictReader(f)
    vel_fnames = reader.fieldnames
    # Resolve the AÑO key once (encoded as AÃ\x91O in latin-1)
    # The AÑO field encodes as 'AÃ\x91O' under latin-1; find_key matches on '\x91O'
    _vel_ano_key = find_key(vel_fnames, "\x91O") or "AÃ\x91O"

    for row in reader:
        vel_read += 1
        nombre = row.get("NOMBRE_CORREDOR", "").strip()
        if not matches_corridor(nombre):
            continue
        vel_filtered += 1

        c = corridor_accum[nombre]
        if c["nombre"] is None:
            c["nombre"]      = nombre
            c["corridor_id"] = row.get("CORREDOR", "").strip()

        c["directions"].add(row.get("SENTIDO", "").strip())
        inicio = row.get("INICIO", "").strip()
        fin    = row.get("FIN",    "").strip()
        if inicio and fin:
            c["segments"].add(f"{inicio} → {fin}")

        km = safe_float(row.get("LONGITUD_KM", ""))
        if km and km > 0 and c["length_km"] is None:
            c["length_km"] = km

        # AÑO column appears as "AÃ\x91O" under latin-1 decode of the UTF-8 source.
        # Use the pre-resolved key stored at open time.
        ano_v = safe_int(row.get(_vel_ano_key, "0"))
        if ano_v > 0:
            c["years"].add(ano_v)

        speed  = safe_float(row.get("VELOCIDAD_KM/H", ""))
        tv_min = safe_float(row.get("TV_MINUTOS", ""))
        hour   = safe_int(row.get("HORA", "-1"))

        if speed and speed > 0:
            c["speed_sum"] += speed
            c["speed_n"]   += 1
            c["min_speed"]  = min(c["min_speed"], speed)
            c["max_speed"]  = max(c["max_speed"], speed)
            c["hourly_speeds"][hour].append(speed)

            if hour in AM_HOURS:
                c["am_speed_sum"] += speed;  c["am_speed_n"] += 1
            elif hour in PM_HOURS:
                c["pm_speed_sum"] += speed;  c["pm_speed_n"] += 1
            else:
                c["off_speed_sum"] += speed; c["off_speed_n"] += 1

        if tv_min and tv_min > 0:
            c["tv_sum"] += tv_min
            c["tv_n"]   += 1

print(f"  Read {vel_read:,} records; {vel_filtered:,} matching corridors "
      f"({len(corridor_accum)} unique).")


def congestion_index(peak_spd, freeflow_spd):
    """Fraction of free-flow speed lost: 0 = no congestion, 1 = standstill."""
    if peak_spd and freeflow_spd and freeflow_spd > 0:
        return round(1 - peak_spd / freeflow_spd, 3)
    return None


corridor_speeds = []
for name, c in sorted(corridor_accum.items()):
    avg_spd    = avg(c["speed_sum"],    c["speed_n"])
    am_spd     = avg(c["am_speed_sum"], c["am_speed_n"])
    pm_spd     = avg(c["pm_speed_sum"], c["pm_speed_n"])
    off_spd    = avg(c["off_speed_sum"],c["off_speed_n"])
    avg_tv     = avg(c["tv_sum"],       c["tv_n"])

    # Estimated travel time at peak from speed + length
    def est_tt(speed, km):
        if speed and km and speed > 0:
            return round(km / speed * 60, 1)
        return None

    km = c["length_km"]

    # Hourly speed profile
    hourly_spd_profile = {
        str(h): round(sum(speeds) / len(speeds), 2)
        for h, speeds in sorted(c["hourly_speeds"].items())
        if h >= 0 and speeds
    }

    record = {
        "corridor_name": name,
        "corridor_id": c["corridor_id"],
        "directions": sorted(c["directions"]),
        "segment_endpoints": sorted(c["segments"]),
        "length_km": km,
        "years_available": sorted(y for y in c["years"] if y > 0),
        "speed_stats": {
            "avg_speed_kmh":       avg_spd,
            "min_speed_kmh":       round(c["min_speed"], 2) if c["min_speed"] != math.inf  else None,
            "max_speed_kmh":       round(c["max_speed"], 2) if c["max_speed"] != -math.inf else None,
            "avg_travel_time_min": avg_tv,
            "total_observations":  c["speed_n"],
        },
        "peak_analysis": {
            "am_avg_speed_kmh":         am_spd,
            "pm_avg_speed_kmh":         pm_spd,
            "off_peak_avg_speed_kmh":   off_spd,
            "am_travel_time_est_min":   est_tt(am_spd, km),
            "pm_travel_time_est_min":   est_tt(pm_spd, km),
            "off_peak_travel_time_est_min": est_tt(off_spd, km),
            "am_congestion_index":  congestion_index(am_spd, off_spd),
            "pm_congestion_index":  congestion_index(pm_spd, off_spd),
            "slower_peak": (
                "AM" if (am_spd and pm_spd and am_spd <= pm_spd)
                else "PM" if (am_spd and pm_spd and pm_spd < am_spd)
                else ("AM" if am_spd else ("PM" if pm_spd else "unknown"))
            ),
        },
        "hourly_speed_profile_kmh": hourly_spd_profile,
    }
    corridor_speeds.append(record)

# Sort: Las Palmas first, then El Poblado, then others alphabetically
def sort_key(r):
    n = r["corridor_name"].lower()
    if   "palmas"  in n: return (0, n)
    elif "poblado" in n: return (1, n)
    elif "autopista" in n: return (2, n)
    else: return (3, n)

corridor_speeds.sort(key=sort_key)


# ════════════════════════════════════════════════════════════════════════════════
# 4. Assemble output
# ════════════════════════════════════════════════════════════════════════════════
output = {
    "source": "Aforos Vehiculares Medellín - MEData",
    "processing_notes": {
        "script": "process_traffic.py",
        "aforos_spatial_filter": (
            f"COORDENADAY in [{LAT_MIN}, {LAT_MAX}], "
            f"COORDENADAX in [{LON_MIN}, {LON_MAX}]"
        ),
        "corridor_keywords": CORRIDOR_KEYWORDS,
        "am_peak_hours": sorted(AM_HOURS),
        "pm_peak_hours": sorted(PM_HOURS),
        "note_vehicle_counts": (
            "Counts use raw 15-min fields (AUTOS, BUSES, CAMIONES, MOTOS, "
            "BICICLETAS). AUTOS_HORA/VOLUMEN_TOTAL_HORA are empty in most rows."
        ),
        "aforos_total_records_read": total_read,
        "aforos_records_in_study_area": filtered_count,
        "velocidad_total_records_read": vel_read,
        "velocidad_records_matched": vel_filtered,
    },
    "aforos_near_las_palmas": aforos_records,
    "corridor_speeds": corridor_speeds,
    "peak_patterns": peak_patterns,
}

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"\nOutput written → {OUTPUT_FILE}")
print(f"  Intersections  : {len(aforos_records)}")
print(f"  Corridors       : {len(corridor_speeds)}")

# ── Console summary ───────────────────────────────────────────────────────────
W = 72
print()
print("=" * W)
print("INTERSECTIONS NEAR LAS PALMAS / EL POBLADO  (ranked by vehicle volume)")
print("=" * W)
hdr = f"{'Nodo':>5}  {'Intersection':<42}  {'Vehicles':>10}  Peak  {'Year(s)'}"
print(hdr)
print("-" * W)
for r in aforos_records:
    vc   = r["vehicle_composition"]
    pa   = r["peak_analysis"]
    yrs  = ",".join(str(y) for y in r["years_surveyed"]) or "—"
    name = r["intersection"] or "(unnamed)"
    print(f"{r['nodo']:>5}  {name[:42]:<42}  "
          f"{vc['total_vehicles']:>10,}  {pa['dominant_peak']:<5}  {yrs}")

print()
print("=" * W)
print("VEHICLE COMPOSITION  (motos share is notable in Medellín)")
print("=" * W)
for r in aforos_records:
    vc = r["vehicle_composition"]
    ms = r["mode_shares_pct"]
    print(f"  {r['intersection'][:42]:<42}  "
          f"autos={ms['autos']:>5.1f}%  motos={ms['motos']:>5.1f}%  "
          f"buses={ms['buses']:>4.1f}%")

print()
print("=" * W)
print("CORRIDOR SPEEDS  (Avenida Las Palmas = HPTU primary corridor)")
print("=" * W)
hdr2 = (f"{'Corridor':<30}  {'Avg':>5}  {'AM':>5}  {'PM':>5}  "
        f"{'Off':>5}  {'AM CI':>6}  {'PM CI':>6}  km")
print(hdr2)
print("-" * W)
for c in corridor_speeds:
    sp = c["speed_stats"]
    pk = c["peak_analysis"]
    print(f"{c['corridor_name']:<30}  "
          f"{str(sp['avg_speed_kmh'] or '—'):>5}  "
          f"{str(pk['am_avg_speed_kmh'] or '—'):>5}  "
          f"{str(pk['pm_avg_speed_kmh'] or '—'):>5}  "
          f"{str(pk['off_peak_avg_speed_kmh'] or '—'):>5}  "
          f"{str(pk['am_congestion_index'] or '—'):>6}  "
          f"{str(pk['pm_congestion_index'] or '—'):>6}  "
          f"{str(c['length_km'] or '—')}")

print()
print("=" * W)
print("PEAK PATTERNS — AGGREGATE STUDY AREA")
print("=" * W)
pp = peak_patterns
print(f"  Intersections analysed       : {pp['intersections_analysed']}")
print(f"  Total vehicle intervals      : {pp['total_vehicles_all_intervals']:,}")
print(f"  AM peak share (hrs 6-8)      : {pp['am_peak_share_pct']} %")
print(f"  PM peak share (hrs 16-18)    : {pp['pm_peak_share_pct']} %")
print(f"  Dominant peak                : {pp['dominant_peak_study_area']}")
print(f"  Busiest single hour          : {pp['busiest_hour_of_day']}:00")
print(f"  Peak AM hour                 : {pp['peak_hour_AM']}:00")
print(f"  Peak PM hour                 : {pp['peak_hour_PM']}:00")
