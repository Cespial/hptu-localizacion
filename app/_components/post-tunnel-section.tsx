"use client";

import { motion } from "framer-motion";
import {
  Timer,
  ArrowRight,
  Construction,
  MapPin,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { orienteMunicipios } from "@/lib/demo-data/oriente-data";

// Filter municipalities that have travel time data (non-zero)
const municipiosWithData = orienteMunicipios.filter(
  (m) => m.travelTimeFromCandidate > 0 && m.travelTimeFromCandidatePostTunnel > 0
);

// Build comparison data for the table and chart
const comparisonData = municipiosWithData
  .map((m) => ({
    name: m.name,
    current: m.travelTimeFromCandidate,
    postTunnel: m.travelTimeFromCandidatePostTunnel,
    savings: Math.round((m.travelTimeFromCandidate - m.travelTimeFromCandidatePostTunnel) * 10) / 10,
    reductionPct: Math.round(
      ((m.travelTimeFromCandidate - m.travelTimeFromCandidatePostTunnel) /
        m.travelTimeFromCandidate) *
        100
    ),
    currentHPTU: m.travelTimeFromHPTU,
    postTunnelHPTU: m.travelTimeFromHPTUPostTunnel,
    savingsHPTU: Math.round((m.travelTimeFromHPTU - m.travelTimeFromHPTUPostTunnel) * 10) / 10,
    population: m.populationEst2026,
  }))
  .sort((a, b) => b.reductionPct - a.reductionPct);

// Chart data: time savings from Access Point
const chartData = comparisonData.map((m) => ({
  name: m.name.length > 12 ? m.name.slice(0, 11) + "." : m.name,
  fullName: m.name,
  ahorro: m.savings,
  pctReduction: m.reductionPct,
}));

// Summary stats
const avgReduction = Math.round(
  comparisonData.reduce((s, m) => s + m.reductionPct, 0) / comparisonData.length
);
const maxSavings = comparisonData.reduce(
  (best, m) => (m.savings > best.savings ? m : best),
  comparisonData[0]
);
const totalPopBenefited = comparisonData.reduce((s, m) => s + m.population, 0);

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

export function PostTunnelSection() {
  return (
    <SectionWrapper id="post-tunnel">
      {/* Header */}
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Impacto Tunel de Oriente — Doble Calzada (2a Etapa, H2 2027)
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Post-Tunel: Access Point Reduce Tiempos hasta 42%
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          La segunda etapa del Tunel de Oriente (doble calzada, estimada H2 2027) reducira
          los tiempos de viaje desde Access Point al Oriente en ~35-40%. HPTU, al estar en
          Robledo (norte), solo se beneficia ~10-15%.
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
            Reduccion Promedio
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">~{avgReduction}%</p>
          <p className="text-[10px] text-muted-foreground">
            desde Access Point
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
            Mayor Ahorro
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {maxSavings.savings} min
          </p>
          <p className="text-[10px] text-muted-foreground">
            {maxSavings.name} (-{maxSavings.reductionPct}%)
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
            Poblacion Beneficiada
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {formatNumber(totalPopBenefited)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            habitantes Oriente (est. 2026)
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
            Timeline
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">H2 2027</p>
          <p className="text-[10px] text-muted-foreground">
            doble calzada estimada
          </p>
        </motion.div>
      </div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="h-4 w-4 text-teal-500" />
            <h3 className="text-sm font-bold">
              Tiempos de Viaje: Actual vs Post-Tunel Doble Calzada
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Comparacion desde Access Point (Km 7) y desde HPTU (Robledo). La doble calzada
            beneficia mas a Access Point por su ubicacion en el corredor del tunel.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Municipio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider" colSpan={3}>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Desde Access Point
                </span>
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" colSpan={2}>
                <span className="inline-flex items-center gap-1">
                  Desde HPTU
                </span>
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Pob. 2026
              </th>
            </tr>
            <tr className="border-b border-border bg-muted/15">
              <th className="py-1.5 px-4 text-[10px] text-muted-foreground font-medium text-left" />
              <th className="py-1.5 px-3 text-[10px] text-muted-foreground font-medium text-center">
                Actual
              </th>
              <th className="py-1.5 px-3 text-[10px] text-muted-foreground font-medium text-center">
                Post-Tunel
              </th>
              <th className="py-1.5 px-3 text-[10px] text-muted-foreground font-medium text-center">
                Ahorro
              </th>
              <th className="py-1.5 px-3 text-[10px] text-muted-foreground font-medium text-center hidden md:table-cell">
                Actual
              </th>
              <th className="py-1.5 px-3 text-[10px] text-muted-foreground font-medium text-center hidden md:table-cell">
                Post-Tunel
              </th>
              <th className="py-1.5 px-3 text-[10px] text-muted-foreground font-medium text-center hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row) => (
              <tr
                key={row.name}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/20",
                  row.reductionPct >= 40 && "bg-teal-50/30"
                )}
              >
                <td className="py-2.5 px-4 font-medium text-xs">
                  {row.name}
                </td>
                <td className="py-2.5 px-3 text-center text-xs text-muted-foreground">
                  {row.current.toFixed(1)} min
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700 border border-teal-200">
                    {row.postTunnel} min
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                    row.reductionPct >= 35
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}>
                    -{row.savings} min ({row.reductionPct}%)
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-xs text-muted-foreground hidden md:table-cell">
                  {row.currentHPTU.toFixed(1)} min
                </td>
                <td className="py-2.5 px-3 text-center hidden md:table-cell">
                  <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                    {row.postTunnelHPTU} min
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-xs hidden sm:table-cell">
                  {formatNumber(row.population)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Metodologia:</strong> Tiempos actuales via Mapbox Matrix API (2026).
            Post-tunel: estimacion ~35-40% reduccion para rutas en corredor del tunel (Access Point);
            ~10-15% reduccion para HPTU (Robledo, no en corredor del tunel). Validar con modelos
            de trafico ANI/INVIAS post-apertura 2a etapa.
          </p>
        </div>
      </motion.div>

      {/* Bar Chart: Time Savings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <ArrowRight className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-bold">
            Ahorro de Tiempo desde Access Point (minutos)
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Minutos ahorrados por municipio tras doble calzada. Access Point es el mayor beneficiario
          al ser el nodo de entrada/salida del tunel.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              label={{
                value: "Minutos ahorrados",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10 },
              }}
            />
            <Tooltip
              contentStyle={{ fontSize: "11px" }}
              formatter={(value, _name, props) => {
                const payload = props?.payload;
                return [
                  `${value} min ahorrados (${payload?.pctReduction ?? 0}%)`,
                  payload?.fullName ?? "",
                ];
              }}
            />
            <Bar dataKey="ahorro" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pctReduction >= 35 ? "#059669" : "#d97706"}
                />
              ))}
              <LabelList
                dataKey="ahorro"
                position="top"
                style={{ fontSize: 10, fontWeight: "bold", fill: "#374151" }}
                formatter={(v: string | number | boolean | null | undefined) => `${v ?? 0} min`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" /> Reduccion &ge;35%
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-600" /> Reduccion &lt;35%
          </span>
        </div>
      </motion.div>

      {/* Timeline note + Access Point advantage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid gap-4 sm:grid-cols-2 mb-8"
      >
        {/* Timeline */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Construction className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold">
              Timeline: 2a Etapa Tunel de Oriente
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { phase: "1a Etapa (actual)", status: "Operativo", date: "Desde 2019", detail: "Tunel vehicular 8.2 km, 1 calzada por sentido", color: "bg-green-100 text-green-700 border-green-300" },
              { phase: "2a Etapa (en ejecucion)", status: "En construccion", date: "Est. H2 2027", detail: "Doble calzada: segundo tubo paralelo. Duplica capacidad vehicular.", color: "bg-amber-100 text-amber-700 border-amber-300" },
              { phase: "Efecto post-apertura", status: "Proyectado", date: "2028+", detail: "Reduccion ~35-40% tiempos de viaje. Incremento TPD estimado +30%.", color: "bg-blue-100 text-blue-700 border-blue-300" },
            ].map((item) => (
              <div key={item.phase} className="flex items-start gap-3">
                <span className={cn(
                  "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border shrink-0 mt-0.5",
                  item.color
                )}>
                  {item.status}
                </span>
                <div>
                  <p className="text-xs font-bold">{item.phase} <span className="font-normal text-muted-foreground">({item.date})</span></p>
                  <p className="text-[10px] text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Point advantage */}
        <div className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-bold text-teal-800">
              Access Point: Puerta del Tunel
            </h3>
          </div>
          <ul className="text-xs text-teal-700 space-y-2">
            <li>
              <strong>Km 7 Las Palmas</strong> es el punto de acceso al corredor del tunel
              desde Medellin — cualquier reduccion de tiempo en el tunel beneficia
              directamente a Access Point.
            </li>
            <li>
              Post doble calzada: <strong>Rionegro a 38 min</strong> (vs 59 min actual) y{" "}
              <strong>Guarne a 32 min</strong> (vs 56 min actual) desde Access Point.
            </li>
            <li>
              HPTU en Robledo <strong>no esta en el corredor del tunel</strong> — su
              reduccion es solo ~12% por mejoras generales en la red vial.
            </li>
            <li>
              Con la doble calzada, Access Point captura{" "}
              <strong>{formatNumber(totalPopBenefited)} habitantes del Oriente</strong>{" "}
              con tiempos de acceso medico competitivos frente a los centros de Medellin.
            </li>
            <li>
              Ventaja se amplifica con el crecimiento del trafico: peaje Las Palmas crecio{" "}
              <strong>+63.8%</strong> en 10 anos (2014-2024).
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Insight Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Timer className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-teal-800">
              Doble Calzada = Ventaja Competitiva Estructural para Access Point
            </h4>
            <ul className="text-sm text-teal-700 mt-2 space-y-1.5">
              <li>
                La 2a etapa del tunel reduce tiempos desde Access Point en{" "}
                <strong>~{avgReduction}% promedio</strong>, convirtiendo a Km 7 en el nodo
                medico mas accesible para el Oriente.
              </li>
              <li>
                <strong>Guarne a 32 min, Rionegro a 38 min, El Retiro a 28 min</strong>{" "}
                desde Access Point — tiempos competitivos con atender una cita medica
                dentro de Medellin.
              </li>
              <li>
                HPTU se beneficia <strong>marginalmente</strong> (~12%) porque no esta
                en el corredor del tunel. La brecha de accesibilidad Access Point vs HPTU
                se amplifica post-tunel.
              </li>
              <li>
                Implicacion para inversionistas: la doble calzada no es un evento futuro
                incierto — <strong>esta en construccion y con fecha estimada H2 2027</strong>.
                La decision de ubicacion debe anticipar esta mejora.
              </li>
            </ul>
            <p className="text-xs text-teal-600 mt-3 italic">
              Fuentes: ANI — Concesion Tunel de Oriente, INVIAS TPD peajes, Mapbox Matrix API,
              estimaciones propias (~35-40% reduccion corredor tunel, ~10-15% mejora general).
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
