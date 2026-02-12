import { Link } from "react-router-dom";
import logo from "@/assets/N60-2Stack-Full.png";
import { navLinks } from "@/data/links";

function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo / Branding */}
        <div className="flex flex-col items-start">
          <Link to="/">
            <img src={logo} alt="Northwest Logo" className="h-12 w-auto mb-4" />
          </Link>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Northwest Conference
          </p>
        </div>

        {/* Map Links into Columns */}
        {navLinks.map((item) => (
          <div key={item.label}>
            <h3 className="text-sm font-semibold mb-3">{item.label}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {item.dropdown ? (
                item.dropdown.map((sub) => (
                  <li key={sub.label}>
                    <Link
                      to={sub.href}
                      className="hover:text-primary transition"
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    to={item.href}
                    className="hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
