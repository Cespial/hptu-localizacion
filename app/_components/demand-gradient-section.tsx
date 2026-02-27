"use client";

import { motion } from "framer-motion";
import { TrendingDown, Users, Car, Building2, DollarSign } from "lucide-react";
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
        <Badge variant="outline" className="mb-4">Fase 1 - Hallazgo Clave</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Gradiente de Demanda: Corredor Las Palmas
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          La demanda potencial disminuye progresivamente al ascender por Las Palmas.
          La zona optima se ubica entre Indiana y Cedro Verde, donde se maximiza
          el equilibrio accesibilidad-demanda-costo.
        </p>
      </div>

      {/* Gradient visualization */}
      <div className="mx-auto max-w-5xl">
        {/* Header with legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-teal-500" />
            <span>Pob. E5/E6 (20 min)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Car className="h-3.5 w-3.5 text-blue-500" />
            <span>Vehiculos/dia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-purple-500" />
            <span>Valor m2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-amber-500" />
            <span>Competencia</span>
          </div>
        </div>

        {/* Gradient cards */}
        <div className="relative">
          {/* Vertical gradient line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-amber-400 to-red-400 rounded-full hidden sm:block" />

          <div className="space-y-3">
            {demandGradient.map((point, i) => {
              const isOptimal = point.id === "indiana" || point.id === "eia";
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
                  {/* Dot on the gradient line */}
                  <div
                    className={cn(
                      "absolute -left-[2.15rem] sm:-left-[2.4rem] top-6 h-4 w-4 rounded-full border-2 border-white shadow hidden sm:block",
                      isOptimal ? "bg-teal-500" : i < 2 ? "bg-teal-400" : i < 4 ? "bg-amber-400" : "bg-red-400"
                    )}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                    {/* Label & elevation */}
                    <div className="sm:w-48 shrink-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold">
                          {point.label}
                        </h4>
                        {isOptimal && (
                          <span className="text-[10px] font-bold bg-teal-500 text-white px-1.5 py-0.5 rounded-full">
                            OPTIMO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {point.elevation} &middot; {point.distanceFromPoblado}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Hora pico: {point.driveTimePeak}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pob. E5/E6</p>
                        <p className="text-sm font-bold text-teal-700">{formatNumber(point.populationE56_20min)}</p>
                        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${demandPct}%` }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Vehiculos/dia</p>
                        <p className="text-sm font-bold text-blue-700">{formatNumber(point.vehiclesPerDay)}</p>
                        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${(point.vehiclesPerDay / 48000) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Valor m2</p>
                        <p className="text-sm font-bold text-purple-700">{formatPrice(point.avgM2Price)}</p>
                        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-purple-500" style={{ width: `${(point.avgM2Price / 12500000) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Competencia</p>
                        <p className="text-sm font-bold text-amber-700">{point.competitorDensity.split("(")[0].trim()}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{point.potStatus}</p>
                      </div>
                    </div>

                    {/* Access score */}
                    <div className="sm:w-20 shrink-0 text-center">
                      <div className={cn(
                        "inline-flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold text-white",
                        accessPct >= 85 ? "bg-teal-500" : accessPct >= 65 ? "bg-amber-500" : "bg-red-400"
                      )}>
                        {accessPct}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">Acceso</p>
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
              <h4 className="font-serif text-lg font-bold text-teal-800">Hallazgo: Zona Optima Identificada</h4>
              <p className="text-sm text-teal-700 mt-1">
                El analisis de gradiente confirma que la <strong>zona entre Indiana y la EIA</strong> (Las Palmas Bajo)
                maximiza la funcion de demanda-accesibilidad. Con <strong>128,500 habitantes E5/E6 en 20 minutos</strong>,
                <strong> 42,000 vehiculos/dia</strong> y uso del suelo compatible, esta zona ofrece el mejor equilibrio
                entre captacion de mercado premium y viabilidad urbanistica. Al ascender por Las Palmas, cada
                kilometro adicional reduce la poblacion accesible en ~12,000 habitantes y el flujo vehicular en ~5,000 unidades/dia.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
