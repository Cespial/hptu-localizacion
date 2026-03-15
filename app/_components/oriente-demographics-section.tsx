"use client";

import { motion } from "framer-motion";
import { Users, MapPin, TrendingUp } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { orienteMunicipios } from "@/lib/demo-data/oriente-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// Population data sorted descending
const populationData = [...orienteMunicipios]
  .sort((a, b) => b.population2018 - a.population2018)
  .map((m) => ({
    name: m.name,
    population: m.population2018,
    projection: m.populationEst2026,
  }));

// Table data sorted descending by population
const tableData = [...orienteMunicipios]
  .sort((a, b) => b.population2018 - a.population2018)
  .map((m) => ({
    name: m.name,
    pop2018: m.population2018,
    pop2026: m.populationEst2026,
    growth: (((m.populationEst2026 - m.population2018) / m.population2018) * 100).toFixed(1),
    contributivo: m.afiliadosContributivo,
    subsidiado: m.afiliadosSubsidiado,
    ratioCS: m.afiliadosContributivo / m.afiliadosSubsidiado,
  }));

const totalPopulation = orienteMunicipios.reduce(
  (sum, m) => sum + m.population2018,
  0
);

export function OrienteDemographicsSection() {
  return (
    <SectionWrapper id="oriente-demografico">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Oriente Antioqueno — Demografia y Crecimiento
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Valle de San Nicolas: El Motor de Crecimiento del Oriente
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Datos poblacionales de DANE CNPV 2018, SISBEN IV y DNP para los 11
          municipios del Oriente cercano. Afiliaciones al sistema de salud
          contributivo y subsidiado.
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
            Total Poblacion Oriente
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {formatNumber(totalPopulation)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            DANE CNPV 2018, 11 municipios
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
            Municipios
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">11</p>
          <p className="text-[10px] text-muted-foreground">
            Valle de San Nicolas
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
            Crecimiento Rionegro
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">+2.0% CAGR</p>
          <p className="text-[10px] text-muted-foreground">
            2018-2026, DANE proyecciones
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
            Licencias Rionegro
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            19% del ritmo de Medellin
          </p>
          <p className="text-[10px] text-muted-foreground">
            SNR, licencias de construccion
          </p>
        </motion.div>
      </div>

      {/* Population bar chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-teal-500" />
          <h3 className="text-sm font-bold">
            Poblacion por Municipio (DANE CNPV 2018)
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Fuente: DANE Censo Nacional de Poblacion y Vivienda 2018 |
          Proyecciones DNP 2026
        </p>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={populationData}
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
                if (name === "population")
                  return [`${formatNumber(Number(value))} hab.`, "Poblacion 2018"];
                return [`${formatNumber(Number(value))} hab.`, "Proyeccion 2026"];
              }}
            />
            <Bar dataKey="population" radius={[0, 6, 6, 0]} barSize={22}>
              {populationData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.population > 100000
                      ? "#0d9488"
                      : entry.population > 50000
                      ? "#3b82f6"
                      : "#64748b"
                  }
                  opacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> &gt;100,000
            hab.
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> 50,000-100,000
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-500" /> &lt;50,000
          </span>
        </div>
      </motion.div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">
              Poblacion, Crecimiento y Afiliacion al Sistema de Salud
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Fuente: DANE CNPV 2018, DNP Proyecciones 2026, SISBEN IV. Ratio
            C/S = Contributivo / Subsidiado (mayor = mas mercado privado).
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Municipio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Pob. 2018
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Proy. 2026
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Crecimiento
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Contrib.
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Subsid.
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Ratio C/S
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
                  {formatNumber(row.pop2018)}
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {formatNumber(row.pop2026)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="text-xs font-bold text-amber-600">
                    +{row.growth}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {formatNumber(row.contributivo)}
                </td>
                <td className="py-2.5 px-3 text-center text-xs">
                  {formatNumber(row.subsidiado)}
                </td>
                <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                      row.ratioCS > 1
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    )}
                  >
                    {row.ratioCS.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Lectura:</strong> Ratio C/S &gt; 1 indica mayor proporcion
            de afiliados al regimen contributivo (mercado de salud privada).
            Rionegro (5.38), La Ceja (4.79) y El Retiro (3.47) son los
            municipios con mayor potencial de mercado para servicios de salud de
            alta complejidad.
          </p>
        </div>
      </motion.div>

      {/* Insight box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-blue-300 bg-blue-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-blue-800">
              Rionegro: Capital de Salud del Oriente
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Rionegro concentra el <strong>55% de las camas</strong> y el{" "}
              <strong>67% de los consultorios</strong> del Oriente Antioqueno,
              con una poblacion que crece al <strong>+2.0% CAGR</strong> — la
              tasa mas alta de la subregion. Su proximidad al{" "}
              <strong>Aeropuerto Jose Maria Cordova</strong>, la presencia de
              la <strong>Zona Franca</strong> y el desarrollo de condominios y
              centros comerciales consolidan un ecosistema que demanda servicios
              de salud de alta complejidad. Las licencias de construccion de
              Rionegro representan el <strong>19% del ritmo de Medellin</strong>,
              un indicador claro de expansion urbana acelerada. El corredor
              sur-oriente (El Retiro, La Ceja, La Union) muestra ratios
              contributivo/subsidiado superiores a 1.0, confirmando un mercado
              con capacidad de pago para servicios privados.
            </p>
            <p className="text-xs text-blue-600 mt-2 italic">
              Fuentes: DANE CNPV 2018, DNP Proyecciones, SISBEN IV, SNR
              Licencias de Construccion, REPS Prestadores
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
