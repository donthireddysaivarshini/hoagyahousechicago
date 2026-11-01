import React, { useState } from "react";
import "../../styles/auth.css";

export interface LoginPageProps {
  onSuccess?: () => void;
  onNavigateRegister?: () => void;
  onNavigateForgotPassword?: () => void;
  onBackToStore?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onBackToStore,
}) => {
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      if (onSuccess) onSuccess();
    }, 700);
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

      <h1 className="auth-title-minimal">Welcome back</h1>
      <p className="auth-subtitle-minimal">
        Sign in to your Hoagy House account to view past orders and saved delivery addresses.
      </p>

      {/* Styled Google Sign-In Action */}
      <div className="google-auth-wrapper">
        <button
          type="button"
          className="google-auth-btn"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          aria-label="Continue with Google sign in"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
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
          <span>{isGoogleLoading ? "Connecting with Google..." : "Continue with Google"}</span>
        </button>
      </div>

      <div className="auth-divider-line">OR SIGN IN WITH EMAIL</div>

      <form className="auth-form-minimal" onSubmit={handleSubmit}>
        <div className="auth-field-minimal">
          <label className="auth-label-minimal" htmlFor="login-email">
            E-mail
          </label>
          <div className="auth-input-underline-wrap">
            <input
              id="login-email"
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
          <label className="auth-label-minimal" htmlFor="login-password">
            Password
          </label>
          <div className="auth-input-underline-wrap">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="auth-input-underline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

        <div className="auth-options-row">
          <label className="auth-remember-label">
            <input
              type="checkbox"
              className="auth-checkbox-minimal"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          {onNavigateForgotPassword && (
            <button
              type="button"
              className="auth-link-minimal"
              onClick={onNavigateForgotPassword}
            >
              Forgot your password?
            </button>
          )}
        </div>

        <button
          type="submit"
          className="auth-btn-solid-black"
          disabled={isLoading || !email || !password}
        >
          {isLoading ? "Signing in..." : "Log in"}
        </button>

        <p className="auth-switch-text">
          Don't have an account?{" "}
          {onNavigateRegister && (
            <button
              type="button"
              className="auth-switch-link"
              onClick={onNavigateRegister}
            >
              Register here
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

export default LoginPage;
