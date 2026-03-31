"use client";

import { motion } from "framer-motion";
import {
  Construction,
  Plane,
  Users,
  Landmark,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  infrastructureProjects,
  airportProjections,
  airportInvestment,
  marketData,
} from "@/lib/demo-data/strategic-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// Sort infrastructure projects by nearest timeline first
const sortedProjects = [...infrastructureProjects].sort((a, b) => {
  const order: Record<string, number> = {
    "Marzo 2026": 1,
    "Q2 2026": 2,
    "2026": 3,
    "2026+": 4,
    "H2 2027": 5,
    "Largo plazo": 6,
    "Indefinido": 7,
  };
  return (order[a.timeline] ?? 99) - (order[b.timeline] ?? 99);
});

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  construccion: {
    label: "En Construccion",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  planeado: {
    label: "Planeado",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  estudios: {
    label: "En Estudios",
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
  pausado: {
    label: "Pausado",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  completado: {
    label: "Completado",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
};

const impactColor = (impact: string) => {
  if (impact.startsWith("CRITICO")) return "text-red-700 bg-red-50 border-red-200";
  if (impact.startsWith("DIRECTO")) return "text-amber-700 bg-amber-50 border-amber-200";
  if (impact.startsWith("ALTO")) return "text-orange-700 bg-orange-50 border-orange-200";
  if (impact.startsWith("MEDIO")) return "text-blue-700 bg-blue-50 border-blue-200";
  if (impact.startsWith("POTENCIAL")) return "text-purple-700 bg-purple-50 border-purple-200";
  return "text-gray-500 bg-gray-50 border-gray-200";
};

// Airport chart data
const airportChartData = airportProjections.map((p) => ({
  year: p.year,
  passengers: p.passengers,
  phase: p.phase,
}));

export function StrategicProspectiveSection() {
  return (
    <SectionWrapper id="prospectiva-estrategica">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Prospectiva — Oriente Antioqueno 2027-2055
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          COP $25+ Billones en Infraestructura: La Transformacion del Corredor
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Proyectos viales, expansion aeroportuaria, y formacion del Area
          Metropolitana que redefinen la accesibilidad de Access Point.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Inversion Vial Pipeline
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            COP $2,5 billones
          </p>
          <p className="text-[10px] text-muted-foreground">
            Tunel + vias + intercambios
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
            Pasajeros Aeropuerto 2055
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">42.7M</p>
          <p className="text-[10px] text-muted-foreground">
            Plan Maestro JMC ({airportInvestment})
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
            Poblacion Oriente
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {formatNumber(marketData.orientePopulation2023)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            +{marketData.orienteGrowthRate}%/ano (DANE)
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card p-4 text-center relative overflow-hidden"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Area Metropolitana
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            Consulta Jul 2026
          </p>
          <p className="text-[10px] text-muted-foreground">
            {marketData.areaMetropolitanaMunicipios} municipios
          </p>
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
        </motion.div>
      </div>

      {/* Infrastructure Projects Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Construction className="h-4 w-4 text-teal-500" />
          <h3 className="text-sm font-bold">
            Pipeline de Infraestructura Vial — Timeline
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-5">
          Fuente: Gobernacion de Antioquia, INVIAS, ANI, Aerocivil | Ordenado
          por fecha estimada de entrega
        </p>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border sm:left-[19px]" />

          <div className="space-y-5">
            {sortedProjects.map((project, i) => {
              const status = statusConfig[project.status];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="relative pl-10 sm:pl-12"
                >
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-[9px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ring-2 sm:left-[13px]",
                      status.dot,
                      project.status === "construccion" && "ring-emerald-200",
                      project.status === "planeado" && "ring-blue-200",
                      project.status === "estudios" && "ring-gray-200",
                      project.status === "pausado" && "ring-red-200"
                    )}
                  />

                  <div className="rounded-lg border bg-muted/20 p-3 sm:p-4 hover:bg-muted/40 transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                          status.bg,
                          status.text,
                          status.border
                        )}
                      >
                        {status.label}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {project.timeline}
                      </span>
                      {project.investment !== "N/D" && (
                        <span className="text-[10px] font-bold text-teal-600">
                          {project.investment}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold">{project.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                          impactColor(project.impactOnAccessPoint)
                        )}
                      >
                        Impacto Access Point
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {project.impactOnAccessPoint}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Airport Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Plane className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-bold">
            Aeropuerto JMC — Proyeccion de Pasajeros (Plan Maestro 2055)
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Fuente: Aerocivil Plan Maestro JMC 2055 | Inversion total:{" "}
          {airportInvestment} | Capacidad actual: 11M pasajeros/ano (operando al
          132%)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={airportChartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="airportFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => String(v)}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              label={{
                value: "Millones pax/ano",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10 },
              }}
              domain={[0, 50]}
            />
            <Tooltip
              contentStyle={{ fontSize: "11px" }}
              formatter={(value) => [
                `${Number(value)}M pasajeros/ano`,
                "Proyeccion",
              ]}
              labelFormatter={(label) => {
                const item = airportChartData.find(
                  (d) => d.year === Number(label)
                );
                return item ? `${label} — ${item.phase}` : String(label);
              }}
            />
            <ReferenceLine
              y={11}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{
                value: "Capacidad actual (11M)",
                position: "right",
                style: { fontSize: 9, fill: "#ef4444" },
              }}
            />
            <Area
              type="monotone"
              dataKey="passengers"
              stroke="#0d9488"
              strokeWidth={3}
              fill="url(#airportFill)"
              dot={{ r: 5, fill: "#0d9488", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
          {airportProjections.map((p) => (
            <span
              key={p.year}
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                p.year === 2024
                  ? "bg-red-50 text-red-700 border-red-200"
                  : p.year <= 2030
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : p.year <= 2040
                  ? "bg-teal-50 text-teal-700 border-teal-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              )}
            >
              {p.year}: {p.passengers}M — {p.phase.split("—")[0].trim()}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
      >
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Migracion
            </p>
          </div>
          <p className="text-xl font-bold text-amber-600">
            {marketData.orienteMigrationRate}/100 hab/ano
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            La mas alta de Antioquia — flujo neto positivo
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-teal-500" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              PIB Oriente
            </p>
          </div>
          <p className="text-xl font-bold text-teal-600">
            {marketData.orienteGDPShareAntioquia}% de Antioquia
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Segunda subregion despues del Valle de Aburra
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="h-3.5 w-3.5 text-blue-500" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Crecimiento Urbano
            </p>
          </div>
          <p className="text-xl font-bold text-blue-600">
            10 → 40 km<sup>2</sup>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            4x desde 1995 — mancha urbana Rionegro/Guarne/Marinilla
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-3.5 w-3.5 text-purple-500" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              X-Oriente Mega Mall
            </p>
          </div>
          <p className="text-xl font-bold text-purple-600">
            COP ${formatNumber(marketData.xOrienteInvestment)}M
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Centro comercial en Llanogrande — ancla de demanda
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Construction className="h-3.5 w-3.5 text-orange-500" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Zona Franca
            </p>
          </div>
          <p className="text-xl font-bold text-orange-600">
            100+ empresas
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            +12.46% ingresos operacionales interanual
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="h-3.5 w-3.5 text-emerald-500" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Budget Rionegro 2025
            </p>
          </div>
          <p className="text-xl font-bold text-emerald-600">
            COP ${formatNumber(marketData.rionegroPlanDesarrolloBudget2025)}M
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Plan de Desarrollo — mayor presupuesto del Oriente
          </p>
        </div>
      </motion.div>

      {/* Insight Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-slate-800">
              Convergencia Historica: Access Point en el Epicentro
            </h4>
            <p className="text-sm text-slate-700 mt-1">
              Cuando la doble calzada del Tunel de Oriente entre en operacion
              (H2 2027), el tiempo de viaje Medellin-Oriente se reduce
              drasticamente. El{" "}
              <strong>Intercambio Vial del Alto de Las Palmas (Q2 2026)</strong>{" "}
              elimina la congestion aguas arriba. La{" "}
              <strong>Via Sika</strong> acorta la ruta al aeropuerto en 12 km.
              El Plan Maestro del aeropuerto JMC apunta a{" "}
              <strong>42.7M pasajeros para 2055</strong>. Todas estas
              inversiones convergen sobre el corredor de Las Palmas, haciendo de{" "}
              <strong>Km 7 la ubicacion de salud mas estrategica</strong> de la
              proxima decada.
            </p>
            <p className="text-xs text-slate-600 mt-2 italic">
              Fuentes: Gobernacion de Antioquia, INVIAS, ANI, Aerocivil Plan
              Maestro JMC 2055, DANE proyecciones, POT Rionegro
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
