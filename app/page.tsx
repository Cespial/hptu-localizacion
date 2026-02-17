import { HeroSection } from "./_components/hero-section";
import { MethodologySection } from "./_components/methodology-section";
import { FormulaSection } from "./_components/formula-section";
import { MapSection } from "./_components/map-section";
import { DataArchitectureSection } from "./_components/data-architecture-section";
import { CronogramSection } from "./_components/cronogram-section";
import { TechStackSection } from "./_components/tech-stack-section";
import { DeliverablesSection } from "./_components/deliverables-section";
import { FooterSection } from "./_components/footer-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <MethodologySection />
      <FormulaSection />
      <MapSection />
      <DataArchitectureSection />
      <CronogramSection />
      <TechStackSection />
      <DeliverablesSection />
      <FooterSection />
    </main>
  );
}
