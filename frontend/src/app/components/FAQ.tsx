import { useState } from "react";
import { AmbienteLogo } from "./AmbienteLogo";

const faqItems = [
  {
    question: "Co když mi QR kód nefunguje / karta je poškozená?",
    answer: "Pokud váš QR kód nefunguje nebo je karta poškozená, kontaktujte nás prosím na e-mailu karty@ambiente.cz. Přiložte fotografii karty a my vám pomůžeme problém vyřešit.",
  },
  {
    question: "Kdy a kde musím registrovat kartu pro opakovanou slevu?",
    answer: "Kartu pro opakovanou slevu zaregistrujete online na našem webu. Stačí naskenovat QR kód na kartě a vyplnit registrační formulář. Registrace je možná kdykoliv po zakoupení balíčku.",
  },
  {
    question: "Platí slevy ve všech podnicích Ambiente?",
    answer: "Ano, slevy z karet platí ve všech podnicích Ambiente. Každá slevová karta obsahuje informaci o konkrétní výši slevy a podmínkách jejího uplatnění.",
  },
  {
    question: "Kolik karet je v jednom balíčku?",
    answer: "Každý balíček obsahuje 5 náhodně vybraných karet z celkové edice 156 unikátních karet.",
  },
  {
    question: "Mohu karty vyměňovat s ostatními sběrateli?",
    answer: "Samozřejmě! Karty jsou určeny ke sbírání i výměně. Můžete se spojit s ostatními sběrateli prostřednictvím našich sociálních sítí nebo přímo v podnicích Ambiente.",
  },
  {
    question: "Jak dlouho platí slevové karty?",
    answer: "Jednorázové slevové karty platí 6 měsíců od zakoupení balíčku. Karty s opakovanou slevou platí 12 měsíců od registrace.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white px-6 py-16 md:py-24 mx-4 rounded-[20px]">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <AmbienteLogo fill="#C8102E" size={48} />
      </div>

      {/* Heading */}
      <h2
        className="text-[#C8102E] text-center tracking-[-0.02em] leading-[1.1] mb-12"
        style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
      >
        Časté dotazy
      </h2>

      {/* FAQ items */}
      <div className="max-w-[800px] mx-auto">
        {faqItems.map((item, i) => (
          <div key={i}>
            <div className="border-t border-[#C8102E]" />
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full py-4 flex items-center justify-center text-center cursor-pointer group"
            >
              <span
                className="text-[#C8102E] tracking-[-0.02em] leading-[1.5] hover:opacity-80 transition"
                style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
              >
                {item.question} {openIndex === i ? "↑" : "↓"}
              </span>
            </button>
            {openIndex === i && (
              <div className="pb-4 px-4">
                <p
                  className="text-[#C8102E] text-center tracking-[-0.02em] leading-[1.2]"
                  style={{ fontSize: "16px" }}
                >
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
        <div className="border-t border-[#C8102E]" />
      </div>
    </section>
  );
}
