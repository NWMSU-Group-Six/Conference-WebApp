import fbLogo from "@/assets/sponsors/facebook-logo-300x106.png";
import googleLogo from "@/assets/sponsors/Google-Logo-1-300x200.png";
import knightLogo from "@/assets/sponsors/knight-foundation-logo-300x85.png";
import msLogo from "@/assets/sponsors/Microsoft-Logo-300x134.png";
import palantirLogo from "@/assets/sponsors/Palantir-Logo-300x81.png";
import nsfLogo from "@/assets/sponsors/national-science-foundation-300x96.png";
import sloanLogo from "@/assets/sponsors/Sloan-Logo-primary-blac-web-300x176.png";

const sponsors = [
  { src: fbLogo, alt: "Facebook" },
  { src: googleLogo, alt: "Google" },
  { src: knightLogo, alt: "Knight Foundation" },
  { src: msLogo, alt: "Microsoft" },
  { src: palantirLogo, alt: "Palantir" },
  { src: nsfLogo, alt: "National Science Foundation" },
  { src: sloanLogo, alt: "Sloan" },
];

function Sponsors() {
  return (
    <>
      <section className="hero-section">
        <div className="cfp-container">
          <h1 className="main-heading">Sponsors</h1>
          <p className="subtitle">
            Thank you to our generous sponsors who support the Northwest
            Conference 2026.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sponsors.map((s) => (
            <div key={s.alt} className="flex items-center justify-center p-4">
              <img src={s.src} alt={s.alt} className="max-h-24 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sponsors;
