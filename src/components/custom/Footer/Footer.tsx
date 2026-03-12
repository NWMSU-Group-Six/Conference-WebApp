import { Link } from "react-router-dom";
import { navLinks } from "@/data/links";
import { scrollToTop } from "@/utils/scrollToTop";

function Footer() {
  return (
    <footer className="w-full border-t" style={{ backgroundColor: "#f0faf5" }}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo / Branding */}
        <div className="flex flex-col items-start gap-3">
          <Link to="/" onClick={scrollToTop}>
            <img
              src="/images/logo-n.svg"
              alt="Northwest Missouri State University"
              className="h-12 w-auto"
            />
          </Link>
          <p className="text-sm font-semibold" style={{ color: "#006a4e" }}>
            Northwest Conference 2026
          </p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Northwest Missouri State University
          </p>
        </div>

        {/* Map Links into Columns */}
        {navLinks.map((item) => (
          <div key={item.label}>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#006a4e" }}>
              {item.label}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {item.dropdown ? (
                item.dropdown.map((sub) => (
                  <li key={sub.label}>
                    <Link
                      onClick={scrollToTop}
                      to={sub.href}
                      className="hover:text-[#006a4e] transition-colors"
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    onClick={scrollToTop}
                    to={item.href}
                    className="hover:text-[#006a4e] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t text-center py-4 text-xs text-gray-500">
        Northwest Missouri State University · 800 University Drive, Maryville,
        MO 64468 · (660) 562-1212 ·{" "}
        <a
          href="mailto: CSIS@nwmissouri.edu"
          className="hover:text-[#006a4e] transition-colors"
        >
          CSIS@nwmissouri.edu
        </a>
      </div>
    </footer>
  );
}

export default Footer;
