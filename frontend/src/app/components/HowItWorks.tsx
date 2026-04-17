import { AmbienteLogo } from "./AmbienteLogo";
import videoSrc from "@/assets/video.mp4";

const features = [
  {
    title: "Sbírejte karty",
    description:
      "Edice sběratelských karet zachycuje osobnosti, jídla, restaurace a důležité momenty z historie Ambiente.",
  },
  {
    title: "Hrajte si",
    description:
      "Karty můžete porovnávat, přebíjet mezi sebou a skládat z nich karetní hry Kvarteto nebo Přebíjená. Pravidla her najdete tady.",
  },
  {
    title: "Získejte výhody",
    description:
      "Součástí edice jsou i karty, které přinášejí jednorázové nebo opakované slevy v restauracích Ambiente.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="jak-to-funguje"
      className="relative mx-4 rounded-[20px] overflow-hidden px-6 py-16 md:py-24"
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <AmbienteLogo fill="white" size={38} />
        </div>

        {/* Heading */}
        <h2
          className="text-white text-center tracking-[-0.02em] leading-[1.1] mb-6"
          style={{ fontSize: "clamp(36px, 6vw, 96px)", fontWeight: 700 }}
        >
          Jak to funguje
        </h2>

        {/* Subtitle */}
        <p
          className="text-white text-center tracking-[-0.02em] leading-[1.1] max-w-[668px] mx-auto mb-16"
          style={{ fontSize: "clamp(14px, 2vw, 24px)" }}
        >
          Každý balíček obsahuje 5 karet. Celá edice obsahuje 156 unikátních karet.
          Celkem je v oběhu 10 000 Balíčku a obsahují karty běžné, vzácné a
          legendární.
        </p>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1100px] mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <p
                className="text-white tracking-[-0.02em] leading-[1.2] mb-2"
                style={{ fontSize: "20px", fontWeight: 700 }}
              >
                {feature.title}
              </p>
              <p
                className="text-white tracking-[-0.02em] leading-[1.2]"
                style={{ fontSize: "20px" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
