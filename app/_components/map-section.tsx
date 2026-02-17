"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { Info } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { MapPin, Layers, Circle, Hospital } from "lucide-react";
import { MapLayerControls, type LayerToggle } from "./map-layer-controls";
import { MapCandidatePanel } from "./map-candidate-panel";
import { candidateZones } from "@/lib/demo-data/candidate-zones";
import { pois, categoryColors, categoryLabels } from "@/lib/demo-data/poi";

const INITIAL_CENTER: [number, number] = [-75.57, 6.21];
const INITIAL_ZOOM = 11.5;

export function MapSection() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
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
    if (map.current || !mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token === "pk.your_mapbox_token_here") {
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      pitch: 0,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    map.current.on("load", () => {
      setMapLoaded(true);

      // Add strata zones source + layer
      map.current!.addSource("strata-zones", {
        type: "geojson",
        data: "/geojson/strata-zones.geojson",
      });
      map.current!.addLayer({
        id: "strata-fill",
        type: "fill",
        source: "strata-zones",
        paint: {
          "fill-color": "#0d9488",
          "fill-opacity": 0.15,
        },
      });
      map.current!.addLayer({
        id: "strata-outline",
        type: "line",
        source: "strata-zones",
        paint: {
          "line-color": "#0d9488",
          "line-width": 1.5,
          "line-opacity": 0.6,
        },
      });

      // Add isochrone sources for each candidate
      ["poblado", "envigado", "llanogrande"].forEach((cand) => {
        map.current!.addSource(`isochrones-${cand}`, {
          type: "geojson",
          data: `/geojson/isochrones-${cand}.geojson`,
        });
        map.current!.addLayer({
          id: `isochrones-${cand}-fill`,
          type: "fill",
          source: `isochrones-${cand}`,
          paint: {
            "fill-color": [
              "match",
              ["get", "minutes"],
              10, "#f59e0b",
              20, "#fb923c",
              30, "#fdba74",
              "#fde68a",
            ],
            "fill-opacity": [
              "match",
              ["get", "minutes"],
              10, 0.25,
              20, 0.15,
              30, 0.08,
              0.05,
            ],
          },
          layout: { visibility: "none" },
        });
        map.current!.addLayer({
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

      // Add HPTU actual marker
      const hptuPoi = pois.find((p) => p.id === "hptu-actual");
      if (hptuPoi) {
        const el = document.createElement("div");
        el.className = "hptu-marker";
        el.innerHTML = `<div style="background:#ef4444;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(hptuPoi.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 12 }).setHTML(
              `<div><p style="font-weight:600;margin:0;">${hptuPoi.name}</p><p style="font-size:12px;color:#666;margin:2px 0 0;">${hptuPoi.description}</p></div>`
            )
          )
          .addTo(map.current!);
        markersRef.current.push(marker);
      }

      // Add candidate zone markers
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
          .addTo(map.current!);
        markersRef.current.push(marker);
      });
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      markersRef.current.forEach((m) => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // POI markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove existing POI markers (keep first few which are HPTU + candidates)
    const poiMarkers: mapboxgl.Marker[] = [];

    const poisLayer = layers.find((l) => l.id === "pois");
    if (poisLayer?.enabled) {
      pois
        .filter((p) => p.id !== "hptu-actual")
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
            .addTo(map.current!);
          poiMarkers.push(marker);
        });
    }

    return () => {
      poiMarkers.forEach((m) => m.remove());
    };
  }, [mapLoaded, layers]);

  // Toggle strata layer visibility
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    const strataLayer = layers.find((l) => l.id === "strata");
    const vis = strataLayer?.enabled ? "visible" : "none";
    try {
      map.current.setLayoutProperty("strata-fill", "visibility", vis);
      map.current.setLayoutProperty("strata-outline", "visibility", vis);
    } catch {}
  }, [mapLoaded, layers]);

  // Toggle isochrone layers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    const isoLayer = layers.find((l) => l.id === "isochrones");
    const vis = isoLayer?.enabled ? "visible" : "none";
    ["poblado", "envigado", "llanogrande"].forEach((cand) => {
      try {
        map.current!.setLayoutProperty(`isochrones-${cand}-fill`, "visibility", vis);
        map.current!.setLayoutProperty(`isochrones-${cand}-line`, "visibility", vis);
      } catch {}
    });
  }, [mapLoaded, layers]);

  // Toggle HPTU marker
  useEffect(() => {
    if (!mapLoaded) return;
    const hptuLayer = layers.find((l) => l.id === "hptu");
    const hptuMarker = markersRef.current[0];
    if (hptuMarker) {
      hptuMarker.getElement().style.display = hptuLayer?.enabled ? "block" : "none";
    }
  }, [mapLoaded, layers]);

  // Handle candidate selection -> flyTo + show isochrones
  const handleSelectCandidate = useCallback(
    (id: string) => {
      const newId = selectedCandidate === id ? null : id;
      setSelectedCandidate(newId);

      if (!map.current || !mapLoaded) return;

      if (newId) {
        const zone = candidateZones.find((z) => z.id === newId);
        if (zone) {
          map.current.flyTo({
            center: zone.coordinates,
            zoom: 13,
            duration: 1500,
          });
        }

        // Enable isochrones layer if not already
        setLayers((prev) =>
          prev.map((l) => (l.id === "isochrones" ? { ...l, enabled: true } : l))
        );

        // Show only selected candidate's isochrones
        ["poblado", "envigado", "llanogrande"].forEach((cand) => {
          const vis = cand === newId ? "visible" : "none";
          try {
            map.current!.setLayoutProperty(`isochrones-${cand}-fill`, "visibility", vis);
            map.current!.setLayoutProperty(`isochrones-${cand}-line`, "visibility", vis);
          } catch {}
        });
      } else {
        map.current.flyTo({
          center: INITIAL_CENTER,
          zoom: INITIAL_ZOOM,
          duration: 1500,
        });
      }
    },
    [selectedCandidate, mapLoaded]
  );

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const hasToken = token && token !== "pk.your_mapbox_token_here";

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
          <div className="relative rounded-xl border overflow-hidden bg-muted" style={{ minHeight: 500 }}>
            {!hasToken ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">Token de Mapbox no configurado</p>
                <p className="text-sm text-muted-foreground/70 mt-2 max-w-md">
                  Agrega tu token en el archivo <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.env.local</code> como{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx</code>
                </p>
              </div>
            ) : (
              <div ref={mapContainer} className="absolute inset-0" />
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-6 lg:max-h-[600px] lg:overflow-y-auto lg:pr-1">
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
