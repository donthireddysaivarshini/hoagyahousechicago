import React, { useEffect, useState } from "react";
import siteData from "../../data/siteData.json";

interface IntroLoaderProps {
  onComplete?: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-loading");

    const timer = setInterval(() => {
      setProgress((prev) => {
        // Natural smooth increment
        const increment = prev < 55 ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 4) + 2;
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          // Allow full progress bar to settle gracefully
          setTimeout(() => {
            setIsClosing(true);
            // Smooth shutter duration: 1100ms
            setTimeout(() => {
              document.body.classList.remove("is-loading");
              setIsDone(true);
              if (onComplete) onComplete();
            }, 1100);
          }, 280);
          return 100;
        }
        return next;
      });
    }, 38);

    return () => {
      clearInterval(timer);
      document.body.classList.remove("is-loading");
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      className={`fruit-loader ${isClosing ? "is-closing" : ""}`}
      id="fruitLoader"
      aria-hidden="true"
    >
      <div className="fruit-loader__content">
        <div className="fruit-loader__logo-wrap">
          <img
            src={`/${siteData.brand.logoImg}`}
            alt={siteData.brand.name}
            className="fruit-loader__logo-img"
          />
        </div>
        <div className="fruit-loader__bar-wrap">
          <div className="fruit-loader__bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="fruit-loader__sweep-panel"></div>
      <div className="fruit-loader__sweep-line"></div>
    </div>
  );
};

export default IntroLoader;
