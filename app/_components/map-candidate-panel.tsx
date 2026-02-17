"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CandidateZone } from "@/lib/demo-data/candidate-zones";

type MapCandidatePanelProps = {
  candidates: CandidateZone[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const scoreLabels: Record<string, string> = {
  accesibilidad: "Accesibilidad (A)",
  demanda: "Demanda (D)",
  competencia: "Competencia (C)",
  valorInmobiliario: "Valor Inmob. (V)",
};

const scoreColors: Record<string, string> = {
  accesibilidad: "bg-teal-500",
  demanda: "bg-blue-500",
  competencia: "bg-amber-500",
  valorInmobiliario: "bg-purple-500",
};

export function MapCandidatePanel({ candidates, selectedId, onSelect }: MapCandidatePanelProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Zonas Candidatas
      </p>
      {candidates.map((zone) => {
        const isSelected = selectedId === zone.id;
        return (
          <button
            key={zone.id}
            onClick={() => onSelect(zone.id)}
            className={cn(
              "w-full rounded-xl border p-4 text-left transition-all",
              isSelected
                ? "border-2 shadow-md bg-card"
                : "border bg-card/50 hover:bg-card hover:shadow-sm"
            )}
            style={isSelected ? { borderColor: zone.color } : {}}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-sm font-semibold">{zone.name}</span>
              </div>
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: zone.color }}
              >
                {zone.score}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{zone.subtitle}</p>

            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {Object.entries(zone.scores).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-28 shrink-0">
                      {scoreLabels[key]}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={cn("h-full rounded-full", scoreColors[key])}
                      />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right">{value}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {zone.highlights.map((h) => (
                    <span key={h} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {h}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </button>
        );
      })}
    </div>
  );
}
