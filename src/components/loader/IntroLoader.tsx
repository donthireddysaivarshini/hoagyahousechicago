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

    let closed = false;
    const triggerClose = () => {
      if (closed) return;
      closed = true;
      setProgress(100);
      setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          document.body.classList.remove("is-loading");
          setIsDone(true);
          if (onComplete) onComplete();
        }, 550);
      }, 100);
    };

    // Listen for instant completion when 3D model finishes downloading
    const handleModelReady = () => {
      triggerClose();
    };
    window.addEventListener("burger-3d-ready", handleModelReady);

    // Natural snappy increment fallback
    const timer = setInterval(() => {
      setProgress((prev) => {
        const increment = prev < 60 ? Math.floor(Math.random() * 8) + 6 : Math.floor(Math.random() * 6) + 4;
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          triggerClose();
          return 100;
        }
        return next;
      });
    }, 24);

    return () => {
      clearInterval(timer);
      window.removeEventListener("burger-3d-ready", handleModelReady);
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
            loading="eager"
            decoding="sync"
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
