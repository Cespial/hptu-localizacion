"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Shield,
  Target,
  ArrowRight,
  Database,
  Check,
  Clock,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { candidateZones } from "@/lib/demo-data/candidate-zones";
import {
  orienteMunicipios,
  orienteHealthSummary,
  trafficCorridors,
} from "@/lib/demo-data/oriente-data";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// ---------------------------------------------------------------
// Scorecard data derived from candidate-zones + oriente-data
// ---------------------------------------------------------------
const scorecardRows = candidateZones.map((z) => {
  // Travel time to Rionegro from each zone (approximated from data)
  let orienteAccess = "—";
  let recommendation = "";
  let grade = "";

  if (z.id === "access-point") {
    orienteAccess = "58.8 min";
    recommendation = "RECOMENDADA";
    grade = "";
  } else if (z.id === "palmas-bajo") {
    orienteAccess = "~60 min";
    recommendation = "";
    grade = "A";
  } else if (z.id === "palmas-medio") {
    orienteAccess = "~65 min";
    recommendation = "";
    grade = "B+";
  } else if (z.id === "envigado") {
    orienteAccess = "~70 min";
    recommendation = "";
    grade = "B";
  } else if (z.id === "nuevo-poblado") {
    orienteAccess = "~75 min";
    recommendation = "";
    grade = "B-";
  } else if (z.id === "palmas-alto") {
    orienteAccess = "~55 min";
    recommendation = "";
    grade = "C+";
  }

  return {
    id: z.id,
    name: z.name,
    score: z.score,
    accesibilidad: z.scores.accesibilidad,
    demanda: z.scores.demanda,
    competencia: z.scores.competencia,
    valorInmobiliario: z.scores.valorInmobiliario,
    orienteAccess,
    recommendation,
    grade,
    isAccessPoint: z.id === "access-point",
  };
});

// Data sources grid
const verifiedSources = [
  { name: "DANE", ok: true },
  { name: "REPS", ok: true },
  { name: "Catastro", ok: true },
  { name: "MEData", ok: true },
  { name: "Mapbox", ok: true },
  { name: "Google Places", ok: true },
  { name: "OSM", ok: true },
  { name: "ANI", ok: true },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 * i, duration: 0.35 },
  }),
};

// ---------------------------------------------------------------
// Component
// ---------------------------------------------------------------
export function ExecutiveSummarySection() {
  return (
    <SectionWrapper
      id="resumen-ejecutivo"
      className="py-16 lg:py-24 bg-gradient-to-b from-slate-50/80 via-white to-white"
    >
      {/* -------- Header -------- */}
      <div className="text-center mb-12 lg:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge
            variant="outline"
            className="mb-5 text-xs tracking-wide border-teal-300 text-teal-700 bg-teal-50 px-3 py-1"
          >
            Resumen Ejecutivo &mdash; Para Tomadores de Decisiones
          </Badge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="font-serif text-3xl font-bold sm:text-4xl lg:text-[2.75rem] tracking-tight"
        >
          Recomendacion Estrategica:{" "}
          <span className="text-teal-700">Access Point</span>, Km 7 Via Las
          Palmas
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="mt-4 text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed"
        >
          Sintesis de 3.8M+ registros de 15 fuentes publicas, analisis
          multicriterio de 6 zonas candidatas, y evaluacion integral del Oriente
          Antioqueno.
        </motion.p>
      </div>

      {/* -------- Verdict Cards -------- */}
      <div className="space-y-5 mb-14 lg:mb-18">
        {/* Card A — Por que Access Point */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50/70 to-white p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-teal-900 sm:text-2xl">
              Por que Access Point
            </h3>
          </div>

          <ul className="space-y-3.5">
            {[
              {
                text: (
                  <>
                    <strong>Nodo puente unico:</strong> 44 min a El Retiro, 51
                    min al Aeropuerto SKRG, 59 min a Rionegro{" "}
                    <span className="text-teal-600 text-xs font-medium">
                      (Mapbox Matrix)
                    </span>
                  </>
                ),
              },
              {
                text: (
                  <>
                    <strong>Km 7 Via Las Palmas, sin pico y placa,</strong>{" "}
                    Retorno 5 &mdash; acceso directo al Tunel de Oriente
                  </>
                ),
              },
              {
                text: (
                  <>
                    <strong>
                      {formatNumber(
                        orienteMunicipios.reduce(
                          (s, m) => s + m.population2018,
                          0
                        )
                      )}
                      + habitantes
                    </strong>{" "}
                    del Oriente Antioqueno con brecha critica de salud (
                    {orienteHealthSummary.facilitiesOriente} vs{" "}
                    {orienteHealthSummary.facilitiesValleAburra} facilities)
                  </>
                ),
              },
              {
                text: (
                  <>
                    <strong>POT permite hasta 19 pisos</strong> en zona (San
                    Lucas), solo 45.8% de densidad usada &mdash; crecimiento
                    futuro garantizado
                  </>
                ),
              },
              {
                text: (
                  <>
                    <strong>2da etapa Tunel de Oriente abre H2 2027</strong>{" "}
                    &mdash; doble calzada reduce tiempos. Km 7 es nodo de
                    entrada.
                  </>
                ),
              },
              {
                text: (
                  <>
                    <strong>Aeropuerto JMC: 14.5M &rarr; 42.7M pasajeros</strong>{" "}
                    (Master Plan 2055). A 20 min de Access Point.
                  </>
                ),
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="h-4.5 w-4.5 text-teal-600 mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base text-teal-900/90 leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Card B — La Oportunidad del Oriente */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/70 to-white p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-blue-900 sm:text-2xl">
              La Oportunidad del Oriente
            </h3>
          </div>

          {/* Mini metric grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {[
              {
                value: formatNumber(
                  orienteMunicipios.reduce((s, m) => s + m.population2018, 0)
                ),
                label: "habitantes",
              },
              {
                value: `+${trafficCorridors[0].growthPct.toFixed(0)}%`,
                label: "trafico Las Palmas (10 a.)",
              },
              {
                value: formatNumber(orienteHealthSummary.totalCamas),
                label: `camas (${orienteHealthSummary.rionegroPctCamas}% en Rionegro)`,
              },
              {
                value: String(orienteHealthSummary.level3or4Count),
                label: "hospitales Nivel 3-4",
              },
              {
                value: "2.4/5",
                label: "rating hospital publico",
              },
              {
                value: `1:${orienteHealthSummary.ratioClinicas}`,
                label: "ratio clinicas",
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="rounded-xl border border-blue-100 bg-white/80 p-3 text-center"
              >
                <p className="text-lg sm:text-xl font-bold text-blue-700">
                  {metric.value}
                </p>
                <p className="text-[10px] sm:text-xs text-blue-600/70 leading-tight mt-0.5">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm sm:text-base text-blue-900/80 leading-relaxed">
            El Oriente Antioqueno tiene un deficit severo de servicios de salud
            de mediana y alta complejidad. Los pacientes son referidos a Medellin
            para cualquier caso complejo.{" "}
            <strong>
              Access Point captura esta demanda insatisfecha.
            </strong>
          </p>
        </motion.div>

        {/* Card C — Riesgo de No Actuar */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50/70 via-amber-50/30 to-white p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-red-900 sm:text-2xl">
              Riesgo de No Actuar
            </h3>
          </div>

          <ul className="space-y-3.5">
            {[
              <>
                <strong>Clinica Somer (Rionegro)</strong> es el unico competidor
                privado de alta complejidad &mdash; ventana de oportunidad
                limitada
              </>,
              <>
                <strong>Clinica Campestre</strong> construye torre de 15 pisos
                en El Poblado
              </>,
              <>
                Trafico del corredor crece{" "}
                <strong>+{trafficCorridors[0].growthPct.toFixed(0)}%</strong> en
                10 anos &mdash; la demanda de servicios de salud seguira
              </>,
              <>
                Si HPTU no ocupa el nodo Las Palmas/Tunel,{" "}
                <strong>otro operador lo hara</strong>
              </>,
              <>
                <strong>Campestre ya abrio sede Rionegro</strong> (marzo 2026,
                $30,000M COP, 250 pac/dia)
              </>,
              <>
                <strong>HSVF Rionegro va hacia 500 camas</strong> &mdash;
                dominara inpatient del Oriente
              </>,
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base text-red-900/85 leading-relaxed">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* -------- Comparative Scorecard -------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border bg-card overflow-x-auto mb-14 lg:mb-18 shadow-sm"
      >
        <div className="p-5 sm:p-7 pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <Target className="h-5 w-5 text-teal-600" />
            <h3 className="font-serif text-lg font-bold sm:text-xl">
              Scorecard Comparativo &mdash; 6 Zonas Candidatas
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            MCDA ponderado (accesibilidad 30%, demanda 25%, competencia 25%,
            valor inmobiliario 20%). Fuentes: Mapbox Matrix, DANE, REPS,
            Catastro, POT.
          </p>
        </div>

        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              {[
                "Zona",
                "Score MCDA",
                "Accesibilidad",
                "Demanda",
                "Competencia",
                "Valor Inmob.",
                "Oriente Access",
                "Recomendacion",
              ].map((col) => (
                <th
                  key={col}
                  className="text-center py-3 px-3 font-semibold text-[10px] uppercase tracking-wider first:text-left first:pl-5"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scorecardRows.map((row, i) => (
              <motion.tr
                key={row.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={rowVariants}
                className={cn(
                  "border-b border-border/50 transition-colors",
                  row.isAccessPoint
                    ? "bg-gradient-to-r from-rose-50/80 via-teal-50/50 to-rose-50/80 font-semibold"
                    : "hover:bg-muted/20"
                )}
              >
                <td
                  className={cn(
                    "py-3 pl-5 pr-3 text-xs font-medium text-left whitespace-nowrap",
                    row.isAccessPoint && "text-teal-800"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {row.isAccessPoint && (
                      <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                    )}
                    {row.name}
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-xs">
                  {row.isAccessPoint ? (
                    <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      En evaluacion
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "font-bold",
                        row.score >= 80
                          ? "text-teal-700"
                          : row.score >= 70
                          ? "text-blue-600"
                          : row.score >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      )}
                    >
                      {row.score}/100
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-center text-xs">
                  {row.isAccessPoint ? (
                    <span className="text-muted-foreground">&mdash;</span>
                  ) : (
                    `${row.accesibilidad}/100`
                  )}
                </td>
                <td className="py-3 px-3 text-center text-xs">
                  {row.isAccessPoint ? (
                    <span className="text-muted-foreground">&mdash;</span>
                  ) : (
                    `${row.demanda}/100`
                  )}
                </td>
                <td className="py-3 px-3 text-center text-xs">
                  {row.isAccessPoint ? (
                    <span className="text-muted-foreground">&mdash;</span>
                  ) : (
                    `${row.competencia}/100`
                  )}
                </td>
                <td className="py-3 px-3 text-center text-xs">
                  {row.isAccessPoint ? (
                    <span className="text-muted-foreground">&mdash;</span>
                  ) : (
                    `${row.valorInmobiliario}/100`
                  )}
                </td>
                <td className="py-3 px-3 text-center text-xs font-medium">
                  {row.orienteAccess}
                </td>
                <td className="py-3 px-3 text-center">
                  {row.recommendation === "RECOMENDADA" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-teal-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm shadow-teal-600/20">
                      <CheckCircle2 className="h-3 w-3" />
                      RECOMENDADA
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                        row.grade === "A"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : row.grade.startsWith("B")
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {row.grade}
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <div className="px-5 sm:px-7 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong>Nota:</strong> Access Point (Km 7 Via Las Palmas, Retorno 5) fue
            incorporada despues de las primeras 5 zonas evaluadas. Los scores
            MCDA formales estan en proceso de calculo. La recomendacion se basa
            en ventajas cualitativas (nodo puente, POT, acceso Tunel de
            Oriente) y tiempos de viaje verificados con Mapbox Matrix API.
          </p>
        </div>
      </motion.div>

      {/* -------- Decision Framework (3-column) -------- */}
      <div className="grid gap-5 md:grid-cols-3 mb-14 lg:mb-18">
        {/* Ventajas Competitivas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border bg-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Shield className="h-4 w-4" />
            </div>
            <h4 className="font-serif text-base font-bold sm:text-lg">
              Ventajas Competitivas
            </h4>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {[
              "Unico nodo que conecta Valle de Aburra y Oriente Antioqueno sur via Las Palmas + Tunel",
              "Sin pico y placa — acceso 24/7 para pacientes y ambulancias",
              "POT permite 19 pisos, solo 45.8% de densidad usada en San Lucas",
              "Proyecto Access Point: 4 torres, 10 pisos (Acierto Inmobiliario) — infraestructura lista",
              "51 min al Aeropuerto SKRG — traslados aeromedicales viables",
              "Demanda cautiva: 460K+ habitantes Oriente con 0 hospitales Nivel 3-4",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-teal-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Riesgos a Mitigar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border bg-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h4 className="font-serif text-base font-bold sm:text-lg">
              Riesgos a Mitigar
            </h4>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {[
              "Competencia densa en El Poblado: 40+ facilities en radio 5 km (Google Places)",
              "Trafico Via Las Palmas en hora pico PM: velocidad cae a 36.1 km/h (MEData)",
              "Verificar restricciones POT especificas del predio (uso dotacional salud)",
              "Precio m2 elevado vs zonas alternativas (Envigado, Itagui)",
              "Dependencia de un unico corredor vial — riesgo por cierres o accidentes",
              "Clinica Campestre ya en expansion: torre de 15 pisos en El Poblado",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Proximos Pasos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border bg-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <ArrowRight className="h-4 w-4" />
            </div>
            <h4 className="font-serif text-base font-bold sm:text-lg">
              Proximos Pasos
            </h4>
          </div>
          <ol className="space-y-2.5 text-sm text-muted-foreground">
            {[
              {
                step: "Visita tecnica al predio",
                detail:
                  "Verificar condiciones fisicas, accesos, entorno inmediato",
              },
              {
                step: "Verificacion POT del predio",
                detail:
                  "Confirmar uso dotacional salud, alturas, indices de ocupacion",
              },
              {
                step: "Modelo financiero detallado",
                detail:
                  "Flujo de caja, TIR, punto de equilibrio con precios reales de mercado",
              },
              {
                step: "Due diligence legal",
                detail:
                  "Titularidad, gravamenes, licencias urbanisticas requeridas",
              },
              {
                step: "Estudio de demanda primario",
                detail:
                  "Encuestas, entrevistas con aseguradoras, proyecciones de pacientes",
              },
              {
                step: "Negociacion con Acierto Inmobiliario",
                detail:
                  "Condiciones comerciales, plazos de entrega, personalizacion de torres",
              },
              {
                step: "Verificar ficha normativa POT del predio",
                detail:
                  "Confirmar uso dotacional salud en la ficha normativa especifica del lote",
              },
              {
                step: "Modelar hub ambulatorio como diferenciador",
                detail:
                  "Modelo de hub ambulatorio (no hospital de camas) para diferenciarse de Somer/HSVF",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold mt-0.5 shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-foreground leading-snug">
                    {item.step}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>

      {/* -------- Data Audit Summary (Footer) -------- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border bg-muted/20 p-5 sm:p-7"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <Database className="h-4.5 w-4.5 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">
            Fuentes verificadas: 15 datasets, 3.8M+ registros
          </p>
        </div>

        {/* Source grid */}
        <div className="flex flex-wrap gap-2 mb-4">
          {verifiedSources.map((src) => (
            <span
              key={src.name}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <Check className="h-3 w-3 text-teal-500" />
              {src.name}
            </span>
          ))}
        </div>

        {/* Pending verification */}
        <div className="flex items-start gap-2">
          <Clock className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground/70">
              Datos pendientes de verificacion:
            </span>{" "}
            Precios m2 de mercado, ocupacion real hospitales Oriente,
            proyecciones DANE 2025-2035, POT especifico del predio.
          </p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
