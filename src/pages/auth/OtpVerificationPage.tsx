import React, { useEffect, useRef, useState } from "react";

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
      <h1 className="auth-title-minimal">Enter code</h1>
      <p className="auth-subtitle-minimal">
        We sent a 6-digit verification code to <br />
        <span style={{ color: "#ffffff", fontWeight: 500 }}>{destination}</span>
      </p>

      <form className="auth-form-minimal" onSubmit={handleVerify}>
        <div className="auth-otp-minimal-grid" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="auth-otp-underline-box"
              autoComplete="one-time-code"
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="auth-btn-solid-black"
          disabled={!isComplete || isVerifying}
        >
          {isVerifying ? "Verifying..." : "Confirm & Continue"}
        </button>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          {canResend ? (
            <button
              type="button"
              className="auth-link-minimal"
              style={{ fontWeight: 600, color: "#ffffff" }}
              onClick={handleTriggerResend}
            >
              Resend verification code
            </button>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.86rem" }}>
              Resend code in <strong>0:{timer < 10 ? `0${timer}` : timer}</strong>
            </span>
          )}
        </div>

        <p className="auth-switch-text" style={{ marginTop: "16px" }}>
          Wrong email?
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
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              type="button"
              className="auth-link-minimal"
              style={{ opacity: 0.65, fontSize: "0.82rem" }}
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
