import React, { useState } from "react";
import "../../styles/auth.css";

export interface AdminLoginPageProps {
  onSuccess?: () => void;
  onBackToStore?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccess,
  onBackToStore,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Mock verification
    setTimeout(() => {
      setIsLoading(false);
      if (email.trim() && password.trim()) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg("Please enter a valid administrator email and password.");
      }
    }, 600);
  };

  return (
    <div className="auth-wrapper" id="adminLoginPage">
      <div className="auth-split-visual">
        {onBackToStore && (
          <button
            type="button"
            className="auth-store-pill"
            onClick={onBackToStore}
          >
            ← Return to Storefront
          </button>
        )}
      </div>

      <div className="auth-split-pane">
        <div className="auth-card-minimal">
          <h1 className="auth-title-minimal">Welcome back</h1>
          <p className="auth-subtitle-minimal">Please enter your administrator details.</p>

          {errorMsg && (
            <div className="auth-error-banner">
              {errorMsg}
            </div>
          )}

          <form className="auth-form-minimal" onSubmit={handleAdminSubmit}>
            <div className="auth-field-minimal">
              <label className="auth-label-minimal" htmlFor="admin-email">
                E-mail
              </label>
              <div className="auth-input-underline-wrap">
                <input
                  id="admin-email"
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

            <div className="auth-field-minimal" style={{ marginBottom: "36px" }}>
              <label className="auth-label-minimal" htmlFor="admin-password">
                Password
              </label>
              <div className="auth-input-underline-wrap">
                <input
                  id="admin-password"
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

            <button
              type="submit"
              className="auth-btn-solid-black"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Signing in..." : "Log in"}
            </button>

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
      </div>
    </div>
  );
};

export default AdminLoginPage;
