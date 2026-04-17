import { useEffect, useRef, useState } from "react";
import { AmbienteLogo } from "./AmbienteLogo";
import { PackSequence } from "./PackSequence";

// How much of the hero's scroll progress is spent playing the rotation
// sequence. After this threshold the cards-stacking phase takes over.
const SEQUENCE_END = 0.3;

import img03Kan from "figma:asset/4d90e00b7580436518b22cd8b29dbde6466bcb63.png";
import img02Acz from "figma:asset/b84fb334be93df64d75c215b19d5f9d6f2d5bfc6.png";
import img09Pul from "figma:asset/f19669c960f98bb05b3b8252f49f44887097b6f5.png";
import img04Pca from "figma:asset/95b807f0a6629a8473d0a5fcd0968a90a760a70d.png";
import img01Sav from "figma:asset/15b4d3c8465ba8cb06f709e0a2f92eb5ef85f967.png";
import img08Bok from "figma:asset/47f6a42dd35ec0d7e51104829607d960649b2b83.png";
import img10Ama from "figma:asset/5fa781cdc9c23f0e22fd5ab1ecb1f6d651d57b01.png";
import img07Ces from "figma:asset/2bb8e73a2052ae79fe9c7e6c3c269da063403800.png";
import img05KarpHolo from "figma:asset/89a7725044543d01ba114f3c97289aa8a7f27626.png";

const cards = [
  { src: img03Kan, rotate: -10, x: -15, y: 5 },
  { src: img02Acz, rotate: 5, x: 20, y: -8 },
  { src: img09Pul, rotate: 16, x: -8, y: 12 },
  { src: img04Pca, rotate: -2, x: 12, y: -4 },
  { src: img01Sav, rotate: -25, x: -22, y: 8 },
  { src: img08Bok, rotate: 18, x: 18, y: -12 },
  { src: img10Ama, rotate: -7, x: -10, y: 6 },
  { src: img07Ces, rotate: 11, x: 8, y: -6 },
  { src: img05KarpHolo, rotate: -17, x: -18, y: 10 },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [packVisible, setPackVisible] = useState(true);
  const [sequenceProgress, setSequenceProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalHeight = sectionRef.current.offsetHeight - window.innerHeight;

      if (scrolled <= 0) {
        setVisibleCards(0);
        setShowContent(false);
        setPackVisible(true);
        setSequenceProgress(0);
        return;
      }

      const progress = Math.min(Math.max(scrolled / totalHeight, 0), 1);

      // Phase 1: rotation sequence (0 → SEQUENCE_END)
      setSequenceProgress(Math.min(progress / SEQUENCE_END, 1));

      // Phase 2: cards appear on the (final-frame) pack (0.35 → 0.75)
      if (progress < 0.35) {
        setVisibleCards(0);
      } else {
        const cardP = Math.min((progress - 0.35) / 0.4, 1);
        setVisibleCards(Math.floor(cardP * cards.length));
      }

      setShowContent(progress > 0.75);
      // Hide the fixed pack once we've scrolled past this section
      setPackVisible(progress < 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* PACK — fixed, sandwiched between red bg (z:1) and text (z:3) */}
      {packVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          style={{ zIndex: 2 }}
        >
          <div
            className="relative scale-150 md:scale-100"
            style={{ width: "min(750px, 85vw)", aspectRatio: "1 / 1" }}
          >
            <PackSequence progress={sequenceProgress} />
            {/* Cards stacking on top */}
            {cards.map((card, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  zIndex: i + 1,
                  opacity: i < visibleCards ? 1 : 0,
                  transform: i < visibleCards
                    ? `rotate(${card.rotate}deg) translate(${card.x}px, ${card.y}px)`
                    : `rotate(0deg) translateY(100vh) scale(0.8)`,
                  transition: "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <img
                  src={card.src}
                  alt=""
                  className="h-auto rounded-sm"
                  style={{
                    width: "min(262px, 30vw)",
                    boxShadow: "4px 4px 12px rgba(0,0,0,0.25)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <section ref={sectionRef} className="relative" style={{ height: "900vh" }}>

        {/* RED BG — bottom layer (z:1), fully opaque, scrolls normally */}
        <div
          className="relative mx-4 mt-4 rounded-t-[20px] overflow-hidden"
          style={{ height: "100vh", zIndex: 1 }}
        >
          <div className="absolute inset-0 bg-[#C8102E]" />
        </div>

        {/* TEXT — top layer (z:3), overlaps red via negative margin, scrolls with it */}
        <div
          className="relative mx-4 -mt-[100vh] pointer-events-none"
          style={{ height: "100vh", zIndex: 3 }}
        >
          {/* Logo */}
          <div className="absolute top-6 right-8">
            <AmbienteLogo fill="white" size={38} />
          </div>

          {/* Headline */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <h1
              className="text-white text-center max-w-[1100px]"
              style={{
                fontFamily: "'GT America', 'Inter', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(40px, 8.5vw, 128px)",
                lineHeight: "0.96",
                letterSpacing: "-0.04em",
              }}
            >
              Poskládejte celou edici sběratelských karet Ambiente.
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="absolute bottom-10 left-0 right-0 text-center text-white/90 tracking-[-0.01em] leading-[1.3] max-w-[700px] mx-auto px-6"
            style={{ fontSize: "clamp(12px, 1.5vw, 18px)" }}
          >
            U příležitosti 30 let Ambiente vznikla limitovaná edice 156
            sběratelských karet, které mapují osobnosti, jídla, restaurace a
            klíčové momenty naší historie.
          </p>
        </div>

        {/* SPACER — transparent area where the fixed pack is visible */}
        <div style={{ height: "700vh", position: "relative", zIndex: 4 }}>
          {/* Benefit text + buttons overlay */}
          <div
            className="sticky top-0 h-screen flex flex-col items-center justify-end pb-24 pointer-events-none"
            style={{ zIndex: 4 }}
          >
            <div
              className="transition-all duration-700 mb-auto mt-16"
              style={{
                opacity: showContent ? 1 : 0,
                transform: showContent ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <p
                className="text-[#C8102E] text-center tracking-[-0.02em] leading-[1.1] max-w-[600px] px-4"
                style={{ fontSize: "clamp(16px, 2vw, 32px)" }}
              >
                Vybrané karty vám navíc otevřou cestu k atraktivním výhodám v
                našich podnicích.
              </p>
            </div>
            <div
              className="flex gap-3 transition-all duration-700 pointer-events-auto"
              style={{
                opacity: showContent ? 1 : 0,
                transform: showContent ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <button
                onClick={() => scrollTo("jak-to-funguje")}
                className="bg-[#C8102E] text-white px-8 py-3 rounded-[10px] tracking-[-0.02em] cursor-pointer hover:bg-[#a80d25] transition"
              >
                Jak to funguje
              </button>
              <button
                onClick={() => scrollTo("kde-karty-koupit")}
                className="bg-[#C8102E] text-white px-8 py-3 rounded-[10px] tracking-[-0.02em] cursor-pointer hover:bg-[#a80d25] transition"
              >
                Kde karty koupit
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
