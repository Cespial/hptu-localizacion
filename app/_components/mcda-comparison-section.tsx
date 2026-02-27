"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { candidateZones } from "@/lib/demo-data/candidate-zones";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

// Prepare radar data
const radarData = [
  { metric: "Accesibilidad", fullMark: 100 },
  { metric: "Demanda", fullMark: 100 },
  { metric: "Competencia", fullMark: 100 },
  { metric: "Valor Inmob.", fullMark: 100 },
].map((item) => {
  const result: Record<string, string | number> = { metric: item.metric };
  candidateZones.forEach((zone) => {
    const key =
      item.metric === "Accesibilidad"
        ? "accesibilidad"
        : item.metric === "Demanda"
        ? "demanda"
        : item.metric === "Competencia"
        ? "competencia"
        : "valorInmobiliario";
    result[zone.name] = zone.scores[key as keyof typeof zone.scores];
  });
  return result;
});

// Prepare bar chart data for overall scores
const barData = candidateZones.map((zone) => ({
  name: zone.name.replace("Las Palmas ", "LP ").replace("Nuevo Poblado - ", "N.P. "),
  fullName: zone.name,
  score: zone.score,
  color: zone.color,
  driveTime: zone.driveTimeToHPTU,
}));

export function MCDAComparisonSection() {
  const leader = candidateZones[0]; // palmas-bajo with score 88

  return (
    <SectionWrapper id="comparativa-mcda">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Sintesis - Comparativa MCDA
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Scoring Multicriterio: 5 Zonas Candidatas
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Evaluacion comparativa usando Score = (A&times;0.35) + (D&times;0.30) +
          (C&times;0.20) + (V&times;0.15) con datos reales de Catastro, REPS,
          Mapbox Matrix y POT.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <h3 className="text-sm font-bold mb-1">Perfil Multicriterio por Zona</h3>
          <p className="text-[10px] text-muted-foreground mb-4">
            Ejes: Accesibilidad (35%), Demanda (30%), Competencia (20%), Valor Inmobiliario (15%)
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9 }}
                tickCount={5}
              />
              {candidateZones.map((zone) => (
                <Radar
                  key={zone.id}
                  name={zone.name}
                  dataKey={zone.name}
                  stroke={zone.color}
                  fill={zone.color}
                  fillOpacity={zone.id === "palmas-bajo" ? 0.25 : 0.05}
                  strokeWidth={zone.id === "palmas-bajo" ? 2.5 : 1}
                />
              ))}
              <Legend
                wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart - Overall Scores */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <h3 className="text-sm font-bold mb-1">Score Global MCDA (0-100)</h3>
          <p className="text-[10px] text-muted-foreground mb-4">
            Score ponderado final con datos de 14 fuentes primarias
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={85}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => [`${value}/100`, "Score MCDA"]}
                labelFormatter={(label) => {
                  const zone = barData.find((b) => b.name === label);
                  return zone?.fullName || label;
                }}
                contentStyle={{ fontSize: "12px" }}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={28}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={index === 0 ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-border bg-muted/30">
              <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider">Zona</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider">Score</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider">Accesib.</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider">Demanda</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider">Compet.</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider">Valor</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Tiempo HPTU</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Avaluo Avg</th>
              <th className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">POT</th>
            </tr>
          </thead>
          <tbody>
            {candidateZones.map((zone, i) => (
              <tr
                key={zone.id}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/30 transition-colors",
                  i === 0 && "bg-teal-50/40 font-medium"
                )}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div>
                      <div className="font-medium text-xs">{zone.name}</div>
                      <div className="text-[10px] text-muted-foreground hidden sm:block">
                        {zone.subtitle}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold text-white",
                      zone.score >= 80
                        ? "bg-teal-500"
                        : zone.score >= 70
                        ? "bg-blue-500"
                        : zone.score >= 60
                        ? "bg-amber-500"
                        : "bg-red-400"
                    )}
                  >
                    {zone.score}
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-xs font-semibold">{zone.scores.accesibilidad}</td>
                <td className="py-3 px-3 text-center text-xs font-semibold">{zone.scores.demanda}</td>
                <td className="py-3 px-3 text-center text-xs font-semibold">{zone.scores.competencia}</td>
                <td className="py-3 px-3 text-center text-xs font-semibold">{zone.scores.valorInmobiliario}</td>
                <td className="py-3 px-3 text-center hidden sm:table-cell">
                  <span className={cn(
                    "text-xs font-bold",
                    zone.driveTimeToHPTU <= 25 ? "text-teal-600" : zone.driveTimeToHPTU <= 35 ? "text-amber-600" : "text-red-600"
                  )}>
                    {zone.driveTimeToHPTU} min
                  </span>
                </td>
                <td className="py-3 px-3 text-center hidden md:table-cell text-xs">
                  {formatPrice(zone.avgM2Price)}
                </td>
                <td className="py-3 px-3 text-center hidden lg:table-cell text-[10px] text-muted-foreground max-w-[150px]">
                  {zone.potViability.split(" - ")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Winner highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-teal-300 bg-teal-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-teal-800">
              Recomendacion: {leader.name} (Score {leader.score}/100)
            </h4>
            <p className="text-sm text-teal-700 mt-1">
              La zona <strong>{leader.subtitle}</strong> lidera en el ranking MCDA con{" "}
              <strong>{leader.score}/100</strong>, superando a {candidateZones[1].name} ({candidateZones[1].score}) por{" "}
              <strong>{leader.score - candidateZones[1].score} puntos</strong>.
              Destaca con <strong>Accesibilidad {leader.scores.accesibilidad}/100</strong> (Mapbox: {leader.driveTimeToHPTU} min a HPTU),{" "}
              <strong>Demanda {leader.scores.demanda}/100</strong> (38,415 predios E6 en comuna 14),
              y viabilidad POT de <strong>9/9</strong> (CL_D=2.38, 68,020 m2 de suelo potencial).
              La ventaja competitiva radica en que es la unica zona con score &gt;80 en las 4 dimensiones evaluadas.
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
