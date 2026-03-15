"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Building2, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  buildingHeights,
  travelTimeComparison,
} from "@/lib/demo-data/oriente-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// Build travel time bar chart data
const travelData = travelTimeComparison.destinations.map((dest, i) => ({
  destination: dest,
  candidato6: travelTimeComparison.fromCandidate[i],
  hptuActual: travelTimeComparison.fromHPTU[i],
  diff: +(
    travelTimeComparison.fromCandidate[i] - travelTimeComparison.fromHPTU[i]
  ).toFixed(1),
}));

const potentialColor: Record<string, { bg: string; text: string }> = {
  masivo: { bg: "bg-green-100", text: "text-green-700" },
  alto: { bg: "bg-blue-100", text: "text-blue-700" },
  medio: { bg: "bg-amber-100", text: "text-amber-700" },
  saturado: { bg: "bg-red-100", text: "text-red-700" },
};

const potentialLabel: Record<string, string> = {
  masivo: "Masivo",
  alto: "Alto",
  medio: "Medio",
  saturado: "Saturado",
};

export function Candidate6AnalysisSection() {
  return (
    <SectionWrapper id="candidato-cra22">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Zona Candidata #6 — Analisis Integral
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Cra 22, El Poblado: Nodo Puente al Oriente
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Analisis para ubicacion 6.217662, -75.554932 usando Mapbox Matrix API,
          REPS, Catastro Medellin, POT Bateria de Indicadores y Google Places.
        </p>
      </div>

      {/* Hero stat */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-5 sm:p-6 text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="h-5 w-5 text-rose-600" />
          <span className="text-sm font-bold text-rose-600">
            Candidato #6
          </span>
        </div>
        <p className="font-mono text-lg font-bold">
          6.217662&deg;N, -75.554932&deg;W
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Carrera 22, El Poblado — Zona estrategica entre Valle de Aburra y Oriente Antioqueno sur
        </p>
      </motion.div>

      {/* 6 KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Drive a Rionegro
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">58.8 min</p>
          <p className="text-[10px] text-muted-foreground">
            Mapbox Matrix API
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
            Drive a Aeropuerto
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">51.3 min</p>
          <p className="text-[10px] text-muted-foreground">
            SKRG Jose Maria Cordova
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
            Drive a El Retiro
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">44.0 min</p>
          <p className="text-[10px] text-muted-foreground">
            gana -17.8 min vs HPTU
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
            Competidores 5km
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">40+</p>
          <p className="text-[10px] text-muted-foreground">
            Google Places API
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            POT Max Pisos
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">19.1</p>
          <p className="text-[10px] text-muted-foreground">
            San Lucas (POT 3ciz-tpgr)
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Densidad Usada
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">45.8%</p>
          <p className="text-[10px] text-muted-foreground">
            margen de crecimiento
          </p>
        </motion.div>
      </div>

      {/* Travel time bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-rose-500" />
          <h3 className="text-sm font-bold">
            Tiempos de Viaje: Candidato #6 vs HPTU Actual
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Fuente: Mapbox Matrix API (driving-traffic). Valores en minutos. Verde = candidato gana.
        </p>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={travelData}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              label={{
                value: "minutos",
                position: "insideBottomRight",
                offset: -5,
                style: { fontSize: 10 },
              }}
            />
            <YAxis
              dataKey="destination"
              type="category"
              width={110}
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{ fontSize: "11px" }}
              formatter={(value, name) => {
                const label =
                  name === "candidato6" ? "Candidato #6" : "HPTU Actual";
                return [`${value} min`, label];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
              formatter={(value) =>
                value === "candidato6" ? "Candidato #6 (Cra 22)" : "HPTU Actual (Robledo)"
              }
            />
            <Bar
              dataKey="candidato6"
              fill="#0d9488"
              radius={[0, 4, 4, 0]}
              barSize={12}
            />
            <Bar
              dataKey="hptuActual"
              fill="#64748b"
              radius={[0, 4, 4, 0]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> Candidato
            #6 gana
          </span>
          <span>
            El Retiro (-17.8 min), La Ceja (-17.8 min), Aeropuerto SKRG (-14.3
            min)
          </span>
        </div>
      </motion.div>

      {/* Building heights table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">
              Alturas de Edificaciones y Potencial POT
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Fuente: Catastro Medellin (bp59-rj8r) + POT Bateria Indicadores
            (3ciz-tpgr). Densidad Usada = pisos promedio / pisos POT max.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Barrio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Pisos Promedio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Max POT
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                % Densidad Usada
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Potencial
              </th>
            </tr>
          </thead>
          <tbody>
            {buildingHeights.map((row) => {
              const colors = potentialColor[row.potentialLevel];
              return (
                <tr
                  key={row.barrio}
                  className="border-b border-border/50 hover:bg-muted/20"
                >
                  <td className="py-2.5 px-4 font-medium text-xs">
                    {row.barrio}
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs font-bold">
                    {row.avgFloors}
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs font-bold">
                    {row.maxPotFloors}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        row.densityUsedPct < 30
                          ? "text-green-600"
                          : row.densityUsedPct < 50
                          ? "text-blue-600"
                          : row.densityUsedPct < 70
                          ? "text-amber-600"
                          : "text-red-600"
                      )}
                    >
                      {row.densityUsedPct}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                        colors.bg,
                        colors.text
                      )}
                    >
                      {potentialLabel[row.potentialLevel]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Nota:</strong> Astorga y Manila tienen solo{" "}
            <strong>14-15% de densidad usada</strong> con POT que permite 14-15
            pisos — desarrollo masivo futuro = crecimiento de demanda.
          </p>
        </div>
      </motion.div>

      {/* Insight box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-rose-300 bg-rose-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-rose-800">
              Posicion Dual: Sirve Valle de Aburra + Oriente Sur
            </h4>
            <p className="text-sm text-rose-700 mt-1">
              Esta ubicacion captura demanda que HPTU actual no puede atender
              eficientemente: <strong>El Retiro</strong> (sin hospital, -17.8
              min vs HPTU), <strong>La Ceja</strong> (-17.8 min),{" "}
              <strong>Aeropuerto SKRG</strong> (-14.3 min para turismo medico).
              Si bien la zona inmediata de El Poblado es competida (40+
              facilities en 5 km), el valor estrategico radica en la{" "}
              <strong>funcion puente</strong>. Astorga y Manila tienen solo{" "}
              <strong>14% de densidad usada</strong> — desarrollo masivo en
              curso implica crecimiento sostenido de demanda futura.
            </p>
            <p className="text-xs text-rose-600 mt-2 italic">
              Fuentes: Mapbox Matrix API, Google Places API, Catastro (bp59-rj8r),
              POT (3ciz-tpgr), REPS (b4dp-ximh)
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
