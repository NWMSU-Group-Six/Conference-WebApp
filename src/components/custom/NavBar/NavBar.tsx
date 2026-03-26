import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < 10) {
        setVisible(true);
      } else if (current > lastScrollY.current + 6) {
        setVisible(false);
        setMobileOpen(false);
      } else if (current < lastScrollY.current - 4) {
        setVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const displayName =
    userProfile?.profile?.firstName
      ? `${userProfile.profile.firstName} ${userProfile.profile.lastName}`
      : firebaseUser?.email ?? "";

  const isAdmin = userProfile?.roles?.includes("admin");
  const isReviewer = userProfile?.roles?.includes("reviewer");

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    navigate("/");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenSection(null);
    scrollToTop();
  };

  return (
    <>
      <div
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
          "bg-white border-b border-gray-200 shadow-sm",
          visible ? "translate-y-0" : "-translate-y-full",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" onClick={closeMobile} className="flex-shrink-0">
            <img
              src="/images/N-Horiz-Full.png"
              alt="Northwest Missouri State University"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav links + auth — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
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
                  <span className="text-sm text-gray-500 max-w-[140px] truncate">
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

          {/* Hamburger button — visible on mobile only */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-down panel */}
          <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg overflow-y-auto max-h-[calc(100vh-72px)]">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      {/* Section toggle */}
                      <button
                        onClick={() =>
                          setOpenSection((s) =>
                            s === item.label ? null : item.label,
                          )
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${openSection === item.label ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Dropdown children */}
                      {openSection === item.label && (
                        <div className="mt-1 ml-4 space-y-1 border-l-2 border-green-100 pl-3">
                          {item.dropdown.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              onClick={closeMobile}
                              className="block px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-green-50 hover:text-[#006a4e] transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href!}
                      onClick={closeMobile}
                      className="block px-4 py-3 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#006a4e] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Auth section */}
              <div className="pt-4 mt-3 border-t border-gray-100 space-y-2">
                {firebaseUser ? (
                  <>
                    <p className="px-4 py-1 text-xs text-gray-400 truncate">{displayName}</p>
                    {(isAdmin || isReviewer) && (
                      <Link
                        to="/dashboard"
                        onClick={closeMobile}
                        className="block px-4 py-3 text-sm font-semibold text-[#006a4e] bg-green-50 hover:bg-green-100 rounded-lg transition"
                      >
                        {isAdmin ? "Admin Dashboard" : "Reviewer Dashboard"}
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-sm font-semibold text-white bg-[#006a4e] hover:bg-[#00543d] px-4 py-3 rounded-lg transition text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="block px-4 py-3 text-sm font-semibold text-white bg-[#006a4e] hover:bg-[#00543d] rounded-lg transition text-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;

