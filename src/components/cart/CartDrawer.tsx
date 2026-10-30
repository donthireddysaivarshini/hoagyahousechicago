import React, { useEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { useCart } from "../../context/CartContext";
import "../../styles/cart-drawer.css";

interface CartDrawerProps {
  onNavigateToMenu?: () => void;
  onNavigateToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToMenu,
  onNavigateToCheckout,
}) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    subtotal,
  } = useCart();
  const lenis = useLenis();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll cleanly and stop/restart Lenis without breaking window scroll limits
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
      lenis?.resize();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
      lenis?.resize();
    };
  }, [isCartOpen, lenis]);

  const tax = subtotal * 0.1025; // Chicago meal tax ~10.25%
  const total = subtotal + tax;

  const handleBrowseMenu = () => {
    setIsCartOpen(false);
    if (onNavigateToMenu) {
      onNavigateToMenu();
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    }
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
  };

  return (
    <div
      className={`cart-drawer-overlay ${isCartOpen ? "is-open" : ""}`}
      onClick={() => setIsCartOpen(false)}
      aria-hidden={!isCartOpen}
    >
      <aside
        className="cart-drawer"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Your Cart"
      >
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title-wrap">
            <h2 className="cart-drawer__title">Your Feast Basket</h2>
            <span className="cart-drawer__badge">{totalCount} items</span>
          </div>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f39200"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h3 className="cart-drawer__empty-title">Your basket is empty</h3>
              <p className="cart-drawer__empty-sub">
                Explore our authentic South Side Chicago hoagies, steak burgers & seafood feasts.
              </p>
              <button
                type="button"
                className="cart-drawer__browse-btn"
                onClick={handleBrowseMenu}
              >
                <span>Browse Full Menu</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              {items.map((it) => {
                const itemTotal = (it.numericPrice || 0) * it.quantity;
                return (
                  <li key={it.id} className="cart-item">
                    <img
                      src={`/${it.img}`}
                      alt={it.name}
                      className="cart-item__img"
                      loading="lazy"
                    />
                    <div className="cart-item__info">
                      <div className="cart-item__top">
                        <h4 className="cart-item__name">{it.name}</h4>
                        <button
                          type="button"
                          className="cart-item__remove"
                          onClick={() => removeFromCart(it.id)}
                          aria-label={`Remove ${it.name}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                      {it.details && (
                        <span className="cart-item__details">{it.details}</span>
                      )}
                      {it.selectedOptions && it.selectedOptions.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", margin: "4px 0" }}>
                          {it.selectedOptions.map((opt, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: "0.72rem",
                                background: "rgba(255, 184, 52, 0.1)",
                                border: "1px solid rgba(255, 184, 52, 0.25)",
                                color: "#ffb834",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="cart-item__bottom">
                        <div className="cart-item__qty">
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() => updateQuantity(it.id, it.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="cart-item__qty-val">{it.quantity}</span>
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() => updateQuantity(it.id, it.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item__price">
                          ${itemTotal > 0 ? itemTotal.toFixed(2) : it.price}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__row">
              <span className="cart-drawer__label">Subtotal</span>
              <span className="cart-drawer__val">${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-drawer__row">
              <span className="cart-drawer__label">Est. Chicago Tax (10.25%)</span>
              <span className="cart-drawer__val">${tax.toFixed(2)}</span>
            </div>
            <div className="cart-drawer__row cart-drawer__row--total">
              <span className="cart-drawer__label">Estimated Total</span>
              <span className="cart-drawer__val cart-drawer__val--gold">
                ${total.toFixed(2)}
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#a8a29e", margin: "6px 0 16px", lineHeight: "1.4" }}>
              * Final total including delivery fee and verified tax is calculated at checkout.
            </p>

            {/* Action Buttons: Proceed to Checkout & Continue Shopping */}
            <button
              type="button"
              className="cart-order-btn"
              onClick={handleCheckout}
            >
              <span>Proceed to Checkout</span>
              <svg
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleContinueShopping}
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#d6d3d1",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "10px",
                transition: "all 0.2s ease",
              }}
            >
              ← Continue Browsing Menu
            </button>

            <div className="cart-drawer__footer-meta">
              <button
                type="button"
                className="cart-drawer__clear-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <span className="cart-drawer__guarantee">
                Made Fresh · Hot & Fast
              </span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
