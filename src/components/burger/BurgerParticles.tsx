import React, { useEffect, useState } from "react";

interface ParticleDef {
  id: string;
  name: string;
  src: string;
  top: string;
  left: string;
  size: string;
  baseRotate: number;
  floatAnim: string;
  floatDuration: string;
  floatDelay: string;
  depth: number; // For mouse parallax
  disperseX: number; // Explosion offset X
  disperseY: number; // Explosion offset Y
  disperseRot: number; // Explosion additional rotation
  blur?: string;
  opacity?: number;
}

const PARTICLES: ParticleDef[] = [
  // 1. Top-Left: Crispy bacon strip framing the upper-left
  {
    id: "bacon-strip-top-left",
    name: "Crispy Bacon Strip",
    src: "/images/particles/bacon_strip.webp",
    top: "12%",
    left: "4%",
    size: "clamp(85px, 8.5vw, 145px)",
    baseRotate: -18,
    floatAnim: "particleFloat1",
    floatDuration: "6.5s",
    floatDelay: "0s",
    depth: 0.05,
    disperseX: -45,
    disperseY: -35,
    disperseRot: -25
  },
  // 2. Mid-Left: Fresh romaine lettuce leaf drifting near left margin
  {
    id: "lettuce-mid-left",
    name: "Romaine Lettuce Leaf",
    src: "/images/particles/lettuce.webp",
    top: "60%",
    left: "2%",
    size: "clamp(85px, 8.5vw, 140px)",
    baseRotate: 24,
    floatAnim: "particleFloat2",
    floatDuration: "7.8s",
    floatDelay: "0.8s",
    depth: 0.06,
    disperseX: -55,
    disperseY: 15,
    disperseRot: 30
  },
  // 3. Bottom-Left: Zesty jalapeño ring on left table surface
  {
    id: "jalapeno-bottom-left",
    name: "Jalapeño Pepper Ring",
    src: "/images/particles/jalapeno.webp",
    top: "86%",
    left: "11%",
    size: "clamp(65px, 6.5vw, 110px)",
    baseRotate: -22,
    floatAnim: "particleFloat3",
    floatDuration: "5.8s",
    floatDelay: "0.4s",
    depth: 0.04,
    disperseX: -30,
    disperseY: 45,
    disperseRot: -20
  },
  // 4. Upper-Middle: Sweet red onion ring floating between title & burger
  {
    id: "onion-upper-mid",
    name: "Red Onion Ring",
    src: "/images/particles/onion.webp",
    top: "26%",
    left: "45%",
    size: "clamp(75px, 7.5vw, 120px)",
    baseRotate: 26,
    floatAnim: "particleFloat1",
    floatDuration: "8.2s",
    floatDelay: "0.6s",
    depth: 0.05,
    disperseX: 10,
    disperseY: -45,
    disperseRot: 30
  },
  // 5. Center-Middle: Glistening dill pickle slice floating in mid-depth
  {
    id: "pickle-center-mid",
    name: "Glistening Pickle Slice",
    src: "/images/particles/pickle.webp",
    top: "52%",
    left: "39%",
    size: "clamp(68px, 6.8vw, 110px)",
    baseRotate: -22,
    floatAnim: "particleFloat2",
    floatDuration: "7.2s",
    floatDelay: "1.2s",
    depth: 0.04,
    disperseX: -15,
    disperseY: 20,
    disperseRot: -25
  },
  // 6. Lower-Middle: Golden crispy potato fry floating near table center
  {
    id: "fry-lower-mid",
    name: "Golden Crispy Potato Fry",
    src: "/images/particles/fry.webp",
    top: "75%",
    left: "49%",
    size: "clamp(70px, 7vw, 115px)",
    baseRotate: 36,
    floatAnim: "particleFloat3",
    floatDuration: "6.6s",
    floatDelay: "0.9s",
    depth: 0.06,
    disperseX: 20,
    disperseY: 40,
    disperseRot: 35
  },
  // 7. Top-Right: Crispy bacon shards breaking apart above burger crown
  {
    id: "bacon-shards-top-right",
    name: "Crispy Bacon Shards",
    src: "/images/particles/bacon_shards.webp",
    top: "12%",
    left: "76%",
    size: "clamp(85px, 8.5vw, 145px)",
    baseRotate: 14,
    floatAnim: "particleFloat2",
    floatDuration: "7.2s",
    floatDelay: "1.6s",
    depth: 0.04,
    disperseX: 40,
    disperseY: -45,
    disperseRot: 25
  },
  // 8. Bottom-Right: Juicy vine tomato slice floating on the right
  {
    id: "tomato-bottom-right",
    name: "Juicy Tomato Slice",
    src: "/images/particles/tomato.webp",
    top: "82%",
    left: "84%",
    size: "clamp(85px, 8.5vw, 140px)",
    baseRotate: -14,
    floatAnim: "particleFloat1",
    floatDuration: "7.5s",
    floatDelay: "1.8s",
    depth: 0.05,
    disperseX: 35,
    disperseY: 40,
    disperseRot: -20
  }
];

interface BurgerParticlesProps {
  progress?: number; // Scroll explosion progress (0 to 1)
}

export const BurgerParticles: React.FC<BurgerParticlesProps> = ({ progress = 0 }) => {
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

  const containerOpacity = Math.max(0, 1 - (progress - 0.35) / 0.16);

  return (
    <div
      className="burger-particles-container"
      style={{
        opacity: containerOpacity,
        pointerEvents: "none",
        transition: "opacity 0.15s ease-out"
      }}
      aria-hidden="true"
    >
      {PARTICLES.map((p) => {
        // Parallax offset
        const px = mousePos.x * p.depth * -40;
        const py = mousePos.y * p.depth * -40;

        // Dispersion driven by scroll explosion progress
        const dx = p.disperseX * progress;
        const dy = p.disperseY * progress;
        const drot = p.disperseRot * progress;

        const currentRotate = p.baseRotate + drot;
        const totalTransform = `translate3d(${px + dx}px, ${py + dy}px, 0) rotate(${currentRotate}deg)`;

        return (
          <div
            key={p.id}
            className={`burger-particle burger-particle--${p.floatAnim}`}
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.floatDuration,
              animationDelay: p.floatDelay,
              opacity: p.opacity ?? 1,
              filter: p.blur ? `blur(${p.blur})` : undefined
            }}
          >
            <div
              className="burger-particle__inner"
              style={{
                transform: totalTransform,
                transition: "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)"
              }}
            >
              <img
                src={p.src}
                alt={p.name}
                loading="eager"
                decoding="async"
                className="burger-particle__img"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BurgerParticles;
