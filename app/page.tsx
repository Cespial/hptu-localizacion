import dynamic from "next/dynamic";
import { FileText, Map, MapPin, Calculator, Database } from "lucide-react";

// Navigation
import { StickyNav } from "./_components/sticky-nav";
import { AppendixToggle } from "./_components/appendix-toggle";
import { GroupDivider } from "./_components/group-divider";

// Group A — RESUMEN Y RECOMENDACION
import { HeroSection } from "./_components/hero-section";
import { ExecutiveSummarySection } from "./_components/executive-summary-section";
import { AmbulatoryConceptSection } from "./_components/ambulatory-concept-section";
import { Candidate6AnalysisSection } from "./_components/candidate6-analysis-section";
import { FinancialSection } from "./_components/financial-section";
import { WhatWeDontKnowSection } from "./_components/what-we-dont-know-section";

// Group B — EL MERCADO
import { OrienteDemographicsSection } from "./_components/oriente-demographics-section";
import { OrienteStrataSection } from "./_components/oriente-strata-section";
import { OrienteHealthGapSection } from "./_components/oriente-health-gap-section";
import { AmbulatoryServicesSection } from "./_components/ambulatory-services-section";
import { CompetitionExpandedSection } from "./_components/competition-expanded-section";
import { PostTunnelSection } from "./_components/post-tunnel-section";
import { DemandValidationSection } from "./_components/demand-validation-section";

// Group C — EL MODELO MCDA
import { FormulaSection } from "./_components/formula-section";
import { MCDAComparisonSection } from "./_components/mcda-comparison-section";
import { SensitivityMCDASection } from "./_components/sensitivity-mcda-section";

// Group D — EVIDENCIA DE SOPORTE
import { DemandGradientSection } from "./_components/demand-gradient-section";
import { Phase2ResultsSection } from "./_components/phase2-results-section";
import { TrafficChartsSection } from "./_components/traffic-charts-section";
import { HealthGapSection } from "./_components/health-gap-section";
import { OrienteFlowsSection } from "./_components/oriente-flows-section";
import { OrienteRionegroGrowthSection } from "./_components/oriente-rionegro-growth-section";
import { StrategicProspectiveSection } from "./_components/strategic-prospective-section";
import { DensurbamSection } from "./_components/densurbam-section";
import { DataIntelligenceSection } from "./_components/data-intelligence-section";

// Group E — APENDICE TECNICO
import { MethodologySection } from "./_components/methodology-section";
import { DataSourcesSection } from "./_components/data-sources-section";
import { DataArchitectureSection } from "./_components/data-architecture-section";
import { TechStackSection } from "./_components/tech-stack-section";
import { CronogramSection } from "./_components/cronogram-section";
import { DeliverablesSection } from "./_components/deliverables-section";
import { FooterSection } from "./_components/footer-section";
import { BackToTop } from "./_components/back-to-top";

const MapSection = dynamic(
  () => import("./_components/map-section").then((mod) => mod.MapSection),
  {
    ssr: false,
    loading: () => (
      <div className="w-full py-6 lg:py-8">
        <div className="text-center mb-6 px-4">
          <p className="text-sm font-semibold text-muted-foreground">Mapa Estrategico</p>
        </div>
        <div className="animate-pulse bg-muted/50 border-y border-border/50" style={{ height: "80vh" }}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-muted-foreground/15 flex items-center justify-center">
                <svg className="h-5 w-5 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <p className="text-sm font-medium text-muted-foreground/50">Cargando mapa interactivo...</p>
              <p className="text-xs text-muted-foreground/30 mt-1">17 capas · 145 IPS · 6 zonas candidatas</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <StickyNav />

      {/* ============================================================ */}
      {/* HERO + RESUMEN EJECUTIVO                                     */}
      {/* ============================================================ */}
      <HeroSection />
      <GroupDivider
        id="grupo-a"
        icon={FileText}
        title="Resumen y Recomendacion"
        subtitle="Lo esencial para tomadores de decisiones"
      />
      <ExecutiveSummarySection />

      {/* ============================================================ */}
      {/* MAPA ESTRATÉGICO — EL PROTAGONISTA                           */}
      {/* Posición 3: justo después del resumen ejecutivo               */}
      {/* El directivo ve el territorio ANTES de los detalles          */}
      {/* ============================================================ */}
      <GroupDivider
        id="grupo-mapa"
        icon={MapPin}
        title="Mapa Estrategico"
        subtitle="Explore el territorio: 6 zonas candidatas, 17 capas de datos, isocronas en tiempo real"
        accentColor="bg-rose-600"
      />
      <MapSection />

      {/* ============================================================ */}
      {/* GRUPO A CONT: RECOMENDACION Y FINANCIERO                     */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-b from-slate-50/80 via-white to-white">
        <AmbulatoryConceptSection />
        <Candidate6AnalysisSection />
        <FinancialSection />
        <WhatWeDontKnowSection />
      </div>

      {/* ============================================================ */}
      {/* GRUPO B: EL MERCADO                                          */}
      {/* ============================================================ */}
      <GroupDivider
        id="grupo-b"
        icon={Map}
        title="El Mercado"
        subtitle="Oriente Antioqueno: 728K habitantes, brecha ambulatoria masiva"
        accentColor="bg-blue-600"
      />
      <OrienteDemographicsSection />
      <OrienteStrataSection />
      <OrienteHealthGapSection />
      <AmbulatoryServicesSection />
      <CompetitionExpandedSection />
      <PostTunnelSection />
      <DemandValidationSection />

      {/* ============================================================ */}
      {/* GRUPO C: EL MODELO MCDA                                      */}
      {/* ============================================================ */}
      <GroupDivider
        id="grupo-c"
        icon={Calculator}
        title="El Modelo MCDA"
        subtitle="5 dimensiones, 6 escenarios, 3,000 simulaciones Monte Carlo"
        accentColor="bg-violet-600"
      />
      <FormulaSection />
      <MCDAComparisonSection />
      <SensitivityMCDASection />

      {/* ============================================================ */}
      {/* GRUPO D: EVIDENCIA DE SOPORTE                                */}
      {/* ============================================================ */}
      <GroupDivider
        id="grupo-d"
        icon={Database}
        title="Evidencia de Soporte"
        subtitle="Datos detallados para analisis profundo"
        accentColor="bg-slate-500"
      />
      <DemandGradientSection />
      <Phase2ResultsSection />
      <TrafficChartsSection />
      <HealthGapSection />
      <OrienteFlowsSection />
      <OrienteRionegroGrowthSection />
      <StrategicProspectiveSection />
      <DensurbamSection />
      <DataIntelligenceSection />

      {/* ============================================================ */}
      {/* GRUPO E: APENDICE TECNICO (colapsado)                        */}
      {/* ============================================================ */}
      <AppendixToggle>
        <MethodologySection />
        <DataSourcesSection />
        <DataArchitectureSection />
        <TechStackSection />
        <CronogramSection />
        <DeliverablesSection />
      </AppendixToggle>

      <FooterSection />
      <BackToTop />
    </main>
  );
}
