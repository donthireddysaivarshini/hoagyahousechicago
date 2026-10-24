import React, { useRef } from "react";
import "../styles/featured-section.css";

interface CardParticle {
  id: string;
  type: "img" | "spark";
  src?: string;
  top: string;
  left?: string;
  right?: string;
  size: string;
  rotate?: number;
  floatAnim: string;
  duration?: string;
  delay?: string;
}

interface CategoryCardItem {
  id: string;
  nameLine1: string;
  nameLine2: string;
  fullName: string;
  img: string;
  particles: CardParticle[];
}

const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: "sandwiches",
    nameLine1: "HOT",
    nameLine2: "SANDWICHES",
    fullName: "Hot Sandwiches & Philly Steaks",
    img: "images/italian-beef-sandwich.webp",
    particles: [
      { id: "p1", type: "img", src: "images/particles/jalapeno.webp", top: "36%", right: "6%", size: "clamp(22px, 2.5vw, 30px)", rotate: 24, floatAnim: "featFloat1", duration: "5.5s", delay: "0s" },
      { id: "p2", type: "img", src: "images/particles/onion.webp", top: "42%", left: "5%", size: "clamp(20px, 2.2vw, 28px)", rotate: -18, floatAnim: "featFloat2", duration: "6.2s", delay: "0.8s" },
      { id: "p3", type: "img", src: "images/particles/bacon_shards.webp", top: "72%", right: "8%", size: "clamp(18px, 2vw, 24px)", rotate: 32, floatAnim: "featFloat1", duration: "5s", delay: "1.4s" },
      { id: "p4", type: "spark", top: "30%", left: "14%", size: "6px", floatAnim: "featSparkPulse", duration: "3s", delay: "0.2s" },
    ],
  },
  {
    id: "burgers",
    nameLine1: "SMASH",
    nameLine2: "BURGERS",
    fullName: "Fresh Smash Burgers",
    img: "images/signature-cheeseburger.webp",
    particles: [
      { id: "p1", type: "img", src: "images/particles/pickle.webp", top: "35%", left: "6%", size: "clamp(22px, 2.4vw, 30px)", rotate: -15, floatAnim: "featFloat2", duration: "6s", delay: "0.3s" },
      { id: "p2", type: "img", src: "images/particles/tomato.webp", top: "40%", right: "5%", size: "clamp(22px, 2.4vw, 30px)", rotate: 20, floatAnim: "featFloat1", duration: "5.6s", delay: "0.9s" },
      { id: "p3", type: "img", src: "images/particles/lettuce.webp", top: "70%", left: "7%", size: "clamp(20px, 2.2vw, 26px)", rotate: -24, floatAnim: "featFloat2", duration: "6.8s", delay: "1.5s" },
      { id: "p4", type: "spark", top: "31%", right: "12%", size: "7px", floatAnim: "featSparkPulse", duration: "3.2s", delay: "0.5s" },
    ],
  },
  {
    id: "chicken",
    nameLine1: "FRIED",
    nameLine2: "CHICKEN",
    fullName: "Crispy Fried Chicken",
    img: "images/crispy-chicken-wings.webp",
    particles: [
      { id: "p1", type: "img", src: "images/particles/bacon_shards.webp", top: "35%", right: "7%", size: "clamp(20px, 2.3vw, 28px)", rotate: 30, floatAnim: "featFloat1", duration: "5.2s", delay: "0.2s" },
      { id: "p2", type: "img", src: "images/particles/jalapeno.webp", top: "42%", left: "5%", size: "clamp(22px, 2.4vw, 28px)", rotate: -20, floatAnim: "featFloat2", duration: "6.4s", delay: "0.7s" },
      { id: "p3", type: "img", src: "images/particles/bacon_shards.webp", top: "72%", left: "9%", size: "clamp(18px, 2vw, 24px)", rotate: -32, floatAnim: "featFloat1", duration: "5.8s", delay: "1.3s" },
      { id: "p4", type: "spark", top: "33%", left: "12%", size: "6px", floatAnim: "featSparkPulse", duration: "2.8s", delay: "0.4s" },
    ],
  },
  {
    id: "fish",
    nameLine1: "CRISPY",
    nameLine2: "SEAFOOD",
    fullName: "Catfish & Jumbo Shrimp",
    img: "images/shrimp-fries-basket.webp",
    particles: [
      { id: "p1", type: "img", src: "images/particles/fry.webp", top: "36%", left: "6%", size: "clamp(28px, 3.2vw, 38px)", rotate: -35, floatAnim: "featFloat2", duration: "6.5s", delay: "0.1s" },
      { id: "p2", type: "img", src: "images/particles/pickle.webp", top: "42%", right: "6%", size: "clamp(20px, 2.3vw, 28px)", rotate: 25, floatAnim: "featFloat1", duration: "5.4s", delay: "0.8s" },
      { id: "p3", type: "img", src: "images/particles/onion.webp", top: "70%", right: "8%", size: "clamp(20px, 2.2vw, 26px)", rotate: -15, floatAnim: "featFloat2", duration: "6s", delay: "1.4s" },
      { id: "p4", type: "spark", top: "32%", right: "14%", size: "6px", floatAnim: "featSparkPulse", duration: "3s", delay: "0.6s" },
    ],
  },
  {
    id: "bowls-salads",
    nameLine1: "RICE",
    nameLine2: "BOWLS",
    fullName: "Flame-Grilled Rice Bowls",
    img: "images/chicken-rice-bowl.webp",
    particles: [
      { id: "p1", type: "img", src: "images/particles/onion.webp", top: "35%", right: "6%", size: "clamp(22px, 2.4vw, 28px)", rotate: 22, floatAnim: "featFloat1", duration: "5.8s", delay: "0.3s" },
      { id: "p2", type: "img", src: "images/particles/jalapeno.webp", top: "42%", left: "5%", size: "clamp(22px, 2.4vw, 28px)", rotate: -22, floatAnim: "featFloat2", duration: "6.2s", delay: "0.9s" },
      { id: "p3", type: "img", src: "images/particles/tomato.webp", top: "72%", right: "8%", size: "clamp(19px, 2.1vw, 25px)", rotate: 18, floatAnim: "featFloat1", duration: "5.5s", delay: "1.5s" },
      { id: "p4", type: "spark", top: "31%", left: "14%", size: "6px", floatAnim: "featSparkPulse", duration: "3.4s", delay: "0.4s" },
    ],
  },
  {
    id: "chicken",
    nameLine1: "CRISPY",
    nameLine2: "WINGS",
    fullName: "Hot & Crispy Wings",
    img: "images/golden-chicken-bites.webp",
    particles: [
      { id: "p1", type: "img", src: "images/particles/bacon_shards.webp", top: "34%", left: "6%", size: "clamp(22px, 2.4vw, 28px)", rotate: -26, floatAnim: "featFloat2", duration: "5.6s", delay: "0.2s" },
      { id: "p2", type: "img", src: "images/particles/jalapeno.webp", top: "40%", right: "6%", size: "clamp(22px, 2.4vw, 28px)", rotate: 19, floatAnim: "featFloat1", duration: "6.2s", delay: "0.7s" },
      { id: "p3", type: "img", src: "images/particles/onion.webp", top: "68%", left: "8%", size: "clamp(20px, 2.2vw, 26px)", rotate: 28, floatAnim: "featFloat2", duration: "5.9s", delay: "1.3s" },
      { id: "p4", type: "spark", top: "30%", right: "12%", size: "7px", floatAnim: "featSparkPulse", duration: "3s", delay: "0.5s" },
    ],
  },
  {
    id: "sides-extras",
    nameLine1: "CRISPY",
    nameLine2: "FRIES",
    fullName: "Golden Shoestring Fries",
    img: "images/shoestring-fries.webp",
    particles: [
      { id: "p1", type: "img", src: "images/particles/fry.webp", top: "34%", right: "6%", size: "clamp(30px, 3.4vw, 40px)", rotate: 28, floatAnim: "featFloat1", duration: "6s", delay: "0.1s" },
      { id: "p2", type: "img", src: "images/particles/bacon_shards.webp", top: "42%", left: "5%", size: "clamp(22px, 2.4vw, 28px)", rotate: -20, floatAnim: "featFloat2", duration: "5.4s", delay: "0.6s" },
      { id: "p3", type: "img", src: "images/particles/fry.webp", top: "68%", right: "9%", size: "clamp(26px, 3vw, 34px)", rotate: -42, floatAnim: "featFloat1", duration: "6.6s", delay: "1.2s" },
      { id: "p4", type: "spark", top: "31%", left: "12%", size: "6px", floatAnim: "featSparkPulse", duration: "3.2s", delay: "0.3s" },
    ],
  },
  {
    id: "beverages",
    nameLine1: "THICK",
    nameLine2: "SHAKES",
    fullName: "Hand-Spun Milkshakes",
    img: "images/chocolate-milkshake.webp",
    particles: [
      { id: "p1", type: "spark", top: "32%", left: "10%", size: "8px", floatAnim: "featSparkPulse", duration: "2.8s", delay: "0s" },
      { id: "p2", type: "spark", top: "38%", right: "9%", size: "7px", floatAnim: "featSparkPulse", duration: "3.2s", delay: "0.5s" },
      { id: "p3", type: "spark", top: "54%", left: "7%", size: "9px", floatAnim: "featSparkPulse", duration: "3s", delay: "1.0s" },
      { id: "p4", type: "spark", top: "68%", right: "10%", size: "6px", floatAnim: "featSparkPulse", duration: "2.6s", delay: "1.5s" },
      { id: "p5", type: "spark", top: "76%", left: "12%", size: "8px", floatAnim: "featSparkPulse", duration: "3.4s", delay: "0.8s" },
    ],
  },
];

interface FeaturedSectionProps {
  onNavigateToMenu?: (categoryId?: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onNavigateToMenu }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleClickCategory = (catId: string) => {
    if (onNavigateToMenu) {
      onNavigateToMenu(catId);
    }
  };

  return (
    <section className="feat-section" id="featuredSection" ref={sectionRef}>
      {/* Header */}
      <div className="feat-section__header">
        <span className="feat-section__eyebrow">OUR MENU CATEGORIES</span>
        <h2 className="feat-section__title">Built for the Bold</h2>
        <p className="feat-section__desc">
          Hand-crafted on Chicago's South Side. Explore our authentic flame-grilled subs, fresh burgers, wings, and combos.
        </p>
      </div>

      {/* Categories Poster Grid (2-2 on mobile, 4-4 from tablet to desktop) */}
      <div className="feat-section__grid">
        {CATEGORY_CARDS.map((cat, idx) => (
          <article
            key={`${cat.id}-${idx}`}
            className="feat-poster-card"
            data-index={idx}
            onClick={() => handleClickCategory(cat.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClickCategory(cat.id);
              }
            }}
            aria-label={`Explore ${cat.fullName} Category`}
          >
            {/* Top Bold Poster Headline */}
            <div className="feat-poster-card__header">
              <span className="feat-poster-card__word">{cat.nameLine1}</span>
              <span className="feat-poster-card__word">{cat.nameLine2}</span>
            </div>

            {/* Floating Ambient Particles Layer (2 to 5 per card) */}
            <div className="feat-poster-card__particles" aria-hidden="true">
              {cat.particles.map((p) => {
                const style: React.CSSProperties = {
                  top: p.top,
                  left: p.left,
                  right: p.right,
                  width: p.size,
                  height: p.size,
                  animationName: p.floatAnim,
                  animationDuration: p.duration || "5s",
                  animationDelay: p.delay || "0s",
                  transform: p.rotate ? `rotate(${p.rotate}deg)` : undefined,
                  ["--rot" as string]: `${p.rotate || 0}deg`,
                };

                if (p.type === "spark") {
                  return (
                    <span
                      key={p.id}
                      className="feat-poster-particle feat-poster-particle--spark"
                      style={style}
                    />
                  );
                }

                return (
                  <img
                    key={p.id}
                    src={`/${p.src}`}
                    alt=""
                    className="feat-poster-particle feat-poster-particle--img"
                    style={style}
                    loading="lazy"
                  />
                );
              })}
            </div>

            {/* Center/Bottom Isolated Cutout Food Render */}
            <div className="feat-poster-card__visual">
              <img
                src={`/${cat.img}`}
                alt={cat.fullName}
                className="feat-poster-card__img"
                loading="eager"
              />
              <div className="feat-poster-card__shadow" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>

      {/* Explore Menu Banner CTA */}
      {onNavigateToMenu && (
        <div className="feat-section__more">
          <button
            type="button"
            className="feat-section__more-btn"
            onClick={() => onNavigateToMenu("all")}
          >
            <span>Explore Menu</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
