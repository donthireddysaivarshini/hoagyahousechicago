import React, { useEffect, useState } from "react";
import "../../styles/sweep-transition.css";

interface SweepTransitionProps {
  isActive: boolean;
  durationMs?: number;
  onCover?: () => void;
  onComplete?: () => void;
}

export const SweepTransition: React.FC<SweepTransitionProps> = ({
  isActive,
  durationMs = 1350,
  onCover,
  onComplete,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    setMounted(true);

    // At 46% of the animation, the shutter is 100% covering the viewport.
    const coverTime = Math.round(durationMs * 0.46);
    const coverTimer = setTimeout(() => {
      if (onCover) onCover();
    }, coverTime);

    // When the animation completes, shutter is completely finished and off-screen.
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
      setMounted(false);
    }, durationMs);

    return () => {
      clearTimeout(coverTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, durationMs, onCover, onComplete]);

  if (!mounted && !isActive) return null;

  return (
    <div
      className={`shutter-sweep ${isActive ? "is-active" : ""}`}
      style={{ "--sweep-duration": `${durationMs}ms` } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="shutter-sweep__sheen" />
      <div className="shutter-sweep__brand">
        <div className="shutter-sweep__bars">
          <span className="shutter-sweep__bar" />
          <span className="shutter-sweep__bar shutter-sweep__bar--accent" />
          <span className="shutter-sweep__bar" />
        </div>
        <span className="shutter-sweep__title">HOAGY HOUSE</span>
        <span className="shutter-sweep__sub">CHICAGO ATELIER</span>
      </div>
    </div>
  );
};

export default SweepTransition;
