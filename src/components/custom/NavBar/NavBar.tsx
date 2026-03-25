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
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      if (current < 10) {
        setVisible(true);
      } else if (current > lastScrollY.current + 6) {
        setVisible(false); // scrolling down
      } else if (current < lastScrollY.current - 4) {
        setVisible(true); // scrolling up
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

  return (
    <div
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        visible ? "translate-y-0" : "-translate-y-full",
        scrolled
          ? "bg-[#003d2a]/95 backdrop-blur-md shadow-lg"
          : "bg-[#00543d]/80 backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[76px]">

        {/* Logo */}
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex-shrink-0">
          <img
            src="/images/N-Horiz-Full.png"
            alt="Northwest Missouri State University"
            className="h-10 w-auto object-contain brightness-0 invert"
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
                        className="px-4 py-2 text-sm font-semibold text-white/90
                          hover:text-white hover:bg-white/10
                          data-[state=open]:bg-white/10 data-[state=open]:text-white
                          bg-transparent border-none cursor-pointer transition-colors rounded-lg"
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="p-1.5 w-48 bg-[#003d2a] rounded-xl shadow-xl border border-white/10">
                          {item.dropdown.map((child) => (
                            <li key={child.label}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.href}
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                  className="block px-4 py-2 text-sm font-medium
                                    text-white/80 rounded-lg
                                    hover:bg-white/10 hover:text-white
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
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="px-4 py-2 text-sm font-semibold rounded-lg
                          text-white/90 hover:text-white hover:bg-white/10
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
          <div className="flex items-center pl-3 border-l border-white/20 ml-1 gap-2">
            {firebaseUser ? (
              <>
                {(isAdmin || isReviewer) && (
                  <Link
                    to="/dashboard"
                    className="text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
                  >
                    {isAdmin ? "Admin" : "Reviewer"}
                  </Link>
                )}
                <span className="text-sm text-white/70 hidden md:block max-w-[140px] truncate">
                  {displayName}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-[#003d2a] bg-white px-4 py-1.5 rounded-lg hover:bg-green-50 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-[#003d2a] bg-white px-4 py-1.5 rounded-lg hover:bg-green-50 transition"
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


  const displayName =
    userProfile?.profile?.firstName
      ? `${userProfile.profile.firstName} ${userProfile.profile.lastName}`
      : firebaseUser?.email ?? "";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[84px]">

        {/* Logo */}
        <Link to="/" onClick={scrollToTop} className="flex-shrink-0">
          <img
            src="/images/N-Horiz-Full.png"
            alt="Northwest Missouri State University"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Nav links + auth — right side */}
        <div className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-0.5">
              {navLinks.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.dropdown ? (
                    <>
                      <NavigationMenuTrigger
                        className="px-4 py-2 text-sm font-semibold text-[#006a4e]
                          hover:bg-green-50
                          data-[state=open]:bg-green-50
                          bg-transparent border-none cursor-pointer transition-colors"
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="p-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100">
                          {item.dropdown.map((child) => (
                            <li key={child.label}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.href}
                                  onClick={scrollToTop}
                                  className="block px-4 py-2 text-sm font-medium
                                    text-gray-700 rounded-lg
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
                        className="px-4 py-2 text-sm font-semibold rounded-lg
                          text-[#006a4e]
                          hover:bg-green-50
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

          {/* Auth section */}
          <div className="flex items-center pl-3 border-l border-gray-200 ml-1">
            {firebaseUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[160px] truncate">
                  {displayName}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm font-semibold text-white bg-[#006a4e] px-4 py-1.5 rounded-lg hover:bg-[#00543d] transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={scrollToTop}
                className="text-sm font-semibold text-white bg-[#006a4e] px-4 py-1.5 rounded-lg hover:bg-[#00543d] transition"
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
