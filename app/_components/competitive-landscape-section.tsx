"use client";

import { motion } from "framer-motion";
import {
  ShieldAlert,
  Stethoscope,
  Scan,
  BrainCircuit,
  ClipboardCheck,
  Wifi,
  Scissors,
  AlertTriangle,
  TrendingUp,
  Target,
  Building2,
  Plane,
  Clock,
  Zap,
  HeartPulse,
  Radiation,
  Baby,
  Droplets,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { competitors, ambulatoryGaps, marketData } from "@/lib/demo-data/strategic-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Treemap,
} from "recharts";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

const formatCOP = (n: number) => {
  if (n >= 1_000_000) return `$${formatNumber(n)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}MM`;
  return `$${formatNumber(n)}M`;
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

// Map gap service names to icons
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

// Service pillars for proposed model
const servicePillars = [
  {
    title: "Cirugia Ambulatoria",
    detail: "Ortopedia, urologia, ginecologia, ORL",
    icon: <Scissors className="h-6 w-6 text-emerald-600" />,
  },
  {
    title: "Centro de Imagenes",
    detail: "TAC, RMN (Fase 1). PET-CT Fase 2",
    icon: <Scan className="h-6 w-6 text-emerald-600" />,
  },
  {
    title: "Consulta Especializada",
    detail: "30+ subespecialidades",
    icon: <Stethoscope className="h-6 w-6 text-emerald-600" />,
  },
  {
    title: "Rehabilitacion Premium",
    detail: "Neuro, cardiaca, deportiva",
    icon: <BrainCircuit className="h-6 w-6 text-emerald-600" />,
  },
  {
    title: "Chequeo Ejecutivo",
    detail: "Programa Zona Franca + turismo medico",
    icon: <ClipboardCheck className="h-6 w-6 text-emerald-600" />,
  },
  {
    title: "Telemedicina Hub",
    detail: "Atencion Oriente + hospital-at-home",
    icon: <Wifi className="h-6 w-6 text-emerald-600" />,
  },
];

// Chart data for market sizing horizontal bars (COP MM = millions)
const marketBars = [
  { name: "Prepagada Antioquia", value: 7200, fill: "#0d9488", label: "COP $7,2 billones" },
  { name: "Cirugia Ambulatoria", value: 2500, fill: "#f59e0b", label: "COP $2,5 billones" },
  { name: "Imagenes Diagnosticas", value: 850, fill: "#8b5cf6", label: "COP $850MM" },
  { name: "Rehabilitacion Premium", value: 320, fill: "#ec4899", label: "COP $320MM" },
  { name: "Turismo Medico", value: 100, fill: "#3b82f6", label: "COP $100MM" },
];

// Market segments for treemap (inline since not in marketData)
const marketSegments = [
  { name: "Prepagada Antioquia", value: 7_200_000, fill: "#0d9488" },
  { name: "Turismo Medico", value: 100_000, fill: "#3b82f6" },
  { name: "Cirugia Ambulatoria", value: 2_500_000, fill: "#f59e0b" },
  { name: "Imagenes Diagnosticas", value: 850_000, fill: "#8b5cf6" },
  { name: "Rehabilitacion Premium", value: 320_000, fill: "#ec4899" },
];

// Treemap data for visualization
const treemapData = marketSegments.map((s) => ({
  name: s.name,
  size: s.value,
  fill: s.fill,
}));

// Custom Treemap content renderer
const TreemapContent = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  fill?: string;
}) => {
  const { x = 0, y = 0, width = 0, height = 0, name = "", size = 0, fill = "#ccc" } = props;
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#fff" strokeWidth={2} rx={4} opacity={0.85} />
      {width > 60 && height > 40 && (
        <>
          <text x={x + 6} y={y + 16} fill="#fff" fontSize={10} fontWeight="bold">
            {name}
          </text>
          <text x={x + 6} y={y + 30} fill="#ffffffcc" fontSize={9}>
            {formatCOP(size)}
          </text>
        </>
      )}
    </g>
  );
};

// Context data for secondary KPI cards (derived from airportProjections and other strategic data)
const airportPassengers2024 = 14_500_000; // from airportProjections[0].passengers * 1M
const zoneFrancaCompanies = 300; // Zona Franca Rionegro (public data)
const zoneFrancaEmployees = 12_000; // estimated from Zona Franca reports

export function CompetitiveLandscapeSection() {
  const highThreats = competitors.filter((c) => c.threat === "alta");
  const totalCompetitorBeds = competitors.reduce((s, c) => s + (c.beds ?? 0), 0);

  return (
    <SectionWrapper id="paisaje-competitivo">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Inteligencia de Mercado — Competencia y Oportunidad
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Paisaje Competitivo: Quien Compite por el Oriente
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Analisis de {competitors.length}+ instituciones, COP ${marketData.prepagadaRevenue2025} billones en mercado prepagada, y{" "}
          {formatNumber(marketData.medicalTourists2024)} turistas medicos en 2024.
        </p>
      </div>

      {/* 1. Market KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Prepagada Antioquia
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            1.4M
          </p>
          <p className="text-[10px] text-muted-foreground">
            afiliados{" "}
            <span className="font-bold text-teal-600">+{marketData.prepagadaGrowth}%</span>{" "}
            (2022-2025)
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
            Turismo Medico
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {formatNumber(marketData.medicalTourists2024)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            pacientes Antioquia 2024
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
            Cirugia Ambulatoria
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {formatNumber(marketData.ambulatorySurgeries2024)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            procedimientos{" "}
            <span className="font-bold text-amber-600">+{marketData.ambulatorySurgeriesGrowth}%</span>{" "}
            anual
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
            % Ambulatorio Global
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {marketData.surgeriesAmbulatory}%
          </p>
          <p className="text-[10px] text-muted-foreground">
            de cirugias son ambulatorias
          </p>
        </motion.div>
      </div>

      {/* 2. Competitor Table */}
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

      {/* 3. Ambulatory Gaps Grid */}
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

      {/* 4. Market Sizing Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Horizontal bar chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-teal-500" />
            <h3 className="text-sm font-bold">
              Tamano de Mercado Salud Privada (COP MM)
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: ADRES, Supersalud, MinSalud SISPRO, ProColombia | Antioquia 2024
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={marketBars}
              layout="vertical"
              margin={{ top: 5, right: 80, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `$${formatNumber(v)}MM`}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={130}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value) => [`COP $${formatNumber(Number(value))} MM`, "Mercado"]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                {marketBars.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> Prepagada
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Ambulatoria
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Turismo Med.
            </span>
          </div>
        </motion.div>

        {/* Treemap showing relative market sizes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-violet-500" />
            <h3 className="text-sm font-bold">
              Proporcion de Segmentos de Mercado
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Treemap proporcional al tamano de mercado en COP | Antioquia 2024
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
              content={<TreemapContent />}
            />
          </ResponsiveContainer>
          <div className="mt-3 space-y-1">
            {marketSegments.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: seg.fill }} />
                  <span className="text-muted-foreground">{seg.name}</span>
                </span>
                <span className="font-bold">{formatCOP(seg.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 5. Proposed Access Point Model */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-emerald-400 bg-emerald-50/50 p-5 sm:p-8 mb-8"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 mb-3">
            <Zap className="h-4 w-4 text-emerald-700" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Modelo Propuesto
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-emerald-900">
            Hub Ambulatorio Premium en Access Point
          </h3>
          <p className="text-sm text-emerald-700 mt-1">
            6 pilares de servicio que llenan las brechas identificadas
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {servicePillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.06, 0.3) }}
              className="rounded-lg border border-emerald-200 bg-white/80 p-4 flex items-start gap-3"
            >
              <div className="shrink-0 p-2 rounded-lg bg-emerald-100">
                {pillar.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">{pillar.title}</h4>
                <p className="text-xs text-emerald-700 mt-0.5">{pillar.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-lg bg-emerald-100/60 border border-emerald-200 p-4">
          <p className="text-sm text-emerald-800 leading-relaxed">
            Este modelo <strong>complementa — no compite con</strong> — la oferta hospitalaria
            de Somer y San Vicente en Rionegro. HPTU se posiciona en el{" "}
            <strong>segmento ambulatorio premium y prepagada que NADIE cubre</strong> en el corredor.
            Con {formatNumber(zoneFrancaCompanies)}+ empresas en Zona Franca,{" "}
            {(airportPassengers2024 / 1_000_000).toFixed(1)}M pasajeros/ano en SKRG, y{" "}
            {formatNumber(marketData.medicalTourists2024)} turistas medicos, el mercado esta validado
            pero desatendido en el Oriente.
          </p>
        </div>
      </motion.div>

      {/* Differentiating context row */}
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

      {/* 6. Insight Box: Window of Opportunity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-slate-800">
              Ventana de Oportunidad: 2026-2028
            </h4>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                <p className="text-sm text-slate-700">
                  <strong>Campestre ya entro a Rionegro (marzo 2026)</strong> — valida la demanda
                  ambulatoria premium, pero es competidor directo en cirugia estetica y consulta
                  especializada.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                <p className="text-sm text-slate-700">
                  <strong>HSVF Rionegro va a 500 camas (2028)</strong> — dominara el segmento
                  inpatient de alta complejidad. El nicho inpatient no es la jugada para HPTU en
                  Oriente.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                <p className="text-sm text-slate-700">
                  <strong>Quironsalud consolida agresivamente</strong> — adquisicion COA + Clofan
                  y interes reportado en el Oriente. Con respaldo Fresenius/Helios, pueden moverse
                  rapido.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                <p className="text-sm text-slate-700">
                  <strong>Si HPTU no actua en 2026-2028</strong>, el nicho ambulatorio premium sera
                  ocupado por Campestre, Quironsalud, o un jugador internacional atraido por el
                  turismo medico y la Zona Franca.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                <p className="text-sm text-slate-700">
                  <strong>La apertura de la doble calzada del tunel (H2 2027)</strong> es el punto de
                  inflexion — reducira tiempos Medellin-Rionegro a &lt;25 min, acelerando la migracion
                  de demanda y legitimando el corredor como zona de salud premium.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 italic">
              Fuentes: ANI (8yi9-t44c), prensa (El Colombiano feb 2026), REPS, ProColombia, planes maestros hospitalarios publicados.
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
