"use client";

import { motion } from "framer-motion";
import { Database, Map, Users, FileText, Cpu, BarChart3, Globe, Layers, ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const columns = [
  {
    title: "Fuentes",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    items: [
      { icon: Users, label: "DANE - Censo", detail: "Poblacion por estrato y manzana" },
      { icon: Map, label: "IGAC - Catastro", detail: "Valores y usos del suelo" },
      { icon: Database, label: "POT Medellin", detail: "Normativa urbanistica" },
      { icon: Globe, label: "OpenStreetMap", detail: "Red vial y POIs" },
    ],
  },
  {
    title: "Procesamiento",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    items: [
      { icon: Layers, label: "QGIS + PostGIS", detail: "Analisis geoespacial" },
      { icon: Cpu, label: "Python / GeoPandas", detail: "ETL y modelado MCDA" },
      { icon: Map, label: "Mapbox APIs", detail: "Isocronas y geocoding" },
      { icon: BarChart3, label: "Scoring Engine", detail: "Calibracion multicriterio" },
    ],
  },
  {
    title: "Salidas",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    items: [
      { icon: Globe, label: "Plataforma Web", detail: "Mapa interactivo Next.js" },
      { icon: FileText, label: "Reporte Ejecutivo", detail: "Documento tecnico PDF" },
      { icon: Database, label: "Base Georreferenciada", detail: "GeoJSON + PostGIS" },
      { icon: BarChart3, label: "Dashboard MCDA", detail: "Scoring por zona" },
    ],
  },
];

export function DataArchitectureSection() {
  return (
    <SectionWrapper id="arquitectura">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4">Arquitectura de Datos</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Flujo de Datos
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Pipeline de datos desde las fuentes oficiales hasta los entregables finales.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((col, colIdx) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: colIdx * 0.15 }}
            className="relative"
          >
            <div className={cn("rounded-xl border-2 p-5", col.borderColor)}>
              <h3 className={cn("text-sm font-bold uppercase tracking-wider mb-4", col.color)}>
                {col.title}
              </h3>
              <div className="space-y-3">
                {col.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={cn("flex items-start gap-3 rounded-lg p-3 border", col.bgColor)}
                    >
                      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", col.color)} />
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Arrow between columns */}
            {colIdx < 2 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="h-6 w-6 text-muted-foreground/40" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
