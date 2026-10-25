import React from "react";

interface FooterProps {
  onNavigateContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateContact }) => {
  return (
    <footer className="luxury-footer" id="siteFooter">
      <div className="luxury-footer__inner">
        {/* Top Pre-Footer Callout Bar */}
        <div className="luxury-footer__top-row">
          <h2 className="luxury-footer__top-heading">Craving Chicago’s finest?</h2>
          <a
            href="https://www.doordash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-footer__cta-btn"
          >
            <span>ORDER ON DOORDASH</span>
            <span className="luxury-footer__cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        {/* Massive Typographic Monolithic Wordmark Hero */}
        <div className="luxury-footer__hero-wordmark" aria-label="Hoagy House">
          <div className="luxury-footer__brand-bars" aria-hidden="true">
            <span className="luxury-footer__bar"></span>
            <span className="luxury-footer__bar"></span>
            <span className="luxury-footer__bar luxury-footer__bar--accent"></span>
          </div>
          <span className="luxury-footer__wordmark-title">hoagy house</span>
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
                7116 S Yates Blvd<br />
                Chicago, IL 60649
              </a>
              <br />
              <span className="luxury-footer__sub-note">South Side · Dine In &amp; Carry Out</span>
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
              <a href="tel:7738912416" className="luxury-footer__link">
                (773) 891-2416
              </a>
              <br />
              <a href="mailto:hoagyhousechicago@gmail.com" className="luxury-footer__link">
                hoagyhousechicago@gmail.com
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
              Mon – Thu: 10:00 AM – 11:00 PM<br />
              Fri – Sat: 10:00 AM – 2:00 AM<br />
              Sun: 10:00 AM – 11:00 PM
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
            &copy; {new Date().getFullYear()} Hoagy House. All Rights Reserved.
          </span>
          <span className="luxury-footer__quality-note">
            100% Turkey &amp; Beef · No Pork · Dine In &amp; Carry Out · DoorDash &amp; Uber Eats
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
