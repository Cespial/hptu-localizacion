"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingUp,
  Building2,
  DollarSign,
  Clock,
  ShieldCheck,
  Sparkles,
  Activity,
  BarChart3,
  ArrowRightLeft,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ambulatoryModel,
  ambulatorySummary,
  phase2Equipment,
} from "@/lib/demo-data/financial-model";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ── Formatters ── */
function fmtB(n: number): string {
  return `$${n.toLocaleString("es-CO")}MM`;
}

/* ── Service line colors for the bar chart ── */
const SERVICE_COLORS: Record<string, string> = {
  imaging: "#0d9488",        // teal-600
  "ambulatory-surgery": "#0891b2", // cyan-600
  "specialist-consults": "#2563eb", // blue-600
  "executive-wellness": "#7c3aed", // violet-600
  "rehab-oncology": "#f59e0b",     // amber-500
  "aesthetics-derm": "#ec4899",     // pink-500
};

/* ── Chart data ── */
const revenueChartData = ambulatoryModel.revenueStreams.map((s) => ({
  name: s.name.replace(" (Fase 1)", "").replace(" / ", "\n"),
  shortName: s.name
    .replace("Imágenes Diagnósticas (Fase 1)", "Imágenes")
    .replace("Cirugía Ambulatoria", "Cirugía")
    .replace("Consulta Especializada", "Consultas")
    .replace("Chequeo Ejecutivo / Wellness", "Ejecutivo")
    .replace("Rehabilitación + Oncología Ambulatoria", "Rehab+Onco")
    .replace("Estética Médica / Dermatología", "Estética"),
  revenue: s.annualRevenueMM,
  id: s.id,
  metric: s.keyMetric,
}));

/* ── Scenario styling ── */
const scenarioStyle: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  Pesimista: {
    border: "border-amber-300",
    bg: "bg-gradient-to-br from-amber-50/60 to-white",
    text: "text-amber-800",
    badge: "bg-amber-100 text-amber-700 border-amber-300",
  },
  Base: {
    border: "border-teal-400 ring-2 ring-teal-200",
    bg: "bg-gradient-to-br from-teal-50/60 to-white",
    text: "text-teal-800",
    badge: "bg-teal-100 text-teal-700 border-teal-300",
  },
  Optimista: {
    border: "border-blue-300",
    bg: "bg-gradient-to-br from-blue-50/60 to-white",
    text: "text-blue-800",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
  },
};

/* ── Investment breakdown rows ── */
const investmentRows = [
  { label: "Adecuación interior (fit-out)", value: 21, notes: "6,000 m² x $3.5M/m²" },
  { label: "Resonancia Magnética 3T", value: 10, notes: "Siemens/GE — referencia regional" },
  { label: "Tomógrafo CT 128+ cortes", value: 4, notes: "Oriente sin CT propio" },
  { label: "Quirófanos ambulatorios (x4)", value: 12, notes: "~$3,000M c/u" },
  { label: "Ecografía, mamografía, Rx, otros", value: 5, notes: "Equipos complementarios" },
  { label: "IT + sistemas hospitalarios", value: 5, notes: "HIS, PACS, RIS, integración" },
  { label: "Capital de trabajo + contingencia", value: 10, notes: "Soft costs, permisos, REPS" },
];
const totalCapexDisplay = investmentRows.reduce((s, r) => s + r.value, 0); // $67.000M

/* ── Comparison data ── */
const comparisonRows = [
  { metric: "CAPEX", ambulatory: "$67,000M", hospital: "$250,000M+", advantage: true },
  { metric: "Timeline", ambulatory: "18-24 meses", hospital: "54+ meses", advantage: true },
  { metric: "Margen EBITDA", ambulatory: "18-22%", hospital: "5-8%", advantage: true },
  { metric: "Payback", ambulatory: "6-8 años", hospital: "10-12 años", advantage: true },
  { metric: "Competencia", ambulatory: "Complementario", hospital: "Directo con Somer/SVF", advantage: true },
];

/* ── Custom tooltip ── */
function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; revenue: number; metric: string } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <p className="text-xs font-bold text-slate-800">{d.name}</p>
      <p className="text-sm font-bold text-teal-700">${d.revenue.toLocaleString("es-CO")}MM/año</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{d.metric}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export function FinancialSection() {
  return (
    <SectionWrapper id="modelo-financiero">
      {/* ── Header ── */}
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Fase 1 — Sin PET-CT
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Modelo Financiero: Sede Ambulatoria en Access Point
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Inversión en adecuación + equipamiento médico dentro de edificio existente.
          Sin compra de terreno, sin construcción — solo fit-out grado hospitalario.
        </p>
      </div>

      {/* ── 3 Scenario Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-3 mb-10"
      >
        {ambulatorySummary.scenarios.map((sc) => {
          const style = scenarioStyle[sc.name] ?? scenarioStyle.Base;
          return (
            <div
              key={sc.name}
              className={cn(
                "rounded-2xl border p-5 shadow-sm",
                style.border,
                style.bg
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", style.badge)}>
                  {sc.name}
                </span>
                {sc.name === "Base" && (
                  <Badge className="bg-teal-600 text-white text-[10px]">Referencia</Badge>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ingreso anual</p>
                  <p className={cn("text-xl font-bold tabular-nums", style.text)}>
                    {fmtB(sc.annualRevenueMM)}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground">EBITDA</p>
                    <p className="text-sm font-bold tabular-nums">{sc.ebitdaMarginPercent}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">EBITDA/año</p>
                    <p className="text-sm font-bold tabular-nums">{fmtB(sc.annualEbitdaMM)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Payback</p>
                    <p className="text-sm font-bold tabular-nums">{sc.paybackYears} años</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                  {sc.notes}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ── Two-column: Investment + Revenue ── */}
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        {/* LEFT: Investment Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-md shadow-teal-600/20">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg font-bold">Desglose de Inversión (CAPEX)</h3>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-2 text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Concepto</th>
                <th className="py-2 px-2 text-[10px] uppercase text-muted-foreground font-semibold tracking-wide text-right">COP MM</th>
                <th className="py-2 pl-2 text-[10px] uppercase text-muted-foreground font-semibold tracking-wide hidden sm:table-cell">Nota</th>
              </tr>
            </thead>
            <tbody>
              {investmentRows.map((row) => (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-2 pr-2 text-xs font-medium">{row.label}</td>
                  <td className="py-2 px-2 text-xs font-bold tabular-nums text-right">
                    ${row.value.toLocaleString("es-CO")}MM
                  </td>
                  <td className="py-2 pl-2 text-[10px] text-muted-foreground hidden sm:table-cell">
                    {row.notes}
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="border-t-2 border-teal-200 bg-teal-50/50">
                <td className="py-2.5 pr-2 text-xs font-bold text-teal-800">Total Fase 1</td>
                <td className="py-2.5 px-2 text-sm font-bold tabular-nums text-teal-800 text-right">
                  ${totalCapexDisplay.toLocaleString("es-CO")}MM
                </td>
                <td className="py-2.5 pl-2 hidden sm:table-cell" />
              </tr>
              {/* Phase 2 PET-CT grayed out */}
              <tr className="opacity-40">
                <td className="py-2 pr-2 text-xs italic">
                  {phase2Equipment[0].name}
                </td>
                <td className="py-2 px-2 text-xs tabular-nums text-right italic">
                  ${phase2Equipment[0].costMM.toLocaleString("es-CO")}MM
                </td>
                <td className="py-2 pl-2 text-[10px] text-muted-foreground hidden sm:table-cell italic">
                  Requiere logística FDG — Fase 2
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* RIGHT: Revenue by Service Line (Bar Chart) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white shadow-md shadow-cyan-600/20">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg font-bold">Ingreso por Línea de Servicio</h3>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueChartData}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 5 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => `$${v}MM`}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  width={80}
                  tick={{ fontSize: 10, fill: "#374151" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={28}>
                  {revenueChartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={SERVICE_COLORS[entry.id] ?? "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">
              Total: <span className="text-teal-700">${ambulatoryModel.revenueStreams.reduce((s, r) => s + r.annualRevenueMM, 0).toLocaleString("es-CO")}MM/año</span>
            </p>
            <Badge variant="outline" className="text-[10px]">
              A madurez (Año 4+)
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Ramp-up: {ambulatoryModel.rampUp.map((r) => `Año ${r.year}: ${r.pct}%`).join(" → ")}
          </p>
        </motion.div>
      </div>

      {/* ── Key Metrics Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10"
      >
        {[
          { icon: DollarSign, label: "CAPEX", value: "$67,000MM", color: "text-teal-700" },
          { icon: TrendingUp, label: "Revenue", value: "$51,000MM", color: "text-cyan-700" },
          { icon: Activity, label: "EBITDA", value: "18%", color: "text-emerald-700" },
          { icon: Clock, label: "Payback", value: "7 años", color: "text-blue-700" },
          { icon: Building2, label: "Apertura", value: "H1 2028", color: "text-violet-700" },
          { icon: DollarSign, label: "Lease/año", value: "$3,240MM", color: "text-amber-700" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border bg-white p-3 shadow-sm text-center"
          >
            <Icon className={cn("h-4 w-4 mx-auto mb-1", color)} />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className={cn("text-sm font-bold tabular-nums", color)}>{value}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Comparison: Ambulatory vs Hospital ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-white p-5 sm:p-6 shadow-sm mb-10"
      >
        <div className="flex items-center gap-2 mb-4">
          <ArrowRightLeft className="h-5 w-5 text-teal-600" />
          <h3 className="font-serif text-lg font-bold text-teal-900">
            Ambulatorio vs Hospital Tradicional
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-teal-200">
                <th className="py-2 pr-4 text-left text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Métrica</th>
                <th className="py-2 px-4 text-center text-[10px] uppercase text-teal-700 font-bold tracking-wide">Ambulatorio</th>
                <th className="py-2 pl-4 text-center text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Hospital</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.metric} className="border-b border-teal-100 last:border-0">
                  <td className="py-2.5 pr-4 text-xs font-medium">{row.metric}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {row.ambulatory}
                    </span>
                  </td>
                  <td className="py-2.5 pl-4 text-center text-xs text-muted-foreground">
                    {row.hospital}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Two-column: Risks + Parameters ── */}
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {/* Key Risks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white shadow-md shadow-red-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-base font-bold">Riesgos Clave</h3>
          </div>
          <ul className="space-y-2">
            {ambulatorySummary.keyRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 text-xs shrink-0">&#9679;</span>
                <span className="text-xs text-muted-foreground leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Parameters to validate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-base font-bold">Parámetros por Validar</h3>
          </div>
          <div className="space-y-2.5">
            {ambulatorySummary.parametersToValidate.map((p) => (
              <div key={p.param} className="flex items-start gap-2">
                <span
                  className={cn(
                    "shrink-0 mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded",
                    p.priority === "ALTA"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {p.priority}
                </span>
                <div>
                  <p className="text-xs font-medium">{p.param}</p>
                  <p className="text-[10px] text-muted-foreground">{p.how}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Insight Box: Access Point Advantage ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-5 sm:p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-emerald-900">
            Ventaja Access Point
          </h3>
        </div>
        <p className="text-sm text-emerald-800 font-medium mb-3">
          Edificio existente, sin construcción, arriendo $45K/m²/mes — CAPEX 100% en adecuación + equipos.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ambulatoryModel.accessPointAdvantage.map((adv, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white/70 px-3 py-2"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span className="text-[11px] text-emerald-800 leading-relaxed">{adv}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
