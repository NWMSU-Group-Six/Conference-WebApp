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
import { getAuth, signOut } from "firebase/auth";


import type { User } from "firebase/auth";
interface NavBarProps {
  user: User | null;
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const auth = getAuth();

const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log("Signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};


function NavBar({ user }: NavBarProps) {
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
      <div className="ml-auto flex items-right gap-3">
  {user ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-2 rounded-xl shadow-sm">

      <span>{user.email}</span>
      <button
        onClick={handleSignOut}
        className="text-sm font-semibold text-white bg-[#006a4e] px-3 py-1.5 rounded-lg hover:bg-[#00543d] transition"
      >
        Sign Out 
      </button>
    </div>
  ) : (
    <span className="text-sm font-medium text-gray-500">Not signed in</span>
  )}
</div>

    </div>
  );
}

export default NavBar;