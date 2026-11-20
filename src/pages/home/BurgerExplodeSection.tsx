import React from "react";

interface BurgerExplodeSectionProps {
  isActive?: boolean;
  onOpenOrderModal?: () => void;
}

export const BurgerExplodeSection: React.FC<BurgerExplodeSectionProps> = ({
  onOpenOrderModal,
}) => {
  return (
    <section className="burger-hero" id="burgerHeroSection">
      {/* Background Ambience Layers */}
      <div className="burger-hero__bg" aria-hidden="true">
        <div className="burger-hero__bg-img" />
        <div className="burger-hero__bg-vignette" />
        <div className="burger-hero__bg-side-tint" />
      </div>

      {/* Hero Content Stage */}
      <div className="burger-hero__stage">
        <div className="burger-hero__inner">
          {/* Left Column: Heading, Subtext, and Two Direct CTAs */}
          <div className="burger-hero__text-col">
            {/* Brand Badge */}
            <div className="burger-hero__brand-badge">
              <span className="burger-hero__brand-badge-dot" aria-hidden="true" />
              <span className="burger-hero__brand-badge-name">HOAGY HOUSE · CHICAGO</span>
            </div>

            {/* Main Lead Heading */}
            <h1 className="burger-hero__tagline-title">
              <span className="burger-hero__tagline-lead">Home of the</span>
              <span className="burger-hero__tagline-accent">Famous Hoagies</span>
            </h1>

            {/* Description Subtext */}
            <p className="burger-hero__tagline-desc">
              Fresh hoagies, Philly steaks, wings and fish, made to order on Chicago's South Side. 100% turkey and beef. No pork.
            </p>

            {/* Direct Action Buttons: Order Now & Call Us */}
            <div className="burger-hero__actions">
              <button
                type="button"
                className="burger-hero__cta-primary"
                onClick={onOpenOrderModal}
                aria-label="Order Now on DoorDash or Uber Eats"
              >
                <span className="burger-hero__cta-primary-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </span>
                <span className="burger-hero__cta-primary-text">Order Now</span>
                <span className="burger-hero__cta-partner-badge">DoorDash · Uber Eats</span>
              </button>

              <a
                href="tel:7738912416"
                className="burger-hero__cta-secondary"
                aria-label="Call Hoagy House at (773) 891-2416"
              >
                <span className="burger-hero__cta-secondary-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="burger-hero__cta-secondary-text">Call Us</span>
                <span className="burger-hero__cta-phone-num">(773) 891-2416</span>
              </a>
            </div>

            {/* Quality & Dietary Guarantee Pills */}
            <div className="burger-hero__trust-row">
              <span className="burger-hero__trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                100% Turkey &amp; Beef
              </span>
              <span className="burger-hero__trust-divider">•</span>
              <span className="burger-hero__trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Strictly No Pork
              </span>
              <span className="burger-hero__trust-divider">•</span>
              <span className="burger-hero__trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Made Fresh to Order
              </span>
            </div>
          </div>

          {/* Right Column: Realistic High-Quality Hoagy Sandwich Photo */}
          <div className="burger-hero__visual-col">
            <div className="burger-hero__photo-card">
              <div className="burger-hero__photo-glow" aria-hidden="true" />
              <img
                src="/images/italian-beef-sandwich.webp"
                alt="Hoagy House Signature Chicago Steak Sandwich Cut in Half with Melted Cheese"
                className="burger-hero__photo-img"
                loading="eager"
              />
              <div className="burger-hero__photo-badge">
                <span className="burger-hero__photo-badge-sub">CHICAGO ORIGINAL</span>
                <span className="burger-hero__photo-badge-title">SIGNATURE HOAGY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ABOUT OUR BUSINESS */}
      <div className="burger-plated__section" id="aboutSection">
        <div className="burger-plated__inner">
          {/* Left Column: Secondary Signature Hoagy Photo Showcase */}
          <div className="burger-plated__visual-col">
            <div className="burger-plated__photo-wrapper">
              <div className="burger-plated__photo-glow" aria-hidden="true" />
              <img
                src="/products/Hoagy House Cheesesteak Feast.webp"
                alt="Hoagy House Philly Cheesesteak and Hoagy Feast"
                className="burger-plated__photo-img"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Story & Business Heritage */}
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

            {/* Quick Order trigger */}
            <div className="burger-plated__order-cta">
              <button
                type="button"
                className="burger-plated__cta-btn"
                onClick={onOpenOrderModal}
              >
                <span>ORDER FOR DELIVERY OR CARRYOUT</span>
                <span className="burger-plated__cta-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BurgerExplodeSection;
