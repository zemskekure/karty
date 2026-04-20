import imgRectangle from "figma:asset/2c1ac18706b11fdc388c5c050b6f11cea4308374.webp";
import { AmbienteLogo } from "./AmbienteLogo";

const locations = [
  {
    title: "Klub Ambiente",
    subtitle: "Rybná 14, Praha 1",
  },
  {
    title: "Podniky Ambiente",
    subtitle: null,
  },
  {
    title: "Online",
    subtitle: "E-shop Jídlo a radost",
  },
];

export function WhereToBuy() {
  return (
    <section
      id="kde-karty-koupit"
      className="relative mx-4 rounded-[20px] overflow-hidden px-6 py-16 md:py-24 min-h-[600px] flex flex-col items-center justify-center"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={imgRectangle}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex justify-center mb-8">
        <AmbienteLogo fill="white" size={38} />
      </div>

      {/* Heading */}
      <h2
        className="relative z-10 text-white text-center tracking-[-0.02em] leading-[1.1] mb-6"
        style={{ fontSize: "clamp(36px, 6vw, 96px)" }}
      >
        Kde karty koupíte
      </h2>

      {/* Subtitle */}
      <div
        className="relative z-10 text-white text-center tracking-[-0.02em] leading-[1.1] max-w-[600px] mb-12"
        style={{ fontSize: "clamp(14px, 2vw, 24px)" }}
      >
        <p className="mb-1">Sběratelské karty jsou k dispozici na následujících místech.</p>
        <p>Cena balíčku je 115 Kč.</p>
      </div>

      {/* Location cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[1100px]">
        {locations.map((loc) => (
          <div
            key={loc.title}
            className="border border-white rounded-[10px] px-6 py-8 flex flex-col items-center justify-center text-center min-h-[105px] hover:bg-white/10 transition cursor-pointer"
          >
            <p
              className="text-white tracking-[-0.02em] leading-[1.1]"
              style={{ fontSize: "20px", fontWeight: 700 }}
            >
              {loc.title}
            </p>
            {loc.subtitle && (
              <p
                className="text-white tracking-[-0.02em] leading-[1.1] mt-1"
                style={{ fontSize: "20px" }}
              >
                {loc.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
