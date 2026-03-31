"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export type LayerToggle = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
  group: "base" | "data" | "analysis" | "oriente";
};

type MapLayerControlsProps = {
  layers: LayerToggle[];
  onToggle: (id: string) => void;
};

const groupLabels: Record<string, string> = {
  base: "Base",
  data: "Datos",
  analysis: "Analisis",
  oriente: "Oriente Antioqueno",
};

export function MapLayerControls({ layers, onToggle }: MapLayerControlsProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth < 768;
    return false;
  });

  const groups = ["base", "data", "analysis", "oriente"] as const;

  return (
    <div className="absolute top-4 left-4 z-20 w-[200px] md:w-[220px] rounded-xl border bg-white/90 backdrop-blur-md shadow-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        <span>Capas ({layers.filter((l) => l.enabled).length}/{layers.length})</span>
        {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
      </button>

      {!collapsed && (
        <div className="px-2 pb-2 space-y-2 max-h-[60vh] overflow-y-auto">
          {groups.map((group) => {
            const groupLayers = layers.filter((l) => l.group === group);
            if (groupLayers.length === 0) return null;
            return (
              <div key={group}>
                <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-1 mb-1">
                  {groupLabels[group]}
                </p>
                <div className="space-y-0.5">
                  {groupLayers.map((layer) => {
                    const Icon = layer.icon;
                    return (
                      <button
                        key={layer.id}
                        onClick={() => onToggle(layer.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-all",
                          layer.enabled
                            ? "bg-white shadow-sm border border-border/50"
                            : "opacity-50 hover:opacity-75"
                        )}
                      >
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded"
                          style={{ backgroundColor: layer.color + "20" }}
                        >
                          <Icon className="h-3 w-3" style={{ color: layer.color }} />
                        </div>
                        <span className="flex-1 text-left font-medium truncate">{layer.label}</span>
                        <div
                          className={cn(
                            "h-3.5 w-7 rounded-full p-0.5 transition-colors",
                            layer.enabled ? "bg-primary" : "bg-muted-foreground/20"
                          )}
                        >
                          <div
                            className={cn(
                              "h-2.5 w-2.5 rounded-full bg-white shadow transition-transform",
                              layer.enabled ? "translate-x-3.5" : "translate-x-0"
                            )}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
