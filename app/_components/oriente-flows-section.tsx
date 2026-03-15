"use client";

import { motion } from "framer-motion";
import { Car, Clock, Route } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  trafficCorridors,
  travelTimeComparison,
} from "@/lib/demo-data/oriente-data";
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

// Grouped bar data for traffic corridors
const trafficChartData = trafficCorridors.map((c) => ({
  name: c.name.length > 25 ? c.name.slice(0, 25) + "..." : c.name,
  fullName: c.name,
  "2014": c.vehiculos2014,
  "2024": c.vehiculos2024,
  growthPct: c.growthPct,
}));

// Travel time table data
const travelTimeTableData = travelTimeComparison.destinations.map((dest, i) => {
  const fromCand = travelTimeComparison.fromCandidate[i];
  const fromHPTU = travelTimeComparison.fromHPTU[i];
  const diff = fromCand - fromHPTU;
  return {
    destination: dest,
    fromCandidate: fromCand,
    fromHPTU: fromHPTU,
    difference: diff,
    advantage:
      diff < -3
        ? "Candidato"
        : diff > 3
        ? "HPTU"
        : "Neutral",
  };
});

export function OrienteFlowsSection() {
  return (
    <SectionWrapper id="flujos-oriente">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Conectividad — Flujos Valle de Aburra → Oriente
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Tunel de Oriente: Explosion de Conectividad
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Datos de crecimiento vehicular de ANI peajes (2014-2024) y analisis
          de tiempos de viaje con Mapbox Directions API (driving-traffic).
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
            TPD Las Palmas
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">4.6M veh/ano</p>
          <p className="text-[10px] text-muted-foreground">
            ANI peajes 2024
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
            Crecimiento Las Palmas
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">+63.8%</p>
          <p className="text-[10px] text-muted-foreground">
            2014-2024, vehiculos/ano
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
            Crecimiento Guarne (Tunel)
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">+30.6%</p>
          <p className="text-[10px] text-muted-foreground">
            2014-2024, impacto tunel
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
            Autopista Med-Bogota
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">+31%</p>
          <p className="text-[10px] text-muted-foreground">
            INVIAS TPD 2014-2024
          </p>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-1 mb-8">
        {/* Traffic corridors grouped bar chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Car className="h-4 w-4 text-teal-500" />
            <h3 className="text-sm font-bold">
              Vehiculos por Corredor: 2014 vs 2024
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: ANI Peajes Colombia (2014-2024) | Vehiculos anuales por
            estacion de peaje
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={trafficChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={0}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) =>
                  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}K`
                }
              />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value, name) => [
                  `${formatNumber(Number(value))} vehiculos`,
                  name === "2014" ? "2014" : "2024",
                ]}
                labelFormatter={(label) => {
                  const item = trafficChartData.find((c) => c.name === label);
                  return item?.fullName || label;
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="2014" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={36} />
              <Bar dataKey="2024" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            {trafficCorridors.map((c) => (
              <span
                key={c.name}
                className={cn(
                  "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                  c.growthPct > 100
                    ? "bg-red-50 text-red-700 border-red-200"
                    : c.growthPct > 50
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                )}
              >
                {c.peaje}: +{c.growthPct}%
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Travel time comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold">
              Tiempos de Viaje: Access Point vs HPTU Prado
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Fuente: Mapbox Directions API (driving-traffic). Verde = candidato
            gana (&gt;3 min mejor). Rojo = HPTU gana. Gris = neutral (±3 min).
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Destino
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Desde Access Point (min)
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Desde HPTU (min)
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Diferencia
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                Ventaja
              </th>
            </tr>
          </thead>
          <tbody>
            {travelTimeTableData.map((row) => {
              const isCandWin = row.advantage === "Candidato";
              const isHPTUWin = row.advantage === "HPTU";
              return (
                <tr
                  key={row.destination}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/20",
                    isCandWin && "font-semibold"
                  )}
                >
                  <td className="py-2.5 px-4 font-medium text-xs">
                    {row.destination}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                        isCandWin
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : isHPTUWin
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      )}
                    >
                      {row.fromCandidate.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                        isHPTUWin
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : isCandWin
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      )}
                    >
                      {row.fromHPTU.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        isCandWin
                          ? "text-teal-600"
                          : isHPTUWin
                          ? "text-red-600"
                          : "text-gray-500"
                      )}
                    >
                      {row.difference > 0
                        ? `+${row.difference.toFixed(1)}`
                        : row.difference.toFixed(1)}{" "}
                      min
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                        isCandWin
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : isHPTUWin
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      )}
                    >
                      {row.advantage}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Lectura:</strong> Access Point tiene ventaja
            significativa hacia el corredor sur-oriente: El Retiro (-17.8 min),
            La Ceja (-17.8 min), Aeropuerto SKRG (-14.4 min). HPTU mantiene
            ventaja para Guarne (-15.9 min mejor desde Prado).
          </p>
        </div>
      </motion.div>

      {/* Insight box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-amber-300 bg-amber-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Route className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-800">
              Access Point Estrategico: Corredor Sur-Oriente
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              El sitio candidato captura el corredor sur-oriente con ventajas
              decisivas: <strong>El Retiro (-17.8 min)</strong>,{" "}
              <strong>La Ceja (-17.8 min)</strong> y{" "}
              <strong>Aeropuerto SKRG (-14.4 min)</strong> respecto a HPTU
              Prado. Mientras el HPTU actual es superior para Guarne y el
              oriente norte (via Tunel, -15.9 min), el candidato funciona como
              un <strong>&quot;puente&quot;</strong> para el creciente corredor
              sur — donde se concentra el mayor ratio contributivo/subsidiado
              (El Retiro 3.47, La Ceja 4.79) y el mayor crecimiento de
              vehiculos por el peaje Las Palmas (+63.8%). Esta
              complementariedad convierte al candidato en la puerta de
              entrada natural del Oriente hacia servicios de alta complejidad.
            </p>
            <p className="text-xs text-amber-600 mt-2 italic">
              Fuentes: ANI Peajes Colombia 2014-2024, Mapbox Directions API
              (driving-traffic), SISBEN IV afiliaciones
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
