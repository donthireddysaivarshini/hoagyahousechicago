import React, { useEffect, useRef, useState } from "react";
import siteData from "../../data/siteData.json";
import SweepTransition from "./SweepTransition";
import "../../styles/intro-loader.css";

interface IntroLoaderProps {
  onComplete?: () => void;
}

interface CinemaParticle {
  id: string;
  name: string;
  src: string;
  targetX: string;
  targetY: string;
  targetZ: string;
  mobileTargetX: string;
  mobileTargetY: string;
  scale: number;
  mobileScale: number;
  baseRotate: number;
  burstDelay: string;
  floatSpeed: string;
  floatType: "float1" | "float2" | "float3";
  isForeground?: boolean;
}

const CINEMA_PARTICLES: CinemaParticle[] = [
  // --- UPPER SKY (Mobile: Top area / Desktop: Widescreen framing) ---
  {
    id: "particle-bacon-strip-outer-tl",
    name: "Crispy Bacon Strip",
    src: "/images/particles/bacon_strip.webp",
    targetX: "clamp(-440px, -37vw, -280px)",
    targetY: "clamp(-280px, -28vh, -180px)",
    targetZ: "40px",
    mobileTargetX: "clamp(-95px, -24vw, -65px)",
    mobileTargetY: "clamp(-310px, -36vh, -220px)",
    scale: 1.05,
    mobileScale: 1.18,
    baseRotate: -25,
    burstDelay: "0.12s",
    floatSpeed: "7.0s",
    floatType: "float2",
  },
  {
    id: "particle-bacon-shards-outer-tr",
    name: "Crispy Bacon Shards",
    src: "/images/particles/bacon_shards.webp",
    targetX: "clamp(290px, 36vw, 440px)",
    targetY: "clamp(-290px, -29vh, -190px)",
    targetZ: "80px",
    mobileTargetX: "clamp(65px, 25vw, 105px)",
    mobileTargetY: "clamp(-280px, -33vh, -200px)",
    scale: 1.25,
    mobileScale: 1.3,
    baseRotate: 18,
    burstDelay: "0.18s",
    floatSpeed: "6.8s",
    floatType: "float1",
    isForeground: true,
  },

  // --- MID-UPPER (Framing Logo Shoulders) ---
  {
    id: "particle-onion-inner-tl",
    name: "Red Onion Ring",
    src: "/images/particles/onion.webp",
    targetX: "clamp(-220px, -18vw, -150px)",
    targetY: "clamp(-170px, -17vh, -120px)",
    targetZ: "20px",
    mobileTargetX: "clamp(-135px, -34vw, -95px)",
    mobileTargetY: "clamp(-145px, -17vh, -105px)",
    scale: 0.95,
    mobileScale: 1.15,
    baseRotate: 24,
    burstDelay: "0.08s",
    floatSpeed: "6.2s",
    floatType: "float1",
  },
  {
    id: "particle-pickle-inner-tr",
    name: "Glistening Pickle",
    src: "/images/particles/pickle.webp",
    targetX: "clamp(150px, 18vw, 220px)",
    targetY: "clamp(-180px, -18vh, -130px)",
    targetZ: "30px",
    mobileTargetX: "clamp(95px, 34vw, 135px)",
    mobileTargetY: "clamp(-130px, -15vh, -95px)",
    scale: 0.92,
    mobileScale: 1.12,
    baseRotate: -22,
    burstDelay: "0.14s",
    floatSpeed: "5.8s",
    floatType: "float2",
  },

  // --- MID-LOWER (Framing Progress Console) ---
  {
    id: "particle-jalapeno-inner-bl",
    name: "Jalapeño Pepper Ring",
    src: "/images/particles/jalapeno.webp",
    targetX: "clamp(-230px, -19vw, -160px)",
    targetY: "clamp(130px, 17vh, 180px)",
    targetZ: "10px",
    mobileTargetX: "clamp(-130px, -33vw, -90px)",
    mobileTargetY: "clamp(120px, 15vh, 160px)",
    scale: 0.88,
    mobileScale: 1.1,
    baseRotate: -18,
    burstDelay: "0.22s",
    floatSpeed: "6.5s",
    floatType: "float3",
  },
  {
    id: "particle-fry-inner-br",
    name: "Golden Potato Fry",
    src: "/images/particles/fry.webp",
    targetX: "clamp(160px, 20vw, 235px)",
    targetY: "clamp(140px, 18vh, 190px)",
    targetZ: "25px",
    mobileTargetX: "clamp(90px, 32vw, 130px)",
    mobileTargetY: "clamp(135px, 16vh, 175px)",
    scale: 0.94,
    mobileScale: 1.15,
    baseRotate: 34,
    burstDelay: "0.26s",
    floatSpeed: "5.6s",
    floatType: "float1",
  },

  // --- LOWER FLOOR (Mobile: Bottom area / Desktop: Widescreen floor) ---
  {
    id: "particle-lettuce-outer-bl",
    name: "Romaine Lettuce Leaf",
    src: "/images/particles/lettuce.webp",
    targetX: "clamp(-440px, -36vw, -290px)",
    targetY: "clamp(190px, 27vh, 290px)",
    targetZ: "70px",
    mobileTargetX: "clamp(-90px, -24vw, -60px)",
    mobileTargetY: "clamp(240px, 32vh, 320px)",
    scale: 1.22,
    mobileScale: 1.3,
    baseRotate: 26,
    burstDelay: "0.32s",
    floatSpeed: "7.6s",
    floatType: "float3",
    isForeground: true,
  },
  {
    id: "particle-tomato-outer-br",
    name: "Juicy Tomato Slice",
    src: "/images/particles/tomato.webp",
    targetX: "clamp(280px, 35vw, 430px)",
    targetY: "clamp(180px, 26vh, 280px)",
    targetZ: "45px",
    mobileTargetX: "clamp(60px, 24vw, 100px)",
    mobileTargetY: "clamp(230px, 30vh, 300px)",
    scale: 1.08,
    mobileScale: 1.2,
    baseRotate: -15,
    burstDelay: "0.38s",
    floatSpeed: "6.4s",
    floatType: "float2",
  },
];

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(1);
  const [hasBurst, setHasBurst] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSweeping, setIsSweeping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const embersCanvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Precise 3.5s Eased Progress Counter & Logo Burst Choreography
  useEffect(() => {
    document.body.classList.add("is-loading");

    const TOTAL_DURATION_MS = 3500; // Exactly 3.5 seconds
    const startTime = performance.now();
    let animId = 0;
    let closed = false;

    // Trigger explosive radial particle burst right after logo reveals
    const burstTimer = setTimeout(() => {
      setHasBurst(true);
    }, 400);

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const progressFraction = Math.min(1, elapsed / TOTAL_DURATION_MS);

      // Smooth custom easing curve for luxury pacing
      const current = Math.max(1, Math.min(100, Math.round(progressFraction * 100)));
      setProgress(current);

      if (elapsed < TOTAL_DURATION_MS) {
        animId = requestAnimationFrame(updateProgress);
      } else {
        if (closed) return;
        closed = true;
        setProgress(100);

        // Climax hold for 220ms at 100%, then trigger separate sweep transition
        setTimeout(() => {
          setIsSweeping(true);
        }, 220);
      }
    };

    animId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(burstTimer);
      document.body.classList.remove("is-loading");
    };
  }, [onComplete]);

  // 2. Interactive 3D Holographic Perspective Tilt
  useEffect(() => {
    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        setMouseTilt({ x: nx, y: ny });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 3. Ambient Drifting Golden Ember Sparks (Lightweight Canvas)
  useEffect(() => {
    const canvas = embersCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    interface Spark {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      fade: number;
    }

    const sparks: Spark[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.7 + 0.3),
      alpha: Math.random() * 0.6 + 0.2,
      fade: Math.random() * 0.008 + 0.003,
    }));

    let sparkAnimId = 0;
    const renderSparks = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha += s.fade;

        if (s.alpha > 0.8 || s.alpha < 0.15) {
          s.fade = -s.fade;
        }

        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 146, 0, ${s.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ffb834";
        ctx.fill();
      }

      sparkAnimId = requestAnimationFrame(renderSparks);
    };

    sparkAnimId = requestAnimationFrame(renderSparks);

    return () => {
      cancelAnimationFrame(sparkAnimId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isDone) return null;

  return (
    <>
      {/* 1. SEPARATE INTRO LOADING SCREEN (Unmounts the moment sweep covers) */}
      {isLoading && (
        <div
          className={`cinema-loader ${hasBurst ? "has-burst" : ""}`}
          id="cinemaLoader"
          aria-hidden="true"
        >
      {/* 1. Atmospheric Lighting & Texture */}
      <div className="cinema-loader__backdrop">
        <div className="cinema-loader__bg-gradient" />
        <div className="cinema-loader__core-glow" />
        <canvas ref={embersCanvasRef} className="cinema-loader__embers-canvas" />
        <div className="cinema-loader__vignette" />
      </div>

      {/* 2. 3D Spatial Particles Stage (Zero-Gravity Culinary Orbit) */}
      <div
        className="cinema-loader__particles-stage"
        style={{
          transform: `rotateX(${mouseTilt.y * -8}deg) rotateY(${mouseTilt.x * 8}deg)`,
          transition: "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {CINEMA_PARTICLES.map((p) => (
          <div
            key={p.id}
            className={`cinema-particle cinema-particle--${p.floatType} ${
              p.isForeground ? "cinema-particle--foreground" : "cinema-particle--midground"
            }`}
            style={
              {
                "--target-x": p.targetX,
                "--target-y": p.targetY,
                "--target-z": p.targetZ,
                "--mobile-target-x": p.mobileTargetX,
                "--mobile-target-y": p.mobileTargetY,
                "--mobile-scale": p.mobileScale,
                "--target-rot": `${p.baseRotate}deg`,
                "--particle-scale": p.scale,
                "--burst-delay": p.burstDelay,
                "--float-speed": p.floatSpeed,
                "--particle-size": p.isForeground
                  ? "clamp(90px, 9vw, 155px)"
                  : "clamp(65px, 6.8vw, 115px)",
              } as React.CSSProperties
            }
          >
            <div className="cinema-particle__float">
              <img
                src={p.src}
                alt={p.name}
                loading="eager"
                decoding="sync"
                className="cinema-particle__img"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Center Hero Stage: Brand Emblem & Clean Progress Console */}
      <div className="cinema-loader__center">
        <div
          className="cinema-loader__center-tilt"
          style={{
            transform: `translate3d(${mouseTilt.x * 10}px, ${mouseTilt.y * 10}px, 0)`,
            transition: "transform 0.22s ease-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Golden Center Hoagy House Logo (No Ring) */}
          <div className="cinema-loader__logo-box">
            <img
              src={`/${siteData.brand.logoImg}`}
              alt={siteData.brand.name}
              className="cinema-loader__logo-img"
              loading="eager"
              decoding="sync"
            />
          </div>

        {/* 5. Clean Architectural Progress Console Directly Under Logo */}
        <div className="cinema-loader__console">
          {/* Razor-Thin Glowing Comet Bar Directly Under Logo */}
          <div className="cinema-loader__bar-container">
            <div
              className="cinema-loader__bar-fill"
              style={{ width: `${progress}%` }}
            >
              <span className="cinema-loader__bar-comet" />
            </div>
          </div>

          {/* Small Refined Percentage Counter Under Progress Bar */}
          <div className="cinema-loader__counter-lockup">
            <span className="cinema-loader__counter-value">{progress}</span>
            <span className="cinema-loader__counter-symbol">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* 2. SEPARATE ARCHITECTURAL SHUTTER SWEEP (Independent Overlay Component) */}
      <SweepTransition
        isActive={isSweeping}
        onCover={() => {
          setIsLoading(false);
          document.body.classList.remove("is-loading");
        }}
        onComplete={() => {
          setIsDone(true);
          if (onComplete) onComplete();
        }}
      />
    </>
  );
};

export default IntroLoader;
