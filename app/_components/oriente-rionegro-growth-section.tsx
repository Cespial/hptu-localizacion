"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Building2,
  Shield,
  AlertTriangle,
  Navigation,
  Stethoscope,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

// 1. Rionegro population growth 2018-2030
const rionegroGrowthData = [
  { year: 2018, population: 116400 },
  { year: 2020, population: 121000 },
  { year: 2022, population: 126000 },
  { year: 2024, population: 131000 },
  { year: 2026, population: 138000 },
  { year: 2028, population: 143000 },
  { year: 2030, population: 149000 },
];

// 3. Ambulatory demand model
const demandModel = [
  { line: "Consulta Especializada", volume: 18000, revenue: 3240 },
  { line: "Cirugia Ambulatoria", volume: 6500, revenue: 2600 },
  { line: "Imagenes Diagnosticas", volume: 9000, revenue: 1350 },
  { line: "Rehabilitacion", volume: 7000, revenue: 560 },
  { line: "Chequeo Ejecutivo", volume: 4500, revenue: 350 },
];
const totalDemandVolume = demandModel.reduce((s, d) => s + d.volume, 0);
const totalDemandRevenue = demandModel.reduce((s, d) => s + d.revenue, 0);

// 4. Private health services portfolio
const servicesPortfolio = [
  {
    name: "Consulta Subespecializada",
    detail: "30+ especialidades",
    target: "Contributivo + prepagada Oriente",
    volume: "18,000 consultas/ano",
    revenue: "3,240",
    margin: "45%",
  },
  {
    name: "Cirugia Ambulatoria",
    detail: "Ortopedia, urologia, ginecologia, ORL",
    target: "Poblacion Rionegro + Zona Franca",
    volume: "6,500 procedimientos/ano",
    revenue: "2,600",
    margin: "38%",
  },
  {
    name: "Centro de Imagenes",
    detail: "TAC, RMN, PET-CT",
    target: "Referencia desde 11 municipios",
    volume: "9,000 estudios/ano",
    revenue: "1,350",
    margin: "52%",
  },
  {
    name: "Laboratorio Clinico Especializado",
    detail: "Perfiles especiales, genetica, molecular",
    target: "Oriente + turismo medico",
    volume: "25,000 muestras/ano",
    revenue: "500",
    margin: "55%",
  },
  {
    name: "Rehabilitacion Premium",
    detail: "Neuro, cardiaca, deportiva",
    target: "Postquirurgicos + deportistas",
    volume: "7,000 sesiones/ano",
    revenue: "560",
    margin: "42%",
  },
  {
    name: "Chequeo Ejecutivo",
    detail: "Zona Franca + turismo medico",
    target: "Ejecutivos ZF + viajeros JMC",
    volume: "4,500 chequeos/ano",
    revenue: "350",
    margin: "60%",
  },
  {
    name: "Telemedicina Hub",
    detail: "Atencion Oriente remoto",
    target: "11 municipios, zonas rurales",
    volume: "12,000 teleconsultas/ano",
    revenue: "240",
    margin: "65%",
  },
  {
    name: "Wellness & Estetica Medica",
    detail: "Procedimientos esteticos no invasivos",
    target: "Poblado + turismo estetico",
    volume: "3,000 procedimientos/ano",
    revenue: "450",
    margin: "58%",
  },
];

// 5. Access Point tunnel node distances
const tunnelDistances = [
  { route: "Km 7 → Portal Tunel", time: "15 min", icon: "tunnel" },
  { route: "Km 7 → Rionegro (via Tunel)", time: "25 min", icon: "city", note: "Post doble calzada H2 2027" },
  { route: "Km 7 → Aeropuerto JMC", time: "35 min", icon: "plane" },
  { route: "Km 7 → Medellin Centro", time: "20 min", icon: "downtown" },
];

// 6. Infrastructure projects / competitors
const competitorProjects = [
  {
    name: "Clinica Campestre Medellin",
    location: "El Poblado + Sede Rionegro",
    description: "Nueva torre de 15 pisos en El Poblado, ambulatorio especializado. Sede Rionegro abre marzo 2026 con capacidad de 250 pac/dia.",
    status: "en-construccion" as const,
    investment: "N/D",
    threatLevel: "alto" as const,
    impact: "Competidor directo en corredor sur + primer mover en Rionegro ambulatorio.",
  },
  {
    name: "Clinica Las Americas AUNA Sur",
    location: "Envigado",
    description: "168 camas, alta complejidad operativa desde 2024. 6 quirofanos, UCI adulto y neonatal.",
    status: "operativo" as const,
    investment: "N/D",
    threatLevel: "medio" as const,
    impact: "Captura demanda sur pero no cubre Oriente. Sin ambulatorio especializado en corredor.",
  },
  {
    name: "Clinica Ojo Oviedo (Torre Medica Oviedo)",
    location: "El Poblado",
    description: "87 consultorios, apertura junio 2025. Cirugia ambulatoria con 6 quirofanos Qlub. Inversion total ~$100,000M COP.",
    status: "en-construccion" as const,
    investment: "$100,000M COP",
    threatLevel: "alto" as const,
    impact: "87 consultorios nuevos en El Poblado = competencia directa en ambulatorio especializado.",
  },
  {
    name: "Proyecto Alto de Las Palmas",
    location: "Corredor alto Las Palmas",
    description: "En evaluacion, posible clinica en zona alta del corredor. Pendiente visita de sitio y validacion de factibilidad.",
    status: "planeacion" as const,
    investment: "Por definir",
    threatLevel: "potencial" as const,
    impact: "Si se materializa, competiria por la misma poblacion del corredor Las Palmas alto.",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  operativo: { label: "Operativo", color: "bg-green-100 text-green-700 border-green-300" },
  "en-construccion": { label: "En Construccion", color: "bg-amber-100 text-amber-700 border-amber-300" },
  planeacion: { label: "Planeacion", color: "bg-red-100 text-red-700 border-red-300" },
};

const threatConfig: Record<string, { label: string; color: string }> = {
  alto: { label: "ALTO", color: "bg-red-100 text-red-700 border-red-300" },
  medio: { label: "MEDIO", color: "bg-amber-100 text-amber-700 border-amber-300" },
  potencial: { label: "POTENCIAL", color: "bg-purple-100 text-purple-700 border-purple-300" },
};

// 7. Density by barrio within isochrone
const densityBarrios = [
  { barrio: "San Lucas", avgFloors: 6.1, maxPOT: 19.1, usedPct: 45.8, potential: "Alto" as const },
  { barrio: "El Tesoro", avgFloors: 5.2, maxPOT: 16.7, usedPct: 52.3, potential: "Medio" as const },
  { barrio: "Los Balsos", avgFloors: 4.8, maxPOT: 16.7, usedPct: 58.2, potential: "Medio" as const },
  { barrio: "Astorga", avgFloors: 3.2, maxPOT: 15.0, usedPct: 14.7, potential: "MASIVO" as const },
  { barrio: "Manila", avgFloors: 3.5, maxPOT: 14.0, usedPct: 14.2, potential: "MASIVO" as const },
];

const potentialColor = {
  Alto: "bg-teal-100 text-teal-700 border-teal-300",
  Medio: "bg-amber-100 text-amber-700 border-amber-300",
  MASIVO: "bg-red-100 text-red-700 border-red-300",
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function OrienteRionegroGrowthSection() {
  return (
    <SectionWrapper id="oriente-rionegro-growth">
      {/* ── Header ── */}
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Oriente — Rionegro Growth & Access Point como Nodo del Tunel
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Rionegro: Motor de Crecimiento y Demanda Capturable
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Analisis de crecimiento poblacional de Rionegro, demanda ambulatoria
          capturable desde el Oriente, portafolio de servicios privados y
          posicionamiento de Access Point como nodo estrategico del Tunel de Oriente.
        </p>
      </div>

      {/* ── 1. KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Poblacion Rionegro 2026
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">~138K</p>
          <p className="text-[10px] text-muted-foreground">
            +2.0% CAGR desde 116K en 2018
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
            Licencias Construccion
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">19%</p>
          <p className="text-[10px] text-muted-foreground">
            del ritmo de Medellin (SNR)
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
            Afiliados Contributivo
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">161K</p>
          <p className="text-[10px] text-muted-foreground">
            84.4% del total afiliados
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
            Demanda Ambulatoria Capturable
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">~45K</p>
          <p className="text-[10px] text-muted-foreground">
            consultas/ano (15% flujo Oriente→Med)
          </p>
        </motion.div>
      </div>

      {/* ── 2. Population Growth Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-teal-500" />
          <h3 className="text-sm font-bold">
            Rionegro — Trayectoria Poblacional 2018-2030
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Fuente: DANE CNPV 2018, DNP Proyecciones | CAGR +2.0% vs +0.9%
          Medellin
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={rionegroGrowthData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="rionegroPop" x1="0" y1="0" x2="0" y2="1">
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
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              domain={[110000, 155000]}
              label={{
                value: "Habitantes",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10 },
              }}
            />
            <Tooltip
              contentStyle={{ fontSize: "11px" }}
              formatter={(value) => [
                `${formatNumber(Number(value))} hab.`,
                "Poblacion",
              ]}
              labelFormatter={(label) => `Ano ${label}`}
            />
            <Area
              type="monotone"
              dataKey="population"
              stroke="#0d9488"
              strokeWidth={3}
              fill="url(#rionegroPop)"
              dot={{ r: 5, fill: "#0d9488", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> Rionegro
            (+2.0% CAGR)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" /> Medellin
            (+0.9% CAGR ref.)
          </span>
        </div>
      </motion.div>

      {/* ── 3. Ambulatory Demand Model ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">
              Modelo de Demanda Ambulatoria Capturable
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Oriente 728K hab. → ~218K requieren atencion especializada/ano →
            ~65K viajan a Medellin (30%) → Access Point intercepta ~15% = ~45K
            consultas/ano
          </p>
        </div>

        {/* Funnel visualization */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { label: "Pob. Oriente", value: "728K", color: "bg-slate-100 border-slate-300 text-slate-700" },
              { label: "Requieren Especializacion", value: "218K", color: "bg-blue-100 border-blue-300 text-blue-700" },
              { label: "Viajan a Medellin", value: "65K", color: "bg-amber-100 border-amber-300 text-amber-700" },
              { label: "Capturable Access Point", value: "45K", color: "bg-teal-100 border-teal-300 text-teal-700" },
            ].map((step) => (
              <div
                key={step.label}
                className={cn(
                  "rounded-lg border p-3 text-center",
                  step.color
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider">
                  {step.label}
                </p>
                <p className="text-lg font-bold mt-0.5">{step.value}</p>
              </div>
            ))}
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Linea de Servicio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Volumen Anual Est.
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Revenue (COP MM/ano)
              </th>
            </tr>
          </thead>
          <tbody>
            {demandModel.map((row) => (
              <tr
                key={row.line}
                className="border-b border-border/50 hover:bg-muted/20"
              >
                <td className="py-2.5 px-4 font-medium text-xs">{row.line}</td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {formatNumber(row.volume)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700 border border-teal-200">
                    ${formatNumber(row.revenue)}M
                  </span>
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-border bg-muted/30 font-bold">
              <td className="py-2.5 px-4 text-xs">TOTAL CAPTURABLE</td>
              <td className="py-2.5 px-3 text-center text-xs">
                {formatNumber(totalDemandVolume)}
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  ${formatNumber(totalDemandRevenue)}M
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Supuestos:</strong> 30% de la poblacion Oriente viaja a
            Medellin para atencion especializada. Access Point captura 15% de
            ese flujo por conveniencia de ubicacion (Km 7, antes del Tunel).
            Revenue estimado con tarifas SOAT + manual ISS 2001 + 30%.
          </p>
        </div>
      </motion.div>

      {/* ── 4. Private Health Services Portfolio ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="h-4 w-4 text-teal-500" />
            <h3 className="text-sm font-bold">
              Portafolio de Servicios Privados — Access Point
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            8 lineas de servicio propuestas. Mercado target: contributivo +
            prepagada + turismo medico + ejecutivos Zona Franca.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Servicio
              </th>
              <th className="text-left py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Target Market
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Volumen Est.
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Revenue (MM/ano)
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                Margen
              </th>
            </tr>
          </thead>
          <tbody>
            {servicesPortfolio.map((svc) => (
              <tr
                key={svc.name}
                className="border-b border-border/50 hover:bg-muted/20"
              >
                <td className="py-2.5 px-4 text-xs">
                  <p className="font-bold">{svc.name}</p>
                  <p className="text-muted-foreground text-[10px]">
                    {svc.detail}
                  </p>
                </td>
                <td className="py-2.5 px-3 text-xs text-muted-foreground hidden sm:table-cell">
                  {svc.target}
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {svc.volume}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700 border border-teal-200">
                    ${svc.revenue}M
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center hidden md:table-cell">
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    {svc.margin}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Nota:</strong> Revenue y margen estimados con benchmarks del
            sector privado colombiano. Validar con estudio de mercado detallado.
          </p>
        </div>
      </motion.div>

      {/* ── 5. Access Point como Nodo del Tunel ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="h-4 w-4 text-teal-500" />
          <h3 className="text-sm font-bold">
            Access Point — Nodo Estrategico del Tunel de Oriente
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-5">
          Km 7 Las Palmas: primer/ultimo nodo medico antes/despues del Tunel de
          Oriente. Catchment total: 863K habitantes.
        </p>

        {/* Tunnel node visual */}
        <div className="relative mb-6">
          {/* Horizontal route bar */}
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-teal-500 to-amber-400 rounded-full -translate-y-1/2" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
            {[
              { label: "Medellin Centro", time: "20 min", color: "border-blue-300 bg-blue-50" },
              { label: "ACCESS POINT Km 7", time: "NODO", color: "border-teal-400 bg-teal-50 ring-2 ring-teal-300" },
              { label: "Portal Tunel", time: "15 min", color: "border-slate-300 bg-slate-50" },
              { label: "Rionegro / JMC", time: "25-35 min", color: "border-amber-300 bg-amber-50" },
            ].map((node) => (
              <div
                key={node.label}
                className={cn(
                  "rounded-xl border-2 p-4 text-center relative z-10",
                  node.color
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider">
                  {node.label}
                </p>
                <p
                  className={cn(
                    "text-lg font-bold mt-1",
                    node.label.startsWith("ACCESS") ? "text-teal-700" : "text-slate-700"
                  )}
                >
                  {node.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Distance cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {tunnelDistances.map((d) => (
            <div
              key={d.route}
              className="rounded-lg border bg-muted/30 p-3 text-center"
            >
              <p className="text-[10px] text-muted-foreground font-medium">
                {d.route}
              </p>
              <p className="text-lg font-bold text-teal-700 mt-0.5">
                {d.time}
              </p>
              {d.note && (
                <p className="text-[9px] text-amber-600 font-medium mt-0.5">
                  {d.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Catchment summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border-2 border-teal-200 bg-teal-50/50 p-3 text-center">
            <p className="text-[10px] text-teal-600 font-medium uppercase tracking-wider">
              Oriente Antioqueno
            </p>
            <p className="text-xl font-bold text-teal-700 mt-0.5">728K</p>
            <p className="text-[10px] text-teal-600">11 municipios</p>
          </div>
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-3 text-center">
            <p className="text-[10px] text-blue-600 font-medium uppercase tracking-wider">
              El Poblado Corredor
            </p>
            <p className="text-xl font-bold text-blue-700 mt-0.5">135K</p>
            <p className="text-[10px] text-blue-600">isocronas 15 min</p>
          </div>
          <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50/50 p-3 text-center col-span-2 sm:col-span-1">
            <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
              Total Catchment
            </p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">863K</p>
            <p className="text-[10px] text-emerald-600">poblacion servida</p>
          </div>
        </div>
      </motion.div>

      {/* ── 6. Infraestructura Medica en Desarrollo ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-bold">
            Infraestructura Medica en Desarrollo — Competidores a Monitorear
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {competitorProjects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.06, 0.3) }}
              className={cn(
                "rounded-xl border bg-card p-4",
                project.threatLevel === "alto" && "border-red-300 border-2"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-bold leading-tight">
                  {project.name}
                </h4>
                {project.threatLevel === "alto" && (
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border bg-muted text-muted-foreground">
                  {project.location}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border",
                    statusConfig[project.status].color
                  )}
                >
                  {statusConfig[project.status].label}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold border",
                    threatConfig[project.threatLevel].color
                  )}
                >
                  Amenaza: {threatConfig[project.threatLevel].label}
                </span>
              </div>

              {project.investment !== "N/D" && project.investment !== "Por definir" && (
                <p className="text-[10px] font-bold text-teal-600 mb-1.5">
                  Inversion: {project.investment}
                </p>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {project.description}
              </p>

              <div className="rounded-lg bg-muted/40 p-2.5">
                <p className="text-[10px] text-muted-foreground">
                  <strong>Impacto Access Point:</strong> {project.impact}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 7. Densificacion dentro de Isocronas ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold">
              Densificacion dentro de Isocronas (15 min Access Point)
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Analisis de altura construida vs altura maxima POT. Barrios con bajo
            % usado = potencial masivo de densificacion futura y demanda
            creciente.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Barrio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Pisos Avg
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Max POT
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                % Usado
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Potencial
              </th>
            </tr>
          </thead>
          <tbody>
            {densityBarrios.map((row) => (
              <tr
                key={row.barrio}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/20",
                  row.potential === "MASIVO" && "bg-red-50/30"
                )}
              >
                <td className="py-2.5 px-4 font-medium text-xs">
                  {row.barrio}
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {row.avgFloors.toFixed(1)}
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {row.maxPOT.toFixed(1)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                      row.usedPct < 20
                        ? "bg-red-50 text-red-700 border-red-200"
                        : row.usedPct < 50
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-teal-50 text-teal-700 border-teal-200"
                    )}
                  >
                    {row.usedPct}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                      potentialColor[row.potential]
                    )}
                  >
                    {row.potential}
                    {row.potential === "MASIVO" &&
                      ` (${(100 - row.usedPct).toFixed(0)}% sin usar)`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Hallazgo clave:</strong> Astorga (14.7%) y Manila (14.2%)
            solo han utilizado ~14% de su capacidad de densificacion POT. Esto
            implica un crecimiento vertical futuro masivo dentro de la isocrona
            de 15 min de Access Point.
          </p>
        </div>
      </motion.div>

      {/* ── 8. Insight Box ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-teal-800">
              Convergencia Oriente + Densificacion = Demanda Garantizada
            </h4>
            <ul className="text-sm text-teal-700 mt-2 space-y-1.5">
              <li>
                Rionegro crece al <strong>doble que Medellin</strong> (+2.0% vs
                +0.9% CAGR) con <strong>84.4% contributivo</strong> — mercado
                privado dominante.
              </li>
              <li>
                <strong>~45K consultas/ano capturables</strong> desde el flujo
                Oriente→Medellin = <strong>~COP $8,100M revenue potencial</strong>.
              </li>
              <li>
                Post Tunel doble calzada (H2 2027):{" "}
                <strong>Rionegro a 25 min de Access Point</strong> — la
                conexion mas directa entre alta complejidad HPTU y el mercado
                Oriente.
              </li>
              <li>
                Astorga y Manila al <strong>14% de densidad POT</strong> ={" "}
                <strong>demanda futura garantizada</strong> dentro de la zona de
                influencia directa de Access Point.
              </li>
              <li>
                Catchment total de <strong>863K habitantes</strong> (728K
                Oriente + 135K Poblado) posiciona a Km 7 como el nodo medico
                mas estrategico del corredor.
              </li>
            </ul>
            <p className="text-xs text-teal-600 mt-3 italic">
              Fuentes: DANE CNPV 2018, DNP Proyecciones, SISBEN IV, SNR
              Licencias, REPS, POT Bateria Indicadores, Mapbox Matrix API,
              Google Places API
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
