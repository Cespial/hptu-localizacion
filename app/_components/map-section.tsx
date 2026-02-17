"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Info, MapPin, Layers, Circle, Hospital } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { MapLayerControls, type LayerToggle } from "./map-layer-controls";
import { MapCandidatePanel } from "./map-candidate-panel";
import { candidateZones } from "@/lib/demo-data/candidate-zones";
import { pois, categoryColors, categoryLabels } from "@/lib/demo-data/poi";

const INITIAL_CENTER: [number, number] = [-75.57, 6.21];
const INITIAL_ZOOM = 11.5;
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const [layers, setLayers] = useState<LayerToggle[]>([
    { id: "strata", label: "Estratos 5 y 6", icon: Layers, color: "#0d9488", enabled: true },
    { id: "pois", label: "Puntos de Interes", icon: MapPin, color: "#3b82f6", enabled: true },
    { id: "isochrones", label: "Isocronas", icon: Circle, color: "#f59e0b", enabled: false },
    { id: "hptu", label: "HPTU Actual", icon: Hospital, color: "#ef4444", enabled: true },
  ]);

  const toggleLayer = useCallback((id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  }, []);

  // Initialize map
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
          style: "mapbox://styles/mapbox/light-v11",
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

          // Strata zones
          map.addSource("strata-zones", {
            type: "geojson",
            data: "/geojson/strata-zones.geojson",
          });
          map.addLayer({
            id: "strata-fill",
            type: "fill",
            source: "strata-zones",
            paint: { "fill-color": "#0d9488", "fill-opacity": 0.15 },
          });
          map.addLayer({
            id: "strata-outline",
            type: "line",
            source: "strata-zones",
            paint: { "line-color": "#0d9488", "line-width": 1.5, "line-opacity": 0.6 },
          });

          // Isochrones
          ["poblado", "envigado", "llanogrande"].forEach((cand) => {
            map.addSource(`isochrones-${cand}`, {
              type: "geojson",
              data: `/geojson/isochrones-${cand}.geojson`,
            });
            map.addLayer({
              id: `isochrones-${cand}-fill`,
              type: "fill",
              source: `isochrones-${cand}`,
              paint: {
                "fill-color": ["match", ["get", "minutes"], 10, "#f59e0b", 20, "#fb923c", 30, "#fdba74", "#fde68a"],
                "fill-opacity": ["match", ["get", "minutes"], 10, 0.25, 20, 0.15, 30, 0.08, 0.05],
              },
              layout: { visibility: "none" },
            });
            map.addLayer({
              id: `isochrones-${cand}-line`,
              type: "line",
              source: `isochrones-${cand}`,
              paint: { "line-color": "#f59e0b", "line-width": 1, "line-opacity": 0.5, "line-dasharray": [2, 2] },
              layout: { visibility: "none" },
            });
          });

          // HPTU actual marker
          const hptuPoi = pois.find((p) => p.id === "hosp-04");
          if (hptuPoi) {
            const el = document.createElement("div");
            el.innerHTML = `<div style="background:#ef4444;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat(hptuPoi.coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 12 }).setHTML(
                  `<div><p style="font-weight:600;margin:0;">${hptuPoi.name}</p><p style="font-size:12px;color:#666;margin:2px 0 0;">${hptuPoi.description}</p></div>`
                )
              )
              .addTo(map);
            markersRef.current.push(marker);
          }

          // Candidate zone markers
          candidateZones.forEach((zone) => {
            const el = document.createElement("div");
            el.innerHTML = `<div style="background:${zone.color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;"></div>`;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat(zone.coordinates)
              .setPopup(
                new mapboxgl.Popup({ offset: 10 }).setHTML(
                  `<div><p style="font-weight:600;margin:0;">${zone.name}</p><p style="font-size:12px;color:#666;margin:2px 0 0;">Score MCDA: <strong>${zone.score}</strong></p></div>`
                )
              )
              .addTo(map);
            markersRef.current.push(marker);
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
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // POI markers
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Clean previous POI markers
    poiMarkersRef.current.forEach((m) => m.remove());
    poiMarkersRef.current = [];

    const poisEnabled = layers.find((l) => l.id === "pois")?.enabled;
    if (!poisEnabled) return;

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
              new mapboxgl.Popup({ offset: 8 }).setHTML(
                `<div><p style="font-weight:600;margin:0;font-size:13px;">${poi.name}</p><p style="font-size:11px;color:#888;margin:2px 0 0;">${categoryLabels[poi.category]}</p><p style="font-size:11px;color:#666;margin:2px 0 0;">${poi.description}</p></div>`
              )
            )
            .addTo(map);
          poiMarkersRef.current.push(marker);
        });
    }

    addPOIs();
  }, [mapLoaded, layers]);

  // Strata visibility
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const vis = layers.find((l) => l.id === "strata")?.enabled ? "visible" : "none";
    try {
      mapRef.current.setLayoutProperty("strata-fill", "visibility", vis);
      mapRef.current.setLayoutProperty("strata-outline", "visibility", vis);
    } catch {}
  }, [mapLoaded, layers]);

  // Isochrone visibility
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const vis = layers.find((l) => l.id === "isochrones")?.enabled ? "visible" : "none";
    ["poblado", "envigado", "llanogrande"].forEach((cand) => {
      try {
        mapRef.current.setLayoutProperty(`isochrones-${cand}-fill`, "visibility", vis);
        mapRef.current.setLayoutProperty(`isochrones-${cand}-line`, "visibility", vis);
      } catch {}
    });
  }, [mapLoaded, layers]);

  // HPTU marker visibility
  useEffect(() => {
    if (!mapLoaded) return;
    const vis = layers.find((l) => l.id === "hptu")?.enabled;
    const hptuMarker = markersRef.current[0];
    if (hptuMarker) {
      hptuMarker.getElement().style.display = vis ? "block" : "none";
    }
  }, [mapLoaded, layers]);

  // Candidate selection -> flyTo
  const handleSelectCandidate = useCallback(
    (id: string) => {
      const newId = selectedCandidate === id ? null : id;
      setSelectedCandidate(newId);

      if (!mapRef.current || !mapLoaded) return;

      if (newId) {
        const zone = candidateZones.find((z) => z.id === newId);
        if (zone) {
          mapRef.current.flyTo({ center: zone.coordinates, zoom: 13, duration: 1500 });
        }
        setLayers((prev) => prev.map((l) => (l.id === "isochrones" ? { ...l, enabled: true } : l)));
        ["poblado", "envigado", "llanogrande"].forEach((cand) => {
          const vis = cand === newId ? "visible" : "none";
          try {
            mapRef.current.setLayoutProperty(`isochrones-${cand}-fill`, "visibility", vis);
            mapRef.current.setLayoutProperty(`isochrones-${cand}-line`, "visibility", vis);
          } catch {}
        });
      } else {
        mapRef.current.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, duration: 1500 });
      }
    },
    [selectedCandidate, mapLoaded]
  );

  const hasToken = MAPBOX_TOKEN && MAPBOX_TOKEN !== "pk.your_mapbox_token_here";

  return (
    <SectionWrapper id="mapa-piloto" fullWidth className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">Piloto Funcional</Badge>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Mapa de Localizacion Estrategica
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Visualizacion interactiva de zonas candidatas, puntos de interes y
            analisis de isocronas para la nueva sede del HPTU.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Map */}
          <div className="rounded-xl border overflow-hidden bg-muted h-[300px] sm:h-[400px] lg:h-[600px] relative">
            {!hasToken ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">Token de Mapbox no configurado</p>
                <p className="text-sm text-muted-foreground/70 mt-2 max-w-md">
                  Agrega tu token en <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.env.local</code> como{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx</code>
                </p>
              </div>
            ) : mapError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <Info className="h-12 w-12 text-red-400/50 mb-4" />
                <p className="text-lg font-semibold text-red-600">{mapError}</p>
              </div>
            ) : (
              <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-6 max-h-[50vh] overflow-y-auto sm:max-h-none sm:overflow-y-visible lg:max-h-[600px] lg:overflow-y-auto lg:pr-1">
            <MapLayerControls layers={layers} onToggle={toggleLayer} />
            <div className="h-px bg-border" />
            <MapCandidatePanel
              candidates={candidateZones}
              selectedId={selectedCandidate}
              onSelect={handleSelectCandidate}
            />

            {/* Legend */}
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Leyenda POI</p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: categoryColors[key as keyof typeof categoryColors] }}
                    />
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
