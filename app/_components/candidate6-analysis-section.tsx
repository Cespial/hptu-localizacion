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
  accessPoint: travelTimeComparison.fromCandidate[i],
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
    <SectionWrapper id="candidato-access-point">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Zona Candidata #6 — Analisis Integral
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Access Point, Km 7 Via Las Palmas: Nodo Puente al Oriente
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Analisis para Access Point (Retorno 5, Acierto Inmobiliario) en Km 7 de Via Las Palmas
          usando Mapbox Matrix API, REPS, Catastro Medellin, POT Bateria de Indicadores y Google Places.
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
            Access Point
          </span>
        </div>
        <p className="font-mono text-lg font-bold">
          6.217662&deg;N, -75.554932&deg;W
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Km 7 Via Las Palmas, Retorno 5 (Acierto Inmobiliario) — Nodo de transicion Valle de Aburra y Oriente Antioqueno
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
            Tiempos de Viaje: Access Point vs HPTU Actual
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
                  name === "accessPoint" ? "Access Point" : "HPTU Actual";
                return [`${value} min`, label];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
              formatter={(value) =>
                value === "accessPoint" ? "Access Point (Km 7 Las Palmas)" : "HPTU Actual (Robledo)"
              }
            />
            <Bar
              dataKey="accessPoint"
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
            <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> Access
            Point gana
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

      {/* MCDA Score Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <h3 className="text-sm font-bold mb-3">
          Score MCDA: 78/100 (#2 de 6 zonas) — 5 Dimensiones
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Accesibilidad", score: 85, weight: "30%", color: "text-teal-600" },
            { label: "Demanda", score: 91, weight: "25%", color: "text-blue-600" },
            { label: "Competencia", score: 65, weight: "20%", color: "text-amber-600" },
            { label: "Visibilidad", score: 78, weight: "15%", color: "text-rose-600" },
            { label: "Esperas Prod.", score: 55, weight: "10%", color: "text-purple-600" },
          ].map((dim) => (
            <div key={dim.label} className="rounded-lg border p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {dim.label} ({dim.weight})
              </p>
              <p className={cn("text-2xl font-bold mt-1", dim.color)}>
                {dim.score}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">
          Score = (85&times;0.30) + (91&times;0.25) + (65&times;0.20) + (78&times;0.15) + (55&times;0.10) = 25.50 + 22.75 + 13.00 + 11.70 + 5.50 = <strong>78.45 &asymp; 78</strong>.
          Supera a Las Palmas Medio (76), Envigado (74), Nuevo Poblado (70) y Las Palmas Alto (50).
          Solo detras de Las Palmas Bajo (88) por mayor centralidad local en El Poblado.
          Visibilidad ajustada a 78 (42K veh/dia genera brand awareness, pero trafico en transito no equivale a demanda medica).
          Esperas Productivas ajustadas a 55 (hoy no existe ecosistema retail en Km 7; score refleja potencial, no estado actual).
        </p>
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
              Posicion Dual: Sirve Valle de Aburra + Oriente Sur (Score 78/100)
            </h4>
            <p className="text-sm text-rose-700 mt-1">
              Con <strong>MCDA 78/100</strong>, Access Point se posiciona como
              la #2 zona candidata. Captura demanda que HPTU actual no puede atender
              eficientemente: <strong>El Retiro</strong> (sin hospital, -17.8
              min vs HPTU), <strong>La Ceja</strong> (-17.8 min),{" "}
              <strong>Aeropuerto SKRG</strong> (-14.3 min para turismo medico).
              El factor que impide un score superior es la{" "}
              <strong>competencia local densa</strong> (45 facilities en 5 km, score C=65)
              y <strong>Torre Oviedo</strong> (2.65 km, competidor directo desde jun 2025).
              El valor estrategico radica en la{" "}
              <strong>funcion puente</strong> y el nicho ambulatorio premium — condicionado a factibilidad del edificio.
              Astorga y Manila tienen solo{" "}
              <strong>14% de densidad usada</strong> — desarrollo masivo en
              curso implica crecimiento sostenido de demanda futura.
            </p>
            <p className="text-xs text-rose-600 mt-2 italic">
              Fuentes: Mapbox Matrix API, Google Places API, Catastro (bp59-rj8r),
              POT (3ciz-tpgr), REPS (b4dp-ximh), OSM Overpass, ANI (8yi9-t44c)
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
