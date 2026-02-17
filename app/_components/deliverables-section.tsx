"use client";

import { motion } from "framer-motion";
import { Globe, FileText, Database, BarChart3, Presentation } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const deliverables = [
  {
    icon: Globe,
    title: "Mapa Interactivo",
    description: "Plataforma web con mapa Mapbox, capas toggleables, isocronas y scoring visual por zona candidata.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: FileText,
    title: "Reporte Ejecutivo",
    description: "Documento tecnico con analisis completo, metodologia, hallazgos y recomendacion final.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Database,
    title: "Base Georreferenciada",
    description: "Datasets GeoJSON y PostGIS con todas las capas espaciales procesadas.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: BarChart3,
    title: "Modelo MCDA",
    description: "Modelo multicriterio calibrado con analisis de sensibilidad y documentacion de pesos.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Presentation,
    title: "Presentacion Ejecutiva",
    description: "Deck de presentacion para stakeholders con visualizaciones clave y recomendacion.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

export function DeliverablesSection() {
  return (
    <SectionWrapper id="entregables">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4">Entregables</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Productos del Estudio
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Cinco entregables concretos al finalizar las 5 semanas del proyecto.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {deliverables.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card p-4 sm:p-5 hover:shadow-card-hover transition-shadow"
            >
              <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-lg", item.bgColor)}>
                <Icon className={cn("h-5 w-5", item.color)} />
              </div>
              <h3 className="text-sm font-bold mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
