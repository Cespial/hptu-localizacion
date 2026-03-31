"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const variables = [
  {
    letter: "A",
    name: "Accesibilidad",
    weight: 30,
    color: "bg-teal-100 text-teal-700 border-teal-300",
    barColor: "bg-teal-500",
    tooltip: "Isocronas, conectividad vial, tiempo de desplazamiento, acceso Tunel de Oriente",
  },
  {
    letter: "D",
    name: "Demanda",
    weight: 25,
    color: "bg-blue-100 text-blue-700 border-blue-300",
    barColor: "bg-blue-500",
    tooltip: "Densidad poblacional E5/E6, contributivos, captacion dual El Poblado + Oriente",
  },
  {
    letter: "C",
    name: "Competencia",
    weight: 20,
    color: "bg-amber-100 text-amber-700 border-amber-300",
    barColor: "bg-amber-500",
    tooltip: "Presencia de competidores, saturacion de oferta, brechas ambulatorias, duopolio Somer+SVF",
  },
  {
    letter: "Vis",
    name: "Visibilidad",
    weight: 15,
    color: "bg-rose-100 text-rose-700 border-rose-300",
    barColor: "bg-rose-500",
    tooltip: "Trafico vehicular diario, exposicion desde via principal, capacidad de convocatoria",
  },
  {
    letter: "Esp",
    name: "Esperas Productivas",
    weight: 10,
    color: "bg-purple-100 text-purple-700 border-purple-300",
    barColor: "bg-purple-500",
    tooltip: "Densidad de retail, servicios y comercio en 500m — modelo wellness center",
  },
];

export function FormulaSection() {
  return (
    <SectionWrapper id="formula">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4">Modelo Multicriterio — 5 Dimensiones</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Formula MCDA
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Multi-Criteria Decision Analysis: cada zona candidata recibe un score
          ponderado de 0 a 100 basado en cinco dimensiones clave. Actualizado
          post-Junta 16 marzo: se reemplaza &quot;Valor Inmobiliario&quot; con
          Visibilidad y Esperas Productivas.
        </p>
      </div>

      {/* Formula */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl rounded-2xl border bg-card p-4 sm:p-6 lg:p-8 shadow-sm"
      >
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-3">Funcion de scoring</p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg font-mono font-semibold">
            <span className="text-foreground">Score</span>
            <span className="text-muted-foreground">=</span>
            {variables.map((v, i) => (
              <span key={v.letter} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground mx-0.5">+</span>}
                <span className="text-muted-foreground">(</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-bold cursor-help ${v.color}`}>
                      {v.letter}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs opacity-80 mt-0.5">{v.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-muted-foreground text-xs">x</span>
                <span className="text-xs">{(v.weight / 100).toFixed(2)}</span>
                <span className="text-muted-foreground">)</span>
              </span>
            ))}
          </div>
        </div>

        {/* Weight bars */}
        <div className="space-y-3">
          {variables.map((v, i) => (
            <motion.div
              key={v.letter}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 w-32 sm:w-48 shrink-0">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-[10px] font-bold ${v.color}`}>
                  {v.letter}
                </span>
                <span className="text-xs sm:text-sm font-medium truncate">{v.name}</span>
              </div>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${v.weight}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full ${v.barColor}`}
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold w-8 sm:w-12 text-right">{v.weight}%</span>
            </motion.div>
          ))}
        </div>

        {/* Change note */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong>Cambio vs version anterior:</strong> Se reemplaza &quot;Valor Inmobiliario&quot; (15%)
            con dos variables nuevas: <strong>Visibilidad</strong> (15%) — trafico vehicular, exposicion,
            capacidad de convocatoria — y <strong>Esperas Productivas</strong> (10%) — densidad de
            retail/servicios alrededor de la zona, modelo wellness center. Accesibilidad baja de 35% a 30%,
            Demanda de 30% a 25%. Competencia se mantiene en 20%.
          </p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
