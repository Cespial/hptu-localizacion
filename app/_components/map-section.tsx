"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Layers, Circle, Hospital, Route, Activity, Building2, Navigation, BarChart3, FileCheck, GraduationCap, ShoppingBag, Globe, Compass, Landmark, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MapLayerControls, type LayerToggle } from "./map-layer-controls";
import { MapCandidatePanel } from "./map-candidate-panel";
import { MapFloatingLegend } from "./map-floating-legend";
import { MapStyleToggle, getStyleUrl, type MapStyleId } from "./map-style-toggle";
import { MapPresetViews, PRESET_VIEWS, type PresetView } from "./map-preset-views";
import { candidateZones } from "@/lib/demo-data/candidate-zones";
import { pois, categoryColors, categoryLabels } from "@/lib/demo-data/poi";

const INITIAL_CENTER: [number, number] = [-75.555, 6.195];
const INITIAL_ZOOM = 10.5;
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const CANDIDATE_IDS = candidateZones.map((z) => z.id);

/* ──────────────────────────────────────────────────────── */
/* Component                                                */
/* ──────────────────────────────────────────────────────── */
export function MapSection() {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poiMarkersRef = useRef<any[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>("access-point");
  const [mapStyle, setMapStyle] = useState<MapStyleId>("light");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Track which lazy sources have been loaded
  const loadedSourcesRef = useRef<Set<string>>(new Set());

  /* ── Layer state (13 layers, grouped) ── */
  const [layers, setLayers] = useState<LayerToggle[]>([
    // Base
    { id: "strata", label: "Estratos 5/6", icon: Layers, color: "#0d9488", enabled: true, group: "base" },
    { id: "corridor", label: "Corredor Las Palmas", icon: Route, color: "#8b5cf6", enabled: true, group: "base" },
    { id: "hptu", label: "HPTU Actual", icon: Hospital, color: "#ef4444", enabled: true, group: "base" },
    { id: "pois", label: "POIs Clave (27)", icon: MapPin, color: "#3b82f6", enabled: false, group: "base" },
    // Data
    { id: "traffic", label: "Trafico por Tramo", icon: Activity, color: "#f97316", enabled: false, group: "data" },
    { id: "healthFull", label: "Red Salud (145 IPS)", icon: Building2, color: "#dc2626", enabled: false, group: "data" },
    { id: "routes", label: "Rutas Alternas", icon: Navigation, color: "#06b6d4", enabled: false, group: "data" },
    { id: "catastro", label: "Catastro E5/E6", icon: BarChart3, color: "#0ea5e9", enabled: true, group: "data" },
    { id: "osmEducation", label: "Colegios Corredor (30)", icon: GraduationCap, color: "#8b5cf6", enabled: false, group: "data" },
    { id: "osmCommercial", label: "Comercio Corredor (28)", icon: ShoppingBag, color: "#f59e0b", enabled: false, group: "data" },
    // Analysis
    { id: "pot", label: "Viabilidad POT (22)", icon: FileCheck, color: "#10b981", enabled: true, group: "analysis" },
    { id: "isochrones", label: "Isocronas", icon: Circle, color: "#f59e0b", enabled: true, group: "analysis" },
    // Oriente Antioqueno
    { id: "orienteHealth", label: "Salud Oriente (OSM)", icon: Hospital, color: "#dc2626", enabled: false, group: "oriente" },
    { id: "accessPointIso", label: "Isocronas Access Point", icon: Globe, color: "#0d9488", enabled: true, group: "oriente" },
    { id: "accessPointRoutes", label: "Rutas Oriente", icon: Compass, color: "#e11d48", enabled: false, group: "oriente" },
    { id: "medicalProjects", label: "Proyectos Salud", icon: Landmark, color: "#f97316", enabled: false, group: "oriente" },
    { id: "orienteMunicipios", label: "Municipios Oriente", icon: Users, color: "#3b82f6", enabled: false, group: "oriente" },
  ]);

  const toggleLayer = useCallback((id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  }, []);

  const isLayerEnabled = useCallback(
    (id: string) => layers.find((l) => l.id === id)?.enabled ?? false,
    [layers]
  );

  /* ── Helpers ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeSetVisibility = (map: any, layerId: string, visible: boolean) => {
    try {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
      }
    } catch {}
  };

  /* ── Load a lazy GeoJSON source + layers ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureTrafficLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("traffic")) return;
    loadedSourcesRef.current.add("traffic");

    const res = await fetch("/geojson/traffic-segments.geojson");
    const data = await res.json();

    if (!map.getSource("traffic-segments")) {
      map.addSource("traffic-segments", { type: "geojson", data });

      // Glow/casing layer behind
      map.addLayer({
        id: "traffic-segments-casing",
        type: "line",
        source: "traffic-segments",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 10,
          "line-opacity": 0.2,
          "line-blur": 3,
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      // Main line
      map.addLayer({
        id: "traffic-segments-line",
        type: "line",
        source: "traffic-segments",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 4,
          "line-opacity": 0.9,
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      // Direction arrows on traffic lines
      map.addLayer({
        id: "traffic-segments-arrows",
        type: "symbol",
        source: "traffic-segments",
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 80,
          "text-field": "▸",
          "text-size": 16,
          "text-keep-upright": false,
          "text-rotation-alignment": "map",
        },
        paint: {
          "text-color": ["get", "color"],
          "text-opacity": 0.7,
        },
      });

      // Speed labels along traffic segments
      map.addLayer({
        id: "traffic-segments-label",
        type: "symbol",
        source: "traffic-segments",
        layout: {
          "symbol-placement": "line-center",
          "text-field": ["concat", ["to-string", ["get", "speed_kmh"]], " km/h"],
          "text-size": 11,
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-offset": [0, -1.2],
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#fff",
          "text-halo-width": 1.5,
        },
      });

      map.on("mouseenter", "traffic-segments-line", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "traffic-segments-line", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureHealthFullLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("healthFull")) return;
    loadedSourcesRef.current.add("healthFull");

    const res = await fetch("/geojson/health-network-full.geojson");
    const data = await res.json();

    if (!map.getSource("health-network-full")) {
      map.addSource("health-network-full", {
        type: "geojson",
        data,
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 40,
      });

      // Clusters
      map.addLayer({
        id: "health-full-clusters",
        type: "circle",
        source: "health-network-full",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#dc2626",
          "circle-radius": ["step", ["get", "point_count"], 14, 5, 18, 15, 24, 30, 30],
          "circle-opacity": 0.7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: "health-full-cluster-count",
        type: "symbol",
        source: "health-network-full",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-size": 11,
        },
        paint: { "text-color": "#fff" },
      });

      // Individual points colored by complexity
      map.addLayer({
        id: "health-full-points",
        type: "circle",
        source: "health-network-full",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "color"],
          "circle-radius": ["get", "radius"],
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.85,
        },
      });

      map.on("mouseenter", "health-full-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "health-full-points", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureOsmLayers = useCallback(async (map: any, category: string) => {
    const sourceId = `osm-${category}`;
    if (loadedSourcesRef.current.has(sourceId)) return;
    loadedSourcesRef.current.add(sourceId);

    const res = await fetch("/geojson/osm-pois-corridor.geojson");
    const allData = await res.json();

    // Filter to just this category
    const filtered = {
      type: "FeatureCollection",
      features: allData.features.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (f: any) => f.properties.category === (category === "education" ? "education" : "commercial")
      ),
    };

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, { type: "geojson", data: filtered });

      const color = category === "education" ? "#8b5cf6" : "#f59e0b";
      map.addLayer({
        id: `${sourceId}-circles`,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-color": color,
          "circle-radius": 5,
          "circle-opacity": 0.7,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: `${sourceId}-labels`,
        type: "symbol",
        source: sourceId,
        layout: {
          "text-field": ["get", "name"],
          "text-size": 9,
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-offset": [0, 1.2],
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": color,
          "text-halo-color": "#fff",
          "text-halo-width": 1,
        },
        minzoom: 14,
      });

      map.on("mouseenter", `${sourceId}-circles`, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", `${sourceId}-circles`, () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureRouteLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("routes")) return;
    loadedSourcesRef.current.add("routes");

    const res = await fetch("/geojson/alternate-routes.geojson");
    const data = await res.json();

    if (!map.getSource("alternate-routes")) {
      map.addSource("alternate-routes", { type: "geojson", data });

      // Route casing/glow
      map.addLayer({
        id: "alternate-routes-casing",
        type: "line",
        source: "alternate-routes",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 8,
          "line-opacity": 0.15,
          "line-blur": 2,
        },
        layout: { "line-cap": "round" },
      });

      map.addLayer({
        id: "alternate-routes-line",
        type: "line",
        source: "alternate-routes",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2.5,
          "line-opacity": 0.75,
          "line-dasharray": [6, 4],
        },
        layout: { "line-cap": "round" },
      });

      // Direction arrows
      map.addLayer({
        id: "alternate-routes-arrows",
        type: "symbol",
        source: "alternate-routes",
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 100,
          "text-field": "▸",
          "text-size": 14,
          "text-keep-upright": false,
          "text-rotation-alignment": "map",
        },
        paint: {
          "text-color": ["get", "color"],
          "text-opacity": 0.6,
        },
      });

      // Time labels at midpoint
      map.addLayer({
        id: "alternate-routes-label",
        type: "symbol",
        source: "alternate-routes",
        layout: {
          "symbol-placement": "line-center",
          "text-field": ["concat", ["to-string", ["get", "time_min"]], " min"],
          "text-size": 10,
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-offset": [0, -1],
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#fff",
          "text-halo-width": 1.5,
        },
      });

      map.on("mouseenter", "alternate-routes-line", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "alternate-routes-line", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureCatastroLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("catastro")) return;
    loadedSourcesRef.current.add("catastro");

    const res = await fetch("/geojson/catastro-density.geojson");
    const data = await res.json();

    if (!map.getSource("catastro-density")) {
      map.addSource("catastro-density", { type: "geojson", data });

      // Bubble circles proportional to E5/E6 predios
      map.addLayer({
        id: "catastro-bubbles",
        type: "circle",
        source: "catastro-density",
        paint: {
          "circle-radius": ["get", "bubble_size"],
          "circle-color": [
            "interpolate", ["linear"], ["get", "pct_e5e6"],
            0, "#bae6fd",
            50, "#0284c7",
            80, "#075985",
            100, "#0c4a6e",
          ],
          "circle-opacity": 0.7,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#fff",
        },
      });

      // Barrio name labels
      map.addLayer({
        id: "catastro-labels",
        type: "symbol",
        source: "catastro-density",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 10,
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-offset": [0, -2.2],
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#075985",
          "text-halo-color": "#fff",
          "text-halo-width": 1.5,
        },
      });

      map.on("mouseenter", "catastro-bubbles", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "catastro-bubbles", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensurePotLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("pot")) return;
    loadedSourcesRef.current.add("pot");

    const res = await fetch("/geojson/pot-viability-complete.geojson");
    const data = await res.json();

    if (!map.getSource("pot-viability")) {
      map.addSource("pot-viability", { type: "geojson", data });

      // Colored circles by viability classification
      map.addLayer({
        id: "pot-circles",
        type: "circle",
        source: "pot-viability",
        paint: {
          "circle-radius": 10,
          "circle-color": ["get", "color"],
          "circle-opacity": 0.8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Score labels inside circles
      map.addLayer({
        id: "pot-score-labels",
        type: "symbol",
        source: "pot-viability",
        layout: {
          "text-field": ["to-string", ["get", "score"]],
          "text-size": 9,
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#fff",
        },
      });

      // Barrio name labels
      map.addLayer({
        id: "pot-name-labels",
        type: "symbol",
        source: "pot-viability",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 10,
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-offset": [0, 1.8],
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#065f46",
          "text-halo-color": "#fff",
          "text-halo-width": 1.5,
        },
      });

      map.on("mouseenter", "pot-circles", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "pot-circles", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, []);

  /* ── Load Oriente Health Facilities ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureOrienteHealthLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("orienteHealth")) return;
    loadedSourcesRef.current.add("orienteHealth");

    try {
      const res = await fetch("/geojson/oriente_health_facilities.geojson");
      if (!res.ok) return;
      const data = await res.json();

      if (!map.getSource("oriente-health-src")) {
        map.addSource("oriente-health-src", { type: "geojson", data });

        map.addLayer({
          id: "oriente-health-circles",
          type: "circle",
          source: "oriente-health-src",
          paint: {
            "circle-color": "#dc2626",
            "circle-radius": 4,
            "circle-opacity": 0.7,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });

        map.addLayer({
          id: "oriente-health-labels",
          type: "symbol",
          source: "oriente-health-src",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 9,
            "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
            "text-offset": [0, 1.2],
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#dc2626",
            "text-halo-color": "#fff",
            "text-halo-width": 1,
          },
          minzoom: 13,
        });

        map.on("mouseenter", "oriente-health-circles", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "oriente-health-circles", () => { map.getCanvas().style.cursor = ""; });
      }
    } catch (e) { console.warn("Failed to load oriente health facilities:", e); }
  }, []);

  /* ── Load Access Point Isochrones ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureAccessPointIsoLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("accessPointIso")) return;
    loadedSourcesRef.current.add("accessPointIso");

    try {
      const res = await fetch("/geojson/access_point_isochrones.geojson");
      if (!res.ok) return;
      const data = await res.json();

      if (!map.getSource("access-point-iso-src")) {
        map.addSource("access-point-iso-src", { type: "geojson", data });

        map.addLayer({
          id: "access-point-isochrones-fill",
          type: "fill",
          source: "access-point-iso-src",
          paint: {
            "fill-color": [
              "match", ["get", "contour"],
              15, "#115e59",
              30, "#0d9488",
              45, "#5eead4",
              60, "#99f6e4",
              "#ccfbf1",
            ],
            "fill-opacity": [
              "match", ["get", "contour"],
              15, 0.20,
              30, 0.15,
              45, 0.10,
              60, 0.07,
              0.05,
            ],
          },
        });

        map.addLayer({
          id: "access-point-isochrones-line",
          type: "line",
          source: "access-point-iso-src",
          paint: {
            "line-color": "#0d9488",
            "line-width": 1,
            "line-opacity": 0.5,
            "line-dasharray": [2, 2],
          },
        });

        // Contour labels
        map.addLayer({
          id: "access-point-isochrones-label",
          type: "symbol",
          source: "access-point-iso-src",
          layout: {
            "symbol-placement": "line",
            "text-field": ["concat", ["to-string", ["get", "contour"]], " min"],
            "text-size": 10,
            "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
            "symbol-spacing": 300,
          },
          paint: {
            "text-color": "#115e59",
            "text-halo-color": "#fff",
            "text-halo-width": 1.5,
          },
        });
      }
    } catch (e) { console.warn("Failed to load access point isochrones:", e); }
  }, []);

  /* ── Load Access Point Routes ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureAccessPointRouteLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("accessPointRoutes")) return;
    loadedSourcesRef.current.add("accessPointRoutes");

    try {
      const res = await fetch("/geojson/access_point_routes.geojson");
      if (!res.ok) return;
      const data = await res.json();

      if (!map.getSource("access-point-routes-src")) {
        map.addSource("access-point-routes-src", { type: "geojson", data });

        map.addLayer({
          id: "access-point-routes-casing",
          type: "line",
          source: "access-point-routes-src",
          paint: {
            "line-color": ["get", "color"],
            "line-width": 8,
            "line-opacity": 0.15,
            "line-blur": 2,
          },
          layout: { "line-cap": "round" },
        });

        map.addLayer({
          id: "access-point-routes-line",
          type: "line",
          source: "access-point-routes-src",
          paint: {
            "line-color": ["get", "color"],
            "line-width": 3,
            "line-opacity": 0.8,
            "line-dasharray": [6, 4],
          },
          layout: { "line-cap": "round" },
        });

        map.addLayer({
          id: "access-point-routes-arrows",
          type: "symbol",
          source: "access-point-routes-src",
          layout: {
            "symbol-placement": "line",
            "symbol-spacing": 100,
            "text-field": "▸",
            "text-size": 14,
            "text-keep-upright": false,
            "text-rotation-alignment": "map",
          },
          paint: {
            "text-color": ["get", "color"],
            "text-opacity": 0.6,
          },
        });

        map.addLayer({
          id: "access-point-routes-label",
          type: "symbol",
          source: "access-point-routes-src",
          layout: {
            "symbol-placement": "line-center",
            "text-field": ["concat", ["get", "destination"], " · ", ["to-string", ["get", "duration_min"]], " min"],
            "text-size": 11,
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, -1.2],
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": ["get", "color"],
            "text-halo-color": "#fff",
            "text-halo-width": 2,
          },
        });

        map.on("mouseenter", "access-point-routes-line", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "access-point-routes-line", () => { map.getCanvas().style.cursor = ""; });
      }
    } catch (e) { console.warn("Failed to load access point routes:", e); }
  }, []);

  /* ── Load Medical Projects ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureMedicalProjectLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("medicalProjects")) return;
    loadedSourcesRef.current.add("medicalProjects");

    try {
      const res = await fetch("/geojson/medical_projects.geojson");
      if (!res.ok) return;
      const data = await res.json();

      if (!map.getSource("medical-projects-src")) {
        map.addSource("medical-projects-src", { type: "geojson", data });

        map.addLayer({
          id: "medical-projects-circles",
          type: "circle",
          source: "medical-projects-src",
          paint: {
            "circle-color": "#f97316",
            "circle-radius": 6,
            "circle-opacity": 0.85,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        map.addLayer({
          id: "medical-projects-labels",
          type: "symbol",
          source: "medical-projects-src",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 10,
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.5],
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#c2410c",
            "text-halo-color": "#fff",
            "text-halo-width": 1.5,
          },
        });

        map.on("mouseenter", "medical-projects-circles", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "medical-projects-circles", () => { map.getCanvas().style.cursor = ""; });
      }
    } catch (e) { console.warn("Failed to load medical projects:", e); }
  }, []);

  /* ── Load Oriente Municipalities ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ensureOrienteMunicipiosLayers = useCallback(async (map: any) => {
    if (loadedSourcesRef.current.has("orienteMunicipios")) return;
    loadedSourcesRef.current.add("orienteMunicipios");

    try {
      const res = await fetch("/geojson/oriente_municipalities.geojson");
      if (!res.ok) return;
      const data = await res.json();

      if (!map.getSource("oriente-municipios-src")) {
        map.addSource("oriente-municipios-src", { type: "geojson", data });

        map.addLayer({
          id: "oriente-municipios-circles",
          type: "circle",
          source: "oriente-municipios-src",
          paint: {
            "circle-color": "#3b82f6",
            "circle-radius": [
              "interpolate", ["linear"], ["get", "population"],
              15000, 8,
              50000, 14,
              120000, 22,
            ],
            "circle-opacity": 0.6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        map.addLayer({
          id: "oriente-municipios-labels",
          type: "symbol",
          source: "oriente-municipios-src",
          layout: {
            "text-field": ["concat", ["get", "name"], "\n", ["to-string", ["get", "population"]], " hab"],
            "text-size": 11,
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0],
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": "#1e3a5f",
            "text-halo-color": "#fff",
            "text-halo-width": 2,
          },
        });

        map.on("mouseenter", "oriente-municipios-circles", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "oriente-municipios-circles", () => { map.getCanvas().style.cursor = ""; });
      }
    } catch (e) { console.warn("Failed to load oriente municipalities:", e); }
  }, []);

  /* ────────────────────────────────────── */
  /* Initialize Map                         */
  /* ────────────────────────────────────── */
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "pk.your_mapbox_token_here") return;

    let cancelled = false;

    async function initMap() {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        if (cancelled || !mapContainer.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN!;

        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: getStyleUrl("light"),
          center: INITIAL_CENTER,
          zoom: INITIAL_ZOOM,
          pitch: 0,
          attributionControl: false,
        });

        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on("error", (e: any) => {
          console.error("Mapbox error:", e);
          if (e?.error?.status === 401 || e?.error?.statusCode === 401) {
            setMapError("Token de Mapbox invalido. Verifica tu API key.");
          }
        });

        map.on("load", () => {
          if (cancelled) return;
          setMapLoaded(true);

          /* ── Strata zones ── */
          map.addSource("strata-zones", {
            type: "geojson",
            data: "/geojson/strata-zones.geojson",
          });
          map.addLayer({
            id: "strata-fill",
            type: "fill",
            source: "strata-zones",
            paint: { "fill-color": "#0d9488", "fill-opacity": 0.25 },
          });
          map.addLayer({
            id: "strata-outline",
            type: "line",
            source: "strata-zones",
            paint: { "line-color": "#0d9488", "line-width": 1.5, "line-opacity": 0.8 },
          });

          /* ── Corridor line (real road geometry from Mapbox Directions API) ── */
          map.addSource("corridor-line", {
            type: "geojson",
            data: "/geojson/corridor-las-palmas.geojson",
          });
          // Corridor glow
          map.addLayer({
            id: "corridor-line-glow",
            type: "line",
            source: "corridor-line",
            paint: {
              "line-color": "#8b5cf6",
              "line-width": 16,
              "line-opacity": 0.12,
              "line-blur": 4,
            },
          });
          map.addLayer({
            id: "corridor-line-layer",
            type: "line",
            source: "corridor-line",
            paint: {
              "line-color": "#8b5cf6",
              "line-width": 5,
              "line-opacity": 0.8,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
          // Corridor label
          map.addLayer({
            id: "corridor-line-label",
            type: "symbol",
            source: "corridor-line",
            layout: {
              "symbol-placement": "line-center",
              "text-field": "Corredor Las Palmas",
              "text-size": 12,
              "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
              "text-offset": [0, -1],
            },
            paint: {
              "text-color": "#7c3aed",
              "text-halo-color": "#fff",
              "text-halo-width": 2,
            },
          });

          /* ── Isochrones ── */
          CANDIDATE_IDS.forEach((cand) => {
            map.addSource(`isochrones-${cand}`, {
              type: "geojson",
              data: `/geojson/isochrones-${cand}.geojson`,
            });
            map.addLayer({
              id: `isochrones-${cand}-fill`,
              type: "fill",
              source: `isochrones-${cand}`,
              paint: {
                "fill-color": [
                  "match",
                  ["get", "contour"],
                  10, "#f59e0b",
                  20, "#fb923c",
                  30, "#fdba74",
                  "#fde68a",
                ],
                "fill-opacity": [
                  "match",
                  ["get", "contour"],
                  10, 0.25,
                  20, 0.15,
                  30, 0.08,
                  0.05,
                ],
              },
              layout: { visibility: "none" },
            });
            map.addLayer({
              id: `isochrones-${cand}-line`,
              type: "line",
              source: `isochrones-${cand}`,
              paint: {
                "line-color": "#f59e0b",
                "line-width": 1,
                "line-opacity": 0.5,
                "line-dasharray": [2, 2],
              },
              layout: { visibility: "none" },
            });
          });

          /* ── Traffic segments (loaded eagerly since default ON) ── */
          ensureTrafficLayers(map);

          /* ── HPTU pulsing marker ── */
          const hptuPoi = pois.find((p) => p.id === "hosp-04");
          if (hptuPoi) {
            const el = document.createElement("div");
            el.innerHTML = `
              <div style="position:relative;">
                <div style="background:#ef4444;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);position:relative;z-index:1;"></div>
                <div style="position:absolute;top:-3px;left:-3px;width:28px;height:28px;border-radius:50%;background:rgba(239,68,68,0.3);animation:pulse 2s infinite;"></div>
              </div>
              <style>@keyframes pulse{0%{transform:scale(1);opacity:0.7}70%{transform:scale(1.8);opacity:0}100%{transform:scale(1.8);opacity:0}}</style>
            `;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat(hptuPoi.coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 14 }).setHTML(
                  `<div style="max-width:220px;"><p style="font-weight:700;margin:0;font-size:13px;">${hptuPoi.name}</p><p style="font-size:11px;color:#666;margin:3px 0 0;">${hptuPoi.description}</p></div>`
                )
              )
              .addTo(map);
            markersRef.current.push({ marker, type: "hptu" });
          }

          /* ── Candidate zone markers + labels ── */
          // Add GeoJSON source for candidate zone labels
          map.addSource("candidate-labels", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: candidateZones.map((z) => ({
                type: "Feature" as const,
                properties: { name: z.name, score: z.score, color: z.color },
                geometry: { type: "Point" as const, coordinates: z.coordinates },
              })),
            },
          });
          map.addLayer({
            id: "candidate-label-text",
            type: "symbol",
            source: "candidate-labels",
            layout: {
              "text-field": ["concat", ["get", "name"], " (", ["to-string", ["get", "score"]], ")"],
              "text-size": 11,
              "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.6],
              "text-anchor": "top",
              "text-allow-overlap": false,
            },
            paint: {
              "text-color": ["get", "color"],
              "text-halo-color": "#fff",
              "text-halo-width": 2,
            },
          });

          candidateZones.forEach((zone) => {
            const el = document.createElement("div");
            if (zone.id === "access-point") {
              // Access Point gets special treatment: larger marker with pulse + "RECOMENDADO" badge
              el.innerHTML = `
                <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
                  <div style="background:${zone.color};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(225,29,72,0.4);position:relative;z-index:2;transition:transform 0.2s;" onmouseenter="this.style.transform='scale(1.2)'" onmouseleave="this.style.transform='scale(1)'"></div>
                  <div style="position:absolute;top:-1px;left:50%;transform:translateX(-50%);width:26px;height:26px;border-radius:50%;background:rgba(225,29,72,0.25);animation:apPulse 2.5s infinite;z-index:1;"></div>
                  <div style="margin-top:2px;background:#e11d48;color:white;font-size:10px;font-weight:800;padding:2px 7px;border-radius:6px;letter-spacing:0.5px;white-space:nowrap;z-index:3;">RECOMENDADO</div>
                </div>
                <style>@keyframes apPulse{0%{transform:translateX(-50%) scale(1);opacity:0.6}70%{transform:translateX(-50%) scale(2);opacity:0}100%{transform:translateX(-50%) scale(2);opacity:0}}</style>
              `;
            } else {
              el.innerHTML = `<div style="background:${zone.color};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;transition:transform 0.2s;" onmouseenter="this.style.transform='scale(1.3)'" onmouseleave="this.style.transform='scale(1)'"></div>`;
            }
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat(zone.coordinates)
              .addTo(map);
            el.addEventListener("click", () => {
              handleSelectCandidate(zone.id);
            });
            markersRef.current.push({ marker, type: "candidate", id: zone.id });
          });

          /* ── Popups for traffic / health / routes ── */
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            maxWidth: "260px",
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("mousemove", "traffic-segments-line", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            popup
              .setLngLat(e.lngLat as { lng: number; lat: number })
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:12px;">${p.name}</p>
                  <p style="font-size:11px;color:#666;margin:2px 0;">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:4px;"></span>
                    ${p.speed_kmh} km/h · ${p.duration_min} min · ${p.distance_km} km
                  </p>
                  <p style="font-size:10px;color:#999;margin:2px 0 0;">${p.corridor} — ${p.congestion}</p>
                </div>`
              )
              .addTo(map);
          });
          map.on("mouseleave", "traffic-segments-line", () => popup.remove());

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("click", "health-full-points", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            const coords = e.features[0].geometry!.coordinates.slice() as [number, number];
            new mapboxgl.Popup({ maxWidth: "300px" })
              .setLngLat(coords)
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:12px;">${p.name}</p>
                  <p style="font-size:11px;margin:2px 0;">
                    <span style="display:inline-block;padding:1px 5px;border-radius:3px;background:${p.color};color:white;font-size:9px;font-weight:600;">${p.complexity}</span>
                    <span style="color:#666;"> · ${p.municipality}</span>
                  </p>
                  ${Number(p.beds) > 0 ? `<p style="font-size:11px;color:#333;margin:2px 0;"><strong>${p.beds}</strong> camas</p>` : ""}
                  ${p.nature ? `<p style="font-size:10px;color:#888;margin:2px 0;">${p.nature}${p.is_ese === "true" || p.is_ese === true ? " · ESE" : ""}</p>` : ""}
                  ${p.barrio ? `<p style="font-size:10px;color:#999;margin:2px 0;">${p.barrio} · ${p.direccion || ""}</p>` : ""}
                  ${p.distancia_km ? `<p style="font-size:10px;color:#999;margin:2px 0 0;">A ${Number(p.distancia_km).toFixed(1)} km de zona mas cercana</p>` : ""}
                </div>`
              )
              .addTo(map);
          });

          // OSM POI popups
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
          const osmPopupHandler = (_layerId: string) => (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            const coords = e.features[0].geometry!.coordinates.slice() as [number, number];
            new mapboxgl.Popup({ maxWidth: "240px" })
              .setLngLat(coords)
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:12px;">${p.name}</p>
                  <p style="font-size:10px;color:#666;margin:2px 0;">${p.subcategory} · ${p.category}</p>
                  ${p.distancia_km ? `<p style="font-size:10px;color:#999;margin:2px 0 0;">A ${Number(p.distancia_km).toFixed(1)} km de zona candidata</p>` : ""}
                </div>`
              )
              .addTo(map);
          };
          map.on("click", "osm-education-circles", osmPopupHandler("osm-education-circles"));
          map.on("click", "osm-commercial-circles", osmPopupHandler("osm-commercial-circles"));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("mousemove", "alternate-routes-line", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            popup
              .setLngLat(e.lngLat as { lng: number; lat: number })
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:12px;">${p.origin}</p>
                  <p style="font-size:11px;color:#666;margin:2px 0;">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:4px;"></span>
                    ${p.time_min} min · ${p.best_route}
                  </p>
                </div>`
              )
              .addTo(map);
          });
          map.on("mouseleave", "alternate-routes-line", () => popup.remove());

          // Click clusters to zoom
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("click", "health-full-clusters", (e: any) => {
            if (!e.features?.length) return;
            const coords = e.features[0].geometry!.coordinates as [number, number];
            map.flyTo({ center: coords, zoom: map.getZoom() + 2, duration: 800 });
          });

          // Catastro bubble popup
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("click", "catastro-bubbles", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            const coords = e.features[0].geometry!.coordinates.slice() as [number, number];
            new mapboxgl.Popup({ maxWidth: "280px" })
              .setLngLat(coords)
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:13px;">${p.name}</p>
                  <p style="font-size:11px;color:#0284c7;margin:3px 0;font-weight:600;">${p.pct_e5e6}% Estratos 5/6</p>
                  <div style="font-size:11px;color:#666;margin:3px 0;">
                    <div>Total predios: <strong>${Number(p.predios_total).toLocaleString()}</strong></div>
                    <div>E5: ${Number(p.predios_e5).toLocaleString()} · E6: ${Number(p.predios_e6).toLocaleString()}</div>
                    <div>Avaluo prom: <strong>$${p.avg_avaluo_m}M</strong> COP</div>
                  </div>
                  ${p.on_corridor === "true" || p.on_corridor === true ? '<p style="font-size:10px;color:#7c3aed;margin:3px 0 0;font-weight:600;">En corredor Las Palmas</p>' : ""}
                </div>`
              )
              .addTo(map);
          });

          // POT viability popup
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("click", "pot-circles", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            const coords = e.features[0].geometry!.coordinates.slice() as [number, number];
            new mapboxgl.Popup({ maxWidth: "300px" })
              .setLngLat(coords)
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:13px;">${p.name}</p>
                  <p style="font-size:11px;margin:3px 0;">
                    <span style="display:inline-block;padding:1px 6px;border-radius:4px;background:${p.color};color:white;font-weight:600;font-size:10px;">${p.viability}</span>
                    Score: ${p.score}/9
                  </p>
                  <div style="font-size:11px;color:#666;margin:3px 0;">
                    <div>CL_D: ${Number(p.cl_d).toFixed(2)} · ICS: ${Number(p.ics).toFixed(1)} · ICF: ${Number(p.icf).toFixed(1)}</div>
                    <div>Suelo potencial: <strong>${Number(p.suelo_potencial_m2).toLocaleString()} m2</strong></div>
                    <div>Altura max: <strong>${p.altura_max} pisos</strong></div>
                    ${Number(p.salud_existente_m2) > 0 ? `<div>Salud existente: ${Number(p.salud_existente_m2).toLocaleString()} m2</div>` : ""}
                  </div>
                  <p style="font-size:10px;color:#999;margin:4px 0 0;">${p.factors}</p>
                </div>`
              )
              .addTo(map);
          });

          /* ── Oriente Antioqueno popups ── */
          // Oriente health facilities popup
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("click", "oriente-health-circles", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            const coords = e.features[0].geometry!.coordinates.slice() as [number, number];
            new mapboxgl.Popup({ maxWidth: "260px" })
              .setLngLat(coords)
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:12px;">${p.name}</p>
                  <p style="font-size:11px;color:#666;margin:2px 0;">
                    <span style="display:inline-block;padding:1px 5px;border-radius:3px;background:#dc2626;color:white;font-size:9px;font-weight:600;">${p.type}</span>
                    <span> · ${p.municipality}</span>
                  </p>
                  ${p.emergency ? `<p style="font-size:10px;color:#999;margin:2px 0 0;">Urgencias: ${p.emergency}</p>` : ""}
                </div>`
              )
              .addTo(map);
          });

          // Access Point routes popup
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("mousemove", "access-point-routes-line", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            popup
              .setLngLat(e.lngLat as { lng: number; lat: number })
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:12px;">Access Point → ${p.destination}</p>
                  <p style="font-size:11px;color:#666;margin:2px 0;">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:4px;"></span>
                    ${p.duration_min} min · ${p.distance_km} km
                  </p>
                </div>`
              )
              .addTo(map);
          });
          map.on("mouseleave", "access-point-routes-line", () => popup.remove());

          // Medical projects popup
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("click", "medical-projects-circles", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            const coords = e.features[0].geometry!.coordinates.slice() as [number, number];
            new mapboxgl.Popup({ maxWidth: "260px" })
              .setLngLat(coords)
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:13px;">${p.name}</p>
                  <p style="font-size:11px;margin:2px 0;">
                    <span style="display:inline-block;padding:1px 5px;border-radius:3px;background:#f97316;color:white;font-size:9px;font-weight:600;">${p.type}</span>
                    <span style="color:#666;"> · ${p.municipality}</span>
                  </p>
                  <p style="font-size:11px;color:#666;margin:2px 0;">${p.description}</p>
                  <p style="font-size:10px;color:#999;margin:2px 0 0;">Estado: ${p.status}</p>
                </div>`
              )
              .addTo(map);
          });

          // Oriente municipalities popup
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map.on("click", "oriente-municipios-circles", (e: any) => {
            if (!e.features?.length) return;
            const p = e.features[0].properties!;
            const coords = e.features[0].geometry!.coordinates.slice() as [number, number];
            new mapboxgl.Popup({ maxWidth: "240px" })
              .setLngLat(coords)
              .setHTML(
                `<div>
                  <p style="font-weight:700;margin:0;font-size:13px;">${p.name}</p>
                  <div style="font-size:11px;color:#666;margin:3px 0;">
                    <div>Poblacion: <strong>${Number(p.population).toLocaleString()} hab</strong></div>
                    <div>IPS registradas: <strong>${p.ips_count}</strong></div>
                    ${p.time_from_access_point_min ? `<div>Tiempo desde Access Point: <strong>${p.time_from_access_point_min} min</strong></div>` : ""}
                  </div>
                </div>`
              )
              .addTo(map);
          });

          /* ── Map annotations (contextual labels) ── */
          map.addSource("map-annotations", {
            type: "geojson",
            data: "/geojson/map-annotations.geojson",
          });
          map.addLayer({
            id: "map-annotations-labels",
            type: "symbol",
            source: "map-annotations",
            layout: {
              "text-field": ["get", "label"],
              "text-size": ["get", "size"],
              "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
              "text-allow-overlap": true,
              "text-ignore-placement": true,
            },
            paint: {
              "text-color": ["get", "color"],
              "text-halo-color": "#ffffff",
              "text-halo-width": 2.5,
            },
            minzoom: 10,
            maxzoom: 14,
          });
        });
      } catch (err) {
        console.error("Failed to initialize map:", err);
        setMapError("Error al cargar el mapa. Revisa la consola.");
      }
    }

    initMap();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];
      poiMarkersRef.current.forEach((m) => m.remove());
      poiMarkersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── POI markers ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    poiMarkersRef.current.forEach((m) => m.remove());
    poiMarkersRef.current = [];

    if (!isLayerEnabled("pois")) return;

    async function addPOIs() {
      const mapboxgl = (await import("mapbox-gl")).default;
      const map = mapRef.current;
      if (!map) return;

      pois
        .filter((p) => p.id !== "hosp-04")
        .forEach((poi) => {
          const el = document.createElement("div");
          const color = categoryColors[poi.category];
          el.innerHTML = `<div style="background:${color};width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);cursor:pointer;"></div>`;
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat(poi.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 8, maxWidth: "240px" }).setHTML(
                `<div><p style="font-weight:600;margin:0;font-size:13px;">${poi.name}</p><p style="font-size:11px;color:#888;margin:2px 0 0;">${categoryLabels[poi.category]}</p><p style="font-size:11px;color:#666;margin:2px 0 0;">${poi.description}</p></div>`
              )
            )
            .addTo(map);
          poiMarkersRef.current.push(marker);
        });
    }

    addPOIs();
  }, [mapLoaded, isLayerEnabled]);

  /* ── Layer visibility effects ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const vis = isLayerEnabled("strata");
    safeSetVisibility(map, "strata-fill", vis);
    safeSetVisibility(map, "strata-outline", vis);
  }, [mapLoaded, isLayerEnabled]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const corridorVis = isLayerEnabled("corridor");
    safeSetVisibility(mapRef.current, "corridor-line-glow", corridorVis);
    safeSetVisibility(mapRef.current, "corridor-line-layer", corridorVis);
    safeSetVisibility(mapRef.current, "corridor-line-label", corridorVis);
  }, [mapLoaded, isLayerEnabled]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const vis = isLayerEnabled("isochrones");
    CANDIDATE_IDS.forEach((cand) => {
      const showThis = vis && (selectedCandidate === null || selectedCandidate === cand);
      safeSetVisibility(mapRef.current, `isochrones-${cand}-fill`, showThis);
      safeSetVisibility(mapRef.current, `isochrones-${cand}-line`, showThis);
    });
  }, [mapLoaded, isLayerEnabled, selectedCandidate]);

  useEffect(() => {
    if (!mapLoaded) return;
    const vis = isLayerEnabled("hptu");
    const hptu = markersRef.current.find((m) => m.type === "hptu");
    if (hptu) hptu.marker.getElement().style.display = vis ? "block" : "none";
  }, [mapLoaded, isLayerEnabled]);

  /* ── Traffic layer visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("traffic");
    if (enabled) {
      ensureTrafficLayers(map).then(() => {
        safeSetVisibility(map, "traffic-segments-casing", true);
        safeSetVisibility(map, "traffic-segments-line", true);
        safeSetVisibility(map, "traffic-segments-arrows", true);
        safeSetVisibility(map, "traffic-segments-label", true);
      });
    } else {
      safeSetVisibility(map, "traffic-segments-casing", false);
      safeSetVisibility(map, "traffic-segments-line", false);
      safeSetVisibility(map, "traffic-segments-arrows", false);
      safeSetVisibility(map, "traffic-segments-label", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureTrafficLayers]);

  /* ── Full Health Network visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("healthFull");
    if (enabled) {
      ensureHealthFullLayers(map).then(() => {
        safeSetVisibility(map, "health-full-clusters", true);
        safeSetVisibility(map, "health-full-cluster-count", true);
        safeSetVisibility(map, "health-full-points", true);
      });
    } else {
      safeSetVisibility(map, "health-full-clusters", false);
      safeSetVisibility(map, "health-full-cluster-count", false);
      safeSetVisibility(map, "health-full-points", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureHealthFullLayers]);

  /* ── OSM Education layer visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("osmEducation");
    if (enabled) {
      ensureOsmLayers(map, "education").then(() => {
        safeSetVisibility(map, "osm-education-circles", true);
        safeSetVisibility(map, "osm-education-labels", true);
      });
    } else {
      safeSetVisibility(map, "osm-education-circles", false);
      safeSetVisibility(map, "osm-education-labels", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureOsmLayers]);

  /* ── OSM Commercial layer visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("osmCommercial");
    if (enabled) {
      ensureOsmLayers(map, "commercial").then(() => {
        safeSetVisibility(map, "osm-commercial-circles", true);
        safeSetVisibility(map, "osm-commercial-labels", true);
      });
    } else {
      safeSetVisibility(map, "osm-commercial-circles", false);
      safeSetVisibility(map, "osm-commercial-labels", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureOsmLayers]);

  /* ── Routes layer visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("routes");
    if (enabled) {
      ensureRouteLayers(map).then(() => {
        safeSetVisibility(map, "alternate-routes-casing", true);
        safeSetVisibility(map, "alternate-routes-line", true);
        safeSetVisibility(map, "alternate-routes-arrows", true);
        safeSetVisibility(map, "alternate-routes-label", true);
      });
    } else {
      safeSetVisibility(map, "alternate-routes-casing", false);
      safeSetVisibility(map, "alternate-routes-line", false);
      safeSetVisibility(map, "alternate-routes-arrows", false);
      safeSetVisibility(map, "alternate-routes-label", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureRouteLayers]);

  /* ── Catastro layer visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("catastro");
    if (enabled) {
      ensureCatastroLayers(map).then(() => {
        safeSetVisibility(map, "catastro-bubbles", true);
        safeSetVisibility(map, "catastro-labels", true);
      });
    } else {
      safeSetVisibility(map, "catastro-bubbles", false);
      safeSetVisibility(map, "catastro-labels", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureCatastroLayers]);

  /* ── POT layer visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("pot");
    if (enabled) {
      ensurePotLayers(map).then(() => {
        safeSetVisibility(map, "pot-circles", true);
        safeSetVisibility(map, "pot-score-labels", true);
        safeSetVisibility(map, "pot-name-labels", true);
      });
    } else {
      safeSetVisibility(map, "pot-circles", false);
      safeSetVisibility(map, "pot-score-labels", false);
      safeSetVisibility(map, "pot-name-labels", false);
    }
  }, [mapLoaded, isLayerEnabled, ensurePotLayers]);

  /* ── Oriente Health layer visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("orienteHealth");
    if (enabled) {
      ensureOrienteHealthLayers(map).then(() => {
        safeSetVisibility(map, "oriente-health-circles", true);
        safeSetVisibility(map, "oriente-health-labels", true);
      });
    } else {
      safeSetVisibility(map, "oriente-health-circles", false);
      safeSetVisibility(map, "oriente-health-labels", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureOrienteHealthLayers]);

  /* ── Access Point Isochrones visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("accessPointIso");
    if (enabled) {
      ensureAccessPointIsoLayers(map).then(() => {
        safeSetVisibility(map, "access-point-isochrones-fill", true);
        safeSetVisibility(map, "access-point-isochrones-line", true);
        safeSetVisibility(map, "access-point-isochrones-label", true);
      });
    } else {
      safeSetVisibility(map, "access-point-isochrones-fill", false);
      safeSetVisibility(map, "access-point-isochrones-line", false);
      safeSetVisibility(map, "access-point-isochrones-label", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureAccessPointIsoLayers]);

  /* ── Access Point Routes visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("accessPointRoutes");
    if (enabled) {
      ensureAccessPointRouteLayers(map).then(() => {
        safeSetVisibility(map, "access-point-routes-casing", true);
        safeSetVisibility(map, "access-point-routes-line", true);
        safeSetVisibility(map, "access-point-routes-arrows", true);
        safeSetVisibility(map, "access-point-routes-label", true);
      });
    } else {
      safeSetVisibility(map, "access-point-routes-casing", false);
      safeSetVisibility(map, "access-point-routes-line", false);
      safeSetVisibility(map, "access-point-routes-arrows", false);
      safeSetVisibility(map, "access-point-routes-label", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureAccessPointRouteLayers]);

  /* ── Medical Projects visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("medicalProjects");
    if (enabled) {
      ensureMedicalProjectLayers(map).then(() => {
        safeSetVisibility(map, "medical-projects-circles", true);
        safeSetVisibility(map, "medical-projects-labels", true);
      });
    } else {
      safeSetVisibility(map, "medical-projects-circles", false);
      safeSetVisibility(map, "medical-projects-labels", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureMedicalProjectLayers]);

  /* ── Oriente Municipalities visibility ── */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const enabled = isLayerEnabled("orienteMunicipios");
    if (enabled) {
      ensureOrienteMunicipiosLayers(map).then(() => {
        safeSetVisibility(map, "oriente-municipios-circles", true);
        safeSetVisibility(map, "oriente-municipios-labels", true);
      });
    } else {
      safeSetVisibility(map, "oriente-municipios-circles", false);
      safeSetVisibility(map, "oriente-municipios-labels", false);
    }
  }, [mapLoaded, isLayerEnabled, ensureOrienteMunicipiosLayers]);

  /* ── Map style change ── */
  const handleStyleChange = useCallback(
    (newStyle: MapStyleId) => {
      if (!mapRef.current || newStyle === mapStyle) return;
      setMapStyle(newStyle);
      // Reset loaded sources since style change removes them
      loadedSourcesRef.current.clear();
      setMapLoaded(false);

      const map = mapRef.current;
      map.setStyle(getStyleUrl(newStyle));

      map.once("style.load", () => {
        setMapLoaded(true);
        // Re-add all sources/layers
        // Strata
        map.addSource("strata-zones", { type: "geojson", data: "/geojson/strata-zones.geojson" });
        map.addLayer({
          id: "strata-fill", type: "fill", source: "strata-zones",
          paint: { "fill-color": "#0d9488", "fill-opacity": 0.25 },
        });
        map.addLayer({
          id: "strata-outline", type: "line", source: "strata-zones",
          paint: { "line-color": "#0d9488", "line-width": 1.5, "line-opacity": 0.8 },
        });

        // Corridor (real road geometry)
        map.addSource("corridor-line", {
          type: "geojson",
          data: "/geojson/corridor-las-palmas.geojson",
        });
        map.addLayer({
          id: "corridor-line-glow", type: "line", source: "corridor-line",
          paint: { "line-color": "#8b5cf6", "line-width": 16, "line-opacity": 0.12, "line-blur": 4 },
        });
        map.addLayer({
          id: "corridor-line-layer", type: "line", source: "corridor-line",
          paint: { "line-color": "#8b5cf6", "line-width": 5, "line-opacity": 0.8 },
          layout: { "line-cap": "round", "line-join": "round" },
        });
        map.addLayer({
          id: "corridor-line-label", type: "symbol", source: "corridor-line",
          layout: { "symbol-placement": "line-center", "text-field": "Corredor Las Palmas", "text-size": 12, "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"], "text-offset": [0, -1] },
          paint: { "text-color": "#7c3aed", "text-halo-color": "#fff", "text-halo-width": 2 },
        });

        // Candidate labels
        map.addSource("candidate-labels", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: candidateZones.map((z) => ({
              type: "Feature" as const,
              properties: { name: z.name, score: z.score, color: z.color },
              geometry: { type: "Point" as const, coordinates: z.coordinates },
            })),
          },
        });
        map.addLayer({
          id: "candidate-label-text", type: "symbol", source: "candidate-labels",
          layout: {
            "text-field": ["concat", ["get", "name"], " (", ["to-string", ["get", "score"]], ")"],
            "text-size": 11, "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.6], "text-anchor": "top", "text-allow-overlap": false,
          },
          paint: { "text-color": ["get", "color"], "text-halo-color": "#fff", "text-halo-width": 2 },
        });

        // Isochrones
        CANDIDATE_IDS.forEach((cand) => {
          map.addSource(`isochrones-${cand}`, { type: "geojson", data: `/geojson/isochrones-${cand}.geojson` });
          map.addLayer({
            id: `isochrones-${cand}-fill`, type: "fill", source: `isochrones-${cand}`,
            paint: {
              "fill-color": ["match", ["get", "contour"], 10, "#f59e0b", 20, "#fb923c", 30, "#fdba74", "#fde68a"],
              "fill-opacity": ["match", ["get", "contour"], 10, 0.25, 20, 0.15, 30, 0.08, 0.05],
            },
            layout: { visibility: "none" },
          });
          map.addLayer({
            id: `isochrones-${cand}-line`, type: "line", source: `isochrones-${cand}`,
            paint: { "line-color": "#f59e0b", "line-width": 1, "line-opacity": 0.5, "line-dasharray": [2, 2] },
            layout: { visibility: "none" },
          });
        });

        // Re-load lazy layers if enabled
        if (isLayerEnabled("traffic")) ensureTrafficLayers(map);
        if (isLayerEnabled("healthFull")) ensureHealthFullLayers(map);
        if (isLayerEnabled("routes")) ensureRouteLayers(map);
        if (isLayerEnabled("catastro")) ensureCatastroLayers(map);
        if (isLayerEnabled("pot")) ensurePotLayers(map);
        if (isLayerEnabled("osmEducation")) ensureOsmLayers(map, "education");
        if (isLayerEnabled("osmCommercial")) ensureOsmLayers(map, "commercial");
        // Oriente layers
        if (isLayerEnabled("orienteHealth")) ensureOrienteHealthLayers(map);
        if (isLayerEnabled("accessPointIso")) ensureAccessPointIsoLayers(map);
        if (isLayerEnabled("accessPointRoutes")) ensureAccessPointRouteLayers(map);
        if (isLayerEnabled("medicalProjects")) ensureMedicalProjectLayers(map);
        if (isLayerEnabled("orienteMunicipios")) ensureOrienteMunicipiosLayers(map);

        // Annotations
        map.addSource("map-annotations", {
          type: "geojson",
          data: "/geojson/map-annotations.geojson",
        });
        map.addLayer({
          id: "map-annotations-labels",
          type: "symbol",
          source: "map-annotations",
          layout: {
            "text-field": ["get", "label"],
            "text-size": ["get", "size"],
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
            "text-allow-overlap": true,
            "text-ignore-placement": true,
          },
          paint: {
            "text-color": ["get", "color"],
            "text-halo-color": "#ffffff",
            "text-halo-width": 2.5,
          },
          minzoom: 10,
          maxzoom: 14,
        });
      });
    },
    [mapStyle, isLayerEnabled, ensureTrafficLayers, ensureHealthFullLayers, ensureRouteLayers, ensureCatastroLayers, ensurePotLayers, ensureOsmLayers, ensureOrienteHealthLayers, ensureAccessPointIsoLayers, ensureAccessPointRouteLayers, ensureMedicalProjectLayers, ensureOrienteMunicipiosLayers]
  );

  /* ── Candidate selection ── */
  const handleSelectCandidate = useCallback(
    (id: string) => {
      const newId = selectedCandidate === id ? null : id;
      setSelectedCandidate(newId);

      if (!mapRef.current || !mapLoaded) return;

      if (newId) {
        const zone = candidateZones.find((z) => z.id === newId);
        if (zone) {
          // Access Point needs wider zoom to show Oriente context
          const zoomLevel = newId === "access-point" ? 10 : 13.5;
          mapRef.current.flyTo({ center: zone.coordinates, zoom: zoomLevel, duration: 1500 });
        }
        // Enable isochrones and show only this zone
        setLayers((prev) => prev.map((l) => (l.id === "isochrones" ? { ...l, enabled: true } : l)));
        CANDIDATE_IDS.forEach((cand) => {
          const vis = cand === newId;
          safeSetVisibility(mapRef.current, `isochrones-${cand}-fill`, vis);
          safeSetVisibility(mapRef.current, `isochrones-${cand}-line`, vis);
        });

        // When selecting Access Point, auto-enable Oriente layers
        if (newId === "access-point") {
          setLayers((prev) =>
            prev.map((l) =>
              ["accessPointIso", "accessPointRoutes", "medicalProjects", "orienteMunicipios"].includes(l.id)
                ? { ...l, enabled: true }
                : l
            )
          );
        }
      } else {
        mapRef.current.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, duration: 1500 });
      }
    },
    [selectedCandidate, mapLoaded]
  );

  /* ── Preset view handler ── */
  const handlePresetView = useCallback(
    (preset: PresetView) => {
      if (!mapRef.current || !mapLoaded) return;

      // Toggle active state
      const newPreset = activePreset === preset.id ? null : preset.id;
      setActivePreset(newPreset);

      if (!newPreset) {
        // Reset to default view
        mapRef.current.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, duration: 1500 });
        return;
      }

      // Fly to preset center/zoom
      mapRef.current.flyTo({ center: preset.center, zoom: preset.zoom, duration: 1800, essential: true });

      // Toggle layers
      setLayers((prev) =>
        prev.map((l) => {
          if (preset.enableLayers.includes(l.id)) return { ...l, enabled: true };
          if (preset.disableLayers.includes(l.id)) return { ...l, enabled: false };
          return l;
        })
      );
    },
    [activePreset, mapLoaded]
  );

  const selectedZone = selectedCandidate ? candidateZones.find((z) => z.id === selectedCandidate) ?? null : null;
  const hasToken = MAPBOX_TOKEN && MAPBOX_TOKEN !== "pk.your_mapbox_token_here";

  /* ── Render ── */
  return (
    <section id="mapa-estrategico" className="w-full py-6 lg:py-8">
      {/* Header */}
      <div className="text-center mb-6 px-4">
        <Badge variant="outline" className="mb-3">
          Tablero Integral — 17 Capas · 145 IPS · 113 Salud Oriente · 22 Barrios · 11 Municipios
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Mapa Estrategico de Localizacion
        </h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto text-sm">
          Tablero integral con 145 IPS (REPS), 113 facilities Oriente (OSM), 22 barrios catastro y POT,
          rutas a Oriente Antioqueno, isocronas 15-60 min y 11 municipios. Click en una zona candidata para explorar.
        </p>
      </div>

      {/* Preset narrative views */}
      <div className="flex justify-center mb-3 px-4">
        <MapPresetViews activePreset={activePreset} onSelectPreset={handlePresetView} />
      </div>

      {/* Candidate zone selector bar */}
      <div className="flex justify-center gap-2 mb-4 px-4 flex-wrap">
        {candidateZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => handleSelectCandidate(zone.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all border ${
              selectedCandidate === zone.id
                ? "shadow-md scale-105"
                : "bg-white/80 hover:bg-white hover:shadow-sm"
            }`}
            style={
              selectedCandidate === zone.id
                ? { backgroundColor: zone.color + "15", borderColor: zone.color, color: zone.color }
                : { borderColor: "transparent" }
            }
          >
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
            {zone.id === "access-point" ? `★ ${zone.name}` : zone.name}
            <span className="font-bold">{zone.score}</span>
          </button>
        ))}
      </div>

      {/* Map container — immersive full-bleed */}
      <div className="relative h-[65vh] sm:h-[80vh] lg:h-[90vh] w-full">
        {!hasToken ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-muted">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">Token de Mapbox no configurado</p>
            <p className="text-sm text-muted-foreground/70 mt-2 max-w-md">
              Agrega tu token en <code className="text-xs bg-muted-foreground/10 px-1.5 py-0.5 rounded">.env.local</code> como{" "}
              <code className="text-xs bg-muted-foreground/10 px-1.5 py-0.5 rounded">NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx</code>
            </p>
          </div>
        ) : mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-muted">
            <MapPin className="h-12 w-12 text-red-400/50 mb-4" />
            <p className="text-lg font-semibold text-red-600">{mapError}</p>
          </div>
        ) : (
          <>
            <div ref={mapContainer} className="w-full h-full" />

            {mapLoaded && (
              <>
                <MapLayerControls layers={layers} onToggle={toggleLayer} />
                <MapStyleToggle current={mapStyle} onChange={handleStyleChange} />
                <MapFloatingLegend />
                <MapCandidatePanel candidate={selectedZone} onClose={() => setSelectedCandidate(null)} />
                {activePreset && (
                  <div className="absolute top-4 right-[60px] z-20 max-w-[200px] rounded-lg bg-white/90 backdrop-blur-md border border-border/50 shadow-lg p-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Vista activa</p>
                    <p className="text-xs font-semibold">{PRESET_VIEWS.find(p => p.id === activePreset)?.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{PRESET_VIEWS.find(p => p.id === activePreset)?.description}</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
