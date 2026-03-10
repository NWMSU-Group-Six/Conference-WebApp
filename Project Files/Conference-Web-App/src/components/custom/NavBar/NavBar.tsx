import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navLinks } from "@/data/links.ts";
import { scrollToTop } from "@/utils/scrollToTop";
import scrollToHash from "@/utils/scrollToHash";

function NavBar() {
  return (
    <div className="w-full fixed top-0 left-0 z-50" style={{ backgroundColor: "#006a4e" }}>
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
        {/* Logo + Site Name */}
        <Link to="/" onClick={scrollToTop} className="flex items-center gap-3">
          <img
            src="/images/logo-n.svg"
            alt="Northwest Missouri State University"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-bold tracking-wide" style={{ color: "#fff" }}>
            Northwest Conference
          </span>
        </Link>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            {navLinks.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.dropdown ? (
                  <>
                    <NavigationMenuTrigger
                      className="text-white bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10"
                      style={{ color: "#fff" }}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-1 p-3 w-48">
                        {item.dropdown.map((sub) => (
                          <li key={sub.label}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={sub.href}
                                onClick={scrollToHash}
                                className="block px-3 py-2 text-sm rounded hover:bg-green-50 hover:text-[#006a4e] font-medium transition-colors"
                              >
                                {sub.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      onClick={scrollToTop}
                      className="px-4 py-2 text-sm font-semibold rounded hover:bg-white/10 transition-colors"
                      style={{ color: "#fff" }}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

export default NavBar;
