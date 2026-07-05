import { Header } from "../components/Header";
import { HeroBento } from "../components/HeroBento";
import { ConditionsBlock } from "../components/ConditionsBlock";
import { FeaturesSplit } from "../components/FeaturesSplit";
import { TariffsBento } from "../components/TariffsBento";
import { FleetGuides } from "../components/FleetGuides";
import { RestSection } from "../components/RestSection";
import { SpearfishingSection } from "../components/SpearfishingSection";
import { DatesSection } from "../components/DatesSection";
import { InfrastructureBento } from "../components/InfrastructureBento";
import { LocationMap } from "../components/LocationMap";
import { Gallery } from "../components/Gallery";
import { Footer } from "../components/Footer";

export default function Page() {
  return (
    <div className="text-slate-100">
      <Header />
      <main className="container-tactical pb-16 pt-24 sm:pt-28">
        <HeroBento />
        <ConditionsBlock />
        <FeaturesSplit />
        <TariffsBento />
        <FleetGuides />
        <RestSection />
        <SpearfishingSection />
        <InfrastructureBento />
        <LocationMap />
        <DatesSection />
      </main>
      <Gallery />
      <Footer />
    </div>
  );
}
