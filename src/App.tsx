import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import IntroLoader from "./components/loader/IntroLoader";
import SweepTransition from "./components/loader/SweepTransition";
import Header from "./components/layout/Header";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BurgerExplodeSection from "./sections/BurgerExplodeSection";
import FeaturedSection from "./sections/FeaturedSection";
import MainMenuPage from "./sections/MainMenuPage";
import ContactPage from "./sections/ContactPage";
import Footer from "./components/layout/Footer";
import { CartProvider, useCart } from "./context/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

type ViewType = "home" | "menu" | "contact";

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith("#contact")) return "contact";
      if (hash.startsWith("#menu")) return "menu";
    }
    return "home";
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isNavSweeping, setIsNavSweeping] = useState(false);
  const pendingNavRef = useRef<(() => void) | null>(null);

  const { toastMessage } = useCart();
  const lenis = useLenis();

  // Helper: check if a target is an admin page or route (Strictly bypass transitions for admin)
  const isAdminRoute = (routeOrHash?: string) => {
    const target = (
      routeOrHash ||
      (typeof window !== "undefined"
        ? window.location.pathname + window.location.hash
        : "")
    ).toLowerCase();

    return (
      target.includes("/admin") ||
      target.startsWith("#admin") ||
      target.startsWith("#/admin") ||
      target === "admin"
    );
  };

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

  // Client-side Page Sweep Transition Orchestrator (Only for client-side pages; skips admin)
  const executeClientTransition = useCallback(
    (targetView: ViewType, categoryToSet?: string) => {
      // 1. If target or current URL is an admin page, BYPASS transition completely!
      if (isAdminRoute(targetView) || isAdminRoute(window.location.hash)) {
        if (categoryToSet) setSelectedCategory(categoryToSet);
        setCurrentView(targetView);
        resetScrollToTop(true);
        return;
      }

      // 2. If navigating to the already active view, smooth scroll to top without curtain
      if (currentView === targetView) {
        if (categoryToSet) setSelectedCategory(categoryToSet);
        if (lenis) {
          lenis.scrollTo(0, { immediate: false, duration: 0.8 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      // 3. Avoid double-triggering if transition is already in flight
      if (isNavSweeping) return;

      // 4. Trigger smooth client-side SweepTransition
      setIsNavSweeping(true);
      pendingNavRef.current = () => {
        if (categoryToSet) setSelectedCategory(categoryToSet);
        setCurrentView(targetView);
        resetScrollToTop(true);
      };
    },
    [currentView, isNavSweeping, lenis, resetScrollToTop]
  );

  const handleNavCover = useCallback(() => {
    // When the shutter has 100% covered the screen, switch the view and reset scroll
    if (pendingNavRef.current) {
      pendingNavRef.current();
      pendingNavRef.current = null;
    }
  }, []);

  const handleNavComplete = useCallback(() => {
    // When the shutter has finished and moved off-screen, de-activate
    setIsNavSweeping(false);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();

      // If admin route, do NOT trigger client-side sweep!
      if (isAdminRoute(hash)) {
        return;
      }

      let target: ViewType = "home";
      if (hash.startsWith("#contact")) {
        target = "contact";
      } else if (hash.startsWith("#menu")) {
        target = "menu";
      }

      if (target !== currentView) {
        executeClientTransition(target);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentView, executeClientTransition]);

  // Synchronize ScrollTrigger and view switches with scroll-to-top
  useEffect(() => {
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

  const navigateToHome = useCallback(() => {
    if (window.location.hash !== "") {
      window.location.hash = "";
    }
    executeClientTransition("home");
  }, [executeClientTransition]);

  const navigateToMenu = useCallback(
    (category?: string) => {
      if (window.location.hash !== "#menu") {
        window.location.hash = "menu";
      }
      executeClientTransition("menu", category || "all");
    },
    [executeClientTransition]
  );

  const navigateToContact = useCallback(() => {
    if (window.location.hash !== "#contact") {
      window.location.hash = "contact";
    }
    executeClientTransition("contact");
  }, [executeClientTransition]);

  return (
    <>
      {/* Brand Intro Loading Screen (Only on initial load) */}
      <IntroLoader />

      {/* Smooth Shutter Sweep Transition (Only client-side pages; strictly skips admin) */}
      <SweepTransition
        isActive={isNavSweeping}
        durationMs={1250}
        onCover={handleNavCover}
        onComplete={handleNavComplete}
      />

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
