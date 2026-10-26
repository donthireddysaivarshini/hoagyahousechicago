import React, { useEffect, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import siteData from "../../data/siteData.json";
import { useCart } from "../../context/CartContext";
import FullScreenNavMenu from "./FullScreenNavMenu";

interface HeaderProps {
  currentView?: "home" | "menu" | "contact" | "auth" | "admin";
  onNavigateHome?: () => void;
  onNavigateMenu?: () => void;
  onNavigateContact?: () => void;
  onNavigateAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = "home",
  onNavigateHome,
  onNavigateMenu,
  onNavigateContact,
  onNavigateAuth,
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { totalCount, setIsCartOpen, subtotal } = useCart();
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else if (lenis) {
      lenis.scrollTo(0, { immediate: false, duration: 0.9 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`site-header ${isSticky ? "is-sticky" : ""}`} id="siteHeader">
        <div className="site-header__bar">
        {/* Left Side: Explore Menu on Home, or Home Button on other views */}
        <div className="site-header__left">
          {currentView === "home" ? (
            <button
              type="button"
              className="site-header__menu-btn"
              onClick={onNavigateMenu}
              aria-label="Explore Menu"
            >
              <span>Explore Menu</span>
            </button>
          ) : (
            <div className="site-header__nav-group">
              <button
                type="button"
                className="site-header__back-btn"
                onClick={onNavigateHome}
                aria-label="Back to Home"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span className="site-header__back-text">Home</span>
              </button>
              {currentView === "contact" && (
                <button
                  type="button"
                  className="site-header__menu-btn"
                  onClick={onNavigateMenu}
                  aria-label="Explore Menu"
                >
                  <span>Explore Menu</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Center Sticky Logo */}
        <div className="site-header__center">
          <a
            href="#"
            onClick={handleLogoClick}
            className={`site-header__brand site-header__brand--hoagy ${currentView === "menu" ? "site-header__brand--menu" : ""}`}
            aria-label={`${siteData.brand.name} Home - Back to top`}
          >
            <img
              src={`/${siteData.brand.logoImg}`}
              alt={`${siteData.brand.name} - ${siteData.brand.tagline}`}
              className="site-header__logo-img"
            />
          </a>
        </div>

        {/* Right Corner: Cart Button + Hamburger Nav Button */}
        <div className="site-header__right">
          {/* Cart Icon & Button */}
          <button
            type="button"
            className="site-header__cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open Basket with ${totalCount} items`}
          >
            <div className="site-header__cart-icon-wrap">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalCount > 0 && (
                <span className="site-header__cart-badge">{totalCount}</span>
              )}
            </div>
            <span className="site-header__cart-label">
              {totalCount > 0 ? `$${subtotal.toFixed(2)}` : "Cart"}
            </span>
          </button>

          {/* Hamburger Nav Button */}
          <button
            type="button"
            className="site-header__hamburger-btn"
            onClick={() => setIsNavOpen(true)}
            aria-label="Open Navigation Menu"
            aria-expanded={isNavOpen}
          >
            <div className="site-header__hamburger-lines" aria-hidden="true">
              <span className="site-header__hamburger-line" />
              <span className="site-header__hamburger-line" />
              <span className="site-header__hamburger-line" />
            </div>
          </button>
        </div>
      </div>
    </header>

    {/* Full Screen Spreading Navigation Menu */}
    <FullScreenNavMenu
      isOpen={isNavOpen}
      onClose={() => setIsNavOpen(false)}
      onNavigateHome={onNavigateHome || (() => {})}
      onNavigateMenu={onNavigateMenu || (() => {})}
      onNavigateContact={onNavigateContact || (() => {})}
      onNavigateAuth={onNavigateAuth}
      currentView={currentView}
    />
  </>
);
};

export default Header;
