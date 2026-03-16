"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Plane,
  Globe,
  Award,
  Star,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ReferenceLine,
  Legend,
} from "recharts";

import {
  supplyGapStats,
  supplyGapHeadline,
  travelAdvantages,
  epsMarketData,
  epsInsight,
  growthDrivers,
  populationProjections,
  airportGrowth,
  competitorInvestments,
  competitorInsight,
  medicalTourismHistory,
  medicalTourismOrigins,
  medicalTourismKPIs,
  hptuMedTourismPosition,
  medicalTourismInsight,
} from "@/lib/demo-data/demand-validation";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// ==================== Q1: Supply Gap Chart Data ====================

const supplyGapChartData = supplyGapStats.map((m) => ({
  name: m.municipio.length > 10 ? m.municipio.substring(0, 10) + "." : m.municipio,
  fullName: m.municipio,
  actual: m.camasPer1000,
  gap: Math.max(0, m.gapPer1000),
  isDeficit: m.gapPer1000 > 0,
}));

// ==================== Q2: Travel Time Chart Data ====================

const travelChartData = travelAdvantages
  .sort((a, b) => b.saving - a.saving)
  .map((t) => ({
    name: t.destination,
    km7: t.fromKm7,
    hptu: t.fromHPTU,
    advantage: t.advantage,
  }));

// ==================== Q3: EPS Pie Data ====================

const totalContributivo = epsMarketData.reduce(
  (acc, m) => acc + m.contributivo,
  0
);
const totalSubsidiado = epsMarketData.reduce(
  (acc, m) => acc + m.subsidiado,
  0
);

const regimeDistribution = [
  {
    name: "Contributivo",
    value: totalContributivo,
    fill: "#0d9488",
  },
  {
    name: "Subsidiado",
    value: totalSubsidiado,
    fill: "#f59e0b",
  },
];

// ==================== Q5: Competitor Investment Chart Data ====================

const investmentChartData = competitorInvestments
  .filter((c) => c.investmentMM > 0)
  .sort((a, b) => b.investmentMM - a.investmentMM)
  .map((c) => ({
    name: c.name,
    value: c.investmentMM / 1000, // billions for readability
    fill:
      c.type === "expansion"
        ? "#ef4444"
        : c.type === "nueva-sede"
        ? "#f59e0b"
        : "#6366f1",
    type: c.type,
    location: c.location,
    year: c.year,
  }));

// ==================== Q6: Medical Tourism Chart Data ====================

const medTourismChartData = medicalTourismHistory.map((y) => ({
  year: y.year,
  patients: y.patients / 1000, // thousands for chart
  revenue: y.revenueUSD,
}));

const originsPieData = medicalTourismOrigins.slice(0, 6).map((o) => ({
  name: o.country,
  value: o.visitors,
  fill:
    o.country === "Estados Unidos"
      ? "#3b82f6"
      : o.country === "Panama"
      ? "#f59e0b"
      : o.country === "Aruba"
      ? "#10b981"
      : o.country === "Colombia (resid. ext.)"
      ? "#8b5cf6"
      : o.country === "Puerto Rico"
      ? "#ec4899"
      : "#94a3b8",
}));

// ==================== COMPONENT ====================

export function DemandValidationSection() {
  return (
    <SectionWrapper id="demand-validation">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Dossier de Validacion de Demanda
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          6 Preguntas que el Board Necesita Responder
        </h2>
        <p className="mt-3 text-muted-foreground max-w-3xl mx-auto">
          Evidencia verificable de que la demanda es real, suficiente y creciente
          para un hub ambulatorio HPTU en Km 7 Via Las Palmas.
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-14">
        {/* ====== Q1: ¿Hay suficientes pacientes? ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-700 font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <Badge className="bg-red-50 text-red-700 border border-red-200 mb-1">
                Gap de Oferta
              </Badge>
              <h3 className="font-serif text-xl font-bold">
                ¿Hay suficientes pacientes?
              </h3>
            </div>
          </div>

          {/* Headline stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { value: supplyGapHeadline.overcrowding, label: "sobreocupacion urgencias Rionegro", color: "text-red-600", sublabel: "El Colombiano ene 2026" },
              { value: supplyGapHeadline.stat, label: "disponibles en Rionegro 2023", color: "text-red-600", sublabel: "ASIS Tabla 13" },
              { value: `${supplyGapHeadline.nonResidentPct}%`, label: "pacientes de OTROS municipios", color: "text-amber-600", sublabel: "ASIS Rionegro 2024" },
              { value: `~${formatNumber(supplyGapHeadline.nonResidentVolume)}`, label: "no residentes atendidos/ano", color: "text-amber-600", sublabel: "Estimacion ASIS" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-700 mt-1">{stat.label}</p>
                <p className="text-[10px] text-gray-400 mt-1.5">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>

          {/* Gap chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h4 className="text-sm font-bold mb-1">
              Camas por 1,000 habitantes vs Estandar OMS (2.5/1,000)
            </h4>
            <p className="text-[10px] text-gray-400 mb-4">
              Fuente: REPS capacidad instalada (b4dp-ximh) | DANE est. 2026
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={supplyGapChartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 5.5]} />
                <Tooltip
                  contentStyle={{ fontSize: "11px" }}
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)}/1,000`,
                    name === "actual" ? "Capacidad actual" : "Deficit vs OMS",
                  ]}
                  labelFormatter={(label) => {
                    const item = supplyGapChartData.find((d) => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <ReferenceLine
                  y={2.5}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{
                    value: "OMS 2.5",
                    position: "right",
                    fontSize: 10,
                    fill: "#ef4444",
                  }}
                />
                <Bar dataKey="actual" stackId="a" radius={[0, 0, 0, 0]} barSize={32}>
                  {supplyGapChartData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.isDeficit ? "#fca5a5" : "#6ee7b7"}
                    />
                  ))}
                </Bar>
                <Bar dataKey="gap" stackId="a" radius={[4, 4, 0, 0]} barSize={32}>
                  {supplyGapChartData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.isDeficit ? "#fee2e2" : "transparent"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-300" /> Sobre OMS
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-300" /> Bajo OMS
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-100" /> Deficit
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                <strong>4 de 7 municipios estan bajo el minimo OMS.</strong> Marinilla (0.42), El Santuario (0.17) y
                El Carmen (0.59) tienen deficits criticos. Rionegro tiene capacidad nominal pero opera al 114%
                de ocupacion con 0 camas UCI.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ====== Q2: ¿Van a venir a Km 7? ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                Ventaja de Conveniencia
              </Badge>
              <h3 className="font-serif text-xl font-bold">
                ¿Van a venir a Km 7?
              </h3>
            </div>
          </div>

          {/* Travel time comparison chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h4 className="text-sm font-bold mb-1">
              Tiempo de viaje: Access Point (Km 7) vs HPTU (Robledo)
            </h4>
            <p className="text-[10px] text-gray-400 mb-4">
              Fuente: Mapbox Matrix API | Valores en minutos
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={travelChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  label={{
                    value: "minutos",
                    position: "insideBottomRight",
                    fontSize: 10,
                    offset: -5,
                  }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: "11px" }}
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)} min`,
                    name === "km7" ? "Access Point Km 7" : "HPTU Robledo",
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "10px" }}
                  formatter={(value) =>
                    value === "km7" ? "Access Point Km 7" : "HPTU Robledo"
                  }
                />
                <Bar dataKey="km7" fill="#3b82f6" barSize={12} radius={[0, 4, 4, 0]} />
                <Bar dataKey="hptu" fill="#94a3b8" barSize={12} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insight */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm"
            >
              <Clock className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-blue-600">-17.8 min</p>
              <p className="text-xs text-gray-700">
                ahorro hacia El Retiro y La Ceja vs HPTU
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm"
            >
              <Plane className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-blue-600">-14.4 min</p>
              <p className="text-xs text-gray-700">
                ahorro hacia Aeropuerto SKRG vs HPTU
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm"
            >
              <Users className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-blue-600">92,900</p>
              <p className="text-xs text-gray-700">
                poblacion El Retiro + La Ceja (catchment sur)
              </p>
            </motion.div>
          </div>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Km 7 no compite con HPTU por el norte</strong> (Guarne, Portal Tunel) sino que
              captura el flujo <strong>sur del Oriente + corredor aeropuerto</strong> — los segmentos
              de mayor poder adquisitivo y mas desatendidos.
            </p>
          </div>
        </motion.div>

        {/* ====== Q3: ¿Pueden pagar? ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <Badge className="bg-teal-50 text-teal-700 border border-teal-200 mb-1">
                Poder Adquisitivo
              </Badge>
              <h3 className="font-serif text-xl font-bold">
                ¿Pueden pagar?
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Pie chart: contributivo vs subsidiado */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h4 className="text-sm font-bold mb-1">
                Distribucion Regimen Catchment (7 municipios)
              </h4>
              <p className="text-[10px] text-gray-400 mb-3">
                Fuente: ADRES/BDUA | Oriente Antioqueno
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={regimeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {regimeDistribution.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: "11px" }}
                    formatter={(value) => [
                      formatNumber(Number(value)),
                      "Afiliados",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="text-2xl font-bold text-teal-600">
                  {formatNumber(epsInsight.totalContributivoCatchment)}
                </p>
                <p className="text-xs text-gray-500">
                  afiliados contributivo en catchment
                </p>
              </div>
            </div>

            {/* EPS table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">
                        Municipio
                      </th>
                      <th className="text-right px-3 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">
                        Contrib.
                      </th>
                      <th className="text-right px-3 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">
                        % Contrib.
                      </th>
                      <th className="text-right px-3 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">
                        Ratio C/S
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {epsMarketData.map((row) => (
                      <tr
                        key={row.municipio}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="px-3 py-2 font-medium text-gray-900 text-xs">
                          {row.municipio}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700 text-xs">
                          {formatNumber(row.contributivo)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span
                            className={`text-xs font-semibold ${
                              row.pctContributivo >= 70
                                ? "text-teal-700"
                                : "text-amber-600"
                            }`}
                          >
                            {row.pctContributivo}%
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-xs text-gray-600">
                          {(row.contributivo / Math.max(row.subsidiado, 1)).toFixed(1)}x
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-3 py-2 text-xs">TOTAL</td>
                      <td className="px-3 py-2 text-right text-teal-700 text-xs">
                        {formatNumber(epsInsight.totalContributivoCatchment)}
                      </td>
                      <td className="px-3 py-2 text-right text-teal-700 text-xs">
                        {(
                          (epsInsight.totalContributivoCatchment /
                            (epsInsight.totalContributivoCatchment +
                              epsInsight.totalSubsidiadoCatchment)) *
                          100
                        ).toFixed(0)}
                        %
                      </td>
                      <td className="px-3 py-2 text-right text-xs">
                        {epsInsight.ratioContribSubsid}x
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-start gap-2">
              <DollarSign className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-sm text-teal-800">
                <strong>Ratio contributivo/subsidiado de {epsInsight.ratioContribSubsid}x</strong> indica
                alto poder adquisitivo. {epsInsight.suraDominance}. Rionegro, La Ceja y
                El Retiro superan el 80% contributivo — mercado natural para salud premium.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ====== Q4: ¿Va a crecer la demanda? ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm shrink-0">
              4
            </div>
            <div>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                Trayectoria de Crecimiento
              </Badge>
              <h3 className="font-serif text-xl font-bold">
                ¿Va a crecer la demanda?
              </h3>
            </div>
          </div>

          {/* Growth drivers grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {growthDrivers.slice(0, 4).map((driver, i) => (
              <motion.div
                key={driver.indicator}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <TrendingUp className="h-4 w-4 text-emerald-500 mb-2" />
                <p className="text-xl font-bold text-emerald-600">{driver.value}</p>
                <p className="text-xs text-gray-700 mt-1">{driver.indicator}</p>
                <p className="text-[10px] text-gray-400 mt-1">{driver.source}</p>
              </motion.div>
            ))}
          </div>

          {/* Area charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Population projection */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h4 className="text-sm font-bold mb-1">
                Poblacion Oriente (7 municipios)
              </h4>
              <p className="text-[10px] text-gray-400 mb-4">
                DANE CNPV 2018 + proyecciones | CAGR +2%
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={populationProjections}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    domain={["dataMin - 20000", "dataMax + 20000"]}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: "11px" }}
                    formatter={(value) => [
                      formatNumber(Number(value)),
                      "Poblacion",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="population"
                    stroke="#10b981"
                    fill="#d1fae5"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Airport growth */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h4 className="text-sm font-bold mb-1">
                Pasajeros Aeropuerto SKRG (millones)
              </h4>
              <p className="text-[10px] text-gray-400 mb-4">
                Plan Maestro JMC 2055 | Aerocivil
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={airportGrowth}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `${v}M`}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: "11px" }}
                    formatter={(value) => [
                      `${value}M pasajeros`,
                      "SKRG",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="passengers"
                    stroke="#3b82f6"
                    fill="#dbeafe"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional growth drivers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {growthDrivers.slice(4).map((driver, i) => (
              <motion.div
                key={driver.indicator}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <p className="text-xs font-bold text-emerald-600">{driver.value}</p>
                </div>
                <p className="text-[11px] text-gray-700">{driver.indicator}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{driver.source}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-800">
              <strong>Todos los indicadores apuntan a crecimiento sostenido:</strong> poblacion (+2% CAGR),
              trafico vial (+30-64% en 10 anos), pasajeros aeropuerto (3x para 2055), y prepagada
              (+37% en 3 anos). La apertura de la doble calzada del tunel (H2 2027) sera el punto de
              inflexion.
            </p>
          </div>
        </motion.div>

        {/* ====== Q5: ¿Otros ya validaron este mercado? ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-violet-100 text-violet-700 font-bold text-sm shrink-0">
              5
            </div>
            <div>
              <Badge className="bg-violet-50 text-violet-700 border border-violet-200 mb-1">
                Senales Competitivas
              </Badge>
              <h3 className="font-serif text-xl font-bold">
                ¿Otros ya validaron este mercado?
              </h3>
            </div>
          </div>

          {/* Investment chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm mb-5">
            <h4 className="text-sm font-bold mb-1">
              Inversiones recientes en el corredor (COP miles de millones)
            </h4>
            <p className="text-[10px] text-gray-400 mb-4">
              Fuente: REPS, prensa verificada, planes institucionales
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={investmentChartData}
                layout="vertical"
                margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: "11px" }}
                  formatter={(value) => [
                    `COP $${(Number(value) * 1000).toLocaleString()}MM`,
                    "Inversion",
                  ]}
                  labelFormatter={(label) => {
                    const item = investmentChartData.find(
                      (d) => d.name === label
                    );
                    return `${label} (${item?.location}, ${item?.year})`;
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                  {investmentChartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> Expansion
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Nueva sede
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" /> Consolidacion
              </span>
            </div>
          </div>

          {/* Competitor cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {competitorInvestments.map((comp, i) => (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.06, 0.3) }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <h5 className="text-sm font-bold text-gray-900">{comp.name}</h5>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">{comp.investment}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {comp.location} | {comp.year}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold border uppercase ${
                      comp.type === "expansion"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : comp.type === "nueva-sede"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}
                  >
                    {comp.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key insight */}
          <div className="mt-5 rounded-xl border-2 border-violet-400 bg-violet-50/50 p-5">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-6 w-6 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg font-bold text-violet-800">
                  El mercado esta validado por la competencia
                </h4>
                <p className="text-sm text-violet-700 mt-2">
                  <strong>{competitorInsight.totalInvestmentLabel}</strong> en inversiones recientes
                  confirman que el corredor Medellin-Oriente tiene demanda real. Clinica del
                  Campestre ya abrio en Rionegro (marzo 2026) con 250 pac/dia proyectados, validando
                  el segmento ambulatorio premium. <strong>Ventana de oportunidad: {competitorInsight.windowOfOpportunity}.</strong>
                </p>
                <div className="mt-3 rounded-lg border-l-4 border-red-400 bg-red-50 p-3">
                  <p className="text-xs text-red-700">
                    <strong>Riesgo:</strong> {competitorInsight.riskIfDelayed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ====== Q6: ¿Hay potencial de turismo de salud? ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-sky-100 text-sky-700 font-bold text-sm shrink-0">
              6
            </div>
            <div>
              <Badge className="bg-sky-50 text-sky-700 border border-sky-200 mb-1">
                Turismo de Salud
              </Badge>
              <h3 className="font-serif text-xl font-bold">
                ¿Hay potencial de turismo medico?
              </h3>
            </div>
          </div>

          {/* Headline KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { value: formatNumber(medicalTourismKPIs.patientsAnnual), label: "pacientes intl/ano (2024)", color: "text-sky-600", sublabel: "ProColombia/MinCIT" },
              { value: `USD $${medicalTourismKPIs.revenueUSD}M`, label: "revenue anual", color: "text-sky-600", sublabel: "Est. 2024" },
              { value: `+${medicalTourismKPIs.growthYoY}%`, label: "crecimiento YoY", color: "text-emerald-600", sublabel: "2023→2024" },
              { value: `USD $${formatNumber(medicalTourismKPIs.avgSpendUSD)}`, label: "gasto promedio/visita", color: "text-sky-600", sublabel: "DANE EVI 2023-2025" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-700 mt-1">{stat.label}</p>
                <p className="text-[10px] text-gray-400 mt-1.5">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Growth chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h4 className="text-sm font-bold mb-1">
                Pacientes internacionales Antioquia (miles)
              </h4>
              <p className="text-[10px] text-gray-400 mb-4">
                Fuente: ProColombia/MinCIT | 2018-2024
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={medTourismChartData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}K`} />
                  <Tooltip
                    contentStyle={{ fontSize: "11px" }}
                    formatter={(value) => [
                      `${Number(value).toFixed(0)}K pacientes`,
                      "Turismo medico",
                    ]}
                  />
                  <Bar dataKey="patients" radius={[4, 4, 0, 0]} barSize={28}>
                    {medTourismChartData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.year === 2020 ? "#fca5a5" : "#38bdf8"}
                        opacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Origins pie */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h4 className="text-sm font-bold mb-1">
                Paises de origen (DANE EVI ponderado)
              </h4>
              <p className="text-[10px] text-gray-400 mb-3">
                Fuente: DANE EVI 2023-2025 | Motivo: Trat. Medicos
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={originsPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${(name ?? "").length > 12 ? (name ?? "").substring(0, 12) + "." : name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {originsPieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: "11px" }}
                    formatter={(value) => [
                      `${formatNumber(Number(value))} visitantes`,
                      "EVI ponderado",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* HPTU JCI advantage */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-sky-600" />
              <h4 className="text-sm font-bold">
                Acreditacion JCI: Ventaja competitiva de HPTU
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">Institucion</th>
                    <th className="text-center px-3 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">Acreditacion</th>
                    <th className="text-center px-3 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">Rating</th>
                    <th className="text-center px-3 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">Cerca SKRG</th>
                  </tr>
                </thead>
                <tbody>
                  {hptuMedTourismPosition.map((h) => (
                    <tr key={h.name} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-900">{h.name}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold border uppercase ${
                          h.accreditation === "JCI"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}>
                          {h.accreditation}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-xs">
                        {h.rating ? (
                          <span className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            {h.rating}
                          </span>
                        ) : (
                          <span className="text-gray-400">&mdash;</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center text-xs">
                        {h.nearAirport ? (
                          <span className="text-emerald-600 font-bold">Si</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key insight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm"
            >
              <Globe className="h-5 w-5 text-sky-500 mb-2" />
              <p className="text-2xl font-bold text-sky-600">0</p>
              <p className="text-xs text-gray-700">
                instituciones JCI a {"<"}30 min del aeropuerto SKRG
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm"
            >
              <Clock className="h-5 w-5 text-sky-500 mb-2" />
              <p className="text-2xl font-bold text-sky-600">-{medicalTourismInsight.timeReduction} min</p>
              <p className="text-xs text-gray-700">
                Km 7 ({medicalTourismInsight.km7ToAirport} min) vs HPTU Robledo ({medicalTourismInsight.hptuToAirport} min) desde SKRG
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm"
            >
              <DollarSign className="h-5 w-5 text-sky-500 mb-2" />
              <p className="text-2xl font-bold text-sky-600">USD ${medicalTourismInsight.annualRevenueCapture5pct}M</p>
              <p className="text-xs text-gray-700">
                potencial capturando solo 5% del turismo medico
              </p>
            </motion.div>
          </div>

          {/* Procedures grid */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
            <h4 className="text-sm font-bold mb-3">
              Procedimientos mas demandados por turistas medicos
            </h4>
            <div className="flex flex-wrap gap-2">
              {medicalTourismKPIs.topProcedures.map((proc) => (
                <span
                  key={proc}
                  className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 border border-sky-200"
                >
                  {proc}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-3">
              Fuente: ProColombia, DANE EVI | HPTU tiene ventaja en cardiologia, ortopedia y cirugia general; puede complementar con chequeo ejecutivo y segunda opinion oncologica
            </p>
          </div>

          {/* Key insight */}
          <div className="rounded-xl border-2 border-sky-400 bg-sky-50/50 p-5">
            <div className="flex items-start gap-3">
              <Plane className="h-6 w-6 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg font-bold text-sky-800">
                  HPTU es el unico hospital JCI en Antioquia
                </h4>
                <p className="text-sm text-sky-700 mt-2">
                  {medicalTourismInsight.hptuAdvantage} Los{" "}
                  <strong>{formatNumber(medicalTourismKPIs.patientsAnnual)} turistas medicos/ano</strong> que
                  llegan a Antioquia aterrizan en SKRG y hoy viajan 57+ min a Medellin para atenderse. Un
                  Access Point JCI-branded a 20 min del aeropuerto captura consultas pre/post-operatorias,
                  segunda opinion oncologica y chequeo ejecutivo premium.
                </p>
                <p className="text-xs text-sky-600 mt-2 italic">
                  Estancia promedio: {medicalTourismKPIs.avgStayNights} noches | Gasto promedio: USD ${formatNumber(medicalTourismKPIs.avgSpendUSD)}/visita (DANE EVI)
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ====== SYNTHESIS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-emerald-900">
              Resumen Ejecutivo: Demanda Validada
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { q: "¿Pacientes?", answer: "Si", detail: "4/7 bajo OMS, 114% sobreocupacion", icon: Users, color: "text-red-600" },
              { q: "¿Vendran?", answer: "Si", detail: "Km7 ahorra 14-18 min al sur", icon: Clock, color: "text-blue-600" },
              { q: "¿Pagan?", answer: "Si", detail: "384K contributivo, C/S 3.5x", icon: DollarSign, color: "text-teal-600" },
              { q: "¿Crece?", answer: "Si", detail: "+2% CAGR, +64% trafico", icon: TrendingUp, color: "text-emerald-600" },
              { q: "¿Validado?", answer: "Si", detail: "$590B invertidos en corredor", icon: Building2, color: "text-violet-600" },
              { q: "¿Tur. salud?", answer: "Si", detail: "85K pac intl, HPTU unico JCI", icon: Globe, color: "text-sky-600" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/80 rounded-xl border border-emerald-200 p-4 text-center"
                >
                  <Icon className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {item.q}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${item.color}`}>
                    {item.answer}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1">{item.detail}</p>
                </motion.div>
              );
            })}
          </div>

          <p className="text-[10px] text-gray-400 mt-6 text-center">
            Fuentes: REPS (b4dp-ximh), ASIS Rionegro 2024, ADRES/BDUA, ANI peajes (8yi9-t44c),
            Mapbox Matrix API, Plan Maestro JMC 2055, DANE CNPV 2018, DANE EVI 2023-2025,
            ProColombia/MinCIT, turismo-cluster-datalake (Fase 12), prensa verificada
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
