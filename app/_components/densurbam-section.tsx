"use client";

import { motion } from "framer-motion";
import { Building2, TrendingUp, AlertTriangle, Leaf } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
} from "recharts";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// IRS Health Equipment (Variable 49) by area - Real DENSURBAM data
const healthIRSData = [
  { name: "El Poblado\n(Comuna)", irs2017: 0.268, irs2025: 0.293, irs2037: 0.323, area: "comuna", critical: true },
  { name: "Villa Carlota", irs2017: 0.044, irs2025: 0.048, irs2037: 0.053, area: "barrio", critical: true },
  { name: "Los Naranjos\n(Med)", irs2017: 0.227, irs2025: 0.248, irs2037: 0.274, area: "barrio", critical: true },
  { name: "Las Palmas\n(Med)", irs2017: 0.968, irs2025: 1.059, irs2037: 1.167, area: "barrio", critical: false },
  { name: "Envigado\n(Mpio)", irs2017: 1.349, irs2025: 1.476, irs2037: 1.627, area: "municipio", critical: false },
  { name: "Sabaneta\n(Mpio)", irs2017: 1.302, irs2025: 1.424, irs2037: 1.570, area: "municipio", critical: false },
  { name: "Medellin\n(Mpio)", irs2017: 0.973, irs2025: 1.064, irs2037: 1.173, area: "municipio", critical: false },
  { name: "Itagui\n(Mpio)", irs2017: 2.451, irs2025: 2.682, irs2037: 2.956, area: "municipio", critical: false },
];

// Population projections - Real DENSURBAM data
const populationData = [
  { year: "2017", elPoblado: 149533, envigado: 229825, itagui: 273501, sabaneta: 88235 },
  { year: "2020", elPoblado: 155400, envigado: 238650, itagui: 284100, sabaneta: 91700 },
  { year: "2025", elPoblado: 163578, envigado: 251412, itagui: 299191, sabaneta: 96523 },
  { year: "2030", elPoblado: 171392, envigado: 263421, itagui: 313482, sabaneta: 101134 },
  { year: "2037", elPoblado: 180314, envigado: 277133, itagui: 329800, sabaneta: 106398 },
];

// IRS General comparison by area
const irsGeneralData = [
  { name: "Medellin", irs2017: 1.714, irs2025: 1.931, irs2037: 2.082 },
  { name: "Envigado", irs2017: 1.756, irs2025: 1.974, irs2037: 2.106 },
  { name: "El Poblado", irs2017: 1.867, irs2025: 2.072, irs2037: 2.231 },
  { name: "Sabaneta", irs2017: 1.977, irs2025: 2.228, irs2037: 2.338 },
  { name: "Itagui", irs2017: 2.055, irs2025: 2.233, irs2037: 2.427 },
  { name: "Santa Elena", irs2017: 2.765, irs2025: 2.924, irs2037: 3.015 },
];

// Barrio-level health deficit data
const barrioDeficitData = [
  { barrio: "Altos del Poblado", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 5296, deficitPct: 100 },
  { barrio: "El Tesoro", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 15646, deficitPct: 100 },
  { barrio: "Los Balsos No.1", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 12696, deficitPct: 100 },
  { barrio: "Los Balsos No.2", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 10904, deficitPct: 100 },
  { barrio: "San Lucas", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 11692, deficitPct: 100 },
  { barrio: "Las Lomas No.1", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 7054, deficitPct: 100 },
  { barrio: "Las Lomas No.2", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 3909, deficitPct: 100 },
  { barrio: "Castropol", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 15315, deficitPct: 100 },
  { barrio: "El Diamante", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 18937, deficitPct: 100 },
  { barrio: "Manila", oferta: 0.0, demanda: 3.5, deficit: 3.5, pob2037: 2464, deficitPct: 100 },
];

// Total deficit population in Las Palmas corridor
const totalDeficitPop = barrioDeficitData.reduce((sum, b) => sum + b.pob2037, 0);

export function DensurbamSection() {
  return (
    <SectionWrapper id="densurbam-sostenibilidad">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          DENSURBAM - Sostenibilidad Territorial (URBAM / EAFIT / AMVA)
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Indice de Relacion de Soporte (IRS) y Deficit de Salud
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Datos de la plataforma DENSURBAM (URBAM-EAFIT / Area Metropolitana): 59 variables,
          986 unidades de analisis, proyecciones 2017-2037. El IRS mide la capacidad del
          territorio de soportar poblacion sin agotar recursos.
        </p>
      </div>

      {/* Key insight: Health IRS */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4 text-center"
        >
          <p className="text-[10px] text-red-600 uppercase tracking-wider font-medium">IRS Salud El Poblado</p>
          <p className="text-3xl font-bold text-red-700 mt-1">0.27</p>
          <p className="text-[10px] text-red-500 mt-0.5">Critico (umbral: 2.5)</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Barrios Deficit 100%</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">10</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">0.0 m² oferta salud</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Pob. sin Equip. Salud 2037</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{formatNumber(totalDeficitPop)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">habitantes proyectados</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Crec. Poblacional 2037</p>
          <p className="text-3xl font-bold text-teal-600 mt-1">+20.6%</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">todos los municipios</p>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Health IRS bar chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold">IRS Equipamiento de Salud (Var. 49) - 2037</h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            IRS &lt; 2.5 = insostenible. El Poblado (0.32) tiene el IRS de salud mas bajo del area.
            Fuente: DENSURBAM / URBAM-EAFIT
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={healthIRSData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 3.5]} tick={{ fontSize: 10 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                tick={{ fontSize: 9 }}
              />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value) => [`${value}`, "IRS 2037"]}
              />
              <ReferenceLine
                x={2.5}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: "Umbral sostenible", position: "top", style: { fontSize: 9, fill: "#ef4444" } }}
              />
              <Bar dataKey="irs2037" radius={[0, 6, 6, 0]} barSize={22}>
                {healthIRSData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.irs2037 >= 2.5 ? "#10b981" : entry.irs2037 >= 1.0 ? "#f59e0b" : "#ef4444"}
                    opacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-400" /> IRS &lt;1.0 (Critico)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> 1.0-2.5 (Insuficiente)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> &ge;2.5 (Sostenible)
            </span>
          </div>
        </motion.div>

        {/* Population projection chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">Proyeccion Poblacional 2017-2037</h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Fuente: DENSURBAM (DANE + AMVA) | Modelo tendencial | +20.6% en 20 anos
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={populationData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 9 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value) => [formatNumber(Number(value)), ""]}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Line type="monotone" dataKey="itagui" name="Itagui" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="envigado" name="Envigado" stroke="#3b82f6" strokeWidth={1.5} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="elPoblado" name="El Poblado" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sabaneta" name="Sabaneta" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Barrio deficit table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold">
              Barrios con Deficit Total de Equipamiento de Salud (100%)
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            DENSURBAM confirma que 10 barrios del corredor Las Palmas / El Poblado tienen
            <strong> 0.0 m² de oferta de salud</strong> vs 3.5 m²/hab requeridos.
            Total: {formatNumber(totalDeficitPop)} habitantes sin cobertura al 2037.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">Barrio</th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">Oferta (m²/hab)</th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">Demanda (m²/hab)</th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">Deficit</th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Pob. 2037</th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">m² Requeridos</th>
            </tr>
          </thead>
          <tbody>
            {barrioDeficitData.map((row) => (
              <tr key={row.barrio} className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-2.5 px-4 font-medium text-xs">{row.barrio}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                    0.0
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-xs font-medium">3.5</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 border border-red-300">
                    100%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-xs hidden sm:table-cell">
                  {formatNumber(row.pob2037)}
                </td>
                <td className="py-2.5 px-3 text-center text-xs font-medium hidden md:table-cell">
                  {formatNumber(Math.round(row.pob2037 * 3.5))} m²
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-border bg-muted/30 font-bold">
              <td className="py-2.5 px-4 text-xs">TOTAL CORREDOR</td>
              <td className="py-2.5 px-3 text-center text-xs text-red-700">0.0</td>
              <td className="py-2.5 px-3 text-center text-xs">3.5</td>
              <td className="py-2.5 px-3 text-center text-xs text-red-700">100%</td>
              <td className="py-2.5 px-3 text-center text-xs hidden sm:table-cell">{formatNumber(totalDeficitPop)}</td>
              <td className="py-2.5 px-3 text-center text-xs hidden md:table-cell">{formatNumber(Math.round(totalDeficitPop * 3.5))} m²</td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* IRS General comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="h-4 w-4 text-teal-500" />
          <h3 className="text-sm font-bold">IRS General Promedio - Capacidad de Soporte Territorial</h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          El IRS promedio (59 variables) mide la sostenibilidad integral del territorio.
          Valores &gt;2.5 indican restricciones. Fuente: DENSURBAM (URBAM-EAFIT / AMVA)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase">Unidad</th>
                <th className="text-center py-2 px-3 text-xs font-semibold uppercase">IRS 2017</th>
                <th className="text-center py-2 px-3 text-xs font-semibold uppercase">IRS 2025</th>
                <th className="text-center py-2 px-3 text-xs font-semibold uppercase">IRS 2037</th>
                <th className="text-center py-2 px-3 text-xs font-semibold uppercase hidden sm:table-cell">Tendencia</th>
                <th className="text-center py-2 px-3 text-xs font-semibold uppercase hidden md:table-cell">Sostenibilidad</th>
              </tr>
            </thead>
            <tbody>
              {irsGeneralData.map((row) => {
                const trend = ((row.irs2037 - row.irs2017) / row.irs2017 * 100).toFixed(1);
                return (
                  <tr key={row.name} className={cn(
                    "border-b border-border/50 hover:bg-muted/20",
                    row.name === "El Poblado" && "bg-teal-50/30 font-medium"
                  )}>
                    <td className="py-2 px-3 text-xs font-medium">{row.name}</td>
                    <td className="py-2 px-3 text-center text-xs">{row.irs2017.toFixed(3)}</td>
                    <td className="py-2 px-3 text-center text-xs">{row.irs2025.toFixed(3)}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                        row.irs2037 >= 2.5 ? "bg-red-50 text-red-700 border-red-200" :
                        row.irs2037 >= 2.0 ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-teal-50 text-teal-700 border-teal-200"
                      )}>
                        {row.irs2037.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center text-xs hidden sm:table-cell text-amber-600 font-semibold">+{trend}%</td>
                    <td className="py-2 px-3 text-center text-xs hidden md:table-cell">
                      {row.irs2037 >= 2.5 ? (
                        <span className="text-red-600 font-semibold">Restriccion</span>
                      ) : row.irs2037 >= 2.0 ? (
                        <span className="text-amber-600 font-semibold">Moderada</span>
                      ) : (
                        <span className="text-teal-600 font-semibold">Adecuada</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Key insight */}
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
              DENSURBAM Confirma: Deficit Critico de Salud en El Poblado
            </h4>
            <p className="text-sm text-red-700 mt-1">
              La plataforma DENSURBAM (URBAM-EAFIT) asigna un <strong>IRS de Salud de 0.27 a El Poblado</strong> —
              el mas bajo de todo el Valle de Aburra — contra un umbral de sostenibilidad de 2.5.
              <strong> 10 barrios del corredor Las Palmas tienen deficit del 100%</strong> en equipamiento
              de salud: 0.0 m² de oferta vs 3.5 m²/hab requeridos. Esto representa{" "}
              <strong>{formatNumber(totalDeficitPop)} habitantes al 2037 sin cobertura</strong> de equipamiento
              de salud en su territorio. Con un crecimiento poblacional proyectado de <strong>+20.6%</strong>,
              la brecha solo se ampliara. Una nueva sede HPTU en Las Palmas Bajo cerraria directamente
              este deficit, aportando los <strong>{formatNumber(Math.round(totalDeficitPop * 3.5))} m² de equipamiento</strong> que
              DENSURBAM identifica como necesarios.
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
