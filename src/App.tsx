import React, { useCallback, useEffect, useState } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import IntroLoader from "./components/loader/IntroLoader";
import Header from "./components/layout/Header";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BurgerExplodeSection from "./sections/BurgerExplodeSection";
import FeaturedSection from "./sections/FeaturedSection";
import MainMenuPage from "./sections/MainMenuPage";
import ContactPage from "./sections/ContactPage";
import Footer from "./components/layout/Footer";
import { CartProvider, useCart } from "./context/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<"home" | "menu" | "contact">(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash.startsWith("#contact")) return "contact";
      if (window.location.hash.startsWith("#menu")) return "menu";
    }
    return "home";
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toastMessage } = useCart();
  const lenis = useLenis();

  // Universal bulletproof scroll-to-top handler
  const resetScrollToTop = useCallback((immediate = true) => {
    if (lenis) {
      lenis.scrollTo(0, { immediate, force: true });
      lenis.resize();
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: immediate ? ("instant" as ScrollBehavior) : "smooth",
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [lenis]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith("#contact")) {
        setCurrentView("contact");
      } else if (window.location.hash.startsWith("#menu")) {
        setCurrentView("menu");
      } else {
        setCurrentView("home");
      }
      resetScrollToTop(true);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [resetScrollToTop]);

  // Synchronize ScrollTrigger and view switches with scroll-to-top
  useEffect(() => {
    // 1. Immediately reset scroll
    resetScrollToTop(true);

    if (currentView !== "home") {
      ScrollTrigger.getAll().forEach((st) => st.disable());
      const timer = setTimeout(() => {
        resetScrollToTop(true);
        if (lenis) lenis.resize();
      }, 25);
      return () => clearTimeout(timer);
    } else {
      resetScrollToTop(true);
      const timer = setTimeout(() => {
        resetScrollToTop(true);
        ScrollTrigger.getAll().forEach((st) => st.enable());
        ScrollTrigger.refresh();
        if (lenis) lenis.resize();
        window.dispatchEvent(new Event("resize"));
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [currentView, lenis, resetScrollToTop]);

  const navigateToHome = () => {
    if (window.location.hash !== "") {
      window.location.hash = "";
    }
    if (currentView === "home") {
      if (lenis) {
        lenis.scrollTo(0, { immediate: false, duration: 0.9 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setCurrentView("home");
      resetScrollToTop(true);
    }
  };

  const navigateToMenu = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    if (window.location.hash !== "#menu") {
      window.location.hash = "menu";
    }
    if (currentView === "menu") {
      if (lenis) {
        lenis.scrollTo(0, { immediate: false, duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setCurrentView("menu");
      resetScrollToTop(true);
    }
  };

  const navigateToContact = () => {
    if (window.location.hash !== "#contact") {
      window.location.hash = "contact";
    }
    if (currentView === "contact") {
      if (lenis) {
        lenis.scrollTo(0, { immediate: false, duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setCurrentView("contact");
      resetScrollToTop(true);
    }
  };

  return (
    <>
      {/* Brand Intro Loading Screen (Only on initial load) */}
      <IntroLoader />

      {/* Sticky Luxury Header with Menu & Cart Controls */}
      <Header
        currentView={currentView}
        onNavigateHome={navigateToHome}
        onNavigateMenu={() => navigateToMenu("all")}
        onNavigateContact={navigateToContact}
      />

      {/* Main Content: Seamless view switching without destructive unmounting */}
      <main id="site-main">
        <div
          id="homeView"
          style={{ display: currentView === "home" ? "block" : "none" }}
        >
          {/* 1st Section: 3D Exploded Burger Hero */}
          <BurgerExplodeSection isActive={currentView === "home"} />

          {/* 2nd Section: Featured Signature Categories Showcase */}
          <FeaturedSection onNavigateToMenu={navigateToMenu} />
        </div>

        <div
          id="menuView"
          style={{ display: currentView === "menu" ? "block" : "none" }}
        >
          <MainMenuPage
            onBackToHome={navigateToHome}
            initialCategory={selectedCategory}
          />
        </div>

        <div
          id="contactView"
          style={{ display: currentView === "contact" ? "block" : "none" }}
        >
          <ContactPage
            onBackToHome={navigateToHome}
            onNavigateMenu={() => navigateToMenu("all")}
          />
        </div>
      </main>

      {/* Luxury Footer */}
      <Footer onNavigateContact={navigateToContact} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer onNavigateToMenu={navigateToMenu} />

      {/* Quick Add Notification */}
      {toastMessage && (
        <div className="cart-toast" role="status" aria-live="polite">
          <span className="cart-toast__dot" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ReactLenis root>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ReactLenis>
  );
};

export default App;
