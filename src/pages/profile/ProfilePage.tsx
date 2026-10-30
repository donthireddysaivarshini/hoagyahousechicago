import React, { useState } from "react";
import "../../styles/customer-pages.css";

interface ProfilePageProps {
  onNavigateMenu: () => void;
  onNavigateOrders: () => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateMenu,
  onNavigateOrders,
  onLogout,
}) => {
  const [name, setName] = useState("Alex Morgan");
  const [email] = useState("alex.morgan@example.com");
  const [phone, setPhone] = useState("(773) 555-0192");
  const [address, setAddress] = useState("7116 S Yates Blvd, Apt 3B, Chicago, IL 60649");
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  return (
    <div className="customer-page-container" id="profilePage">
      <div className="customer-page-inner">
        {/* Header */}
        <div className="customer-page-header">
          <div className="customer-page-badge">Customer Account</div>
          <h1 className="customer-page-title">My Account Profile</h1>
          <p className="customer-page-subtitle">
            Manage your personal contact details, saved Chicago delivery address, and account preferences.
          </p>
        </div>

        {/* Preview Alert Banner */}
        <div className="preview-alert-banner">
          <span className="preview-alert-banner__icon">ℹ️</span>
          <div>
            <strong>Demonstration Profile:</strong> This profile displays sample customer data for client review.
            Once Google OAuth &amp; Django sessions are deployed on the live domain, this connects directly to your verified customer account.
          </div>
        </div>

        {isSavedToast && (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.2)",
              border: "1px solid #22c55e",
              color: "#22c55e",
              padding: "12px 18px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            ✓ Profile preferences saved (Preview Mode).
          </div>
        )}

        <div className="profile-grid">
          {/* Left Column: Avatar & Account Badges */}
          <div className="profile-sidebar-card">
            <div className="profile-avatar-wrap">AM</div>
            <h2 className="profile-name">{name}</h2>
            <div className="profile-email">{email}</div>

            <div style={{ marginBottom: "20px" }}>
              <span className="google-connected-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Google Account Connected</span>
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                type="button"
                className="modal-add-cart-btn"
                style={{ width: "100%", height: "46px", fontSize: "0.92rem" }}
                onClick={onNavigateOrders}
              >
                <span>View Order History</span>
              </button>

              <button
                type="button"
                onClick={onNavigateMenu}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(243, 146, 0, 0.35)",
                  color: "#f5ede4",
                  padding: "12px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                }}
              >
                Browse Menu
              </button>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff9170",
                  padding: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "6px",
                  textDecoration: "underline",
                }}
              >
                Log Out of Demo Account
              </button>
            </div>
          </div>

          {/* Right Column: Editable Profile Fields */}
          <div className="checkout-card" style={{ margin: 0 }}>
            <h2 className="checkout-card__title" style={{ marginBottom: "18px" }}>
              Profile Details &amp; Saved Delivery Address
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-row two-col">
                <div className="form-group">
                  <label className="form-label" htmlFor="prof-name">Customer Name</label>
                  <input
                    id="prof-name"
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="prof-email">Email Address</label>
                  <input
                    id="prof-email"
                    type="email"
                    disabled
                    className="form-input"
                    value={email}
                    style={{ opacity: 0.65 }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label" htmlFor="prof-phone">Phone Number</label>
                <input
                  id="prof-phone"
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label" htmlFor="prof-address">
                  Default Delivery Address (within 3 miles)
                </label>
                <input
                  id="prof-address"
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <span style={{ fontSize: "0.78rem", color: "var(--color-gold, #ffb834)", marginTop: "4px" }}>
                  📍 Eligible for Hoagy House 3-mile local delivery zone
                </span>
              </div>

              <button
                type="submit"
                className="modal-add-cart-btn"
                style={{ maxWidth: "200px" }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

