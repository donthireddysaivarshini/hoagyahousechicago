import React, { useEffect } from "react";
import siteData from "../../data/siteData.json";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="order-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="orderModalTitle"
    >
      <div
        className="order-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="order-modal-close-btn"
          onClick={onClose}
          aria-label="Close order options"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brand Header */}
        <div className="order-modal-header">
          <img
            src={`/${siteData.brand.logoImg}`}
            alt="Hoagy House Chicago"
            className="order-modal-logo"
          />
          <h2 id="orderModalTitle" className="order-modal-title">
            Order From Hoagy House
          </h2>
          <p className="order-modal-subtitle">
            Fresh hoagies, Philly steaks, wings &amp; fish — made fresh to order on Chicago’s South Side. 100% turkey &amp; beef. No pork.
          </p>
        </div>

        {/* Ordering Channels Stack */}
        <div className="order-modal-options">
          {/* Option 1: DoorDash */}
          <a
            href="https://www.doordash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="order-modal-btn order-modal-btn--doordash"
            aria-label="Order on DoorDash"
          >
            <div className="order-modal-btn-content">
              <span className="order-modal-btn-badge">FAST DELIVERY</span>
              <span className="order-modal-btn-title">Order on DoorDash</span>
              <span className="order-modal-btn-desc">Convenient doorstep delivery &amp; live driver tracking</span>
            </div>
            <div className="order-modal-btn-arrow" aria-hidden="true">
              <span>Order Now</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </a>

          {/* Option 2: Uber Eats */}
          <a
            href="https://www.ubereats.com"
            target="_blank"
            rel="noopener noreferrer"
            className="order-modal-btn order-modal-btn--ubereats"
            aria-label="Order on Uber Eats"
          >
            <div className="order-modal-btn-content">
              <span className="order-modal-btn-badge order-modal-btn-badge--uber">SOUTH SIDE DELIVERY</span>
              <span className="order-modal-btn-title">Order on Uber Eats</span>
              <span className="order-modal-btn-desc">On-demand delivery to your home or office</span>
            </div>
            <div className="order-modal-btn-arrow" aria-hidden="true">
              <span>Order Now</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </a>

          {/* Option 3: Direct Phone Call for Carryout / Catering */}
          <a
            href="tel:7738912416"
            className="order-modal-btn order-modal-btn--call"
            aria-label="Call store to order (773) 891-2416"
          >
            <div className="order-modal-btn-content">
              <span className="order-modal-btn-badge order-modal-btn-badge--pickup">TAP TO CALL</span>
              <span className="order-modal-btn-title">Call Store: (773) 891-2416</span>
              <span className="order-modal-btn-desc">Hot counter pickup &amp; catering hotline</span>
            </div>
            <div className="order-modal-btn-arrow" aria-hidden="true">
              <span>Call Us</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
          </a>
        </div>

        {/* Modal Footer Store Details */}
        <div className="order-modal-footer">
          <div className="order-modal-detail">
            <span className="order-modal-detail-label">STORE LOCATION</span>
            <span className="order-modal-detail-val">7116 S Yates Blvd, Chicago, IL 60649</span>
          </div>
          <div className="order-modal-detail">
            <span className="order-modal-detail-label">HOURS</span>
            <span className="order-modal-detail-val">
              Mon–Thu 10AM–11PM · Fri–Sat 10AM–2AM · Sun 10AM–11PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;

