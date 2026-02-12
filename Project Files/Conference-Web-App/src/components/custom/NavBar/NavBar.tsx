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

function NavBar() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full border-b bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        {/* Logo - Always Links Home */}
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
            {/* About Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 p-4 w-48">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/general-info">General Info</Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/pricing">Pricing</Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/faq">FAQ</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Agenda */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/agenda">Agenda</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Speakers */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/speakers">Speakers</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Sponsors */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/sponsors">Sponsors</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Contact */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/contact">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Login */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/login">Login</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

export default NavBar;
