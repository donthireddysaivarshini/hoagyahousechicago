import React, { useEffect, useRef, useState } from "react";
import "../../styles/auth.css";

export interface OtpVerificationPageProps {
  destination?: string;
  onSuccess?: (otpCode: string) => void;
  onResend?: () => void;
  onNavigateLogin?: () => void;
  onBackToStore?: () => void;
}

export const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({
  destination = "your email",
  onSuccess,
  onResend,
  onNavigateLogin,
  onBackToStore,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const digit = cleanVal.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    // Auto-advance
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const nextOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      nextOtp[i] = pastedData[i];
    }
    setOtp(nextOtp);

    const focusIndex = Math.min(pastedData.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (onSuccess) onSuccess(code);
    }, 700);
  };

  const handleTriggerResend = () => {
    if (!canResend) return;
    setTimer(59);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
    if (onResend) onResend();
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="auth-card-minimal">
      {/* Prominent Hoagy House Logo */}
      <div className="auth-brand-header">
        <img
          src="/images/logo.webp"
          alt="Hoagy House Chicago"
          className="auth-brand-logo"
        />
      </div>

      <h1 className="auth-title-minimal">Enter code</h1>
      <p className="auth-subtitle-minimal">
        We sent a 6-digit verification code to <strong style={{ color: "#fff" }}>{destination}</strong>.
      </p>

      <form className="auth-form-minimal" onSubmit={handleVerify}>
        <div className="auth-otp-row">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="auth-otp-cell"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        <div className="auth-resend-row">
          {canResend ? (
            <button
              type="button"
              className="auth-link-minimal"
              style={{ color: "var(--color-gold, #ffb834)", fontWeight: 600 }}
              onClick={handleTriggerResend}
            >
              Resend verification code
            </button>
          ) : (
            <span>Resend code in {timer}s</span>
          )}
        </div>

        <button
          type="submit"
          className="auth-btn-solid-black"
          disabled={!isComplete || isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify & Continue"}
        </button>

        <p className="auth-switch-text">
          Want to change email?{" "}
          {onNavigateLogin && (
            <button
              type="button"
              className="auth-switch-link"
              onClick={onNavigateLogin}
            >
              Back to log in
            </button>
          )}
        </p>

        {onBackToStore && (
          <div className="auth-back-nav">
            <button
              type="button"
              className="auth-link-minimal auth-back-btn"
              onClick={onBackToStore}
            >
              ← Return to Public Storefront
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OtpVerificationPage;
