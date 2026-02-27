"use client";

import { motion } from "framer-motion";
import { Hospital, AlertTriangle, Users, TrendingUp } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { healthNodes, poblacionDane } from "@/lib/demo-data/demand-gradient";
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

// Bed capacity data from REPS
const bedData = healthNodes
  .sort((a, b) => b.beds - a.beds)
  .map((node) => ({
    name: node.name
      .replace("Hospital Pablo Tobon Uribe", "HPTU")
      .replace("Clinica Medellin S.A.S.", "Cl. Medellin")
      .replace("Clinica del Prado S.A.S.", "Cl. del Prado")
      .replace("Hospital General de Medellin (ESE)", "HGM ESE")
      .replace("Clinica CES", "Cl. CES")
      .replace("ESE Hospital Manuel Uribe Angel", "H. Uribe Angel"),
    fullName: node.name,
    beds: node.beds,
    occupancy: parseInt(node.occupancy),
    available: Math.round(node.beds * (1 - parseInt(node.occupancy) / 100)),
    type: node.type,
    municipality: node.municipality,
  }));

// Coverage area population vs beds
const coverageData = [
  {
    area: "Medellin",
    population: poblacionDane.censoNacional2018.medellin,
    projection2026: poblacionDane.proyecciones2026.medellin,
    beds: 1094 + 624 + 304 + 384, // Major hospitals
    ratio: Math.round(poblacionDane.censoNacional2018.medellin / (1094 + 624 + 304 + 384)),
  },
  {
    area: "Envigado",
    population: poblacionDane.censoNacional2018.envigado,
    projection2026: poblacionDane.proyecciones2026.envigado,
    beds: 120,
    ratio: Math.round(poblacionDane.censoNacional2018.envigado / 120),
  },
  {
    area: "Itagui",
    population: poblacionDane.censoNacional2018.itagui,
    projection2026: poblacionDane.proyecciones2026.itagui,
    beds: 150, // Estimated from REPS
    ratio: Math.round(poblacionDane.censoNacional2018.itagui / 150),
  },
  {
    area: "Sabaneta",
    population: poblacionDane.censoNacional2018.sabaneta,
    projection2026: poblacionDane.proyecciones2026.sabaneta,
    beds: 45, // Estimated from REPS
    ratio: Math.round(poblacionDane.censoNacional2018.sabaneta / 45),
  },
];

// IPS distribution pie chart
const ipsDistribution = [
  { name: "Medellin", value: 662, fill: "#0d9488" },
  { name: "Envigado", value: 87, fill: "#3b82f6" },
  { name: "Itagui", value: 51, fill: "#8b5cf6" },
  { name: "Sabaneta", value: 42, fill: "#f59e0b" },
  { name: "Otros V. Aburra", value: 694, fill: "#d1d5db" },
];

export function HealthGapSection() {
  const totalBeds = bedData.reduce((sum, h) => sum + h.beds, 0);
  const avgOccupancy = Math.round(
    bedData.reduce((sum, h) => sum + h.occupancy * h.beds, 0) / totalBeds
  );

  return (
    <SectionWrapper id="brecha-salud">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Fase 2 - Brecha de Capacidad Hospitalaria
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Red de Salud: Saturacion y Oportunidad
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Analisis de 1,536 IPS registradas en REPS (Valle de Aburra), capacidad
          instalada de 2,739 camas en 6 hospitales principales, y cobertura
          poblacional con datos DANE CNPV 2018.
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
            Camas Totales
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {formatNumber(totalBeds)}
          </p>
          <p className="text-[10px] text-muted-foreground">6 hospitales principales</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Ocupacion Avg
          </p>
          <p className={cn(
            "text-2xl font-bold mt-1",
            avgOccupancy >= 90 ? "text-red-600" : avgOccupancy >= 80 ? "text-amber-600" : "text-teal-600"
          )}>
            {avgOccupancy}%
          </p>
          <p className="text-[10px] text-muted-foreground">ponderada por camas</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            IPS Valle Aburra
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">1,536</p>
          <p className="text-[10px] text-muted-foreground">REPS habilitadas</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Alta Complejidad Las Palmas
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">1</p>
          <p className="text-[10px] text-muted-foreground">Solo Cl. CES (213 camas)</p>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Bed capacity chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Hospital className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold">
              Capacidad Instalada (Camas) y Ocupacion
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: REPS Prestadores (b4dp-ximh) | Capacidad Instalada
            (s2ru-bqt6)
          </p>
          <ResponsiveContainer width="100%" height={300}>
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
                width={90}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value, name) => {
                  if (name === "beds") return [`${formatNumber(Number(value))} camas`, "Capacidad"];
                  return [`${value}%`, "Ocupacion"];
                }}
                labelFormatter={(label) => {
                  const h = bedData.find((b) => b.name === label);
                  return h?.fullName || label;
                }}
              />
              <Bar dataKey="beds" radius={[0, 6, 6, 0]} barSize={22}>
                {bedData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      entry.occupancy >= 90
                        ? "#ef4444"
                        : entry.occupancy >= 80
                        ? "#f59e0b"
                        : "#10b981"
                    }
                    opacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-400" /> Ocupacion &ge;90%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> 80-89%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> &lt;80%
            </span>
          </div>
        </motion.div>

        {/* IPS Distribution pie */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">
              Distribucion IPS por Municipio
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: REPS (b4dp-ximh) | 1,536 IPS habilitadas Valle de Aburra
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ipsDistribution}
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
                {ipsDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value) => [`${formatNumber(Number(value))} IPS`, "Cantidad"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Coverage ratio table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold">
              Cobertura Poblacional: Habitantes por Cama Hospitalaria
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Fuente: DANE CNPV 2018 + Proyecciones 2026 | REPS Capacidad
            Instalada. OMS recomienda 3-5 camas por 1,000 habitantes.
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
                Camas
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Hab/Cama
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Camas/1000 hab
              </th>
            </tr>
          </thead>
          <tbody>
            {coverageData.map((row) => {
              const growth = (
                ((row.projection2026 - row.population) / row.population) *
                100
              ).toFixed(1);
              const per1000 = ((row.beds / row.population) * 1000).toFixed(1);
              return (
                <tr
                  key={row.area}
                  className="border-b border-border/50 hover:bg-muted/20"
                >
                  <td className="py-2.5 px-4 font-medium text-xs">
                    {row.area}
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs">
                    {formatNumber(row.population)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs">
                    {formatNumber(row.projection2026)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-xs font-bold text-amber-600">
                      +{growth}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs font-bold">
                    {formatNumber(row.beds)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                        row.ratio > 1000
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {formatNumber(row.ratio)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        parseFloat(per1000) < 1
                          ? "text-red-600"
                          : parseFloat(per1000) < 3
                          ? "text-amber-600"
                          : "text-teal-600"
                      )}
                    >
                      {per1000}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Referencia OMS:</strong> Se recomiendan 3-5 camas por cada 1,000 habitantes.
            Medellin tiene <strong>1.0 camas/1,000 hab</strong> en hospitales principales (deficit significativo).
            Envigado tiene solo <strong>0.6 camas/1,000</strong>. La nueva sede HPTU en el corredor sur
            contribuiria a cerrar esta brecha critica.
          </p>
        </div>
      </motion.div>

      {/* Gap insight */}
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
              Brecha Critica: Solo 213 Camas de Alta Complejidad en Las Palmas
            </h4>
            <p className="text-sm text-red-700 mt-1">
              El corredor Las Palmas — que conecta a los <strong>38,415 predios estrato 6</strong> del
              Poblado con el altiplano — tiene una sola clinica de alta complejidad: <strong>Clinica CES
              con 213 camas</strong> al 82% de ocupacion. HPTU en Prado esta a <strong>23.8 minutos</strong> y
              opera al <strong>96% de ocupacion</strong> con 1,094 camas. Con una proyeccion de <strong>+6.1%
              de crecimiento poblacional</strong> al 2026 en Medellin y <strong>+17.1% en Envigado</strong>,
              la demanda seguira creciendo. Una nueva sede en Las Palmas Bajo cerraria esta brecha,
              ofreciendo alta complejidad a menos de <strong>11 minutos</strong> de la Milla de Oro.
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
