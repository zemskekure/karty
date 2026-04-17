import { AmbienteLogo } from "./AmbienteLogo";

export function FloatingControls() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top-right floating circle button */}
      <button
        onClick={scrollToTop}
        className="fixed top-5 right-5 z-50 w-10 h-10 flex items-center justify-center cursor-pointer hover:scale-110 transition"
      >
        <AmbienteLogo fill="#C8102E" size={28} />
      </button>

      {/* Bottom-right floating red circle */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full bg-[#C8102E] shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 13V1M7 1L1 7M7 1L13 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}