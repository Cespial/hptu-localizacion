"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Star, Shield } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { medicalProjects } from "@/lib/demo-data/oriente-data";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

const statusColor: Record<string, string> = {
  operativo: "bg-green-100 text-green-700 border-green-300",
  "en-construccion": "bg-amber-100 text-amber-700 border-amber-300",
  planeacion: "bg-red-100 text-red-700 border-red-300",
  desconocido: "bg-gray-100 text-gray-600 border-gray-300",
};

const statusLabel: Record<string, string> = {
  operativo: "Operativo",
  "en-construccion": "En Construccion",
  planeacion: "Planeacion",
  desconocido: "Desconocido",
};

export function CompetitionExpandedSection() {
  const operativos = medicalProjects.filter((p) => p.status === "operativo").length;
  const enConstruccion = medicalProjects.filter((p) => p.status === "en-construccion").length;
  const competidores = medicalProjects.filter((p) => p.isCompetitor).length;

  const rated = medicalProjects.filter((p) => p.rating !== undefined);
  const avgRating =
    rated.length > 0
      ? (rated.reduce((s, p) => s + (p.rating ?? 0), 0) / rated.length).toFixed(1)
      : "N/A";

  return (
    <SectionWrapper id="competencia-ampliada">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Competencia — Infraestructura Medica en Desarrollo
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Mapa de Competencia: Proyectos Medicos Activos
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Google Places API + REPS + OSM: inventario de proyectos medicos
          existentes y en desarrollo en el Oriente Antioqueno y corredor sur.
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Proyectos Operativos
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">{operativos}</p>
          <p className="text-[10px] text-muted-foreground">
            Google Places + REPS
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            En Construccion
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {enConstruccion}
          </p>
          <p className="text-[10px] text-muted-foreground">
            torres medicas y clinicas
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Rating Promedio Oriente
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">{avgRating}/5</p>
          <p className="text-[10px] text-muted-foreground">
            baja calidad percibida
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Competidores Directos HPTU
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {competidores}
          </p>
          <p className="text-[10px] text-muted-foreground">
            isCompetitor = true
          </p>
        </motion.div>
      </div>

      {/* Project cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {medicalProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
            className={cn(
              "rounded-xl border bg-card p-4",
              project.isCompetitor && "border-red-400 border-2"
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold leading-tight">
                {project.name}
              </h4>
              {project.isCompetitor && (
                <Shield className="h-4 w-4 text-red-500 shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border bg-muted text-muted-foreground">
                {project.municipality}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border",
                  statusColor[project.status]
                )}
              >
                {statusLabel[project.status]}
              </span>
            </div>

            {project.rating !== undefined && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold">{project.rating}</span>
                {project.reviews !== undefined && (
                  <span className="text-[10px] text-muted-foreground">
                    ({formatNumber(project.reviews)} resenas)
                  </span>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Insight box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-amber-300 bg-amber-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-800">
              Clinica Somer: Unico Competidor de Alta Complejidad
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              Somer es la <strong>unica instalacion privada de alta complejidad</strong> en
              todo el Oriente Antioqueno. El Hospital San Juan de Dios (publico) tiene{" "}
              <strong>2.4/5 rating</strong> — la calificacion mas baja de la region. El
              proyecto <strong>Clinica Alto de Las Palmas NO fue encontrado en Google
              Places</strong> — aun permanece en fase conceptual sin presencia digital
              verificable. La Clinica del Campestre esta construyendo una{" "}
              <strong>torre de 15 pisos en El Poblado</strong>, apuntando al corredor sur.{" "}
              <strong>Oportunidad:</strong> la marca HPTU + calidad diferenciarian
              fuertemente en un mercado donde el rating promedio es solo {avgRating}/5.
            </p>
            <p className="text-xs text-amber-600 mt-2 italic">
              Fuentes: Google Places API (hospital_details_oriente), REPS (b4dp-ximh),
              OSM Overpass (health facilities)
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
