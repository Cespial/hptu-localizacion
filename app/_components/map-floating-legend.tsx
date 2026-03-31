"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { categoryColors, categoryLabels } from "@/lib/demo-data/poi";

const healthLegend = [
  { color: "#dc2626", label: "Alta complejidad", size: "h-2.5 w-2.5" },
  { color: "#f97316", label: "Mediana", size: "h-2 w-2" },
  { color: "#94a3b8", label: "Baja/Consulta", size: "h-1.5 w-1.5" },
];

const trafficLegend = [
  { color: "#ef4444", label: "Severa (<18 km/h)" },
  { color: "#f59e0b", label: "Moderada (18-28)" },
  { color: "#22c55e", label: "Fluido (>28)" },
];

const isochroneLegend = [
  { color: "#f59e0b", label: "10 min" },
  { color: "#fb923c", label: "20 min" },
  { color: "#fdba74", label: "30 min" },
];

const orienteIsochroneLegend = [
  { color: "#115e59", label: "15 min" },
  { color: "#0d9488", label: "30 min" },
  { color: "#5eead4", label: "45 min" },
  { color: "#99f6e4", label: "60 min" },
];

export function MapFloatingLegend() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth < 640;
    return false;
  });

  return (
    <div className="absolute bottom-4 left-4 z-20 rounded-xl border bg-white/90 backdrop-blur-md shadow-lg max-w-[260px] overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:bg-muted/50 transition-colors"
      >
        <span>Leyenda</span>
        {collapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-2">
          {/* Red de Salud */}
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground">Red de Salud (145 IPS)</p>
            <div className="space-y-0.5">
              {healthLegend.map(({ color, label, size }) => (
                <div key={color} className="flex items-center gap-1.5">
                  <div className={`${size} rounded-full shrink-0`} style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">Trafico</p>
            <div className="space-y-0.5">
              {trafficLegend.map(({ color, label }) => (
                <div key={color} className="flex items-center gap-1.5">
                  <div className="h-1 w-4 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catastro */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">Catastro E5/E6</p>
            <div className="flex gap-1.5 items-center">
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: "#bae6fd" }} />
              <span className="text-[10px] text-muted-foreground">Bajo</span>
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: "#0284c7" }} />
              <span className="text-[10px] text-muted-foreground">Medio</span>
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: "#0c4a6e" }} />
              <span className="text-[10px] text-muted-foreground">Alto %</span>
            </div>
          </div>

          {/* POT Viabilidad */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">Viabilidad POT (22 barrios)</p>
            <div className="flex gap-1.5 items-center flex-wrap">
              {[
                { color: "#22c55e", label: "Alta" },
                { color: "#84cc16", label: "Med-Alta" },
                { color: "#f59e0b", label: "Media" },
                { color: "#ef4444", label: "Baja" },
              ].map(({ color, label }) => (
                <div key={color} className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* POI categories */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">POIs Clave</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: categoryColors[key as keyof typeof categoryColors] }}
                  />
                  <span className="text-[10px] text-muted-foreground truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Context layers */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">Contexto Corredor</p>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "#8b5cf6" }} />
                <span className="text-[10px] text-muted-foreground">Colegios</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "#f59e0b" }} />
                <span className="text-[10px] text-muted-foreground">Comercio</span>
              </div>
            </div>
          </div>

          {/* Isochrones */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">Isocronas</p>
            <div className="flex gap-2">
              {isochroneLegend.map(({ color, label }) => (
                <div key={color} className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: color, opacity: 0.4 }} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Oriente Antioqueño */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">Oriente Antioqueno</p>
            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "#e11d48" }} />
                <span className="text-[10px] text-muted-foreground">Access Point</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "#dc2626" }} />
                <span className="text-[10px] text-muted-foreground">Salud OSM</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "#f97316" }} />
                <span className="text-[10px] text-muted-foreground">Proyectos</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "#3b82f6" }} />
                <span className="text-[10px] text-muted-foreground">Municipios</span>
              </div>
            </div>
          </div>

          {/* Oriente Isochrones */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">Isocronas Access Point</p>
            <div className="flex gap-1.5 flex-wrap">
              {orienteIsochroneLegend.map(({ color, label }) => (
                <div key={color} className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: color, opacity: 0.3 }} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Oriente Routes */}
          <div className="space-y-1 pt-1.5 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground">Rutas Oriente</p>
            <div className="flex gap-1.5 items-center flex-wrap">
              {[
                { color: "#e11d48", label: "Rionegro" },
                { color: "#f97316", label: "Aeropuerto" },
                { color: "#8b5cf6", label: "La Ceja" },
                { color: "#06b6d4", label: "Marinilla" },
                { color: "#10b981", label: "Guarne" },
              ].map(({ color, label }) => (
                <div key={color} className="flex items-center gap-1">
                  <div className="h-0.5 w-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
