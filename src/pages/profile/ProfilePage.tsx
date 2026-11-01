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
  const [phone, setPhone] = useState("(773) 891-2416");
  const [address, setAddress] = useState("7116 S Yates Blvd, Apt 3B, Chicago, IL 60649");
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2800);
  };

  return (
    <div className="customer-page-container" id="profilePage">
      <div className="customer-page-inner">
        {/* Page Header */}
        <div className="customer-page-header">
          <div className="customer-page-badge">Customer Account</div>
          <h1 className="customer-page-title">My Account Profile</h1>
          <p className="customer-page-subtitle">
            Manage your personal contact details, saved Chicago delivery address, and account preferences.
          </p>
        </div>

        {/* Success Toast with clean SVG check */}
        {isSavedToast && (
          <div className="profile-feedback-alert profile-feedback-alert--success" role="status">
            <svg
              className="profile-feedback-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Profile preferences updated successfully.</span>
          </div>
        )}

        <div className="profile-grid">
          {/* Left Column: Member Card & Quick Navigation */}
          <aside className="profile-sidebar-card">
            <div className="profile-avatar-wrap" aria-hidden="true">AM</div>
            <h2 className="profile-name">{name}</h2>
            <div className="profile-email">{email}</div>

            <div className="profile-badge-row">
              <span className="profile-member-pill">
                <span className="profile-member-dot" aria-hidden="true" />
                <span>Hoagy House Member</span>
              </span>
            </div>

            <div className="profile-actions-stack">
              <button
                type="button"
                className="profile-action-btn profile-action-btn--primary"
                onClick={onNavigateOrders}
              >
                <span>View Order History</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                type="button"
                className="profile-action-btn profile-action-btn--secondary"
                onClick={onNavigateMenu}
              >
                <span>Browse Menu</span>
              </button>

              <button
                type="button"
                className="profile-signout-btn"
                onClick={onLogout}
              >
                Sign Out
              </button>
            </div>
          </aside>

          {/* Right Column: Editable Profile Details in 3 Structured Groups */}
          <section className="checkout-card profile-details-card">
            <h2 className="checkout-card__title">
              <span>Account Settings &amp; Delivery</span>
            </h2>

            <form onSubmit={handleSave} className="profile-form">
              {/* Group 1: Personal Details */}
              <div className="profile-form-section">
                <h3 className="profile-form-section-title">1. Personal Details</h3>
                <div className="form-row two-col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="prof-name">Customer Name</label>
                    <input
                      id="prof-name"
                      type="text"
                      required
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
                      className="form-input form-input--disabled"
                      value={email}
                      aria-describedby="prof-email-hint"
                    />
                    <span id="prof-email-hint" className="form-input-hint">
                      Primary verified account email
                    </span>
                  </div>
                </div>
              </div>

              {/* Group 2: Contact Details */}
              <div className="profile-form-section">
                <h3 className="profile-form-section-title">2. Contact Details</h3>
                <div className="form-group">
                  <label className="form-label" htmlFor="prof-phone">Phone Number (for order updates)</label>
                  <input
                    id="prof-phone"
                    type="tel"
                    required
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Group 3: Delivery Address */}
              <div className="profile-form-section">
                <h3 className="profile-form-section-title">3. Delivery Address</h3>
                <div className="form-group">
                  <label className="form-label" htmlFor="prof-address">
                    Default Street Address (within 3-mile Chicago radius)
                  </label>
                  <input
                    id="prof-address"
                    type="text"
                    required
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <span className="profile-zone-indicator">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffb834" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Eligible for Hoagy House 3-mile local Chicago delivery</span>
                  </span>
                </div>
              </div>

              <div className="profile-form-footer">
                <button
                  type="submit"
                  className="profile-submit-btn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
