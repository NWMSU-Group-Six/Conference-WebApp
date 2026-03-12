import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navLinks } from "@/data/links";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function NavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[84px]">
        {/* Logo */}
        <Link to="/" onClick={scrollToTop}>
          <img
            src="/images/N-Horiz-Full.png"
            alt="Northwest Missouri State University"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Nav Links */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-1">
            {navLinks.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.dropdown ? (
                  <>
                    <NavigationMenuTrigger
                      className="px-4 py-2 text-sm font-semibold text-[#006a4e] 
                        hover:bg-green-50 hover:text-[#006a4e] 
                        data-[state=open]:bg-green-50 data-[state=open]:text-[#006a4e]
                        bg-transparent border-none cursor-pointer transition-colors"
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="p-2 w-48 bg-white rounded shadow-lg border">
                        {item.dropdown.map((child) => (
                          <li key={child.label}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={child.href}
                                onClick={scrollToTop}
                                className="block px-4 py-2 text-sm font-medium 
                                  text-gray-700 rounded 
                                  hover:bg-green-50 hover:text-[#006a4e] 
                                  transition-colors"
                              >
                                {child.label}
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
                      className="px-4 py-2 text-sm font-semibold rounded 
                        text-[#006a4e]
                        hover:bg-green-50 hover:text-[#006a4e] 
                        transition-colors"
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