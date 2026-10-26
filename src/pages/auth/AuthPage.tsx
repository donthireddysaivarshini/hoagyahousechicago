import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import OtpVerificationPage from "./OtpVerificationPage";
import "../../styles/auth.css";

export type AuthMode = "login" | "register" | "forgot-password" | "otp";

export interface AuthPageProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
  onBackToStore?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = "login",
  onSuccess,
  onBackToStore,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [otpTarget, setOtpTarget] = useState<string>("your email");

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleForgotTarget = (target: string) => {
    setOtpTarget(target || "your email");
    setMode("otp");
  };

  return (
    <div className="auth-wrapper" id="authPage">
      <div className="auth-split-visual">
        {onBackToStore && (
          <button
            type="button"
            className="auth-store-pill"
            onClick={onBackToStore}
          >
            ← Back to Storefront
          </button>
        )}
      </div>

      <div className="auth-split-pane">
        {mode === "login" && (
          <LoginPage
            onSuccess={onSuccess}
            onNavigateRegister={() => setMode("register")}
            onNavigateForgotPassword={() => setMode("forgot-password")}
            onBackToStore={onBackToStore}
          />
        )}

        {mode === "register" && (
          <RegisterPage
            onSuccess={() => setMode("otp")}
            onNavigateLogin={() => setMode("login")}
            onBackToStore={onBackToStore}
          />
        )}

        {mode === "forgot-password" && (
          <ForgotPasswordPage
            onSubmitTarget={handleForgotTarget}
            onNavigateLogin={() => setMode("login")}
            onBackToStore={onBackToStore}
          />
        )}

        {mode === "otp" && (
          <OtpVerificationPage
            destination={otpTarget}
            onSuccess={onSuccess}
            onNavigateLogin={() => setMode("login")}
            onBackToStore={onBackToStore}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
