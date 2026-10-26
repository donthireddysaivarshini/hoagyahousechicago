import React, { useEffect, useRef, useState } from "react";
import "../../styles/sweep-transition.css";

interface SweepTransitionProps {
  isActive: boolean;
  durationMs?: number;
  onCover?: () => void;
  onComplete?: () => void;
}

export const SweepTransition: React.FC<SweepTransitionProps> = ({
  isActive,
  durationMs = 1250,
  onCover,
  onComplete,
}) => {
  const [mounted, setMounted] = useState(false);

  // Store latest callbacks in refs to prevent dependency changes from resetting animation timers
  const onCoverRef = useRef(onCover);
  onCoverRef.current = onCover;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isActive) {
      setMounted(false);
      return;
    }

    setMounted(true);

    // At 46% of the animation, the shutter is 100% covering the viewport.
    const coverTime = Math.round(durationMs * 0.46);
    const coverTimer = setTimeout(() => {
      onCoverRef.current?.();
    }, coverTime);

    // When the animation completes, shutter is completely finished and off-screen.
    const completeTimer = setTimeout(() => {
      onCompleteRef.current?.();
      setMounted(false);
    }, durationMs);

    return () => {
      clearTimeout(coverTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, durationMs]);

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
