import React from "react";

interface FooterProps {
  onNavigateContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateContact }) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="luxury-footer" id="siteFooter">
      <div className="luxury-footer__inner">
        {/* Top Pre-Footer Callout Bar */}
        <div className="luxury-footer__top-row">
          <h2 className="luxury-footer__top-heading">CRAVING CHICAGO’S FINEST?</h2>
          <div className="luxury-footer__top-actions">
            <a
              href="https://www.doordash.com/store/hoagy-house-chicago-132473/122833947/?cursor=eyJzZWFyY2hfaXRlbV9jYXJvdXNlbF9jdXJzb3IiOnsicXVlcnkiOiJIb2FneSBob3VzZSAiLCJpdGVtX2lkcyI6W10sInNlYXJjaF90ZXJtIjoiaG9hZ3kgaG91c2UiLCJ2ZXJ0aWNhbF9pZCI6LTk5OSwidmVydGljYWxfbmFtZSI6ImFsbCIsInF1ZXJ5X2ludGVudCI6IlNUT1JFX1JYIn0sInN0b3JlX3ByaW1hcnlfdmVydGljYWxfaWRzIjpbMSwxMDAzMjIsMTAwMzMyLDEwMDMzMywxMTAwMzcsMTEwMDQ1LDExMDA1MiwxMTAwNTUsMTEwMDYyLDExMDA4MiwxMTAwODMsMTc1LDE3NiwxNzcsMTc4LDE3OSwxOTIsMTEwMDU4LDE5MywxOTVdfQ==&pickup=false"
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-footer__cta-btn luxury-footer__cta-btn--doordash"
              aria-label="Order on DoorDash"
            >
              <span className="luxury-footer__cta-icon-badge luxury-footer__cta-icon-badge--doordash" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#FF3008">
                  <path d="M23.038 9.537a5.525 5.525 0 0 0-4.897-4.041H4.37a.89.89 0 0 0-.82.553L.073 14.19a.89.89 0 0 0 .82 1.226h4.34a.89.89 0 0 0 .82-.553l1.86-4.524h6.03a3.738 3.738 0 0 1 3.312 2.732 3.754 3.754 0 0 1-3.626 4.75H8.76a.89.89 0 0 0-.82.553l-1.07 2.604a.89.89 0 0 0 .82 1.226h5.938c5.44 0 9.774-4.55 9.41-10.167z" />
                </svg>
              </span>
              <span>ORDER ON DOORDASH</span>
              <span className="luxury-footer__cta-arrow" aria-hidden="true">→</span>
            </a>
            <a
              href="https://www.ubereats.com"
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-footer__cta-btn luxury-footer__cta-btn--ubereats"
              aria-label="Order on Uber Eats"
            >
              <span className="luxury-footer__cta-icon-badge luxury-footer__cta-icon-badge--ubereats" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#06C167">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                </svg>
              </span>
              <span>ORDER ON UBER EATS</span>
              <span className="luxury-footer__cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Brand Showcase: Iconic /// HOAGY HOUSE Wordmark in ALL CAPS */}
        <div className="luxury-footer__hero-wordmark" aria-label="HOAGY HOUSE CHICAGO">
          <div className="luxury-footer__brand-bars" aria-hidden="true">
            <span className="luxury-footer__bar" />
            <span className="luxury-footer__bar luxury-footer__bar--accent" />
            <span className="luxury-footer__bar" />
          </div>
          <span className="luxury-footer__wordmark-title">HOAGY HOUSE</span>
        </div>

        {/* 4-Column Mid Grid: Location, Contact, Hours, Heritage Seal */}
        <div className="luxury-footer__mid-grid">
          {/* Column 1: Location & Address */}
          <div className="luxury-footer__col luxury-footer__col--location">
            <span className="luxury-footer__label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f39200" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: "-1px", marginRight: "6px" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              LOCATION
            </span>
            <p className="luxury-footer__info-text">
              <a
                href="https://maps.google.com/?q=7116+S+Yates+Blvd,+Chicago,+IL+60649"
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-footer__link"
              >
                7116 S YATES BLVD<br />
                CHICAGO, IL 60649
              </a>
              <br />
              <span className="luxury-footer__sub-note">SOUTH SIDE · DINE IN &amp; CARRY OUT</span>
            </p>
          </div>

          {/* Column 2: Contact Information */}
          <div className="luxury-footer__col luxury-footer__col--contact">
            <span className="luxury-footer__label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f39200" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: "-1px", marginRight: "6px" }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {onNavigateContact ? (
                <button
                  type="button"
                  onClick={onNavigateContact}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    font: "inherit",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  CONTACT PAGE →
                </button>
              ) : (
                "CONTACT"
              )}
            </span>
            <p className="luxury-footer__info-text">
              <a
                href="tel:7738912416"
                className="luxury-footer__link luxury-footer__phone-link"
                aria-label="Tap to call (773) 891-2416"
              >
                (773) 891-2416
              </a>
              <br />
              <a href="mailto:hoagyhousechicago@gmail.com" className="luxury-footer__link">
                HOAGYHOUSECHICAGO@GMAIL.COM
              </a>
            </p>
          </div>

          {/* Column 3: Business Hours */}
          <div className="luxury-footer__col luxury-footer__col--hours">
            <span className="luxury-footer__label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f39200" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: "-1px", marginRight: "6px" }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              HOURS
            </span>
            <p className="luxury-footer__info-text">
              MON – THU: 10:00 AM – 11:00 PM<br />
              FRI – SAT: 10:00 AM – 2:00 AM<br />
              SUN: 10:00 AM – 11:00 PM
            </p>
          </div>

          {/* Column 4: Circular Heritage Seal Badge */}
          <div className="luxury-footer__col luxury-footer__col--seal">
            <div className="luxury-footer__seal-circle" title="20 Years Chicago Heritage">
              <span className="luxury-footer__seal-star" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f39200">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <span className="luxury-footer__seal-year">EST. 2004</span>
              <span className="luxury-footer__seal-sub">CHICAGO</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Row */}
        <div className="luxury-footer__bottom-row">
          <span className="luxury-footer__copyright">
            &copy; {new Date().getFullYear()} HOAGY HOUSE. ALL RIGHTS RESERVED.
          </span>
          <span className="luxury-footer__quality-note">
            100% TURKEY &amp; BEEF · NO PORK · DINE IN &amp; CARRY OUT · DOORDASH &amp; UBER EATS
          </span>
          <button
            type="button"
            onClick={handleScrollToTop}
            className="luxury-footer__scroll-top-btn"
            style={{
              background: "none",
              border: "none",
              color: "var(--color-gold, #ffb834)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              cursor: "pointer",
              padding: "4px 8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "transform 0.2s ease, color 0.2s ease",
            }}
            aria-label="Scroll to top of page"
          >
            <span>BACK TO TOP</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
