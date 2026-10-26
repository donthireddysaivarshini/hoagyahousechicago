import React, { useState } from "react";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 700);
  };

  return (
    <div className="auth-card-minimal">
      <h1 className="auth-title-minimal">Create account</h1>
      <p className="auth-subtitle-minimal">Please enter your details to sign up.</p>

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
          Already have an account?
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
