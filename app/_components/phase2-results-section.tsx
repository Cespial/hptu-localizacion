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
        <Badge variant="outline" className="mb-4">Fase 2 - Flujos y Nodos</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Analisis de Accesibilidad y Red de Salud
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Mapeo de flujos vehiculares, tiempos de desplazamiento y analisis de
          la red de nodos de salud existente con sus brechas de cobertura.
        </p>
      </div>

      {/* Traffic Flows */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Car className="h-5 w-5 text-blue-600" />
          <h3 className="font-serif text-xl font-bold">Flujos Vehiculares Principales</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Corredor</th>
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Direccion</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">AM Peak</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">PM Peak</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Vel. Pico</th>
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Cuello de Botella</th>
              </tr>
            </thead>
            <tbody>
              {trafficFlows.map((flow, i) => (
                <motion.tr
                  key={flow.corridor}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-3 font-medium">{flow.corridor}</td>
                  <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">{flow.direction}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                      {formatNumber(flow.amPeak)} v/h
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                      {formatNumber(flow.pmPeak)} v/h
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center hidden sm:table-cell text-muted-foreground">{flow.avgSpeed_amPeak}</td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-red-600">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      {flow.bottleneck}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Nodes */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Hospital className="h-5 w-5 text-red-600" />
          <h3 className="font-serif text-xl font-bold">Nodos de Salud Existentes y Brechas</h3>
        </div>

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
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  parseInt(node.occupancy) >= 90 ? "bg-red-100 text-red-700" :
                  parseInt(node.occupancy) >= 80 ? "bg-amber-100 text-amber-700" :
                  "bg-green-100 text-green-700"
                )}>
                  {node.occupancy} ocup.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Camas</p>
                  <p className="text-sm font-bold">{node.beds}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Radio</p>
                  <p className="text-sm font-bold">{node.catchmentRadius}</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-2">
                <span className="font-medium">Mercado:</span> {node.mainMarket}
              </div>

              <div className="rounded-lg bg-red-50 border border-red-100 p-2">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{node.gap}</p>
                </div>
              </div>
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
          <h4 className="text-sm font-bold mb-1">Tiempo Optimo</h4>
          <p className="text-xs text-muted-foreground">
            Las Palmas Bajo tiene tiempo de acceso promedio de <strong>12 minutos</strong> desde
            las principales zonas residenciales E5/E6 en hora no pico. En hora pico sube a 15-18 min.
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
          <h4 className="text-sm font-bold mb-1">Brecha de Cobertura</h4>
          <p className="text-xs text-muted-foreground">
            La red actual opera a <strong>89% de ocupacion promedio</strong>. El HPTU en Prado
            esta a 96%. No existe oferta de alta complejidad en el corredor Las Palmas.
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
          <h4 className="text-sm font-bold mb-1">Oportunidad de Captacion</h4>
          <p className="text-xs text-muted-foreground">
            Se estima que <strong>38,550 usuarios de prepagada</strong> en El Poblado actualmente
            se desplazan 25-40 min hasta HPTU Prado. Una sede en Las Palmas reduciria ese tiempo a 10-15 min.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
