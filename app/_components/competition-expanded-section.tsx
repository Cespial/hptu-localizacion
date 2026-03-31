"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Star,
  Shield,
  ShieldAlert,
  Stethoscope,
  Scan,
  BrainCircuit,
  ClipboardCheck,
  Scissors,
  Target,
  Plane,
  Clock,
  Building2,
  Radiation,
  Baby,
  Droplets,
  HeartPulse,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { medicalProjects } from "@/lib/demo-data/oriente-data";
import { competitors, ambulatoryGaps, marketData } from "@/lib/demo-data/strategic-data";

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

const threatColor: Record<string, string> = {
  alta: "bg-red-100 text-red-700 border-red-300",
  media: "bg-amber-100 text-amber-700 border-amber-300",
  baja: "bg-green-100 text-green-700 border-green-300",
};

const levelColor: Record<string, string> = {
  critico: "bg-red-100 text-red-700 border-red-300",
  limitado: "bg-amber-100 text-amber-700 border-amber-300",
  inexistente: "bg-gray-100 text-gray-600 border-gray-300",
  basico: "bg-blue-100 text-blue-700 border-blue-300",
};

const levelLabel: Record<string, string> = {
  critico: "Critico",
  limitado: "Limitado",
  inexistente: "Inexistente",
  basico: "Basico",
};

const gapIconMap: Record<string, React.ReactNode> = {
  "Cirugia Ambulatoria Avanzada": <Scissors className="h-5 w-5 text-red-500" />,
  "Imagenes Diagnosticas Avanzadas": <Scan className="h-5 w-5 text-amber-500" />,
  "Oncologia Ambulatoria": <ShieldAlert className="h-5 w-5 text-red-500" />,
  "Radioterapia": <Radiation className="h-5 w-5 text-red-500" />,
  "Rehabilitacion Especializada": <BrainCircuit className="h-5 w-5 text-gray-500" />,
  "Chequeo Ejecutivo": <ClipboardCheck className="h-5 w-5 text-gray-500" />,
  "Turismo Medico": <Plane className="h-5 w-5 text-gray-500" />,
  "Pediatria Subespecializada": <Baby className="h-5 w-5 text-gray-500" />,
  "Hemodialisis": <Droplets className="h-5 w-5 text-amber-500" />,
  "Cardiologia Intervencionista": <HeartPulse className="h-5 w-5 text-amber-500" />,
};

// Context data
const airportPassengers2024 = 14_500_000;
const zoneFrancaCompanies = 300;
const zoneFrancaEmployees = 12_000;

export function CompetitionExpandedSection() {
  const operativos = medicalProjects.filter((p) => p.status === "operativo").length;
  const enConstruccion = medicalProjects.filter((p) => p.status === "en-construccion").length;
  const competidores = medicalProjects.filter((p) => p.isCompetitor).length;

  const rated = medicalProjects.filter((p) => p.rating !== undefined);
  const avgRating =
    rated.length > 0
      ? (rated.reduce((s, p) => s + (p.rating ?? 0), 0) / rated.length).toFixed(1)
      : "N/A";

  const highThreats = competitors.filter((c) => c.threat === "alta");
  const totalCompetitorBeds = competitors.reduce((s, c) => s + (c.beds ?? 0), 0);

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
          Google Places API + REPS + OSM: inventario de {competitors.length}+ instituciones,
          proyectos medicos existentes y en desarrollo en el Oriente Antioqueno y corredor sur.
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

      {/* Competitor Table (from competitive-landscape) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold">
              Matriz de Competidores: {competitors.length} Instituciones Mapeadas
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {formatNumber(totalCompetitorBeds)} camas totales identificadas | {highThreats.length} amenazas altas para HPTU
          </p>
        </div>
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Institucion
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Camas
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                UCI
              </th>
              <th className="text-left py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Ubicacion
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Amenaza
              </th>
              <th className="text-left py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                Movimiento Reciente
              </th>
              <th className="text-left py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">
                Diferenciador
              </th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr
                key={c.id}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/20 transition-colors",
                  c.threat === "alta" && "bg-red-50/30"
                )}
              >
                <td className="py-2.5 px-4 text-xs">
                  <span className={cn("font-medium", c.threat === "alta" && "font-bold text-red-800")}>
                    {c.name}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-xs font-bold">
                  {c.beds !== null ? formatNumber(c.beds) : (
                    <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border bg-blue-50 text-blue-700 border-blue-200">
                      Amb.
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {c.icuBeds != null && c.icuBeds > 0 ? c.icuBeds : <span className="text-muted-foreground">&mdash;</span>}
                </td>
                <td className="py-2.5 px-3 text-xs text-muted-foreground">
                  {c.location}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase",
                      threatColor[c.threat]
                    )}
                  >
                    {c.threat}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-[11px] text-muted-foreground hidden md:table-cell max-w-[200px]">
                  {c.recentMove}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-muted-foreground hidden lg:table-cell max-w-[200px]">
                  {c.differentiator}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Fuentes:</strong> REPS Prestadores (b4dp-ximh), Google Places API, prensa (El Colombiano, Portafolio), sitios institucionales.
            Inversion estimada de fuentes publicas y reportes sectoriales.
          </p>
        </div>
      </motion.div>

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

      {/* Ambulatory Gaps Grid (from competitive-landscape) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-bold">
            Brechas Ambulatorias en el Oriente: Servicios Ausentes o Criticos
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ambulatoryGaps.map((gap, i) => (
            <motion.div
              key={gap.service}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className={cn(
                "rounded-xl border bg-card p-4",
                gap.level === "critico" && "border-red-300",
                gap.level === "inexistente" && "border-gray-300 border-dashed"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {gapIconMap[gap.service] ?? <Stethoscope className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-bold leading-tight">{gap.service}</h4>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold border uppercase",
                        levelColor[gap.level]
                      )}
                    >
                      {levelLabel[gap.level]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {gap.statusOriente}
                  </p>
                  <p className="text-[11px] text-blue-700 mt-1.5 font-medium leading-relaxed">
                    {gap.opportunity}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Differentiating context row (from competitive-landscape) */}
      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <Plane className="h-5 w-5 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">
            {(airportPassengers2024 / 1_000_000).toFixed(1)}M
          </p>
          <p className="text-[10px] text-muted-foreground">
            pasajeros SKRG 2024 — aeropuerto a 20 min del Access Point
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <Building2 className="h-5 w-5 text-violet-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-violet-600">
            {formatNumber(zoneFrancaCompanies)}+
          </p>
          <p className="text-[10px] text-muted-foreground">
            empresas Zona Franca Rionegro — {formatNumber(zoneFrancaEmployees)} empleados
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <Clock className="h-5 w-5 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-amber-600">
            {formatNumber(marketData.orientePopulation2023)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            poblacion Oriente — {ambulatoryGaps.filter((g) => g.level === "inexistente").length} servicios inexistentes
          </p>
        </motion.div>
      </div>

      {/* Insight box: Duopolio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-amber-300 bg-amber-50/50 p-5 sm:p-6 mb-8"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-800">
              Duopolio Somer + SVF: Alta Complejidad en el Oriente
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              <strong>Somer y San Vicente Fundacion Rionegro</strong> conforman un duopolio de
              alta complejidad en el Oriente Antioqueno. El Hospital San Juan de Dios (publico) tiene{" "}
              <strong>2.4/5 rating</strong> — la calificacion mas baja de la region. El
              proyecto <strong>Clinica Alto de Las Palmas NO fue encontrado en Google
              Places</strong> — aun permanece en fase conceptual sin presencia digital
              verificable. La Clinica del Campestre abrio{" "}
              <strong>sede en Rionegro (marzo 2026, 250 pac/dia)</strong>, expansion ambulatoria al Oriente.{" "}
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

      {/* Insight box: Ventana de Oportunidad (from competitive-landscape) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-rose-400 bg-rose-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-rose-800">
              Ventana de Oportunidad: 2026-2028
            </h4>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <p className="text-sm text-rose-700">
                  <strong>Campestre ya entro a Rionegro (marzo 2026)</strong> — valida la demanda
                  ambulatoria premium, pero es competidor directo en cirugia estetica y consulta
                  especializada.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <p className="text-sm text-rose-700">
                  <strong>HSVF Rionegro va a 500 camas (2028)</strong> — dominara el segmento
                  inpatient de alta complejidad. El nicho inpatient no es la jugada para HPTU en
                  Oriente.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <p className="text-sm text-rose-700">
                  <strong>Quironsalud consolida agresivamente</strong> — adquisicion COA + Clofan
                  y interes reportado en el Oriente. Con respaldo Fresenius/Helios, pueden moverse
                  rapido.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <p className="text-sm text-rose-700">
                  <strong>Si HPTU no actua en 2026-2028</strong>, el nicho ambulatorio premium sera
                  ocupado por Campestre, Quironsalud, o un jugador internacional atraido por el
                  turismo medico y la Zona Franca.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <p className="text-sm text-rose-700">
                  <strong>La apertura de la doble calzada del tunel (H2 2027)</strong> es el punto de
                  inflexion — reducira tiempos Medellin-Rionegro a &lt;25 min, acelerando la migracion
                  de demanda y legitimando el corredor como zona de salud premium.
                </p>
              </div>
            </div>
            <p className="text-xs text-rose-600 mt-3 italic">
              Fuentes: ANI (8yi9-t44c), prensa (El Colombiano feb 2026), REPS, ProColombia, planes maestros hospitalarios publicados.
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
