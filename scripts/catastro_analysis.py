#!/usr/bin/env python3
"""
Catastro analysis for HPTU localization study.
Processes informacion_predios.csv and outputs structured JSON.
"""

import csv
import json
import os
from collections import defaultdict

INPUT_FILE = "/Users/cristianespinal/hptu-localizacion/data/raw/informacion_predios.csv"
OUTPUT_FILE = "/Users/cristianespinal/hptu-localizacion/data/processed/catastro_analysis.json"

# El Poblado is comuna 14 in Medellín
EL_POBLADO_COMMUNE = "14"

# Estratos of interest for high-value analysis
HIGH_ESTRATOS = {"4", "5", "6"}

# Las Palmas corridor barrios (keywords to match DS_BARRIO)
LAS_PALMAS_KEYWORDS = [
    "PALMAS", "EL TESORO", "LAS LOMAS", "SANTA MARIA", "CASTROPOL",
    "LAS VEGAS", "MANILA", "ALEJANDRIA", "LA AGUACATALA", "AGUACATALA",
    "POBLADO", "EL POBLADO", "ASTORGA", "PATIO BONITO", "LALINDE",
    "LOS BALSOS", "BALSOS", "MICHEL", "INTERMEDIO", "AVES MARIA",
    "LA FLORIDA", "FLORIDA", "EL DIAMANTE", "DIAMANTE"
]

def normalize_barrio(name):
    """Normalize barrio name for consistent keying."""
    return name.strip().upper() if name else "UNKNOWN"

def parse_avaluo(val):
    """Parse avaluo value to float, return 0 on failure."""
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0

def parse_estrato(val):
    """Parse estrato to string integer, return 'unknown' on failure."""
    try:
        e = str(int(float(val)))
        return e
    except (ValueError, TypeError):
        return "unknown"

def main():
    # Accumulators
    total_records = 0

    # El Poblado (commune 14) accumulators
    # by_estrato[estrato] = {"count": int, "sum_avaluo": float}
    ep_by_estrato = defaultdict(lambda: {"count": 0, "sum_avaluo": 0.0})
    # by_barrio[barrio] = {"estrato_mode_count": {estrato: count}, "count": int, "sum_avaluo": float}
    ep_by_barrio = defaultdict(lambda: {"estrato_counts": defaultdict(int), "count": 0, "sum_avaluo": 0.0})

    # All comunas estratos 4/5/6 accumulators
    # all_comunas[nomComuna][estrato] = count
    all_comunas = defaultdict(lambda: defaultdict(int))

    # Las Palmas corridor
    las_palmas_barrios = set()

    print(f"Reading {INPUT_FILE} ...")

    with open(INPUT_FILE, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)

        for i, row in enumerate(reader):
            total_records += 1
            if i % 100000 == 0:
                print(f"  Processed {i:,} records...")

            cod_comuna = str(row.get("codComuna", "")).strip()
            nom_comuna = str(row.get("nomComuna", "")).strip().upper()
            barrio_raw = str(row.get("DS_BARRIO", "")).strip()
            barrio = normalize_barrio(barrio_raw)
            estrato_raw = row.get("Estrato", "")
            estrato = parse_estrato(estrato_raw)
            avaluo = parse_avaluo(row.get("AvaluoTotal", 0))

            # Track all comunas for estratos 4/5/6
            if estrato in HIGH_ESTRATOS and nom_comuna:
                all_comunas[nom_comuna][estrato] += 1

            # El Poblado specific
            if cod_comuna == EL_POBLADO_COMMUNE:
                ep_by_estrato[estrato]["count"] += 1
                ep_by_estrato[estrato]["sum_avaluo"] += avaluo

                ep_by_barrio[barrio]["count"] += 1
                ep_by_barrio[barrio]["sum_avaluo"] += avaluo
                ep_by_barrio[barrio]["estrato_counts"][estrato] += 1

                # Check if barrio is on Las Palmas corridor
                for kw in LAS_PALMAS_KEYWORDS:
                    if kw in barrio:
                        las_palmas_barrios.add(barrio)
                        break

    print(f"Done reading. Total records: {total_records:,}")

    # Build output structures
    # El Poblado by_estrato
    ep_estrato_out = {}
    for estrato, data in sorted(ep_by_estrato.items()):
        count = data["count"]
        avg = data["sum_avaluo"] / count if count > 0 else 0.0
        ep_estrato_out[estrato] = {
            "count": count,
            "avg_avaluo": round(avg, 2),
            "total_avaluo": round(data["sum_avaluo"], 2)
        }

    # El Poblado by_barrio
    ep_barrio_out = {}
    for barrio, data in sorted(ep_by_barrio.items()):
        count = data["count"]
        avg = data["sum_avaluo"] / count if count > 0 else 0.0
        # Determine dominant estrato
        ec = data["estrato_counts"]
        dominant_estrato = max(ec, key=ec.get) if ec else "unknown"
        ep_barrio_out[barrio] = {
            "dominant_estrato": dominant_estrato,
            "estrato_breakdown": dict(sorted(ec.items())),
            "count": count,
            "avg_avaluo": round(avg, 2),
            "total_avaluo": round(data["sum_avaluo"], 2),
            "on_las_palmas_corridor": barrio in las_palmas_barrios
        }

    # All comunas e4/e5/e6
    all_comunas_out = {}
    for comuna, estrato_counts in sorted(all_comunas.items()):
        all_comunas_out[comuna] = {
            "e4": estrato_counts.get("4", 0),
            "e5": estrato_counts.get("5", 0),
            "e6": estrato_counts.get("6", 0),
            "total_e456": (
                estrato_counts.get("4", 0) +
                estrato_counts.get("5", 0) +
                estrato_counts.get("6", 0)
            )
        }

    # Las Palmas corridor summary
    las_palmas_summary = {}
    for barrio in sorted(las_palmas_barrios):
        if barrio in ep_barrio_out:
            las_palmas_summary[barrio] = ep_barrio_out[barrio]

    output = {
        "source": "Catastro Municipal Medellín - datos.gov.co",
        "dataset_id": "bp59-rj8r",
        "total_records": total_records,
        "el_poblado": {
            "commune_code": EL_POBLADO_COMMUNE,
            "total_predios": sum(d["count"] for d in ep_by_estrato.values()),
            "by_estrato": ep_estrato_out,
            "by_barrio": ep_barrio_out
        },
        "las_palmas_corridor_barrios": las_palmas_summary,
        "all_comunas_e456": all_comunas_out
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\nOutput saved to {OUTPUT_FILE}")

    # Print summary to console
    print("\n=== EL POBLADO (COMMUNE 14) SUMMARY ===")
    print(f"Total predios: {output['el_poblado']['total_predios']:,}")
    print("\nBy Estrato:")
    for estrato, data in sorted(ep_estrato_out.items()):
        print(f"  Estrato {estrato}: {data['count']:,} predios | "
              f"avg avaluo: ${data['avg_avaluo']:,.0f} | "
              f"total: ${data['total_avaluo']:,.0f}")

    print("\nBy Barrio (El Poblado):")
    for barrio, data in sorted(ep_barrio_out.items(), key=lambda x: -x[1]["count"]):
        corridor = " [LAS PALMAS CORRIDOR]" if data["on_las_palmas_corridor"] else ""
        print(f"  {barrio}: {data['count']:,} predios | "
              f"estrato dom: {data['dominant_estrato']} | "
              f"avg: ${data['avg_avaluo']:,.0f}{corridor}")

    print("\n=== ALL COMUNAS - ESTRATOS 4/5/6 ===")
    for comuna, data in sorted(all_comunas_out.items(), key=lambda x: -x[1]["total_e456"]):
        print(f"  {comuna}: E4={data['e4']:,} | E5={data['e5']:,} | E6={data['e6']:,} | "
              f"Total={data['total_e456']:,}")

    print("\n=== LAS PALMAS CORRIDOR BARRIOS ===")
    for barrio, data in sorted(las_palmas_summary.items(), key=lambda x: -x[1]["avg_avaluo"]):
        print(f"  {barrio}: {data['count']:,} predios | avg: ${data['avg_avaluo']:,.0f} | "
              f"estrato: {data['dominant_estrato']}")

    return output

if __name__ == "__main__":
    main()
