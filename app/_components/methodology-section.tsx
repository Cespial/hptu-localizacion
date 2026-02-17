"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Route, Scale, Target, Database, Users, Building2, Waypoints, Car, Landmark, TrendingUp, Crosshair, Layers, PieChart } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const phases = [
  {
    id: 1,
    title: "Mapeo de Demanda",
    icon: MapPin,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    ringColor: "ring-teal-500",
    dotColor: "bg-teal-500",
    description: "Identificacion y georreferenciacion de la poblacion objetivo (estratos 5 y 6) y sus patrones de ubicacion en el Area Metropolitana.",
    activities: [
      { icon: Users, label: "Georreferenciacion poblacional", detail: "Mapeo de densidad E5/E6 por manzana censal" },
      { icon: MapPin, label: "Puntos de interes clave", detail: "Clinicas, colegios, clubes, zonas corporativas" },
      { icon: Database, label: "Analisis de isocronas base", detail: "Tiempos de desplazamiento 10/20/30 minutos" },
    ],
  },
  {
    id: 2,
    title: "Flujos y Nodos",
    icon: Route,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    ringColor: "ring-blue-500",
    dotColor: "bg-blue-500",
    description: "Analisis de la infraestructura vial, nodos de transporte y corredores de movilidad que conectan la demanda con los sitios candidatos.",
    activities: [
      { icon: Car, label: "Flujos vehiculares principales", detail: "Corredores viales y tiempos de recorrido" },
      { icon: Waypoints, label: "Nodos de salud existentes", detail: "Red hospitalaria y cobertura actual" },
      { icon: Route, label: "Modelado de accesibilidad", detail: "Matrices OD y grafos de movilidad" },
    ],
  },
  {
    id: 3,
    title: "Competencia y Normativa",
    icon: Scale,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    ringColor: "ring-amber-500",
    dotColor: "bg-amber-500",
    description: "Evaluacion del entorno competitivo en salud premium y revision de la normativa urbanistica (POT) aplicable a cada zona candidata.",
    activities: [
      { icon: Building2, label: "Mapeo de competidores", detail: "Clinicas y hospitales premium en el area" },
      { icon: Landmark, label: "Revision POT y normativa", detail: "Usos del suelo y restricciones urbanisticas" },
      { icon: TrendingUp, label: "Analisis de mercado inmobiliario", detail: "Valores m2 y tendencias de desarrollo" },
    ],
  },
  {
    id: 4,
    title: "Sintesis y Recomendacion",
    icon: Target,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    ringColor: "ring-emerald-500",
    dotColor: "bg-emerald-500",
    description: "Integracion de todas las dimensiones mediante el modelo MCDA (Multi-Criteria Decision Analysis) para generar un ranking final de zonas candidatas.",
    activities: [
      { icon: Crosshair, label: "Calibracion modelo MCDA", detail: "Ponderacion de criterios con expertos" },
      { icon: Layers, label: "Scoring de zonas candidatas", detail: "Evaluacion multicriterio 0-100" },
      { icon: PieChart, label: "Analisis de sensibilidad", detail: "Robustez del ranking ante cambios de pesos" },
    ],
  },
];

export function MethodologySection() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <SectionWrapper id="metodologia">
      <div className="text-center mb-8 lg:mb-12">
        <Badge variant="outline" className="mb-4">Ruta Metodologica</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Modelo de Nodos y Flujos de Valor
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Metodologia en 4 fases para identificar la ubicacion optima,
          integrando datos geoespaciales, demograficos y de mercado.
        </p>
      </div>

      {/* Stepper - horizontal on desktop */}
      <div className="relative mb-10">
        {/* Connection line */}
        <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            const isActive = activePhase === i;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(i)}
                className={cn(
                  "relative flex flex-col items-center text-center group cursor-pointer transition-all",
                  isActive ? "scale-105" : "hover:scale-[1.02]"
                )}
              >
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                    isActive
                      ? `${phase.bgColor} ${phase.borderColor} ring-2 ${phase.ringColor} ring-offset-2`
                      : "bg-background border-border group-hover:border-muted-foreground/30"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? phase.color : "text-muted-foreground")} />
                </div>
                <div className="mt-3">
                  <span className={cn("text-xs font-medium", isActive ? phase.color : "text-muted-foreground")}>
                    Fase {phase.id}
                  </span>
                  <p className={cn("text-xs sm:text-sm font-semibold mt-0.5 leading-tight", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {phase.title}
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={cn("absolute -bottom-2 h-1 w-8 rounded-full", phase.dotColor)}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "rounded-2xl border-2 p-4 sm:p-6 lg:p-8",
            phases[activePhase].borderColor,
            phases[activePhase].bgColor + "/30"
          )}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", phases[activePhase].bgColor)}>
              {(() => { const Icon = phases[activePhase].icon; return <Icon className={cn("h-5 w-5", phases[activePhase].color)} />; })()}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">
                Fase {phases[activePhase].id}: {phases[activePhase].title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {phases[activePhase].description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {phases[activePhase].activities.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 rounded-lg bg-background/80 p-4 border"
                >
                  <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", phases[activePhase].color)} />
                  <div>
                    <p className="text-sm font-semibold">{activity.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
