import { AmbienteLogo } from "./AmbienteLogo";
import svgPaths from "../../imports/svg-yz6ef4796w";

function SmallLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 13.9646 13.9777" fill="none">
      <path d={svgPaths.p32738480} fill="white" />
      <path d={svgPaths.p5eb2180} fill="white" />
      <path d={svgPaths.p3b0ca880} fill="white" />
      <path d={svgPaths.p16b8c300} fill="white" />
    </svg>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-4 mb-4 rounded-[20px] bg-[#C8102E] px-6 md:px-8 py-8 md:py-12">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <AmbienteLogo fill="white" size={38} />
      </div>

      {/* Buttons */}
      <div className="max-w-[1400px] mx-auto space-y-3 mb-20">
        <button className="w-full bg-white text-[#C8102E] py-3 rounded-[10px] tracking-[-0.02em] cursor-pointer hover:bg-white/90 transition">
          Zaregistrovat slevovou kartu
        </button>
        <button className="w-full border-2 border-white text-white py-3 rounded-[10px] tracking-[-0.02em] cursor-pointer hover:bg-white/10 transition">
          Obchodní podmínky
        </button>
      </div>

      {/* Bottom area */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <button
          onClick={scrollToTop}
          className="text-white tracking-[-0.04em] leading-[0.96] cursor-pointer hover:opacity-80 transition text-left"
          style={{ fontSize: "clamp(64px, 8vw, 128px)" }}
        >
          Nahoru.
        </button>
        <div className="flex items-center gap-2">
          <SmallLogo />
          <p
            className="text-white tracking-[-0.02em] leading-[1.2]"
            style={{ fontSize: "16px" }}
          >
            Za sběratelskými kartami stojí lidé z Ambiente.
          </p>
        </div>
      </div>
    </section>
  );
}
