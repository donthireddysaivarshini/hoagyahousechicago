import React, { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import IntroLoader from "./components/loader/IntroLoader";
import Header from "./components/layout/Header";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BurgerExplodeSection from "./sections/BurgerExplodeSection";
import FeaturedSection from "./sections/FeaturedSection";
import MainMenuPage from "./sections/MainMenuPage";
import Footer from "./components/layout/Footer";
import { CartProvider, useCart } from "./context/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<"home" | "menu">(() => {
    if (typeof window !== "undefined" && window.location.hash === "#menu") {
      return "menu";
    }
    return "home";
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toastMessage } = useCart();

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith("#menu")) {
        setCurrentView("menu");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Ensure ScrollTrigger never intercepts scrolling on the products page
  useEffect(() => {
    if (currentView === "menu") {
      ScrollTrigger.getAll().forEach((st) => st.disable());
    } else {
      ScrollTrigger.getAll().forEach((st) => st.enable());
      ScrollTrigger.refresh();
    }
  }, [currentView]);

  const navigateToHome = () => {
    window.location.hash = "";
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  };

  const navigateToMenu = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    window.location.hash = "menu";
    setCurrentView("menu");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      </main>

      {/* Luxury Footer */}
      <Footer />

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
