"use client";

import { motion } from "framer-motion";
import { Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  orienteStrataData,
  orienteStrataSummary,
} from "@/lib/demo-data/oriente-strata";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// Chart data: contributivo vs subsidiado by municipality
const chartData = orienteStrataData.map((m) => ({
  name: m.municipio.length > 10 ? m.municipio.slice(0, 10) + "." : m.municipio,
  fullName: m.municipio,
  contributivo: m.afiliadosContributivo,
  subsidiado: m.afiliadosSubsidiado,
  pctContrib: m.pctContributivo,
}));

export function OrienteStrataSection() {
  return (
    <SectionWrapper id="estratos-oriente">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Estratificacion Oriente — Dato Proxy
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Estratos 4/5/6 en el Oriente Antioqueno
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          No existe un dataset directo de estratificacion catastral para todos los
          municipios del Oriente en datos.gov.co. Se usa proxy basado en afiliacion
          contributiva y dato directo de Rionegro (Decreto 096/2021).
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
            Poblacion Total
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {formatNumber(orienteStrataSummary.totalPoblacion)}
          </p>
          <p className="text-[10px] text-muted-foreground">11 municipios Oriente</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Total Contributivo
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {formatNumber(orienteStrataSummary.totalContributivo)}
          </p>
          <p className="text-[10px] text-muted-foreground">RUAF Abr 2022</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Rionegro E4+
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">42.1%</p>
          <p className="text-[10px] text-muted-foreground">
            18,852 viviendas (dato directo)
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
            Proxy E4+ Total
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {formatNumber(orienteStrataSummary.totalProxyE4Plus)}
          </p>
          <p className="text-[10px] text-muted-foreground">estimacion conservadora</p>
        </motion.div>
      </div>

      {/* Chart: Contributivo vs Subsidiado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-bold">
            Afiliacion Contributivo vs Subsidiado por Municipio
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Municipios con mayor % contributivo = mayor capacidad de pago = mercado atractivo
          para salud privada. Rionegro, El Retiro y La Ceja superan el 50%.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{ fontSize: "11px" }}
              labelFormatter={(label) => {
                const item = chartData.find((d) => d.name === label);
                return item?.fullName || label;
              }}
              formatter={(value) => [
                formatNumber(Number(value)),
                "",
              ]}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="contributivo" fill="#0d9488" name="Contributivo" radius={[3, 3, 0, 0]} />
            <Bar dataKey="subsidiado" fill="#94a3b8" name="Subsidiado" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detailed table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <h3 className="text-sm font-bold mb-1">
            Proxy de Estratificacion — Oriente Antioqueno
          </h3>
          <p className="text-[10px] text-muted-foreground">
            Dato directo solo disponible para Rionegro (Decreto 096/2021). Otros municipios
            usan proxy basado en ratio E4+/contributivo de Rionegro.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Municipio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Poblacion
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                % Contrib.
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                E4+ (proxy)
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Dato Directo
              </th>
              <th className="text-left py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                Nota
              </th>
            </tr>
          </thead>
          <tbody>
            {orienteStrataData.map((m) => {
              const isDirect = m.estratoDirecto !== null;
              const isStrong = m.pctContributivo > 50;
              return (
                <tr
                  key={m.municipio}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/20",
                    isDirect && "bg-amber-50/40",
                    isStrong && !isDirect && "bg-teal-50/30"
                  )}
                >
                  <td className="py-2.5 px-4 font-medium text-xs">{m.municipio}</td>
                  <td className="py-2.5 px-3 text-center text-xs">
                    {formatNumber(m.poblacion2018)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                        isStrong
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      )}
                    >
                      {m.pctContributivo.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs font-bold">
                    {formatNumber(m.proxyE4Plus)}
                  </td>
                  <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                    {isDirect ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Si
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Proxy</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-muted-foreground hidden md:table-cell max-w-[200px]">
                    {m.nota.slice(0, 80)}{m.nota.length > 80 ? "..." : ""}
                  </td>
                </tr>
              );
            })}
            {/* Sum row */}
            <tr className="border-t-2 border-border bg-muted/30 font-bold">
              <td className="py-2.5 px-4 text-xs">Total Oriente</td>
              <td className="py-2.5 px-3 text-center text-xs">
                {formatNumber(orienteStrataSummary.totalPoblacion)}
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border bg-teal-50 text-teal-700 border-teal-200">
                  {(
                    (orienteStrataSummary.totalContributivo /
                      (orienteStrataSummary.totalContributivo +
                        orienteStrataSummary.totalSubsidiado)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </td>
              <td className="py-2.5 px-3 text-center text-xs font-bold">
                {formatNumber(orienteStrataSummary.totalProxyE4Plus)}
              </td>
              <td className="py-2.5 px-3 hidden sm:table-cell" />
              <td className="py-2.5 px-3 hidden md:table-cell" />
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* Transparency note */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-800">
              Nota de Transparencia: Dato Proxy
            </h4>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              <strong>Solo Rionegro tiene estratificacion catastral publica verificable</strong> (Decreto
              096/2021). Para los demas municipios, se usa un proxy basado en la relacion
              entre estrato 4+ y % de afiliacion contributiva observada en Rionegro
              (ratio = 0.765). Este proxy es <strong>conservador</strong> y tiene limitaciones:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-amber-700">
              {orienteStrataSummary.limitaciones.map((lim, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  {lim}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-amber-600 mt-3 italic">
              Fuentes: Decreto 096/2021 (Rionegro), DiariOriente, RUAF Aseguramiento (ruaf-giye),
              DANE CNPV 2018 (evm3-92yw)
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
