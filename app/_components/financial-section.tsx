"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  zoneFinancialsCalculated,
  generalParams,
  financialSummary,
} from "@/lib/demo-data/financial-model";
import { AlertTriangle, CheckCircle2, TrendingUp, Building2, DollarSign, Clock } from "lucide-react";

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(1)}B`;
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(0)}MM`;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

function fmtCOP(n: number): string {
  if (Math.abs(n) >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}B COP`;
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)}MM COP`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M COP`;
  return `${n.toLocaleString()} COP`;
}

export function FinancialSection() {
  const sorted = [...zoneFinancialsCalculated].sort((a, b) => a.paybackYears - b.paybackYears);
  const best = sorted[0];

  return (
    <section id="modelo-financiero" className="container mx-auto max-w-6xl py-12 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="outline" className="mb-2">
          Fase 3 — Modelo Financiero Preliminar
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Factibilidad Financiera por Zona
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
          Modelo preliminar basado en costos reales de construccion hospitalaria en Colombia,
          benchmarks operativos del sector y precios de suelo del corredor.
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="text-xs text-amber-600 font-medium">
            Parametros marcados con simbolo requieren validacion con datos reales
          </span>
        </div>
      </div>

      {/* Key parameters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Building2, label: "Construccion/m²", value: fmtCOP(generalParams.constructionCostM2.value), validated: generalParams.constructionCostM2.validated },
          { icon: DollarSign, label: "Dotacion", value: `${generalParams.equipmentPct.value}% inversion civil`, validated: generalParams.equipmentPct.validated },
          { icon: TrendingUp, label: "Ingreso/cama/año", value: fmtCOP(generalParams.revenuePerBed.value), validated: generalParams.revenuePerBed.validated },
          { icon: Clock, label: "Timeline total", value: financialSummary.constructionTimeline.split("=")[1]?.trim() || "54 meses", validated: true },
        ].map(({ icon: Icon, label, value, validated }) => (
          <Card key={label} className="relative">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
                {!validated && <AlertTriangle className="h-3 w-3 text-amber-500" />}
              </div>
              <p className="text-sm font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zone comparison table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Comparativo Financiero por Zona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-4 font-semibold text-muted-foreground">Zona</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">Lote (m²)</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">Suelo/m²</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">Area const.</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">Camas</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">Inversion total</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">Ingreso/año</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">EBITDA/año</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">Payback</th>
                  <th className="py-2 px-2 font-semibold text-muted-foreground text-right">VPN 10 años</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((z) => (
                  <tr
                    key={z.zoneId}
                    className={`border-b last:border-0 ${z.zoneId === best.zoneId ? "bg-emerald-50" : ""}`}
                  >
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        {z.zoneId === best.zoneId && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                        <span className="font-medium">{z.zoneName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{z.lotSizeM2.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{fmt(z.landCostM2.value)}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{z.builtAreaM2.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-medium">{z.beds}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-medium">{fmtCOP(z.totalInvestment)}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{fmtCOP(z.annualRevenue)}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-emerald-700 font-medium">
                      {fmtCOP(z.annualRevenue * (z.ebitdaMargin.value / 100))}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      <span className={`font-bold ${z.paybackYears <= 12 ? "text-emerald-700" : z.paybackYears <= 18 ? "text-amber-600" : "text-red-600"}`}>
                        {z.paybackYears} años
                      </span>
                    </td>
                    <td className={`py-2.5 px-2 text-right tabular-nums font-medium ${z.npv10y > 0 ? "text-emerald-700" : "text-red-600"}`}>
                      {fmtCOP(z.npv10y)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            * VPN calculado con tasa de descuento {generalParams.discountRate.value}%, ramp-up 60% año 1, 80% año 2, 100% año 3+.
            EBITDA = Ingreso x Margen ({generalParams.ebitdaMargin.value}% base, ajustado por zona).
          </p>
        </CardContent>
      </Card>

      {/* Two-column: Risks + Parameters to validate */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Parameters to validate */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Parametros por Validar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {financialSummary.parametersToValidate.map((p) => (
                <div key={p.param} className="flex items-start gap-2">
                  <span className={`shrink-0 mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    p.priority === "ALTA" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {p.priority}
                  </span>
                  <div>
                    <p className="text-xs font-medium">{p.param}</p>
                    <p className="text-[10px] text-muted-foreground">{p.how}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Risks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Riesgos Clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {financialSummary.keyRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 text-xs">&#9679;</span>
                  <span className="text-xs text-muted-foreground">{risk}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-800">
                <strong>Contexto demografico:</strong> Medellín alcanza su pico poblacional en 2025 (~2.53M hab) y comienza a decrecer.
                Sin embargo, la población 60+ crece +59,000 personas al 2030 (18.2% → 20.7%),
                incrementando la demanda de servicios hospitalarios de alta complejidad.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {sorted.map((z) => (
          <Card key={z.zoneId} className={z.zoneId === best.zoneId ? "ring-2 ring-emerald-500" : ""}>
            <CardContent className="p-3 text-center space-y-1">
              <p className="text-xs font-bold">{z.zoneName}</p>
              <p className="text-lg font-bold tabular-nums">{fmtCOP(z.totalInvestment)}</p>
              <p className="text-[10px] text-muted-foreground">{z.beds} camas · {z.builtAreaM2.toLocaleString()} m²</p>
              <div className={`text-xs font-bold ${z.paybackYears <= 12 ? "text-emerald-600" : z.paybackYears <= 18 ? "text-amber-600" : "text-red-600"}`}>
                Payback: {z.paybackYears} años
              </div>
              {z.npv10y > 0 ? (
                <p className="text-[10px] text-emerald-600">VPN: +{fmtCOP(z.npv10y)}</p>
              ) : (
                <p className="text-[10px] text-red-600">VPN: {fmtCOP(z.npv10y)}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
