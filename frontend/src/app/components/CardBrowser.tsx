import { useState, useCallback } from "react";
import img03Kan from "figma:asset/4d90e00b7580436518b22cd8b29dbde6466bcb63.png";
import img02Acz from "figma:asset/b84fb334be93df64d75c215b19d5f9d6f2d5bfc6.png";
import img09Pul from "figma:asset/f19669c960f98bb05b3b8252f49f44887097b6f5.png";
import img04Pca from "figma:asset/95b807f0a6629a8473d0a5fcd0968a90a760a70d.png";
import img01Sav from "figma:asset/15b4d3c8465ba8cb06f709e0a2f92eb5ef85f967.png";
import img08Bok from "figma:asset/47f6a42dd35ec0d7e51104829607d960649b2b83.png";
import img10Ama from "figma:asset/5fa781cdc9c23f0e22fd5ab1ecb1f6d651d57b01.png";
import img07Ces from "figma:asset/2bb8e73a2052ae79fe9c7e6c3c269da063403800.png";
import img05KarpHolo from "figma:asset/89a7725044543d01ba114f3c97289aa8a7f27626.png";
import { AmbienteLogo } from "./AmbienteLogo";

const allCards = [
  { id: 1, src: img01Sav, name: "Savoy", category: "ambiente" },
  { id: 2, src: img02Acz, name: "Artisan", category: "slevove" },
  { id: 3, src: img03Kan, name: "Kantýna", category: "ambiente" },
  { id: 4, src: img04Pca, name: "Pasta", category: "ambiente" },
  { id: 5, src: img05KarpHolo, name: "Karp", category: "slevove" },
  { id: 6, src: img07Ces, name: "Čestr", category: "ambiente" },
  { id: 7, src: img08Bok, name: "Boku", category: "slevove" },
  { id: 8, src: img09Pul, name: "Pulkrab", category: "ambiente" },
  { id: 9, src: img10Ama, name: "Ambiente", category: "ambiente" },
];

// Total grid slots (some will be empty placeholders)
const GRID_SLOTS = 18;

type FilterType = "all" | "ambiente" | "slevove";

export function CardBrowser() {
  const [cards, setCards] = useState(allCards);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const shuffle = useCallback(() => {
    setCards((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }, []);

  const filteredCards =
    activeFilter === "all"
      ? cards
      : cards.filter((c) => c.category === activeFilter);

  // Fill remaining slots with empty placeholders
  const slots = Array.from({ length: GRID_SLOTS }, (_, i) => filteredCards[i] || null);

  return (
    <section className="mx-4 rounded-[20px] bg-[#C8102E] px-4 md:px-8 py-16 md:py-24 overflow-hidden">
      {/* Heading */}
      <h2
        className="text-white text-center tracking-[-0.02em] leading-[1.1] mb-10"
        style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
      >
        Prohlédněte si všechny karty
      </h2>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-8 max-w-[1400px] mx-auto">
        <button className="border border-white text-white px-5 py-2 rounded-[10px] tracking-[-0.02em] cursor-pointer flex items-center gap-2 hover:bg-white/10 transition">
          Podnik <span>↓</span>
        </button>
        <button
          onClick={() => setActiveFilter("ambiente")}
          className={`border border-white px-5 py-2 rounded-[10px] tracking-[-0.02em] cursor-pointer transition ${
            activeFilter === "ambiente"
              ? "bg-white text-[#C8102E]"
              : "text-white hover:bg-white/10"
          }`}
        >
          Ambiente
        </button>
        <button
          onClick={() => setActiveFilter("slevove")}
          className={`border border-white px-5 py-2 rounded-[10px] tracking-[-0.02em] cursor-pointer transition ${
            activeFilter === "slevove"
              ? "bg-white text-[#C8102E]"
              : "text-white hover:bg-white/10"
          }`}
        >
          Slevové
        </button>
        <div className="flex-1" />
        <button
          onClick={() => {
            setActiveFilter("all");
            shuffle();
          }}
          className="bg-white text-[#C8102E] px-5 py-2 rounded-[10px] tracking-[-0.02em] cursor-pointer hover:bg-white/90 transition"
        >
          Zamíchat
        </button>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[1400px] mx-auto">
        {slots.map((card, i) => (
          <div
            key={card ? card.id : `empty-${i}`}
            className="bg-[#D92D49] rounded-[10px] aspect-[230/325] flex items-center justify-center overflow-hidden"
          >
            {card ? (
              <div className="p-3 w-full h-full">
                <img
                  src={card.src}
                  alt={card.name}
                  className="w-full h-full object-cover rounded-sm shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
