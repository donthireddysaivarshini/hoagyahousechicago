import React, { useEffect, useState } from "react";

interface IngredientParticleDef {
  id: string;
  name: string;
  src: string;
  top: string;
  left: string;
  size: string;
  baseRotate: number;
  floatAnim: "float1" | "float2" | "float3";
  floatDuration: string;
  floatDelay: string;
  depth: number;
  baseXPercent: number; // 0 to 100 for proximity repulsion
  baseYPercent: number; // 0 to 100 for proximity repulsion
  opacity?: number;
}

const INGREDIENT_PARTICLES: IngredientParticleDef[] = [
  // 1. Top-Left: Crispy Bacon Strip framing top left heading
  {
    id: "contact-bacon-strip-top-left",
    name: "Crispy Bacon Strip",
    src: "/images/particles/bacon_strip.webp",
    top: "14%",
    left: "3.5%",
    size: "clamp(80px, 8vw, 135px)",
    baseRotate: -18,
    floatAnim: "float1",
    floatDuration: "6.8s",
    floatDelay: "0s",
    depth: 0.06,
    baseXPercent: 5,
    baseYPercent: 15,
  },
  // 2. Mid-Left: Fresh Romaine Lettuce Leaf floating beside info cards
  {
    id: "contact-lettuce-mid-left",
    name: "Romaine Lettuce Leaf",
    src: "/images/particles/lettuce.webp",
    top: "54%",
    left: "1.5%",
    size: "clamp(85px, 8.5vw, 140px)",
    baseRotate: 24,
    floatAnim: "float2",
    floatDuration: "7.5s",
    floatDelay: "0.8s",
    depth: 0.05,
    baseXPercent: 3,
    baseYPercent: 54,
  },
  // 3. Bottom-Left: Zesty Jalapeño Pepper Ring beneath address card
  {
    id: "contact-jalapeno-bottom-left",
    name: "Jalapeño Pepper Ring",
    src: "/images/particles/jalapeno.webp",
    top: "84%",
    left: "5%",
    size: "clamp(68px, 6.8vw, 115px)",
    baseRotate: -22,
    floatAnim: "float3",
    floatDuration: "5.9s",
    floatDelay: "0.4s",
    depth: 0.04,
    baseXPercent: 7,
    baseYPercent: 84,
  },
  // 4. Top-Center: Sweet Red Onion Ring floating high near watermark
  {
    id: "contact-onion-top-center",
    name: "Red Onion Ring",
    src: "/images/particles/onion.webp",
    top: "8%",
    left: "48%",
    size: "clamp(75px, 7.5vw, 120px)",
    baseRotate: 26,
    floatAnim: "float1",
    floatDuration: "8.1s",
    floatDelay: "0.6s",
    depth: 0.05,
    baseXPercent: 48,
    baseYPercent: 8,
  },
  // 5. Center-Mid: Glistening Dill Pickle Slice in the gap between columns
  {
    id: "contact-pickle-center-mid",
    name: "Glistening Pickle Slice",
    src: "/images/particles/pickle.webp",
    top: "42%",
    left: "44.5%",
    size: "clamp(68px, 6.8vw, 110px)",
    baseRotate: -20,
    floatAnim: "float2",
    floatDuration: "7.1s",
    floatDelay: "1.2s",
    depth: 0.04,
    baseXPercent: 44,
    baseYPercent: 42,
  },
  // 6. Bottom-Center: Golden Crispy Potato Fry floating near bottom
  {
    id: "contact-fry-bottom-center",
    name: "Golden Crispy Potato Fry",
    src: "/images/particles/fry.webp",
    top: "86%",
    left: "46%",
    size: "clamp(72px, 7.2vw, 120px)",
    baseRotate: 36,
    floatAnim: "float3",
    floatDuration: "6.5s",
    floatDelay: "0.9s",
    depth: 0.05,
    baseXPercent: 46,
    baseYPercent: 86,
  },
  // 7. Top-Right: Crispy Bacon Shards breaking above contact form
  {
    id: "contact-bacon-shards-top-right",
    name: "Crispy Bacon Shards",
    src: "/images/particles/bacon_shards.webp",
    top: "11%",
    left: "84%",
    size: "clamp(85px, 8.5vw, 145px)",
    baseRotate: 16,
    floatAnim: "float2",
    floatDuration: "7.4s",
    floatDelay: "1.4s",
    depth: 0.06,
    baseXPercent: 86,
    baseYPercent: 12,
  },
  // 8. Mid-Right: Juicy Vine Tomato Slice floating beside form textarea
  {
    id: "contact-tomato-mid-right",
    name: "Juicy Tomato Slice",
    src: "/images/particles/tomato.webp",
    top: "48%",
    left: "87%",
    size: "clamp(85px, 8.5vw, 140px)",
    baseRotate: -15,
    floatAnim: "float1",
    floatDuration: "7.6s",
    floatDelay: "1.7s",
    depth: 0.05,
    baseXPercent: 89,
    baseYPercent: 48,
  },
  // 9. Bottom-Right: Zesty Jalapeño Pepper Ring beneath submit button
  {
    id: "contact-jalapeno-bottom-right",
    name: "Jalapeño Pepper Ring",
    src: "/images/particles/jalapeno.webp",
    top: "85%",
    left: "83%",
    size: "clamp(68px, 6.8vw, 115px)",
    baseRotate: 22,
    floatAnim: "float3",
    floatDuration: "6.2s",
    floatDelay: "1.1s",
    depth: 0.04,
    baseXPercent: 84,
    baseYPercent: 85,
  },
];

export const ContactParticles: React.FC = () => {
  const [mousePos, setMousePos] = useState({
    nx: 0,
    ny: 0,
    clientX: -1000,
    clientY: -1000,
    isActive: false,
  });

  useEffect(() => {
    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePos({
          nx,
          ny,
          clientX: e.clientX,
          clientY: e.clientY,
          isActive: true,
        });
      });
    };

    const handleMouseLeave = () => {
      setMousePos((prev) => ({ ...prev, isActive: false }));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="contact-particles-layer" aria-hidden="true">
      {INGREDIENT_PARTICLES.map((p) => {
        // Parallax drift based on normalized screen mouse position
        const px = mousePos.nx * p.depth * -50;
        const py = mousePos.ny * p.depth * -50;

        // Proximity hover repulsion: if cursor gets close to an ingredient, it glides away gracefully
        let repelX = 0;
        let repelY = 0;

        if (mousePos.isActive && typeof window !== "undefined") {
          const particleScreenX = (p.baseXPercent / 100) * window.innerWidth;
          const particleScreenY = (p.baseYPercent / 100) * window.innerHeight;
          const dx = particleScreenX - mousePos.clientX;
          const dy = particleScreenY - mousePos.clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const repelRadius = 240;
          if (dist < repelRadius && dist > 0) {
            const force = (1 - dist / repelRadius) * 48; // Max 48px repulsion
            repelX = (dx / dist) * force;
            repelY = (dy / dist) * force;
          }
        }

        const totalX = Math.round(px + repelX);
        const totalY = Math.round(py + repelY);
        const transformStr = `translate3d(${totalX}px, ${totalY}px, 0) rotate(${p.baseRotate}deg)`;

        return (
          <div
            key={p.id}
            className={`contact-particle contact-particle--${p.floatAnim}`}
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.floatDuration,
              animationDelay: p.floatDelay,
              opacity: p.opacity ?? 1,
            }}
          >
            <div
              className="contact-particle__inner"
              style={{
                transform: transformStr,
              }}
            >
              <img
                src={p.src}
                alt={p.name}
                loading="eager"
                decoding="async"
                className="contact-particle__img"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactParticles;
