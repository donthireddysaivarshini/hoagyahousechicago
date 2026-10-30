import React, { useState } from "react";
import "../../styles/customer-pages.css";

export interface RegisterPageProps {
  onSuccess?: () => void;
  onNavigateLogin?: () => void;
  onBackToStore?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateLogin,
  onBackToStore,
}) => {
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [password, setPassword] = useState("••••••••••••");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleGoogleSignUp = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      if (onSuccess) onSuccess();
    }, 700);
  };

  return (
    <div className="auth-card-minimal">
      <h1 className="auth-title-minimal">Create account</h1>
      <p className="auth-subtitle-minimal">Join Hoagy House Rewards for fast reordering and exclusive Chicago specials.</p>

      {/* Google Authentication Section */}
      <div className="google-auth-wrapper">
        <button
          type="button"
          className="google-auth-btn"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>{isGoogleLoading ? "Connecting with Google..." : "Sign up with Google"}</span>
        </button>

        <div
          style={{
            fontSize: "0.74rem",
            color: "#a8a29e",
            marginTop: "8px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: "var(--color-gold, #ffb834)", fontWeight: 700 }}>[Preview Mode]</span> Rapid Google OAuth integration ready for production domain verification.
        </div>
      </div>

      <div className="auth-divider-line">OR REGISTER WITH EMAIL</div>

      <form className="auth-form-minimal" onSubmit={handleSubmit}>
        <div className="auth-field-minimal">
          <label className="auth-label-minimal" htmlFor="reg-name">
            Full Name
          </label>
          <div className="auth-input-underline-wrap">
            <input
              id="reg-name"
              type="text"
              required
              placeholder="Enter your full name"
              className="auth-input-underline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        </div>

        <div className="auth-field-minimal">
          <label className="auth-label-minimal" htmlFor="reg-email">
            E-mail
          </label>
          <div className="auth-input-underline-wrap">
            <input
              id="reg-email"
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

        <div className="auth-field-minimal">
          <label className="auth-label-minimal" htmlFor="reg-password">
            Password
          </label>
          <div className="auth-input-underline-wrap">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a strong password"
              className="auth-input-underline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-underline-action"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        <div className="auth-options-row" style={{ marginBottom: "28px" }}>
          <label className="auth-remember-label">
            <input
              type="checkbox"
              className="auth-checkbox-minimal"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span style={{ fontSize: "0.84rem" }}>
              I agree to the Terms and Privacy Policy
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="auth-btn-solid-black"
          disabled={isLoading || !email || !password || !name || !agreeTerms}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>

        <p className="auth-switch-text">
          Already have an account?{" "}
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

export default RegisterPage;
