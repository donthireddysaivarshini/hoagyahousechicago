import React, { useEffect, useState } from "react";
import siteData from "../../data/siteData.json";
import FullScreenNavMenu from "./FullScreenNavMenu";

interface HeaderProps {
  currentView?: string;
  onNavigateHome?: () => void;
  onNavigateMenu?: () => void;
  onNavigateContact?: () => void;
  onNavigateAuth?: () => void;
  onNavigateOrders?: () => void;
  onNavigateProfile?: () => void;
  onOpenOrderModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = "home",
  onNavigateHome,
  onNavigateMenu,
  onNavigateContact,
  onNavigateAuth,
  onNavigateOrders,
  onNavigateProfile,
  onOpenOrderModal,
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

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
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`site-header ${isSticky ? "is-sticky" : ""}`} id="siteHeader">
        <div className="site-header__bar">
          {/* Left Side: Explore Menu on Home, or Home Back Button on other views */}
          <div className="site-header__left">
            {currentView === "home" ? (
              <button
                type="button"
                className="site-header__menu-btn"
                onClick={onNavigateMenu}
                aria-label="Explore Menu"
              >
                <span className="site-header__menu-btn-desktop">Explore Menu</span>
                <span className="site-header__menu-btn-mobile">Menu</span>
              </button>
            ) : (
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
                  aria-hidden="true"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span className="site-header__back-text">Home</span>
              </button>
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

          {/* Right Corner: Order Online CTA + Hamburger Nav Button */}
          <div className="site-header__right">
            {/* Order Online Action Button linking to Ordering Options */}
            <button
              type="button"
              className="site-header__order-btn"
              onClick={onOpenOrderModal}
              aria-label="Order Online on DoorDash or Uber Eats"
            >
              <span className="site-header__order-icon" aria-hidden="true">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </span>
              <span className="site-header__order-text-desktop">Order Online</span>
              <span className="site-header__order-text-mobile">Order</span>
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
        onNavigateOrders={onNavigateOrders}
        onNavigateProfile={onNavigateProfile}
        currentView={currentView}
      />
    </>
  );
};

export default Header;
