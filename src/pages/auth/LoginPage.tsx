import React, { useState } from "react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 700);
  };

  return (
    <div className="auth-card-minimal">
      <h1 className="auth-title-minimal">Welcome back</h1>
      <p className="auth-subtitle-minimal">Please enter your details.</p>

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
          Don't have an account?
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

export default LoginPage;
