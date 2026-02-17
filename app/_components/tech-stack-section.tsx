"use client";

import { motion } from "framer-motion";
import { Map, Code2, Database, Globe, Cpu, BarChart3 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";

const tools = [
  { icon: Map, name: "QGIS", category: "GIS", description: "Analisis geoespacial y cartografia", color: "#589632" },
  { icon: Cpu, name: "Python", category: "Analisis", description: "GeoPandas, Scikit-learn, MCDA", color: "#3776AB" },
  { icon: Globe, name: "Mapbox GL", category: "Mapas Web", description: "Visualizacion interactiva", color: "#4264fb" },
  { icon: Code2, name: "Next.js", category: "Frontend", description: "Plataforma web React SSR", color: "#000000" },
  { icon: Database, name: "PostGIS", category: "Base de Datos", description: "Datos georreferenciados", color: "#336791" },
  { icon: BarChart3, name: "Vercel", category: "Deploy", description: "Hosting y CDN global", color: "#000000" },
];

export function TechStackSection() {
  return (
    <SectionWrapper id="stack">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4">Stack Tecnologico</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Herramientas y Tecnologias
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Combinacion de herramientas GIS profesionales y tecnologias web modernas.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-xl border bg-card p-5 text-center hover:shadow-card-hover transition-all"
            >
              <div
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: tool.color + "12" }}
              >
                <Icon className="h-6 w-6" style={{ color: tool.color }} />
              </div>
              <p className="text-sm font-bold">{tool.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{tool.category}</p>
              <p className="text-[11px] text-muted-foreground/70 mt-1 hidden group-hover:block">
                {tool.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
