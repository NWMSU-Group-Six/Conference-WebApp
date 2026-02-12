import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logo from "@/assets/N60-2Stack-Full.png";
import { navLinks } from "@/data/links.ts";
import { scrollToTop } from "@/utils/scrollToTop";

function NavBar() {
  return (
    <div className="w-full border-b bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        {/* Logo */}
        <Link to="/" onClick={scrollToTop}>
          <img
            src={logo}
            alt="Northwest Logo"
            className="h-15 w-auto object-contain cursor-pointer"
          />
        </Link>
        <Link to="/" onClick={scrollToTop}>
          <h1 className="text-2xl font-semibold">Northwest Conference</h1>
        </Link>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            {navLinks.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.dropdown ? (
                  <>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-2 p-4 w-48">
                        {item.dropdown.map((sub) => (
                          <li key={sub.label}>
                            <NavigationMenuLink asChild>
                              <Link to={sub.href}>{sub.label}</Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link to={item.href}>{item.label}</Link>
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
