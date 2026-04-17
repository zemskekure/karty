import { HeroSection } from "./components/HeroSection";
import { HowItWorks } from "./components/HowItWorks";
import { CardTypes } from "./components/CardTypes";
import { CardBrowser } from "./components/CardBrowser";
import { WhereToBuy } from "./components/WhereToBy";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { FloatingControls } from "./components/FloatingControls";

export default function App() {
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      <FloatingControls />
      <HeroSection />
      <div className="h-4" />
      <HowItWorks />
      <div className="h-4" />
      <CardTypes />
      <div className="h-4" />
      <CardBrowser />
      <div className="h-4" />
      <WhereToBuy />
      <div className="h-4" />
      <FAQ />
      <div className="h-4" />
      <Footer />
    </div>
  );
}