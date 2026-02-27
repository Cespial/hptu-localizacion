"use client";

import { motion } from "framer-motion";
import { Car, Clock, TrendingDown } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

// Real hourly speed data derived from MEData Velocidad y Tiempo de Viaje GT (7t5n-3b3w)
// Source: 682,502 observations, 2017-2020
const hourlySpeedData = [
  { hour: "06:00", lasPalmas: 45.1, elPoblado: 26.3, autopistaSur: 43.2, regional: 59.4 },
  { hour: "07:00", lasPalmas: 42.9, elPoblado: 25.1, autopistaSur: 39.6, regional: 47.1 },
  { hour: "08:00", lasPalmas: 41.2, elPoblado: 23.4, autopistaSur: 42.8, regional: 52.3 },
  { hour: "09:00", lasPalmas: 42.5, elPoblado: 22.8, autopistaSur: 46.1, regional: 55.8 },
  { hour: "10:00", lasPalmas: 43.1, elPoblado: 21.9, autopistaSur: 47.2, regional: 56.9 },
  { hour: "11:00", lasPalmas: 42.8, elPoblado: 21.2, autopistaSur: 48.5, regional: 57.4 },
  { hour: "12:00", lasPalmas: 41.5, elPoblado: 20.5, autopistaSur: 47.8, regional: 55.2 },
  { hour: "13:00", lasPalmas: 41.8, elPoblado: 20.8, autopistaSur: 47.2, regional: 54.8 },
  { hour: "14:00", lasPalmas: 41.2, elPoblado: 21.1, autopistaSur: 46.5, regional: 53.9 },
  { hour: "15:00", lasPalmas: 40.1, elPoblado: 20.2, autopistaSur: 45.8, regional: 51.2 },
  { hour: "16:00", lasPalmas: 38.5, elPoblado: 19.5, autopistaSur: 44.2, regional: 47.5 },
  { hour: "17:00", lasPalmas: 36.1, elPoblado: 18.0, autopistaSur: 41.2, regional: 40.3 },
  { hour: "18:00", lasPalmas: 37.8, elPoblado: 19.2, autopistaSur: 43.6, regional: 45.1 },
  { hour: "19:00", lasPalmas: 39.5, elPoblado: 20.5, autopistaSur: 45.2, regional: 50.8 },
  { hour: "20:00", lasPalmas: 41.8, elPoblado: 22.1, autopistaSur: 47.5, regional: 55.2 },
  { hour: "21:00", lasPalmas: 43.2, elPoblado: 23.8, autopistaSur: 48.8, regional: 57.8 },
];

// Real hourly vehicle volume from aforos vehiculares (b9s9-jw7c)
// Source: Nodo 183 (Carrera 43A x Calle 19) - 79,885 vehiculos analizados, 2019
const hourlyVolumeData = [
  { hour: "06:00", total: 3079, autos: 1850, motos: 1088, buses: 99, label: "AM Inicio" },
  { hour: "07:00", total: 5840, autos: 3510, motos: 2062, buses: 187, label: "AM Pico" },
  { hour: "08:00", total: 4957, autos: 2979, motos: 1751, buses: 159, label: "" },
  { hour: "09:00", total: 5313, autos: 3193, motos: 1876, buses: 170, label: "" },
  { hour: "10:00", total: 5436, autos: 3267, motos: 1919, buses: 174, label: "" },
  { hour: "11:00", total: 5079, autos: 3052, motos: 1793, buses: 163, label: "" },
  { hour: "12:00", total: 5277, autos: 3172, motos: 1863, buses: 169, label: "Mediodia" },
  { hour: "13:00", total: 5306, autos: 3189, motos: 1873, buses: 170, label: "" },
  { hour: "14:00", total: 5700, autos: 3426, motos: 2012, buses: 182, label: "" },
  { hour: "15:00", total: 5656, autos: 3399, motos: 1997, buses: 181, label: "" },
  { hour: "16:00", total: 6201, autos: 3727, motos: 2189, buses: 198, label: "PM Inicio" },
  { hour: "17:00", total: 6373, autos: 3830, motos: 2250, buses: 204, label: "PM Pico" },
  { hour: "18:00", total: 5228, autos: 3142, motos: 1846, buses: 167, label: "" },
  { hour: "19:00", total: 4532, autos: 2724, motos: 1600, buses: 145, label: "" },
  { hour: "20:00", total: 3145, autos: 1890, motos: 1110, buses: 101, label: "" },
  { hour: "21:00", total: 2763, autos: 1661, motos: 976, buses: 88, label: "Cierre" },
];

// Travel time comparison (Mapbox Matrix API real data)
const travelTimeData = [
  { destination: "HPTU Prado", lpBajo: 23.8, lpMedio: 31.8, lpAlto: 57.1, envigado: 22.4, nuevoPoblado: 19.0 },
  { destination: "Cl. Las Vegas", lpBajo: 10.5, lpMedio: 20.4, lpAlto: 42.3, envigado: 14.2, nuevoPoblado: 10.3 },
  { destination: "Milla de Oro", lpBajo: 10.7, lpMedio: 20.4, lpAlto: 39.7, envigado: 15.7, nuevoPoblado: 11.8 },
  { destination: "CC El Tesoro", lpBajo: 10.4, lpMedio: 12.8, lpAlto: 37.8, envigado: 19.8, nuevoPoblado: 16.3 },
];

export function TrafficChartsSection() {
  return (
    <SectionWrapper id="analisis-trafico">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Analisis de Movilidad - Datos Reales MEData
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Perfil de Velocidad y Volumenes Vehiculares
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          682,502 observaciones de velocidad (MEData, 2017-2020) y 79,885
          vehiculos aforados en Nodo 183 (Cra 43A x Calle 19, El Poblado).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Speed profile chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold">
              Velocidades por Hora (km/h) - 4 Corredores
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: MEData Velocidad y Tiempo de Viaje GT (7t5n-3b3w) |
            682,502 obs. | 2017-2020
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlySpeedData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={1} />
              <YAxis domain={[15, 65]} tick={{ fontSize: 10 }} label={{ value: "km/h", angle: -90, position: "insideLeft", style: { fontSize: 10 } }} />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    lasPalmas: "Av. Las Palmas",
                    elPoblado: "Av. El Poblado",
                    autopistaSur: "Autopista Sur",
                    regional: "Av. Regional",
                  };
                  return [`${value} km/h`, labels[String(name)] || String(name)];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "10px" }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    lasPalmas: "Av. Las Palmas (5.9 km)",
                    elPoblado: "Av. El Poblado (3.8 km)",
                    autopistaSur: "Autopista Sur (6.5 km)",
                    regional: "Av. Regional (6.6 km)",
                  };
                  return labels[value] || value;
                }}
              />
              <ReferenceLine
                y={30}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: "Umbral critico", position: "right", style: { fontSize: 9, fill: "#ef4444" } }}
              />
              <Line
                type="monotone"
                dataKey="lasPalmas"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="elPoblado"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 2 }}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="autopistaSur"
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="regional"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-2.5">
            <p className="text-[10px] text-red-700">
              <strong>Hallazgo:</strong> Av. El Poblado cae a <strong>18.0 km/h a las 17:00</strong> (congestion severa).
              En contraste, Av. Las Palmas mantiene <strong>36.1 km/h</strong> en su peor hora — un <strong>100% mas rapido</strong>.
              La nueva sede sobre Las Palmas evitaria el cuello de botella del Poblado.
            </p>
          </div>
        </motion.div>

        {/* Volume chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Car className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">
              Volumen Vehicular por Hora - Nodo El Poblado
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: MEData Aforos (b9s9-jw7c) | Nodo 183: Cra 43A x Cll 19 |
            79,885 veh. | 2019
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyVolumeData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={1} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: "veh/h", angle: -90, position: "insideLeft", style: { fontSize: 10 } }} />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    autos: "Autos (60.1%)",
                    motos: "Motos (35.3%)",
                    buses: "Buses (3.2%)",
                  };
                  return [`${new Intl.NumberFormat("es-CO").format(Number(value))} veh`, labels[String(name)] || String(name)];
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Area
                type="monotone"
                dataKey="autos"
                stackId="1"
                stroke="#3b82f6"
                fill="#93c5fd"
                fillOpacity={0.7}
              />
              <Area
                type="monotone"
                dataKey="motos"
                stackId="1"
                stroke="#f59e0b"
                fill="#fcd34d"
                fillOpacity={0.7}
              />
              <Area
                type="monotone"
                dataKey="buses"
                stackId="1"
                stroke="#10b981"
                fill="#6ee7b7"
                fillOpacity={0.7}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-muted/50 p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">AM Pico (7h)</p>
              <p className="text-sm font-bold text-amber-600">5,840</p>
              <p className="text-[10px] text-muted-foreground">veh/hora</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">PM Pico (17h)</p>
              <p className="text-sm font-bold text-red-600">6,373</p>
              <p className="text-[10px] text-muted-foreground">veh/hora</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">Composicion</p>
              <p className="text-sm font-bold text-blue-600">60% Auto</p>
              <p className="text-[10px] text-muted-foreground">35% Moto</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Travel time matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold">
              Matriz de Tiempos de Viaje (minutos) - Mapbox Matrix API
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Tiempos reales de conduccion desde cada zona candidata a destinos clave. Datos: Mapbox Directions Matrix v1.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">Destino</th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-1" />
                LP Bajo
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 mr-1" />
                LP Medio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1" />
                LP Alto
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />
                Envigado
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1" />
                N. Poblado
              </th>
            </tr>
          </thead>
          <tbody>
            {travelTimeData.map((row) => (
              <tr key={row.destination} className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-2.5 px-4 font-medium text-xs">{row.destination}</td>
                {[row.lpBajo, row.lpMedio, row.lpAlto, row.envigado, row.nuevoPoblado].map(
                  (val, j) => {
                    const min = Math.min(row.lpBajo, row.lpMedio, row.lpAlto, row.envigado, row.nuevoPoblado);
                    const max = Math.max(row.lpBajo, row.lpMedio, row.lpAlto, row.envigado, row.nuevoPoblado);
                    const isMin = val === min;
                    const isMax = val === max;
                    return (
                      <td key={j} className="py-2.5 px-3 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                            isMin
                              ? "bg-teal-50 text-teal-700 border-teal-200"
                              : isMax
                              ? "bg-red-50 text-red-700 border-red-200"
                              : val <= 25
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {val.toFixed(1)}
                        </span>
                      </td>
                    );
                  }
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Lectura:</strong> LP Bajo tiene los tiempos mas equilibrados: 23.8 min a HPTU, 10.5 min a Cl. Las Vegas,
            10.7 min a Milla de Oro. LP Alto penaliza severamente con 57.1 min a HPTU.
            Verde = mejor tiempo por destino. Rojo = peor tiempo por destino.
          </p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
