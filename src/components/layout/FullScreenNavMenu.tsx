import React, { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/full-screen-nav.css";

interface FullScreenNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onNavigateMenu: () => void;
  currentView?: "home" | "menu";
}

export const FullScreenNavMenu: React.FC<FullScreenNavMenuProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onNavigateMenu,
  currentView = "home",
}) => {
  const { totalCount, setIsCartOpen, showToast } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const navRoutes = [
    {
      num: "01",
      id: "home",
      label: "HOME",
      onClick: () => {
        onClose();
        onNavigateHome();
      },
      isActive: currentView === "home",
    },
    {
      num: "02",
      id: "menu",
      label: "EXPLORE MENU",
      onClick: () => {
        onClose();
        onNavigateMenu();
      },
      isActive: currentView === "menu",
    },
    {
      num: "03",
      id: "cart",
      label: "CART",
      badge: totalCount > 0 ? String(totalCount) : undefined,
      onClick: () => {
        onClose();
        setIsCartOpen(true);
      },
      isActive: false,
    },
    {
      num: "04",
      id: "orders",
      label: "MY ORDERS",
      onClick: () => {
        onClose();
        showToast("My Orders feature is in active development!");
      },
      isActive: false,
    },
    {
      num: "05",
      id: "payments",
      label: "PAYMENT HISTORY",
      onClick: () => {
        onClose();
        showToast("Payment History feature is in active development!");
      },
      isActive: false,
    },
    {
      num: "06",
      id: "login",
      label: "LOGIN",
      onClick: () => {
        onClose();
        showToast("Login & Account feature is in active development!");
      },
      isActive: false,
    },
  ];

  return (
    <div
      className={`fullscreen-nav ${isOpen ? "is-open" : ""}`}
      id="fullscreenNavMenu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* LEFT COLUMN: Cinematic luxury dark-themed chateau lounge & amber chandelier interior */}
      <div className="fullscreen-nav__visual-col">
        <img
          src="/images/nav_menu_visual.webp"
          alt="Luxury chateau lounge interior"
          className="fullscreen-nav__visual-img"
          loading="lazy"
        />
        <div className="fullscreen-nav__visual-overlay" />
      </div>

      {/* RIGHT COLUMN: Dark textured panel with navigation routes */}
      <div className="fullscreen-nav__panel-col">
        {/* Organic Torn Paper Edge SVG */}
        <svg
          className="fullscreen-nav__torn-edge"
          viewBox="0 0 60 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 60,0 L 60,1000 L 14,1000 L 22,965 L 12,930 L 28,895 L 14,860 L 26,825 L 10,790 L 30,755 L 16,720 L 32,685 L 12,650 L 25,615 L 15,580 L 30,545 L 8,510 L 28,475 L 16,440 L 33,405 L 12,370 L 27,335 L 14,300 L 31,265 L 16,230 L 28,195 L 10,160 L 29,125 L 14,90 L 26,55 L 12,20 L 24,0 Z"
            fill="currentColor"
          />
        </svg>

        {/* Top Action Icons: Cart + Close */}
        <div className="fullscreen-nav__top-actions">
          <button
            type="button"
            className="fullscreen-nav__cart-btn"
            onClick={() => {
              onClose();
              setIsCartOpen(true);
            }}
            aria-label={`View cart with ${totalCount} items`}
          >
            <svg
              className="fullscreen-nav__cart-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="fullscreen-nav__cart-badge">{totalCount}</span>
          </button>

          <button
            type="button"
            className="fullscreen-nav__close-btn"
            onClick={onClose}
            aria-label="Close Navigation Menu"
          >
            <svg
              className="fullscreen-nav__close-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Center: Numbered Navigation Stack */}
        <nav className="fullscreen-nav__menu-body">
          <ul className="fullscreen-nav__links-list">
            {navRoutes.map((route) => (
              <li key={route.id} className="fullscreen-nav__link-item">
                <button
                  type="button"
                  className={`fullscreen-nav__link-btn ${route.isActive ? "is-active" : ""}`}
                  onClick={route.onClick}
                >
                  <span className="fullscreen-nav__link-num">{route.num}</span>
                  <span className="fullscreen-nav__link-text">{route.label}</span>
                  {route.badge && (
                    <span className="fullscreen-nav__link-badge">{route.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Footer: Policies & Social Icons */}
        <div className="fullscreen-nav__footer">
          <div className="fullscreen-nav__policies">POLICIES</div>
          <div className="fullscreen-nav__socials">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="fullscreen-nav__social-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="fullscreen-nav__social-link"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="fullscreen-nav__social-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter / X"
              className="fullscreen-nav__social-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenNavMenu;
