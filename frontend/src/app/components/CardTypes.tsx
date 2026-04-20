import img09Pul from "figma:asset/f19669c960f98bb05b3b8252f49f44887097b6f5.webp";
import img02Acz from "figma:asset/b84fb334be93df64d75c215b19d5f9d6f2d5bfc6.webp";
import img05KarpHolo from "figma:asset/89a7725044543d01ba114f3c97289aa8a7f27626.webp";
import { AmbienteLogo } from "./AmbienteLogo";

const cardTypes = [
  {
    title: "Běžné",
    description: "sběratelské karty bez slevy",
    image: img09Pul,
  },
  {
    title: "Sběratelské",
    description: "sběratelské karty s jednorázovou slevou",
    image: img02Acz,
  },
  {
    title: "Legendární",
    description: "sběratelské karty s dlouhodobou slevou",
    image: img05KarpHolo,
  },
];

export function CardTypes() {
  return (
    <section className="bg-white px-6 py-16 md:py-24 mx-4 rounded-[20px]">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <AmbienteLogo fill="#C8102E" size={38} />
      </div>

      {/* Heading */}
      <h2
        className="text-[#C8102E] text-center tracking-[-0.02em] leading-[1.1] mb-14"
        style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
      >
        Jaké karty můžete získat
      </h2>

      {/* 3 cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
        {cardTypes.map((type) => (
          <div key={type.title} className="flex flex-col items-center">
            {/* Label above card */}
            <div className="text-center mb-3">
              <p
                className="text-[#C8102E] tracking-[-0.02em] leading-[1.2]"
                style={{ fontSize: "20px", fontWeight: 700 }}
              >
                {type.title}
              </p>
              <p
                className="text-[#C8102E] tracking-[-0.02em] leading-[1.2]"
                style={{ fontSize: "20px" }}
              >
                {type.description}
              </p>
            </div>
            {/* Card image */}
            <div className="w-full max-w-[333px] aspect-[333/471] rounded-[12px] overflow-hidden shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              <img
                src={type.image}
                alt={type.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
