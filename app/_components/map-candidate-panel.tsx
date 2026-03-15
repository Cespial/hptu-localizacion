"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { CandidateZone } from "@/lib/demo-data/candidate-zones";

type MapCandidatePanelProps = {
  candidate: CandidateZone | null;
  onClose: () => void;
};

const scoreLabels: Record<string, string> = {
  accesibilidad: "Accesibilidad",
  demanda: "Demanda",
  competencia: "Competencia",
  valorInmobiliario: "Valor Inmob.",
};

const scoreColors: Record<string, string> = {
  accesibilidad: "bg-teal-500",
  demanda: "bg-blue-500",
  competencia: "bg-amber-500",
  valorInmobiliario: "bg-purple-500",
};

const formatNumber = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export function MapCandidatePanel({ candidate, onClose }: MapCandidatePanelProps) {
  return (
    <AnimatePresence>
      {candidate && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-4 right-4 z-20 w-[320px] rounded-xl border bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: candidate.color + "15" }}
          >
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: candidate.color }} />
              <span className="font-bold text-sm">{candidate.name}</span>
              <div
                className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                style={{ backgroundColor: candidate.color }}
              >
                {candidate.score}/100
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="px-4 py-3 space-y-3">
            <p className="text-[11px] text-muted-foreground">{candidate.subtitle}</p>

            {/* MCDA Score bars */}
            <div className="space-y-1.5">
              {Object.entries(candidate.scores).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground w-20 shrink-0">
                    {scoreLabels[key]}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={cn("h-full rounded-full", scoreColors[key])}
                    />
                  </div>
                  <span className="text-[11px] font-bold w-6 text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-[9px] text-muted-foreground">Pob. E5/E6</p>
                <p className="text-xs font-bold">{formatNumber(candidate.demandEstimate)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-[9px] text-muted-foreground">Valor m2</p>
                <p className="text-xs font-bold">{formatPrice(candidate.avgM2Price)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-[9px] text-muted-foreground">Tiempo a HPTU</p>
                <p className="text-xs font-bold">{candidate.driveTimeToHPTU} min</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-[9px] text-muted-foreground">POT</p>
                <p className="text-[9px] font-medium leading-tight">{candidate.potViability.split("-")[0].trim()}</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-1">
              {candidate.highlights.slice(0, 3).map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground"
                >
                  {h.length > 60 ? h.substring(0, 57) + "..." : h}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
