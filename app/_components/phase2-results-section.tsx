"use client";

import { motion } from "framer-motion";
import { Car, Hospital, AlertTriangle, Clock, ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { trafficFlows, healthNodes } from "@/lib/demo-data/demand-gradient";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

export function Phase2ResultsSection() {
  return (
    <SectionWrapper id="flujos-nodos">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">Fase 2 - Flujos y Nodos (Datos Reales)</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Velocidades Viales y Red de Salud
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Datos reales de MEData Velocidad y Tiempo de Viaje GT (682,502 observaciones, 2017-2020),
          Aforos Vehiculares (74,900 registros) y REPS Prestadores de Salud (1,536 IPS Valle de Aburra).
        </p>
      </div>

      {/* Traffic Flows */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Car className="h-5 w-5 text-blue-600" />
          <h3 className="font-serif text-xl font-bold">Velocidades por Corredor Vial</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Fuente: MEData Velocidad y Tiempo de Viaje GT (dataset 7t5n-3b3w) | 682,502 observaciones | 2017-2020
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Corredor</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Km</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Avg km/h</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">AM km/h</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">PM km/h</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">PM min</th>
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Peor Hora</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Obs.</th>
              </tr>
            </thead>
            <tbody>
              {trafficFlows.map((flow, i) => (
                <motion.tr
                  key={flow.corridorId}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/30 transition-colors",
                    flow.corridor === "Avenida Las Palmas" && "bg-teal-50/30 font-medium"
                  )}
                >
                  <td className="py-3 px-3">
                    <div className="font-medium">{flow.corridor}</div>
                    <div className="text-[10px] text-muted-foreground hidden sm:block">{flow.direction}</div>
                  </td>
                  <td className="py-3 px-3 text-center">{flow.lengthKm}</td>
                  <td className="py-3 px-3 text-center font-semibold">{flow.avgSpeedKmh.toFixed(1)}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                      {flow.amSpeedKmh.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                      flow.pmSpeedKmh < 25 ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"
                    )}>
                      {flow.pmSpeedKmh.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center hidden sm:table-cell">{flow.pmTravelTimeMin.toFixed(1)}</td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-red-600">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      {flow.worstHour}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center hidden lg:table-cell text-muted-foreground text-xs">
                    {formatNumber(flow.totalObservations)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Nodes */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Hospital className="h-5 w-5 text-red-600" />
          <h3 className="font-serif text-xl font-bold">Nodos de Salud: Capacidad y Brechas</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Fuente: REPS Prestadores (b4dp-ximh) | Capacidad Instalada (s2ru-bqt6) | ESE Antioquia con GPS (pi36-fdpk) | 1,536 IPS en Valle de Aburra
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {healthNodes.map((node, i) => (
            <motion.div
              key={node.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold">{node.name}</h4>
                  <p className="text-xs text-muted-foreground">{node.type}</p>
                  <p className="text-[10px] text-muted-foreground">{node.municipality}</p>
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full shrink-0",
                  parseInt(node.occupancy) >= 90 ? "bg-red-100 text-red-700" :
                  parseInt(node.occupancy) >= 80 ? "bg-amber-100 text-amber-700" :
                  "bg-green-100 text-green-700"
                )}>
                  {node.occupancy}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Camas (REPS)</p>
                  <p className="text-sm font-bold">{formatNumber(node.beds)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Coords</p>
                  <p className="text-[10px] font-medium leading-tight">{node.coordinates.split("(")[0].trim()}</p>
                </div>
              </div>

              <div className="rounded-lg bg-red-50 border border-red-100 p-2">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{node.gap}</p>
                </div>
              </div>

              <p className="text-[9px] text-muted-foreground mt-2">Fuente: {node.repsSource}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key findings */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border-2 border-blue-200 bg-blue-50/30 p-5"
        >
          <Clock className="h-6 w-6 text-blue-600 mb-3" />
          <h4 className="text-sm font-bold mb-1">Las Palmas: 40.9 km/h</h4>
          <p className="text-xs text-muted-foreground">
            MEData registra velocidad promedio de <strong>40.9 km/h</strong> en Av. Las Palmas (5.9 km),
            cayendo a <strong>36.1 km/h a las 17:00</strong>. Vs. Av. El Poblado: solo 21.6 km/h promedio.
            64,285 observaciones, 2017-2020.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border-2 border-red-200 bg-red-50/30 p-5"
        >
          <Hospital className="h-6 w-6 text-red-600 mb-3" />
          <h4 className="text-sm font-bold mb-1">HPTU: 1,094 Camas al 96%</h4>
          <p className="text-xs text-muted-foreground">
            REPS confirma que HPTU tiene <strong>1,094 camas</strong> (la mayor del area) al 96% de ocupacion.
            El total de IPS en el Valle de Aburra es <strong>1,536</strong>. Solo <strong>Clinica CES</strong> (213 camas)
            ofrece alta complejidad sobre el corredor Las Palmas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border-2 border-teal-200 bg-teal-50/30 p-5"
        >
          <ArrowUpRight className="h-6 w-6 text-teal-600 mb-3" />
          <h4 className="text-sm font-bold mb-1">38,415 Predios E6 en El Poblado</h4>
          <p className="text-xs text-muted-foreground">
            Catastro Municipal confirma <strong>38,415 predios estrato 6</strong> en Comuna 14 (avaluo promedio $438M COP)
            y EPM registra <strong>36,351 suscriptores E6</strong> de acueducto. El Poblado domina con el
            <strong> 98% de todos los predios E6</strong> de Medellin.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
