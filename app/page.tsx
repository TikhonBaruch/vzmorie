import { Header } from "../components/Header";
import { HeroBento } from "../components/HeroBento";
import { FeaturesSplit } from "../components/FeaturesSplit";
import { TariffsBento } from "../components/TariffsBento";
import { InfrastructureBento } from "../components/InfrastructureBento";
import { LocationMap } from "../components/LocationMap";
import { FleetGuides } from "../components/FleetGuides";
import { Gallery } from "../components/Gallery";
import { Footer } from "../components/Footer";

export default function Page() {
  return (
    <div className="text-slate-100">
      <Header />
      <main className="container-tactical pb-16 pt-24 sm:pt-28">
        <HeroBento />
        <FeaturesSplit />
        <TariffsBento />
        <InfrastructureBento />
        <LocationMap />
      </main>
      <FleetGuides />
      <Gallery />
      <Footer />
    </div>
  );
}

