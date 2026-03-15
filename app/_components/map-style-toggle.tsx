"use client";

import { cn } from "@/lib/utils";
import { Sun, Satellite, Moon } from "lucide-react";

export type MapStyleId = "light" | "satellite" | "dark";

const styles: { id: MapStyleId; label: string; icon: React.ElementType; url: string }[] = [
  { id: "light", label: "Claro", icon: Sun, url: "mapbox://styles/mapbox/light-v11" },
  { id: "satellite", label: "Satelite", icon: Satellite, url: "mapbox://styles/mapbox/satellite-streets-v12" },
  { id: "dark", label: "Oscuro", icon: Moon, url: "mapbox://styles/mapbox/dark-v11" },
];

type MapStyleToggleProps = {
  current: MapStyleId;
  onChange: (id: MapStyleId) => void;
};

export function MapStyleToggle({ current, onChange }: MapStyleToggleProps) {
  return (
    <div className="absolute top-4 right-14 z-20 flex rounded-lg border bg-white/90 backdrop-blur-md shadow-lg overflow-hidden">
      {styles.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors",
            current === id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

export function getStyleUrl(id: MapStyleId): string {
  return styles.find((s) => s.id === id)?.url ?? styles[0].url;
}
