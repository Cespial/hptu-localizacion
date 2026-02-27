import dynamic from "next/dynamic";
import { HeroSection } from "./_components/hero-section";
import { MethodologySection } from "./_components/methodology-section";
import { FormulaSection } from "./_components/formula-section";
import { DemandGradientSection } from "./_components/demand-gradient-section";
import { Phase2ResultsSection } from "./_components/phase2-results-section";
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
      <MethodologySection />
      <FormulaSection />
      <DemandGradientSection />
      <Phase2ResultsSection />
      <MapSection />
      <DataSourcesSection />
      <DataArchitectureSection />
      <CronogramSection />
      <TechStackSection />
      <DeliverablesSection />
      <FooterSection />
    </main>
  );
}
