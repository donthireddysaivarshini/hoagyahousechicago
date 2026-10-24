import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BurgerCanvas from "../components/burger/BurgerCanvas";
import BurgerParticles from "../components/burger/BurgerParticles";



interface BurgerExplodeSectionProps {
  isActive?: boolean;
}

export const BurgerExplodeSection: React.FC<BurgerExplodeSectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const initScrollTrigger = () => {
      if (triggerRef.current) triggerRef.current.kill();

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        pin: true,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 1.8)}`,
        anticipatePin: 1,
        refreshPriority: 2,
        scrub: 0.5,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setScrollProgress(p);
        }
      });

      if (!isActive && triggerRef.current) {
        triggerRef.current.disable();
      }
    };

    initScrollTrigger();
    ScrollTrigger.refresh();

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill(true);
        triggerRef.current = null;
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) {
          st.kill(true);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!triggerRef.current) return;
    if (isActive) {
      triggerRef.current.enable();
      ScrollTrigger.refresh();
    } else {
      triggerRef.current.disable();
    }
  }, [isActive]);



  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePos({ x: nx, y: ny });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="burger-hero" id="burgerHeroSection" ref={sectionRef}>
      {/* Background Ambience Layers with Smooth Mouse Parallax */}
      <div className="burger-hero__bg" aria-hidden="true">
        {/* Section 1 Hero Restaurant Background */}
        <div
          className="burger-hero__bg-img"
          style={{
            transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -14}px, 0) scale(1.06)`,
            transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
          }}
        ></div>
        <div className="burger-hero__bg-vignette"></div>
        <div className="burger-hero__bg-side-tint"></div>

        {/* Section 2 Dark Studio Background Layer (Smoothly fades in as burger flies to plate) */}
        <div
          className="burger-hero__bg-dark-studio"
          style={{
            opacity: Math.max(0, Math.min(1, (scrollProgress - 0.28) / 0.30))
          }}
        >
          <div
            className="burger-hero__dark-studio-img"
            style={{
              transform: `translate3d(${mousePos.x * -22}px, ${mousePos.y * -16}px, 0) scale(1.06)`,
              transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
            }}
          ></div>
          <div className="burger-hero__dark-studio-vignette"></div>
          {/* Warm Light Pool on the studio table surface directly under the plate */}
          <div className="burger-plated__table-light-pool"></div>
        </div>
      </div>

      {/* Floating Ingredient Particles (fades out as burger flies to plate) */}
      <BurgerParticles progress={scrollProgress} />

      {/* Full-bleed 3D Canvas Layer */}
      <div className="burger-canvas-stage">
        <BurgerCanvas progress={scrollProgress} />
      </div>

      {/* =========================================================================
          PHASE 1: SECTION 1 (HERO & EXPLODING 3D VIEW)
          Left: Title, Exploded badge, CTA
          Right: 3D Exploding Burger
         ========================================================================= */}
      <div
        className="burger-hero__stage"
        style={{
          opacity: Math.max(0, 1 - (scrollProgress - 0.30) / 0.14),
          pointerEvents: scrollProgress > 0.42 ? "none" : "auto",
          transform: `translateY(${scrollProgress > 0.30 ? (scrollProgress - 0.30) * -80 : 0}px)`
        }}
      >
        <div className="burger-hero__inner">
          {/* Left Column: Website Name Badge & Creative Professional Tagline */}
          <div className="burger-hero__text-col">
            {/* Website Name in Neat Badge */}
            <div className="burger-hero__brand-badge">
              <span className="burger-hero__brand-badge-dot" aria-hidden="true" />
              <span className="burger-hero__brand-badge-name">HOAGY HOUSE · CHICAGO</span>
            </div>

            {/* Creative Professional Tagline */}
            <h1 className="burger-hero__tagline-title">
              <span className="burger-hero__tagline-lead">CRAFTED WITH FIRE,</span>
              <span className="burger-hero__tagline-accent">SERVED WITH SOUL</span>
            </h1>

            <p className="burger-hero__tagline-desc">
              Home of Chicago’s signature flame-seared smash burgers, authentic Philly steaks &amp; legendary grill classics — crafted fresh to order every day.
            </p>
          </div>

          {/* Right Column Spacer: where 3D burger explodes */}
          <div className="burger-hero__model-placeholder" aria-hidden="true"></div>
        </div>

        {/* Animated Scroll Down Indicator (Icon Only) - Bottom Middle */}
        <div
          className="burger-hero__scroll-indicator"
          onClick={() => {
            window.scrollBy({ top: window.innerHeight * 0.95, behavior: "smooth" });
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              window.scrollBy({ top: window.innerHeight * 0.95, behavior: "smooth" });
            }
          }}
          aria-label="Scroll down to explore"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 7),
            pointerEvents: scrollProgress > 0.12 ? "none" : "auto",
          }}
        >
          <div className="burger-hero__scroll-mouse">
            <span className="burger-hero__scroll-wheel" />
          </div>
          <svg
            className="burger-hero__scroll-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          PHASE 2: SECTION 2 (NEW SECTION: BURGER FLIES & LANDS RESTING ON PLATE)
          Left: 3D Plate with Resting Burger
          Right: Editorial Text, Story, Ingredients & Order CTA
         ========================================================================= */}
      <div
        className="burger-plated__stage"
        id="platedSection"
        style={{
          opacity: Math.max(0, Math.min(1, (scrollProgress - 0.42) / 0.20)),
          pointerEvents: scrollProgress < 0.42 ? "none" : "auto",
          transform: `translateY(${Math.max(0, (1 - Math.min(1, (scrollProgress - 0.42) / 0.20)) * 60)}px)`
        }}
      >
        <div className="burger-plated__inner">
          {/* Left Column Spacer: where 3D burger lands resting on plate */}
          <div className="burger-plated__plate-placeholder" aria-hidden="true"></div>

          {/* Right Column: About Business Editorial Story */}
          <div className="burger-plated__text-col">
            <h2 className="burger-plated__title">
              <span className="burger-plated__title-sub">ABOUT OUR BUSINESS</span>
              <span className="burger-plated__title-main">20 YEARS ON THE SOUTH SIDE</span>
            </h2>

            <p className="burger-plated__desc">
              For 20 years, Hoagy House has proudly served Chicago’s South Side with love, fresh food, and friendly faces. We’re back under a fresh new look with our famous made-to-order menu — hoagies, Philly steaks, Italian beef, smash burgers, chicken wings, fish &amp; shrimp.
            </p>

            <div className="burger-plated__highlights">
              <span className="burger-plated__highlight-pill">7116 S Yates Blvd</span>
              <span className="burger-plated__highlight-pill">100% Turkey &amp; Beef</span>
              <span className="burger-plated__highlight-pill">No Pork</span>
              <span className="burger-plated__highlight-pill">Dine In &amp; Carry Out</span>
              <span className="burger-plated__highlight-pill">Late Night Fri–Sat</span>
            </div>

            <p className="burger-plated__closing">
              “We’re glad to be serving you again.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BurgerExplodeSection;
