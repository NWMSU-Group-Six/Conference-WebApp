import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navLinks } from "@/data/links";
import { useAuth } from "@/context/AuthContext";

function NavBar() {
  const { firebaseUser, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < 10) {
        setVisible(true);
      } else if (current > lastScrollY.current + 6) {
        setVisible(false);
      } else if (current < lastScrollY.current - 4) {
        setVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName =
    userProfile?.profile?.firstName
      ? `${userProfile.profile.firstName} ${userProfile.profile.lastName}`
      : firebaseUser?.email ?? "";

  const isAdmin = userProfile?.roles?.includes("admin");
  const isReviewer = userProfile?.roles?.includes("reviewer");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
        "bg-white border-b border-gray-200 shadow-sm",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">

        {/* Logo */}
        <Link to="/" onClick={scrollToTop} className="flex-shrink-0">
          <img
            src="/images/N-Horiz-Full.png"
            alt="Northwest Missouri State University"
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Nav links + auth */}
        <div className="flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-0">
              {navLinks.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.dropdown ? (
                    <>
                      <NavigationMenuTrigger
                        className="px-4 py-2 text-sm font-medium text-gray-700
                          hover:text-[#006a4e] hover:bg-green-50
                          data-[state=open]:bg-green-50 data-[state=open]:text-[#006a4e]
                          bg-transparent border-none cursor-pointer transition-colors rounded-lg"
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="p-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-100">
                          {item.dropdown.map((child) => (
                            <li key={child.label}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.href}
                                  onClick={scrollToTop}
                                  className="block px-4 py-2 text-sm font-medium
                                    text-gray-600 rounded-lg
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
                        className="px-4 py-2 text-sm font-medium rounded-lg
                          text-gray-700 hover:text-[#006a4e] hover:bg-green-50
                          transition-colors inline-block"
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth section */}
          <div className="flex items-center pl-3 border-l border-gray-200 ml-1 gap-2">
            {firebaseUser ? (
              <>
                {(isAdmin || isReviewer) && (
                  <Link
                    to="/dashboard"
                    className="text-xs font-semibold text-[#006a4e] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition"
                  >
                    {isAdmin ? "Admin" : "Reviewer"}
                  </Link>
                )}
                <span className="text-sm text-gray-500 hidden md:block max-w-[140px] truncate">
                  {displayName}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-white bg-[#006a4e] hover:bg-[#00543d] px-4 py-1.5 rounded-lg transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-white bg-[#006a4e] hover:bg-[#00543d] px-4 py-1.5 rounded-lg transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

