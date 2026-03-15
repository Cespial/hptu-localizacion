import dynamic from "next/dynamic";
import { HeroSection } from "./_components/hero-section";
import { ExecutiveSummarySection } from "./_components/executive-summary-section";
import { MethodologySection } from "./_components/methodology-section";
import { FormulaSection } from "./_components/formula-section";
import { DemandGradientSection } from "./_components/demand-gradient-section";
import { Phase2ResultsSection } from "./_components/phase2-results-section";
import { TrafficChartsSection } from "./_components/traffic-charts-section";
import { HealthGapSection } from "./_components/health-gap-section";
import { OrienteDemographicsSection } from "./_components/oriente-demographics-section";
import { OrienteFlowsSection } from "./_components/oriente-flows-section";
import { OrienteHealthGapSection } from "./_components/oriente-health-gap-section";
import { CompetitionExpandedSection } from "./_components/competition-expanded-section";
import { AmbulatoryServicesSection } from "./_components/ambulatory-services-section";
import { Candidate6AnalysisSection } from "./_components/candidate6-analysis-section";
import { StrategicProspectiveSection } from "./_components/strategic-prospective-section";
import { CompetitiveLandscapeSection } from "./_components/competitive-landscape-section";
import { MCDAComparisonSection } from "./_components/mcda-comparison-section";
import { FinancialSection } from "./_components/financial-section";
import { DensurbamSection } from "./_components/densurbam-section";
import { DataSourcesSection } from "./_components/data-sources-section";
import { DataArchitectureSection } from "./_components/data-architecture-section";
import { CronogramSection } from "./_components/cronogram-section";
import { TechStackSection } from "./_components/tech-stack-section";
import { DeliverablesSection } from "./_components/deliverables-section";
import { FooterSection } from "./_components/footer-section";

const MapSection = dynamic(
  () => import("./_components/map-section").then((mod) => mod.MapSection),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ExecutiveSummarySection />
      <MethodologySection />
      <FormulaSection />
      <MapSection />
      <DemandGradientSection />
      <Phase2ResultsSection />
      <TrafficChartsSection />
      <HealthGapSection />
      {/* Oriente Antioqueno expansion */}
      <OrienteDemographicsSection />
      <OrienteFlowsSection />
      <OrienteHealthGapSection />
      <CompetitionExpandedSection />
      <AmbulatoryServicesSection />
      <Candidate6AnalysisSection />
      {/* Strategic intelligence */}
      <StrategicProspectiveSection />
      <CompetitiveLandscapeSection />
      {/* Synthesis */}
      <MCDAComparisonSection />
      <FinancialSection />
      <DensurbamSection />
      <DataSourcesSection />
      <DataArchitectureSection />
      <CronogramSection />
      <TechStackSection />
      <DeliverablesSection />
      <FooterSection />
    </main>
  );
}
