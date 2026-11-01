import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import IntroLoader from "./components/loader/IntroLoader";
import SweepTransition from "./components/loader/SweepTransition";
import Header from "./components/layout/Header";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HomePage,
  MenuPage,
  ContactPage,
  AuthPage,
  CheckoutPage,
  OrderConfirmationPage,
  OrdersPage,
  ProfilePage,
} from "./pages";
import type { PlacedOrderData } from "./pages";
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLoginPage = React.lazy(() => import("./pages/admin/AdminLoginPage"));
import Footer from "./components/layout/Footer";
import { CartProvider, useCart } from "./context/CartContext";
import CartDrawer from "./components/cart/CartDrawer";
import ScrollToTopButton from "./components/common/ScrollToTopButton";

type ViewType =
  | "home"
  | "menu"
  | "contact"
  | "auth"
  | "admin"
  | "checkout"
  | "confirmation"
  | "orders"
  | "profile";

const resolveRouteFromLocation = (): {
  view: ViewType;
  authMode?: "login" | "register" | "forgot-password" | "otp";
} => {
  if (typeof window === "undefined") return { view: "home" };

  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, "");
  const hash = window.location.hash.toLowerCase();

  // Admin routing check: matches /admin, /admin/..., #admin, #/admin
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    hash.startsWith("#admin") ||
    hash.startsWith("#/admin")
  ) {
    return { view: "admin" };
  }

  // Client auth routing checks: matches /register, /login, /auth, /forgot, /otp etc.
  if (pathname === "/register" || hash.startsWith("#register")) {
    return { view: "auth", authMode: "register" };
  }
  if (pathname === "/forgot" || pathname.startsWith("/forgot") || hash.startsWith("#forgot")) {
    return { view: "auth", authMode: "forgot-password" };
  }
  if (pathname === "/otp" || hash.startsWith("#otp")) {
    return { view: "auth", authMode: "otp" };
  }
  if (
    pathname === "/auth" ||
    pathname === "/login" ||
    hash.startsWith("#auth") ||
    hash.startsWith("#login")
  ) {
    return { view: "auth", authMode: "login" };
  }

  // Checkout and Customer Portal views
  if (pathname === "/checkout" || hash.startsWith("#checkout")) {
    return { view: "checkout" };
  }
  if (pathname === "/confirmation" || hash.startsWith("#confirmation")) {
    return { view: "confirmation" };
  }
  if (pathname === "/orders" || hash.startsWith("#orders")) {
    return { view: "orders" };
  }
  if (pathname === "/profile" || hash.startsWith("#profile")) {
    return { view: "profile" };
  }

  // Storefront subpages
  if (pathname === "/contact" || hash.startsWith("#contact")) {
    return { view: "contact" };
  }
  if (pathname === "/menu" || hash.startsWith("#menu")) {
    return { view: "menu" };
  }

  return { view: "home" };
};

const AppContent: React.FC = () => {
  const initialRoute = resolveRouteFromLocation();
  const [authInitialMode, setAuthInitialMode] = useState<
    "login" | "register" | "forgot-password" | "otp"
  >(initialRoute.authMode || "login");
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>(initialRoute.view);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPlacedOrder, setCurrentPlacedOrder] = useState<PlacedOrderData | null>(null);
  const [isNavSweeping, setIsNavSweeping] = useState(false);
  const pendingNavRef = useRef<(() => void) | null>(null);

  const { toastMessage } = useCart();
  const lenis = useLenis();

  // Helper: check if a target is an admin page or route (Strictly bypass transitions for admin)
  const isAdminRoute = (routeOrHash?: string) => {
    if (routeOrHash) {
      const lower = routeOrHash.toLowerCase();
      return (
        lower === "admin" ||
        lower === "/admin" ||
        lower.startsWith("/admin/") ||
        lower.startsWith("#admin") ||
        lower.startsWith("#/admin")
      );
    }
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return (
        pathname === "/admin" ||
        pathname.startsWith("/admin/") ||
        hash.startsWith("#admin") ||
        hash.startsWith("#/admin")
      );
    }
    return false;
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
      if (isAdminRoute(targetView) || isAdminRoute()) {
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
    const handleLocationChange = () => {
      const route = resolveRouteFromLocation();
      if (route.authMode) {
        setAuthInitialMode(route.authMode);
      }

      // If admin route, navigate directly to admin without client-side sweep!
      if (route.view === "admin") {
        setCurrentView("admin");
        resetScrollToTop(true);
        return;
      }

      if (route.view !== currentView) {
        executeClientTransition(route.view);
      }
    };

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [currentView, executeClientTransition, resetScrollToTop]);

  // Synchronize ScrollTrigger and view switches with scroll-to-top
  useEffect(() => {
    resetScrollToTop(true);

    if (currentView !== "home") {
      ScrollTrigger.getAll().forEach((st) => st.disable(false, true));
      const timer = setTimeout(() => {
        resetScrollToTop(true);
        if (lenis) {
          lenis.start();
          lenis.resize();
        }
      }, 25);
      return () => clearTimeout(timer);
    } else {
      resetScrollToTop(true);
      const timer = setTimeout(() => {
        resetScrollToTop(true);
        ScrollTrigger.getAll().forEach((st) => st.enable());
        ScrollTrigger.refresh();
        if (lenis) {
          lenis.start();
          lenis.resize();
        }
        window.dispatchEvent(new Event("resize"));
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [currentView, lenis, resetScrollToTop]);

  // Synchronize Lenis smooth-scroll ticks with GSAP ScrollTrigger
  useEffect(() => {
    if (!lenis) return;
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  // Safety watchdog: ensure document.body and html never stay stuck with overflow: hidden or stopped scroll
  useEffect(() => {
    const ensureScrollActive = () => {
      const hasModalOpen =
        document.querySelector(".cart-drawer-overlay.is-open") ||
        document.querySelector(".fullscreen-nav.is-open") ||
        document.querySelector(".product-modal-backdrop.is-open") ||
        document.querySelector(".cinema-loader");

      if (!hasModalOpen && !isNavSweeping) {
        if (document.body.style.overflow === "hidden") {
          document.body.style.overflow = "";
        }
        if (document.body.classList.contains("is-loading")) {
          document.body.classList.remove("is-loading");
        }
        if (lenis?.isStopped) {
          lenis.start();
          lenis.resize();
        }
      }
    };

    window.addEventListener("focus", ensureScrollActive);
    const interval = setInterval(ensureScrollActive, 1000);
    return () => {
      window.removeEventListener("focus", ensureScrollActive);
      clearInterval(interval);
    };
  }, [isNavSweeping, lenis]);

  const navigateToHome = useCallback(() => {
    if (window.location.pathname !== "/") {
      window.history.pushState(null, "", "/");
    }
    if (window.location.hash !== "") {
      window.location.hash = "";
    }
    executeClientTransition("home");
  }, [executeClientTransition]);

  const navigateToMenu = useCallback(
    (category?: string) => {
      if (window.location.pathname !== "/" && window.location.pathname !== "/menu") {
        window.history.pushState(null, "", "/menu");
      } else if (window.location.hash !== "#menu") {
        window.location.hash = "menu";
      }
      executeClientTransition("menu", category || "all");
    },
    [executeClientTransition]
  );

  const navigateToContact = useCallback(() => {
    if (window.location.pathname !== "/" && window.location.pathname !== "/contact") {
      window.history.pushState(null, "", "/contact");
    } else if (window.location.hash !== "#contact") {
      window.location.hash = "contact";
    }
    executeClientTransition("contact");
  }, [executeClientTransition]);

  const navigateToAuth = useCallback(
    (mode: "login" | "register" | "forgot-password" | "otp" = "login") => {
      setAuthInitialMode(mode);
      if (window.location.pathname !== "/" && window.location.pathname !== "/auth") {
        window.history.pushState(null, "", "/auth");
      } else if (window.location.hash !== "#auth") {
        window.location.hash = "auth";
      }
      executeClientTransition("auth");
    },
    [executeClientTransition]
  );

  const navigateToCheckout = useCallback(() => {
    if (window.location.pathname !== "/" && window.location.pathname !== "/checkout") {
      window.history.pushState(null, "", "/checkout");
    } else if (window.location.hash !== "#checkout") {
      window.location.hash = "checkout";
    }
    executeClientTransition("checkout");
  }, [executeClientTransition]);

  const navigateToConfirmation = useCallback(
    (order?: PlacedOrderData) => {
      if (order) {
        setCurrentPlacedOrder(order);
      }
      if (window.location.pathname !== "/" && window.location.pathname !== "/confirmation") {
        window.history.pushState(null, "", "/confirmation");
      } else if (window.location.hash !== "#confirmation") {
        window.location.hash = "confirmation";
      }
      executeClientTransition("confirmation");
    },
    [executeClientTransition]
  );

  const navigateToOrders = useCallback(() => {
    if (window.location.pathname !== "/" && window.location.pathname !== "/orders") {
      window.history.pushState(null, "", "/orders");
    } else if (window.location.hash !== "#orders") {
      window.location.hash = "orders";
    }
    executeClientTransition("orders");
  }, [executeClientTransition]);

  const navigateToProfile = useCallback(() => {
    if (window.location.pathname !== "/" && window.location.pathname !== "/profile") {
      window.history.pushState(null, "", "/profile");
    } else if (window.location.hash !== "#profile") {
      window.location.hash = "profile";
    }
    executeClientTransition("profile");
  }, [executeClientTransition]);

  return (
    <>
      {/* Brand Intro Loading Screen (Only on initial load of public storefront) */}
      {currentView !== "admin" && currentView !== "auth" && (
        <IntroLoader
          onComplete={() => {
            ScrollTrigger.refresh();
            if (lenis) lenis.resize();
          }}
        />
      )}

      {/* Smooth Shutter Sweep Transition (Only client-side pages; strictly skips admin) */}
      <SweepTransition
        isActive={isNavSweeping}
        durationMs={1250}
        onCover={handleNavCover}
        onComplete={handleNavComplete}
      />

      {/* Customer Header (Only shown on storefront client views, HIDDEN on admin & login/auth) */}
      {currentView !== "admin" && currentView !== "auth" && (
        <Header
          currentView={currentView}
          onNavigateHome={navigateToHome}
          onNavigateMenu={() => navigateToMenu("all")}
          onNavigateContact={navigateToContact}
          onNavigateAuth={() => navigateToAuth("login")}
          onNavigateOrders={navigateToOrders}
          onNavigateProfile={navigateToProfile}
        />
      )}

      {/* Main Content: Scalable Role-Based & Client Pages */}
      <main id="site-main">
        {/* Home Page (Exploded Burger 3D Hero + Featured Categories Showcase) */}
        <HomePage
          isActive={currentView === "home"}
          onNavigateToMenu={navigateToMenu}
        />

        {/* Menu Page Catalog */}
        <div
          id="menuView"
          style={{ display: currentView === "menu" ? "block" : "none" }}
        >
          <MenuPage
            onBackToHome={navigateToHome}
            initialCategory={selectedCategory}
          />
        </div>

        {/* Contact Page */}
        <div
          id="contactView"
          style={{ display: currentView === "contact" ? "block" : "none" }}
        >
          <ContactPage
            onBackToHome={navigateToHome}
            onNavigateMenu={() => navigateToMenu("all")}
          />
        </div>

        {/* Checkout Page */}
        <div
          id="checkoutView"
          style={{ display: currentView === "checkout" ? "block" : "none" }}
        >
          <CheckoutPage
            onBackToMenu={() => navigateToMenu("all")}
            onOrderSuccess={(placedOrder) => navigateToConfirmation(placedOrder)}
          />
        </div>

        {/* Order Confirmation Page */}
        <div
          id="confirmationView"
          style={{ display: currentView === "confirmation" ? "block" : "none" }}
        >
          <OrderConfirmationPage
            order={currentPlacedOrder}
            onNavigateMenu={() => navigateToMenu("all")}
            onNavigateOrders={navigateToOrders}
          />
        </div>

        {/* My Orders Page */}
        <div
          id="ordersView"
          style={{ display: currentView === "orders" ? "block" : "none" }}
        >
          <OrdersPage
            currentOrder={currentPlacedOrder}
            onNavigateMenu={() => navigateToMenu("all")}
            onNavigateHome={navigateToHome}
          />
        </div>

        {/* Customer Profile Page */}
        <div
          id="profileView"
          style={{ display: currentView === "profile" ? "block" : "none" }}
        >
          <ProfilePage
            onNavigateMenu={() => navigateToMenu("all")}
            onNavigateOrders={navigateToOrders}
            onLogout={navigateToHome}
          />
        </div>

        {/* Client Auth Page (Login, Register, Forgot Password, OTP) */}
        <div
          id="authView"
          style={{ display: currentView === "auth" ? "block" : "none" }}
        >
          <AuthPage
            initialMode={authInitialMode}
            onSuccess={navigateToProfile}
            onBackToStore={navigateToHome}
          />
        </div>

        {/* Admin Portal Page (Lazy-loaded isolated console guarded by AdminLoginPage) */}
        {currentView === "admin" && (
          <div id="adminView">
            <React.Suspense
              fallback={
                <div
                  style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0c0a09",
                    color: "#ffb834",
                    fontFamily: "monospace",
                    letterSpacing: "0.12em",
                  }}
                >
                  INITIALIZING ADMIN SYSTEM...
                </div>
              }
            >
              {isAdminAuthed ? (
                <AdminDashboard
                  onBackToClient={() => {
                    setIsAdminAuthed(false);
                    navigateToHome();
                  }}
                />
              ) : (
                <AdminLoginPage
                  onSuccess={() => setIsAdminAuthed(true)}
                  onBackToStore={navigateToHome}
                />
              )}
            </React.Suspense>
          </div>
        )}
      </main>

      {/* Customer Footer, Cart Drawer & Floating Scroll-To-Top (Only shown on storefront client views, HIDDEN on admin & login/auth) */}
      {currentView !== "admin" && currentView !== "auth" && (
        <>
          <Footer onNavigateContact={navigateToContact} />
          <CartDrawer
            onNavigateToMenu={navigateToMenu}
            onNavigateToCheckout={navigateToCheckout}
          />
          <ScrollToTopButton />
          {toastMessage && (
            <div className="cart-toast" role="status" aria-live="polite">
              <span className="cart-toast__dot" />
              <span>{toastMessage}</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.4,
      }}
    >
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ReactLenis>
  );
};

export default App;
