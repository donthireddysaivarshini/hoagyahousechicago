import React, { useState } from "react";
import "../../styles/auth.css";

export interface ForgotPasswordPageProps {
  onSubmitTarget?: (identifier: string) => void;
  onNavigateLogin?: () => void;
  onBackToStore?: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onSubmitTarget,
  onNavigateLogin,
  onBackToStore,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSubmitTarget) onSubmitTarget(email);
    }, 600);
  };

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

      <h1 className="auth-title-minimal">Reset password</h1>
      <p className="auth-subtitle-minimal">
        Please enter your email to receive a verification code.
      </p>

      <form className="auth-form-minimal" onSubmit={handleSubmit}>
        <div className="auth-field-minimal" style={{ marginBottom: "32px" }}>
          <label className="auth-label-minimal" htmlFor="forgot-email">
            E-mail
          </label>
          <div className="auth-input-underline-wrap">
            <input
              id="forgot-email"
              type="email"
              required
              placeholder="Enter your e-mail"
              className="auth-input-underline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <button
          type="submit"
          className="auth-btn-solid-black"
          disabled={isLoading || !email}
        >
          {isLoading ? "Sending code..." : "Send recovery code"}
        </button>

        <p className="auth-switch-text">
          Remember your password?{" "}
          {onNavigateLogin && (
            <button
              type="button"
              className="auth-switch-link"
              onClick={onNavigateLogin}
            >
              Log in here
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

export default ForgotPasswordPage;
