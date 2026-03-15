"use client";

import { motion } from "framer-motion";
import { Hospital, AlertTriangle, Users, Activity } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  orienteMunicipios,
  orienteHealthSummary,
} from "@/lib/demo-data/oriente-data";
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
} from "recharts";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// Bed data sorted descending
const bedData = [...orienteMunicipios]
  .sort((a, b) => b.camas - a.camas)
  .map((m) => ({
    name: m.name,
    camas: m.camas,
    population: m.population2018,
    isRionegro: m.id === "rionegro",
  }));

// Pie chart data — distribution of camas
const rionegroCamas = orienteMunicipios.find((m) => m.id === "rionegro")?.camas ?? 0;
const laCejaCamas = orienteMunicipios.find((m) => m.id === "la-ceja")?.camas ?? 0;
const guarneCamas = orienteMunicipios.find((m) => m.id === "guarne")?.camas ?? 0;
const totalCamas = orienteMunicipios.reduce((sum, m) => sum + m.camas, 0);
const otrosCamas = totalCamas - rionegroCamas - laCejaCamas - guarneCamas;

const pieData = [
  {
    name: "Rionegro",
    value: rionegroCamas,
    pct: ((rionegroCamas / totalCamas) * 100).toFixed(0),
    fill: "#0d9488",
  },
  {
    name: "La Ceja",
    value: laCejaCamas,
    pct: ((laCejaCamas / totalCamas) * 100).toFixed(0),
    fill: "#3b82f6",
  },
  {
    name: "Guarne",
    value: guarneCamas,
    pct: ((guarneCamas / totalCamas) * 100).toFixed(0),
    fill: "#8b5cf6",
  },
  {
    name: "Otros",
    value: otrosCamas,
    pct: ((otrosCamas / totalCamas) * 100).toFixed(0),
    fill: "#d1d5db",
  },
];

// Table data sorted by population descending
const tableData = [...orienteMunicipios]
  .sort((a, b) => b.population2018 - a.population2018)
  .map((m) => ({
    name: m.name,
    population: m.population2018,
    camas: m.camas,
    consultorios: m.consultorios,
    prestadores: m.prestadores,
    camasPer1000: (m.camas / m.population2018) * 1000,
    nivelMax: m.nivelMaximo,
  }));

export function OrienteHealthGapSection() {
  return (
    <SectionWrapper id="brecha-oriente">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Brecha de Salud — Oriente Antioqueno
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          {orienteHealthSummary.facilitiesOriente} vs{" "}
          {orienteHealthSummary.facilitiesValleAburra}: La Brecha Critica del
          Oriente
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Datos REPS para 11 municipios del Oriente Antioqueno y comparacion con
          el Valle de Aburra. Facilities contabilizadas via OSM Overpass.
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
            Facilities Oriente
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {orienteHealthSummary.facilitiesOriente}
          </p>
          <p className="text-[10px] text-muted-foreground">OSM 11 municipios</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Facilities Valle Aburra
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {orienteHealthSummary.facilitiesValleAburra}
          </p>
          <p className="text-[10px] text-muted-foreground">
            OSM Area Metropolitana
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
            Ratio Clinicas
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            1:{orienteHealthSummary.ratioClinicas}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Oriente vs Valle Aburra
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
            Hospitales Nivel 3-4
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1 flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-5 w-5" />
            {orienteHealthSummary.level3or4Count}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Cero alta complejidad (REPS)
          </p>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Bed capacity horizontal bar chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Hospital className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold">
              Camas por Municipio (REPS Capacidad Instalada)
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: REPS Prestadores (b4dp-ximh) | Capacidad Instalada Nov 2022
          </p>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={bedData}
              layout="vertical"
              margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value, name) => {
                  if (name === "camas")
                    return [`${formatNumber(Number(value))} camas`, "Capacidad"];
                  return [formatNumber(Number(value)), String(name)];
                }}
              />
              <Bar dataKey="camas" radius={[0, 6, 6, 0]} barSize={22}>
                {bedData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.isRionegro ? "#0d9488" : "#3b82f6"}
                    opacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> Rionegro
              ({orienteHealthSummary.rionegroPctCamas}% del total)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Otros
              municipios
            </span>
          </div>
        </motion.div>

        {/* Pie chart — bed distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">
              Distribucion de Camas por Municipio
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: REPS (b4dp-ximh) | {formatNumber(totalCamas)} camas totales
            en 11 municipios del Oriente
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                labelLine={{ strokeWidth: 1 }}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value) => [
                  `${formatNumber(Number(value))} camas`,
                  "Cantidad",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 rounded-lg bg-red-50 border border-red-100 p-2.5">
            <p className="text-[10px] text-red-700">
              <strong>Concentracion critica:</strong> Rionegro acumula el{" "}
              <strong>{orienteHealthSummary.rionegroPctCamas}%</strong> de las
              camas y el{" "}
              <strong>{orienteHealthSummary.rionegroPctConsultorios}%</strong> de
              los consultorios. Un solo punto de fallo para{" "}
              {formatNumber(
                orienteMunicipios.reduce(
                  (sum, m) => sum + m.population2018,
                  0
                )
              )}{" "}
              habitantes.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Coverage table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold">
              Cobertura por Municipio: Camas, Consultorios y Prestadores
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Fuente: REPS Capacidad Instalada (b4dp-ximh), DANE CNPV 2018. OMS
            recomienda 3-5 camas por 1,000 habitantes.
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
                Camas
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Consultorios
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Prestadores
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Camas/1000 hab
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Nivel Max
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.name}
                className="border-b border-border/50 hover:bg-muted/20"
              >
                <td className="py-2.5 px-4 font-medium text-xs">{row.name}</td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {formatNumber(row.population)}
                </td>
                <td className="py-2.5 px-3 text-center text-xs font-bold">
                  {formatNumber(row.camas)}
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {formatNumber(row.consultorios)}
                </td>
                <td className="py-2.5 px-3 text-center text-xs hidden sm:table-cell">
                  {formatNumber(row.prestadores)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                      row.camasPer1000 < 1
                        ? "bg-red-50 text-red-700 border-red-200"
                        : row.camasPer1000 < 3
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-teal-50 text-teal-700 border-teal-200"
                    )}
                  >
                    {row.camasPer1000.toFixed(1)}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                      row.nivelMax >= 2
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : row.nivelMax === 1
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    )}
                  >
                    {row.nivelMax === 0 ? "Sin nivel" : `Nivel ${row.nivelMax}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Referencia OMS:</strong> Se recomiendan 3-5 camas por cada
            1,000 habitantes. Solo Rionegro ({(rionegroCamas / (orienteMunicipios.find(m => m.id === "rionegro")?.population2018 ?? 1) * 1000).toFixed(1)} camas/1,000)
            se acerca al umbral minimo. La mayoria de municipios estan
            criticamente por debajo del estandar internacional.
          </p>
        </div>
      </motion.div>

      {/* Insight box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-red-300 bg-red-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-red-800">
              Dependencia Total de Rionegro: Riesgo Sistemico
            </h4>
            <p className="text-sm text-red-700 mt-1">
              Rionegro concentra el{" "}
              <strong>
                {orienteHealthSummary.rionegroPctCamas}% de camas
              </strong>{" "}
              y{" "}
              <strong>
                {orienteHealthSummary.rionegroPctConsultorios}% de consultorios
              </strong>{" "}
              del Oriente. Solo existe{" "}
              <strong>1 hospital Nivel 2 publico</strong> (
              {orienteHealthSummary.onlyLevel2Hospital}, rating Google 2.4/5).{" "}
              <strong>No hay Nivel 3 ni 4.</strong> Si Rionegro colapsa,{" "}
              {formatNumber(
                orienteMunicipios.reduce(
                  (sum, m) => sum + m.population2018,
                  0
                )
              )}{" "}
              habitantes pierden acceso a servicios hospitalarios. El Retiro no
              tiene hospital ESE propio (nivel reportado: 0 en REPS). Las
              ratings de hospitales en el Oriente oscilan entre{" "}
              <strong>2.4 y 3.7/5</strong> — una oportunidad clara para un
              servicio de calidad HPTU que compita en experiencia y complejidad.
            </p>
            <p className="text-xs text-red-600 mt-2 italic">
              Fuentes: REPS Capacidad Instalada (b4dp-ximh), Google Places API
              (ratings), OSM Overpass (facilities), DANE CNPV 2018
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
