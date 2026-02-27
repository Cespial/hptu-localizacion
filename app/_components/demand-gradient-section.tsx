"use client";

import { motion } from "framer-motion";
import { TrendingDown, Database } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { demandGradient } from "@/lib/demo-data/demand-gradient";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export function DemandGradientSection() {
  return (
    <SectionWrapper id="gradiente-demanda">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">Fase 1 - Gradiente de Demanda (Datos Reales)</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Corredor Las Palmas: Analisis por Barrio
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Datos reales de Catastro Municipal (1,041,413 predios), POT Bateria de Indicadores,
          MEData Velocidades (64,285 observaciones) y Mapbox Matrix API.
          La demanda y accesibilidad disminuyen al ascender por el corredor.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Source badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {["Catastro Medellin (bp59-rj8r)", "POT Indicadores (3ciz-tpgr)", "MEData Velocidades (7t5n-3b3w)", "Mapbox Matrix API", "REPS (b4dp-ximh)"].map(src => (
            <span key={src} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] text-muted-foreground font-medium">
              <Database className="h-2.5 w-2.5" />
              {src}
            </span>
          ))}
        </div>

        {/* Gradient cards */}
        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-amber-400 to-red-400 rounded-full hidden sm:block" />

          <div className="space-y-3">
            {demandGradient.map((point, i) => {
              const isOptimal = point.id === "altos-del-poblado" || point.id === "el-tesoro";
              const demandPct = point.demandScore;
              const accessPct = point.accessScore;

              return (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "relative rounded-xl border p-4 sm:p-5 sm:ml-14 transition-all",
                    isOptimal
                      ? "border-teal-300 bg-teal-50/50 shadow-sm ring-1 ring-teal-200"
                      : "bg-card hover:shadow-sm"
                  )}
                >
                  <div
                    className={cn(
                      "absolute -left-[2.15rem] sm:-left-[2.4rem] top-6 h-4 w-4 rounded-full border-2 border-white shadow hidden sm:block",
                      isOptimal ? "bg-teal-500" : i < 2 ? "bg-teal-400" : i < 4 ? "bg-amber-400" : "bg-red-400"
                    )}
                  />

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">{point.label}</h4>
                          {isOptimal && (
                            <span className="text-[10px] font-bold bg-teal-500 text-white px-1.5 py-0.5 rounded-full">
                              ZONA OPTIMA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {point.barrioRef} &middot; {point.elevation}
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <div className={cn(
                          "inline-flex items-center justify-center h-9 w-9 rounded-full text-xs font-bold text-white",
                          demandPct >= 85 ? "bg-teal-500" : demandPct >= 65 ? "bg-amber-500" : "bg-red-400"
                        )}>
                          {demandPct}
                        </div>
                        <div className={cn(
                          "inline-flex items-center justify-center h-9 w-9 rounded-full text-xs font-bold text-white",
                          accessPct >= 85 ? "bg-blue-500" : accessPct >= 65 ? "bg-amber-500" : "bg-red-400"
                        )}>
                          {accessPct}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Catastro (Predios E5/E6)</p>
                        <p className="font-bold text-teal-700 mt-0.5">{formatNumber(point.prediosE56)} predios</p>
                        <p className="text-muted-foreground">Avaluo avg: {formatPrice(point.avaluoPromedio)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">POT Viabilidad Dotacional</p>
                        <p className="font-bold text-blue-700 mt-0.5">{point.potScore.split("(")[0].trim()}</p>
                        <p className="text-muted-foreground">Altura: {point.potAltura} | SPD: {formatNumber(point.sueloPotencial)} m2</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Accesibilidad (Mapbox / MEData)</p>
                        <p className="font-bold text-purple-700 mt-0.5">{point.mapboxDriveToHPTU}</p>
                        <p className="text-muted-foreground">{point.corridorSpeed.split(":")[0]}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Key insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-xl border-2 border-teal-300 bg-teal-50/50 p-5 sm:p-6"
        >
          <div className="flex items-start gap-3">
            <TrendingDown className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-lg font-bold text-teal-800">Hallazgo: Altos del Poblado es la Zona Optima</h4>
              <p className="text-sm text-teal-700 mt-1">
                El barrio <strong>Altos del Poblado (cod 1408)</strong> obtiene el maximo score de viabilidad POT (9/9)
                con <strong>CL_D=2.38</strong> (maxima concentracion dotacional) y <strong>68,020 m2 de suelo potencial</strong>.
                El Catastro registra <strong>1,867 predios E5/E6</strong> con avaluo promedio de <strong>$245M COP</strong>.
                La Mapbox Matrix API confirma <strong>23.8 min a HPTU</strong> y <strong>10.5 min a Cl. Las Vegas</strong>.
                MEData registra <strong>40.9 km/h promedio</strong> en Av. Las Palmas (64,285 observaciones, 2017-2020).
                Cada punto adicional subiendo por Las Palmas incrementa el tiempo de viaje en ~6 min y reduce los predios E5/E6 accesibles.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
