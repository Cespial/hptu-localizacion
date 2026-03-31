"use client";

import { cn } from "@/lib/utils";
import { Building2, MapPin, Mountain, Target, BarChart3, Route } from "lucide-react";

export type PresetView = {
  id: string;
  label: string;
  icon: React.ElementType;
  center: [number, number];
  zoom: number;
  enableLayers: string[];
  disableLayers: string[];
  description: string;
};

export const PRESET_VIEWS: PresetView[] = [
  {
    id: "mercado-dual",
    label: "Mercado Dual",
    icon: Building2,
    center: [-75.50, 6.19],
    zoom: 10.5,
    enableLayers: ["strata", "corridor", "catastro", "pois", "hptu", "orienteMunicipios"],
    disableLayers: ["traffic", "healthFull", "routes", "pot", "isochrones", "osmEducation", "osmCommercial", "orienteHealth", "accessPointIso", "accessPointRoutes", "medicalProjects"],
    description: "174K predios E5/E6 + corredor Las Palmas",
  },
  {
    id: "competencia",
    label: "Competencia",
    icon: Target,
    center: [-75.557, 6.212],
    zoom: 13,
    enableLayers: ["pois", "hptu", "corridor", "pot"],
    disableLayers: ["strata", "traffic", "routes", "catastro", "isochrones", "osmEducation", "osmCommercial", "orienteHealth", "accessPointIso", "accessPointRoutes", "medicalProjects", "orienteMunicipios", "healthFull"],
    description: "145 IPS + viabilidad POT + competidores",
  },
  {
    id: "oriente",
    label: "Oriente",
    icon: Mountain,
    center: [-75.42, 6.15],
    zoom: 10,
    enableLayers: ["orienteMunicipios", "orienteHealth", "accessPointRoutes", "medicalProjects", "corridor"],
    disableLayers: ["strata", "traffic", "healthFull", "routes", "catastro", "pois", "pot", "isochrones", "osmEducation", "osmCommercial", "accessPointIso", "hptu"],
    description: "728K hab, 11 municipios, rutas al Oriente",
  },
  {
    id: "tunel",
    label: "Tunel",
    icon: Route,
    center: [-75.49, 6.19],
    zoom: 10,
    enableLayers: ["corridor", "accessPointRoutes", "accessPointIso", "orienteMunicipios", "hptu"],
    disableLayers: ["strata", "traffic", "healthFull", "routes", "catastro", "pois", "pot", "isochrones", "osmEducation", "osmCommercial", "orienteHealth", "medicalProjects"],
    description: "Corredor + rutas al Oriente + isocronas post-Tunel",
  },
  {
    id: "access-point",
    label: "Sede HPTU",
    icon: MapPin,
    center: [-75.554932, 6.217662],
    zoom: 12,
    enableLayers: ["accessPointIso", "traffic", "corridor", "pot", "pois", "hptu"],
    disableLayers: ["strata", "healthFull", "routes", "catastro", "isochrones", "osmEducation", "osmCommercial", "orienteHealth", "accessPointRoutes", "medicalProjects", "orienteMunicipios"],
    description: "Isocronas + trafico + POT desde Km 7",
  },
  {
    id: "comparativa",
    label: "Comparativa",
    icon: BarChart3,
    center: [-75.565, 6.195],
    zoom: 11.5,
    enableLayers: ["isochrones", "corridor", "hptu", "strata", "catastro"],
    disableLayers: ["traffic", "healthFull", "routes", "pot", "osmEducation", "osmCommercial", "orienteHealth", "accessPointIso", "accessPointRoutes", "medicalProjects", "orienteMunicipios", "pois"],
    description: "6 zonas + isocronas del candidato seleccionado",
  },
];

type MapPresetViewsProps = {
  activePreset: string | null;
  onSelectPreset: (preset: PresetView) => void;
};

export function MapPresetViews({ activePreset, onSelectPreset }: MapPresetViewsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
        Vistas:
      </span>
      {PRESET_VIEWS.map((preset) => {
        const Icon = preset.icon;
        const isActive = activePreset === preset.id;
        return (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            title={preset.description}
            className={cn(
              "flex items-center gap-1.5 shrink-0 rounded-full sm:rounded-lg px-3 py-1.5 sm:py-2 sm:min-w-[140px] text-[11px] font-medium transition-all border",
              isActive
                ? "bg-[#00549f] text-white border-[#00549f] shadow-md"
                : "bg-white/90 text-muted-foreground border-border/50 hover:bg-white hover:shadow-sm hover:border-[#0D9488]"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <div className="text-left">
              <span className="block font-semibold">{preset.label}</span>
              <span className="hidden sm:block text-[9px] opacity-70 font-normal leading-tight">{preset.description}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
