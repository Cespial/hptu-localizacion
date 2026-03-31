"use client";

import { motion } from "framer-motion";
import { Search, Footprints, Car, Lightbulb } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { palmasBajoZoom } from "@/lib/demo-data/palmas-bajo-zoom";
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

/* ── Chart data: POI comparison ── */
const comparisonData = [
  {
    category: "Gastronomia",
    palmasBajo: palmasBajoZoom.poisComparison.palmasBajo.gastronomia,
    millaDeOro: palmasBajoZoom.poisComparison.millaDeOro.gastronomia,
  },
  {
    category: "Financiero",
    palmasBajo: palmasBajoZoom.poisComparison.palmasBajo.financiero,
    millaDeOro: palmasBajoZoom.poisComparison.millaDeOro.financiero,
  },
  {
    category: "Farmacias",
    palmasBajo: palmasBajoZoom.poisComparison.palmasBajo.farmacias,
    millaDeOro: palmasBajoZoom.poisComparison.millaDeOro.farmacias,
  },
  {
    category: "Retail",
    palmasBajo: palmasBajoZoom.poisComparison.palmasBajo.retail,
    millaDeOro: palmasBajoZoom.poisComparison.millaDeOro.retail,
  },
  {
    category: "Bienestar",
    palmasBajo: palmasBajoZoom.poisComparison.palmasBajo.bienestar,
    millaDeOro: palmasBajoZoom.poisComparison.millaDeOro.bienestar,
  },
];

export function PalmasBajoZoomSection() {
  return (
    <SectionWrapper id="zoom-palmas-bajo">
      {/* ── Header ── */}
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Google Places API — 281 POIs en 500m
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Ultra-Zoom: Palmas Bajo
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Analisis de densidad de servicios, caminabilidad y tiempos de viaje
          para la zona #1 del MCDA (Score 88/100).
        </p>
      </div>

      {/* ── Two-column: POI comparison chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Search className="h-4 w-4 text-teal-500" />
          <h3 className="text-sm font-bold">
            Palmas Bajo vs Milla de Oro: POIs por Categoria
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Fuente: Google Places API, radio 500m. Palmas Bajo: {palmasBajoZoom.poisComparison.palmasBajo.totalPOIs} POIs | Milla de Oro: {palmasBajoZoom.poisComparison.millaDeOro.totalPOIs} POIs.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              label={{
                value: "POIs",
                position: "insideBottomRight",
                offset: -5,
                style: { fontSize: 10 },
              }}
            />
            <YAxis
              dataKey="category"
              type="category"
              width={90}
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{ fontSize: "11px" }}
              formatter={(value, name) => {
                const label =
                  name === "palmasBajo" ? "Palmas Bajo" : "Milla de Oro";
                return [`${value} POIs`, label];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
              formatter={(value) =>
                value === "palmasBajo"
                  ? "Palmas Bajo (281)"
                  : "Milla de Oro (396)"
              }
            />
            <Bar
              dataKey="palmasBajo"
              fill="#0d9488"
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
            <Bar
              dataKey="millaDeOro"
              fill="#2563eb"
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span>
            Palmas Bajo lidera en <strong>bienestar</strong> (55 vs 54) — MdO lidera en financiero (40 vs 13) y farmacias (23 vs 11)
          </span>
        </div>
      </motion.div>

      {/* ── Two-column: Walking + Driving ── */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Walking distances */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card overflow-x-auto"
        >
          <div className="p-4 sm:p-6 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Footprints className="h-4 w-4 text-teal-500" />
              <h3 className="text-sm font-bold">
                Distancias Caminando
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Fuente: Google Directions API (walking). {palmasBajoZoom.streetDensity}
            </p>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-y border-border bg-muted/30">
                <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                  Destino
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                  Minutos
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                  Km
                </th>
              </tr>
            </thead>
            <tbody>
              {palmasBajoZoom.walkingDistances.map((row) => (
                <tr
                  key={row.destination}
                  className="border-b border-border/50 hover:bg-muted/20"
                >
                  <td className="py-2.5 px-4 font-medium text-xs">
                    {row.destination}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        row.minutes < 15
                          ? "text-teal-600"
                          : "text-muted-foreground"
                      )}
                    >
                      {row.minutes} min
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs text-muted-foreground">
                    {row.km.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
            <p className="text-[10px] text-muted-foreground">
              <strong className="text-teal-600">Verde</strong> = destinos a menos de 15 min caminando.
            </p>
          </div>
        </motion.div>

        {/* Driving times */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card overflow-x-auto"
        >
          <div className="p-4 sm:p-6 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Car className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold">
                Tiempos en Carro
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Fuente: Google Directions API (driving, traffic). 10 destinos clave.
            </p>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-y border-border bg-muted/30">
                <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                  Destino
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                  Minutos
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                  Km
                </th>
              </tr>
            </thead>
            <tbody>
              {palmasBajoZoom.drivingTimes.map((row) => (
                <tr
                  key={row.destination}
                  className="border-b border-border/50 hover:bg-muted/20"
                >
                  <td className="py-2.5 px-4 font-medium text-xs">
                    {row.destination}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        row.minutes <= 10
                          ? "text-teal-600"
                          : row.minutes <= 25
                          ? "text-blue-600"
                          : "text-muted-foreground"
                      )}
                    >
                      {row.minutes} min
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs text-muted-foreground">
                    {row.km.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
            <p className="text-[10px] text-muted-foreground">
              <strong className="text-teal-600">Verde</strong> = &le;10 min |
              <strong className="text-blue-600"> Azul</strong> = &le;25 min
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Key Findings ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-teal-300 bg-teal-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-teal-800">
              Hallazgos Clave: Palmas Bajo
            </h4>
            <ul className="mt-3 space-y-2">
              {palmasBajoZoom.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-teal-400 shrink-0" />
                  <span className="text-sm text-teal-700">{finding}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-teal-600 mt-3 italic">
              Fuentes: Google Places API, Google Directions API (marzo 2026).
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
