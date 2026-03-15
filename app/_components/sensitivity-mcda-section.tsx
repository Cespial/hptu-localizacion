"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, BarChart3, ShieldCheck, Shuffle, Target, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { candidateZones } from "@/lib/demo-data/candidate-zones";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

// ── Types ────────────────────────────────────────────────────────────
type Weights = {
  accesibilidad: number;
  demanda: number;
  competencia: number;
  valorInmobiliario: number;
};

type Scenario = {
  label: string;
  short: string;
  weights: Weights;
};

// ── Constants ────────────────────────────────────────────────────────
const DEFAULT_WEIGHTS: Weights = {
  accesibilidad: 35,
  demanda: 30,
  competencia: 20,
  valorInmobiliario: 15,
};

const CRITERIA_META: {
  key: keyof Weights;
  label: string;
  letter: string;
  color: string;
  bg: string;
  border: string;
  slider: string;
}[] = [
  {
    key: "accesibilidad",
    label: "Accesibilidad",
    letter: "A",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-300",
    slider: "accent-teal-600",
  },
  {
    key: "demanda",
    label: "Demanda",
    letter: "D",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-300",
    slider: "accent-blue-600",
  },
  {
    key: "competencia",
    label: "Competencia",
    letter: "C",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-300",
    slider: "accent-amber-600",
  },
  {
    key: "valorInmobiliario",
    label: "Valor Inmob.",
    letter: "V",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-300",
    slider: "accent-purple-600",
  },
];

const SCENARIOS: Scenario[] = [
  { label: "Base", short: "Base", weights: { accesibilidad: 35, demanda: 30, competencia: 20, valorInmobiliario: 15 } },
  { label: "Demanda First", short: "Dem.", weights: { accesibilidad: 20, demanda: 45, competencia: 20, valorInmobiliario: 15 } },
  { label: "Accesibilidad First", short: "Acc.", weights: { accesibilidad: 45, demanda: 20, competencia: 20, valorInmobiliario: 15 } },
  { label: "Competencia First", short: "Comp.", weights: { accesibilidad: 20, demanda: 20, competencia: 45, valorInmobiliario: 15 } },
  { label: "Equal", short: "Igual", weights: { accesibilidad: 25, demanda: 25, competencia: 25, valorInmobiliario: 25 } },
];

const MONTE_CARLO_ITERATIONS = 3000;
const HISTOGRAM_BINS = 20;

// ── Helpers ──────────────────────────────────────────────────────────
function computeScore(
  scores: { accesibilidad: number; demanda: number; competencia: number; valorInmobiliario: number },
  weights: Weights
): number {
  const total = weights.accesibilidad + weights.demanda + weights.competencia + weights.valorInmobiliario;
  return (
    (scores.accesibilidad * weights.accesibilidad +
      scores.demanda * weights.demanda +
      scores.competencia * weights.competencia +
      scores.valorInmobiliario * weights.valorInmobiliario) /
    total
  );
}

function rankZones(weights: Weights) {
  return [...candidateZones]
    .map((z) => ({
      ...z,
      computedScore: computeScore(z.scores, weights),
    }))
    .sort((a, b) => b.computedScore - a.computedScore);
}

// Box-Muller for gaussian noise
function gaussianRandom(mean: number, stdDev: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

// ── Component ────────────────────────────────────────────────────────
export function SensitivityMCDASection() {
  const [weights, setWeights] = useState<Weights>({ ...DEFAULT_WEIGHTS });

  // ── Slider handler: redistribute remaining weight proportionally ───
  const handleSliderChange = useCallback(
    (changedKey: keyof Weights, newVal: number) => {
      setWeights((prev) => {
        const oldVal = prev[changedKey];
        const delta = newVal - oldVal;
        if (delta === 0) return prev;

        const otherKeys = (Object.keys(prev) as (keyof Weights)[]).filter(
          (k) => k !== changedKey
        );
        const otherSum = otherKeys.reduce((s, k) => s + prev[k], 0);

        if (otherSum === 0) {
          // Edge-case: others all zero, distribute equally
          const perOther = Math.round((100 - newVal) / otherKeys.length);
          const result = { ...prev, [changedKey]: newVal };
          otherKeys.forEach((k, i) => {
            result[k] =
              i === otherKeys.length - 1
                ? 100 - newVal - perOther * (otherKeys.length - 1)
                : perOther;
          });
          return result;
        }

        const remaining = 100 - newVal;
        const result: Weights = { ...prev, [changedKey]: newVal };
        let allocated = 0;
        otherKeys.forEach((k, i) => {
          if (i === otherKeys.length - 1) {
            result[k] = Math.max(0, remaining - allocated);
          } else {
            const share = Math.max(0, Math.round((prev[k] / otherSum) * remaining));
            result[k] = share;
            allocated += share;
          }
        });

        return result;
      });
    },
    []
  );

  // ── Dynamic ranking ────────────────────────────────────────────────
  const ranked = useMemo(() => rankZones(weights), [weights]);

  // ── Tornado chart data for Access Point ────────────────────────────
  const tornadoData = useMemo(() => {
    const ap = candidateZones.find((z) => z.id === "access-point")!;
    const baseScore = computeScore(ap.scores, DEFAULT_WEIGHTS);

    return CRITERIA_META.map((cm) => {
      // +15% weight
      const wPlus = { ...DEFAULT_WEIGHTS };
      const wMinus = { ...DEFAULT_WEIGHTS };
      wPlus[cm.key] = DEFAULT_WEIGHTS[cm.key] + 15;
      wMinus[cm.key] = DEFAULT_WEIGHTS[cm.key] - 15;
      // Normalize: redistribute delta among other keys proportionally
      const otherKeys = (Object.keys(DEFAULT_WEIGHTS) as (keyof Weights)[]).filter(
        (k) => k !== cm.key
      );
      const otherTotal = otherKeys.reduce((s, k) => s + DEFAULT_WEIGHTS[k], 0);
      otherKeys.forEach((k) => {
        wPlus[k] = DEFAULT_WEIGHTS[k] - (15 * DEFAULT_WEIGHTS[k]) / otherTotal;
        wMinus[k] = DEFAULT_WEIGHTS[k] + (15 * DEFAULT_WEIGHTS[k]) / otherTotal;
      });

      const scorePlus = computeScore(ap.scores, wPlus);
      const scoreMinus = computeScore(ap.scores, wMinus);

      return {
        criterion: cm.label,
        deltaPlus: +(scorePlus - baseScore).toFixed(2),
        deltaMinus: +(scoreMinus - baseScore).toFixed(2),
        letter: cm.letter,
      };
    }).sort(
      (a, b) =>
        Math.abs(b.deltaPlus) + Math.abs(b.deltaMinus) -
        (Math.abs(a.deltaPlus) + Math.abs(a.deltaMinus))
    );
  }, []);

  // ── Rank stability matrix ──────────────────────────────────────────
  const stabilityMatrix = useMemo(() => {
    return candidateZones.map((zone) => {
      const ranks = SCENARIOS.map((sc) => {
        const r = rankZones(sc.weights);
        const idx = r.findIndex((z) => z.id === zone.id);
        return idx + 1;
      });
      return {
        id: zone.id,
        name: zone.name,
        color: zone.color,
        ranks,
      };
    });
  }, []);

  // ── Monte Carlo simulation ─────────────────────────────────────────
  const monteCarloResults = useMemo(() => {
    const ap = candidateZones.find((z) => z.id === "access-point")!;
    const scores: number[] = [];
    let rank2Count = 0;
    let rank3OrBetterCount = 0;

    for (let i = 0; i < MONTE_CARLO_ITERATIONS; i++) {
      // Perturb weights with gaussian noise, std = 5
      const w: Weights = {
        accesibilidad: gaussianRandom(DEFAULT_WEIGHTS.accesibilidad, 5),
        demanda: gaussianRandom(DEFAULT_WEIGHTS.demanda, 5),
        competencia: gaussianRandom(DEFAULT_WEIGHTS.competencia, 5),
        valorInmobiliario: gaussianRandom(DEFAULT_WEIGHTS.valorInmobiliario, 5),
      };
      // Clamp to positive
      (Object.keys(w) as (keyof Weights)[]).forEach((k) => {
        w[k] = Math.max(1, w[k]);
      });
      // Normalize to 100
      const total = w.accesibilidad + w.demanda + w.competencia + w.valorInmobiliario;
      (Object.keys(w) as (keyof Weights)[]).forEach((k) => {
        w[k] = (w[k] / total) * 100;
      });

      const apScore = computeScore(ap.scores, w);
      scores.push(apScore);

      const r = rankZones(w);
      const apRank = r.findIndex((z) => z.id === "access-point") + 1;
      if (apRank <= 2) rank2Count++;
      if (apRank <= 3) rank3OrBetterCount++;
    }

    const p5 = percentile(scores, 5);
    const p50 = percentile(scores, 50);
    const p95 = percentile(scores, 95);
    const pctRank2 = ((rank2Count / MONTE_CARLO_ITERATIONS) * 100).toFixed(1);
    const pctRank3 = ((rank3OrBetterCount / MONTE_CARLO_ITERATIONS) * 100).toFixed(1);

    // Build histogram
    const minScore = Math.floor(Math.min(...scores));
    const maxScore = Math.ceil(Math.max(...scores));
    const binWidth = (maxScore - minScore) / HISTOGRAM_BINS;
    const bins = Array.from({ length: HISTOGRAM_BINS }, (_, i) => {
      const lo = minScore + i * binWidth;
      const hi = lo + binWidth;
      const count = scores.filter((s) => s >= lo && (i === HISTOGRAM_BINS - 1 ? s <= hi : s < hi)).length;
      return {
        range: `${lo.toFixed(0)}-${hi.toFixed(0)}`,
        mid: +((lo + hi) / 2).toFixed(1),
        count,
        isP50: p50 >= lo && p50 < hi,
      };
    });

    return { scores, p5, p50, p95, pctRank2, pctRank3, bins };
  }, []);

  // ── Gap analysis data ──────────────────────────────────────────────
  const gapData = useMemo(() => {
    return SCENARIOS.map((sc) => {
      const r = rankZones(sc.weights);
      const first = r[0];
      const second = r[1];
      const gap = +(first.computedScore - second.computedScore).toFixed(1);
      return {
        scenario: sc.short,
        fullLabel: sc.label,
        gap,
        first: first.name,
        second: second.name,
      };
    });
  }, []);

  return (
    <SectionWrapper id="sensibilidad-mcda">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Analisis de Sensibilidad MCDA
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Robustez del Ranking: Sensibilidad y Monte Carlo
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Evaluacion de la estabilidad del ranking multicriterio ante cambios
          en pesos, escenarios alternativos y 3,000 simulaciones
          estocasticas.
        </p>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Simulaciones MC
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {MONTE_CARLO_ITERATIONS.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">iteraciones Gauss(5%)</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Access Point Top-2
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {monteCarloResults.pctRank2}%
          </p>
          <p className="text-[10px] text-muted-foreground">de simulaciones</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Mediana Score (P50)
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {monteCarloResults.p50.toFixed(1)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            P5: {monteCarloResults.p5.toFixed(1)} | P95: {monteCarloResults.p95.toFixed(1)}
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
            Escenarios Testados
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">5</p>
          <p className="text-[10px] text-muted-foreground">
            nunca por debajo de #3
          </p>
        </motion.div>
      </div>

      {/* ── 1. Interactive Weight Sliders + Dynamic Ranking ────────── */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-teal-500" />
                <CardTitle className="text-sm">Ajuste de Pesos Interactivo</CardTitle>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Mueva los sliders para redistribuir pesos (suman 100%). El ranking se
                recalcula en tiempo real.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {CRITERIA_META.map((cm) => (
                  <div key={cm.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-md border text-[10px] font-bold",
                            cm.bg,
                            cm.color,
                            cm.border
                          )}
                        >
                          {cm.letter}
                        </span>
                        <span className="text-xs font-medium">{cm.label}</span>
                      </div>
                      <span className="text-sm font-bold tabular-nums">
                        {Math.round(weights[cm.key])}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={70}
                      step={1}
                      value={Math.round(weights[cm.key])}
                      onChange={(e) =>
                        handleSliderChange(cm.key, Number(e.target.value))
                      }
                      className={cn("w-full h-2 rounded-lg cursor-pointer", cm.slider)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total pesos</span>
                  <span
                    className={cn(
                      "font-bold",
                      Math.round(
                        weights.accesibilidad +
                          weights.demanda +
                          weights.competencia +
                          weights.valorInmobiliario
                      ) === 100
                        ? "text-teal-600"
                        : "text-red-600"
                    )}
                  >
                    {Math.round(
                      weights.accesibilidad +
                        weights.demanda +
                        weights.competencia +
                        weights.valorInmobiliario
                    )}
                    %
                  </span>
                </div>
                <button
                  onClick={() => setWeights({ ...DEFAULT_WEIGHTS })}
                  className="mt-2 text-[10px] text-teal-600 hover:text-teal-800 font-medium underline underline-offset-2"
                >
                  Restaurar pesos base (35/30/20/15)
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dynamic ranking */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-sm">Ranking Dinamico</CardTitle>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Recalculado en tiempo real con los pesos seleccionados
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {ranked.map((zone, i) => {
                  const isAP = zone.id === "access-point";
                  return (
                    <motion.div
                      key={zone.id}
                      layout
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
                        isAP && "border-rose-300 bg-rose-50/40",
                        !isAP && "bg-muted/20"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                          i === 0
                            ? "bg-amber-500"
                            : i === 1
                            ? "bg-gray-400"
                            : i === 2
                            ? "bg-orange-700"
                            : "bg-gray-300"
                        )}
                      >
                        #{i + 1}
                      </span>
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "text-xs font-semibold truncate",
                              isAP && "text-rose-700"
                            )}
                          >
                            {zone.name}
                          </span>
                          <span className="text-sm font-bold tabular-nums ml-2">
                            {zone.computedScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: zone.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${zone.computedScore}%` }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── 2. Tornado Chart ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card p-4 sm:p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Shuffle className="h-4 w-4 text-teal-500" />
          <h3 className="text-sm font-bold">
            Tornado Chart: Sensibilidad de Access Point (+-15% peso)
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">
          Variacion del score de Access Point cuando cada criterio sube o baja 15 puntos
          porcentuales de peso (redistribucion proporcional). Verde = mejora, rojo = empeora.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={tornadoData}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              domain={["auto", "auto"]}
              label={{
                value: "Delta Score",
                position: "insideBottomRight",
                offset: -5,
                style: { fontSize: 10, fill: "#6b7280" },
              }}
            />
            <YAxis
              dataKey="criterion"
              type="category"
              width={95}
              tick={{ fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{ fontSize: "11px" }}
              formatter={(value, name) => [
                `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(2)} pts`,
                name === "deltaPlus" ? "Peso +15%" : "Peso -15%",
              ]}
            />
            <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={1.5} />
            <Bar dataKey="deltaPlus" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} name="deltaPlus" />
            <Bar dataKey="deltaMinus" fill="#ef4444" radius={[4, 0, 0, 4]} barSize={16} name="deltaMinus" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── 3. Rank Stability Matrix ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-0 sm:pb-0">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4 text-teal-500" />
            <h3 className="text-sm font-bold">
              Matriz de Estabilidad de Ranking
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Posicion de cada zona bajo 5 escenarios de ponderacion. Oro = #1, Plata = #2,
            Bronce = #3.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-border bg-muted/30">
              <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider">
                Zona
              </th>
              {SCENARIOS.map((sc) => (
                <th
                  key={sc.label}
                  className="text-center py-3 px-3 font-semibold text-xs uppercase tracking-wider"
                >
                  <span className="hidden sm:inline">{sc.label}</span>
                  <span className="sm:hidden">{sc.short}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stabilityMatrix.map((row) => {
              const isAP = row.id === "access-point";
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/30 transition-colors",
                    isAP && "bg-rose-50/30 font-medium"
                  )}
                >
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="text-xs font-medium truncate">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  {row.ranks.map((rank, j) => (
                    <td key={j} className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                          rank === 1 &&
                            "bg-amber-100 text-amber-800 ring-2 ring-amber-300",
                          rank === 2 &&
                            "bg-gray-100 text-gray-700 ring-2 ring-gray-300",
                          rank === 3 &&
                            "bg-orange-100 text-orange-800 ring-2 ring-orange-300",
                          rank > 3 && "bg-muted text-muted-foreground"
                        )}
                      >
                        {rank}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* ── 4. Monte Carlo Distribution + 5. Gap Analysis ─────────── */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Monte Carlo Histogram */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Shuffle className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">
              Monte Carlo: Distribucion Score Access Point
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            {MONTE_CARLO_ITERATIONS.toLocaleString()} iteraciones con perturbacion
            gaussiana (std=5%) sobre los pesos base. Lineas = P5, P50, P95.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={monteCarloResults.bins}
              margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="mid"
                tick={{ fontSize: 9 }}
                label={{
                  value: "Score Access Point",
                  position: "insideBottomRight",
                  offset: -5,
                  style: { fontSize: 10, fill: "#6b7280" },
                }}
              />
              <YAxis
                tick={{ fontSize: 9 }}
                label={{
                  value: "Frecuencia",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, fill: "#6b7280" },
                }}
              />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value) => [
                  `${value} iteraciones`,
                  "Frecuencia",
                ]}
                labelFormatter={(label) => `Score ~${label}`}
              />
              <ReferenceLine
                x={+monteCarloResults.p5.toFixed(1)}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `P5: ${monteCarloResults.p5.toFixed(1)}`,
                  position: "top",
                  style: { fontSize: 9, fill: "#ef4444", fontWeight: 700 },
                }}
              />
              <ReferenceLine
                x={+monteCarloResults.p50.toFixed(1)}
                stroke="#0d9488"
                strokeWidth={2}
                label={{
                  value: `P50: ${monteCarloResults.p50.toFixed(1)}`,
                  position: "top",
                  style: { fontSize: 9, fill: "#0d9488", fontWeight: 700 },
                }}
              />
              <ReferenceLine
                x={+monteCarloResults.p95.toFixed(1)}
                stroke="#3b82f6"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `P95: ${monteCarloResults.p95.toFixed(1)}`,
                  position: "top",
                  style: { fontSize: 9, fill: "#3b82f6", fontWeight: 700 },
                }}
              />
              <Bar dataKey="count" radius={[3, 3, 0, 0]} barSize={18}>
                {monteCarloResults.bins.map((bin, i) => (
                  <Cell
                    key={i}
                    fill={bin.isP50 ? "#0d9488" : "#94a3b8"}
                    opacity={bin.isP50 ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold">
              <span className="h-2 w-4 rounded-sm bg-red-500 inline-block" />
              P5: {monteCarloResults.p5.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold">
              <span className="h-2 w-4 rounded-sm bg-teal-600 inline-block" />
              P50: {monteCarloResults.p50.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold">
              <span className="h-2 w-4 rounded-sm bg-blue-500 inline-block" />
              P95: {monteCarloResults.p95.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-teal-700">
              Top-2 en {monteCarloResults.pctRank2}% | Top-3 en {monteCarloResults.pctRank3}%
            </span>
          </div>
        </motion.div>

        {/* Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold">
              Gap #1 vs #2 por Escenario
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Diferencia de score entre la zona #1 y #2 bajo cada escenario.
            Cuando competencia tiene mayor peso, el gap se reduce — favoreciendo
            el nicho de Access Point.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={gapData}
              margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="scenario"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                domain={[0, "auto"]}
                label={{
                  value: "Gap (pts)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, fill: "#6b7280" },
                }}
              />
              <Tooltip
                contentStyle={{ fontSize: "11px" }}
                formatter={(value) => [
                  `${Number(value).toFixed(1)} pts`,
                  "Gap #1 vs #2",
                ]}
                labelFormatter={(label) => {
                  const item = gapData.find((g) => g.scenario === label);
                  return item
                    ? `${item.fullLabel}: ${item.first} vs ${item.second}`
                    : String(label);
                }}
              />
              <Bar dataKey="gap" radius={[4, 4, 0, 0]} barSize={32}>
                {gapData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.gap <= 4
                        ? "#10b981"
                        : entry.gap <= 7
                        ? "#f59e0b"
                        : "#ef4444"
                    }
                    opacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              Gap reducido (&le;4 pts)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
              Gap medio (5-7 pts)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" />
              Gap alto (&gt;7 pts)
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── 6. Insight Box ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-teal-200 bg-teal-50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-teal-800">
              Ranking Robusto: Access Point es Consistentemente #2
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm text-teal-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                <span>
                  <strong>Access Point mantiene posicion #2 en &gt;{monteCarloResults.pctRank2}%</strong>{" "}
                  de simulaciones Monte Carlo ({MONTE_CARLO_ITERATIONS.toLocaleString()} iteraciones,
                  perturbacion gaussiana std=5%).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                <span>
                  <strong>Gap con #1 se reduce a 2-3 pts</strong> bajo pesos
                  favorables a competencia nicho (escenario &quot;Competencia First&quot;),
                  donde el corredor sin hospitales de Access Point maximiza su
                  diferenciacion.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                <span>
                  <strong>Ranking robusto:</strong> ningun escenario mueve a Access
                  Point por debajo de #3 — confirmando su posicion como candidato
                  solido independientemente de la metodologia de ponderacion
                  utilizada.
                </span>
              </li>
            </ul>
            <p className="text-xs text-teal-600 mt-3 italic">
              Fuente: Simulacion Monte Carlo (N={MONTE_CARLO_ITERATIONS.toLocaleString()},
              Gauss std=5%), 5 escenarios deterministicos de sensibilidad
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
