"use client";

import { cn } from "@/lib/utils";

export type LayerToggle = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
};

type MapLayerControlsProps = {
  layers: LayerToggle[];
  onToggle: (id: string) => void;
};

export function MapLayerControls({ layers, onToggle }: MapLayerControlsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Capas del Mapa
      </p>
      {layers.map((layer) => {
        const Icon = layer.icon;
        return (
          <button
            key={layer.id}
            onClick={() => onToggle(layer.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all",
              layer.enabled
                ? "bg-card border-border shadow-sm"
                : "bg-muted/50 border-transparent opacity-60 hover:opacity-80"
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                layer.enabled ? "opacity-100" : "opacity-50"
              )}
              style={{ backgroundColor: layer.color + "20" }}
            >
              <Icon className="h-4 w-4" style={{ color: layer.color }} />
            </div>
            <span className="flex-1 text-left font-medium">{layer.label}</span>
            <div
              className={cn(
                "h-5 w-9 rounded-full p-0.5 transition-colors",
                layer.enabled ? "bg-primary" : "bg-muted-foreground/20"
              )}
            >
              <div
                className={cn(
                  "h-4 w-4 rounded-full bg-white shadow transition-transform",
                  layer.enabled ? "translate-x-4" : "translate-x-0"
                )}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
