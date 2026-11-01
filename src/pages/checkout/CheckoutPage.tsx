import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/customer-pages.css";

export interface PlacedOrderData {
  orderId: string;
  timestamp: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: "PICKUP" | "DELIVERY";
  deliveryAddress: string;
  orderNotes: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  items: any[];
}

interface CheckoutPageProps {
  onBackToMenu: () => void;
  onOrderSuccess: (order: PlacedOrderData) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToMenu,
  onOrderSuccess,
}) => {
  const { items, subtotal, clearCart } = useCart();

  const [fulfillmentType, setFulfillmentType] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [customerName, setCustomerName] = useState("Alex Morgan");
  const [customerEmail, setCustomerEmail] = useState("alex.morgan@example.com");
  const [customerPhone, setCustomerPhone] = useState("(773) 891-2416");
  const [deliveryAddress, setDeliveryAddress] = useState("7116 S Yates Blvd, Apt 3B");
  const [deliveryZip, setDeliveryZip] = useState("60649");
  const [orderNotes, setOrderNotes] = useState("");

  // Payment mock fields
  const [cardName, setCardName] = useState("Alex Morgan");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4111");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const taxRate = 0.1025; // Chicago restaurant meal tax ~10.25%
  const tax = subtotal * taxRate;
  const deliveryFee = fulfillmentType === "DELIVERY" ? 3.99 : 0.0;
  const grandTotal = subtotal + tax + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const generatedOrderId = `HH-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullAddress =
      fulfillmentType === "DELIVERY"
        ? `${deliveryAddress}, Chicago, IL ${deliveryZip} (within 3-mile delivery radius)`
        : "Store Pickup: 7116 S Yates Blvd, Chicago, IL 60649";

    const completedOrder: PlacedOrderData = {
      orderId: generatedOrderId,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      customerName,
      customerEmail,
      customerPhone,
      fulfillmentType,
      deliveryAddress: fullAddress,
      orderNotes,
      subtotal,
      tax,
      deliveryFee,
      total: grandTotal,
      items: [...items],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      onOrderSuccess(completedOrder);
    }, 900);
  };

  if (items.length === 0) {
    return (
      <div className="customer-page-container">
        <div className="customer-page-inner" style={{ textAlign: "center", padding: "80px 20px" }}>
          <div className="customer-page-badge">Checkout</div>
          <h1 className="customer-page-title">Your Basket is Empty</h1>
          <p className="customer-page-subtitle" style={{ margin: "12px auto 28px" }}>
            Add delicious flame-seared burgers, Philly steaks, and hoagies before proceeding to checkout.
          </p>
          <button
            type="button"
            className="orders-action-btn orders-action-btn--primary"
            style={{ maxWidth: "260px", margin: "0 auto" }}
            onClick={onBackToMenu}
          >
            ← Explore Our Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-page-container" id="checkoutPage">
      <div className="customer-page-inner">
        {/* Page Header */}
        <div className="customer-page-header">
          <div className="customer-page-badge">Hoagy House Chicago · Checkout</div>
          <h1 className="customer-page-title">Finalize Your Order</h1>
          <p className="customer-page-subtitle">
            Confirm your fulfillment preference, contact information, and review your order total.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <form onSubmit={handleSubmitOrder}>
          <div className="checkout-grid">
            {/* Left Column: Fulfillment, Contact, Schedule Notice, Payment */}
            <div className="checkout-main-col">
              {/* Card 1: Fulfillment Type */}
              <div className="checkout-card">
                <h2 className="checkout-card__title">
                  <span className="checkout-card__title-num">1</span>
                  <span>Fulfillment Method</span>
                </h2>

                <div className="fulfillment-tabs">
                  <div
                    className={`fulfillment-tab ${fulfillmentType === "PICKUP" ? "is-active" : ""}`}
                    onClick={() => setFulfillmentType("PICKUP")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setFulfillmentType("PICKUP");
                    }}
                  >
                    <div className="fulfillment-tab__header">
                      <span className="fulfillment-tab__name">Store Pickup</span>
                      {fulfillmentType === "PICKUP" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffb834" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="fulfillment-tab__desc">Pick up fresh at 7116 S Yates Blvd</span>
                  </div>

                  <div
                    className={`fulfillment-tab ${fulfillmentType === "DELIVERY" ? "is-active" : ""}`}
                    onClick={() => setFulfillmentType("DELIVERY")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setFulfillmentType("DELIVERY");
                    }}
                  >
                    <div className="fulfillment-tab__header">
                      <span className="fulfillment-tab__name">Local Delivery</span>
                      {fulfillmentType === "DELIVERY" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffb834" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="fulfillment-tab__desc">Within 3 miles ($3.99 fee)</span>
                  </div>
                </div>

                {fulfillmentType === "PICKUP" ? (
                  <div className="pickup-info-box">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffb834"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <strong style={{ color: "#fff" }}>Hoagy House South Side Chicago</strong>
                      <div>7116 S Yates Blvd, Chicago, IL 60649</div>
                      <div style={{ marginTop: "4px", color: "var(--color-gold, #ffb834)" }}>
                        Estimated ready time: 15–25 minutes
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="delivery-fields">
                    <div className="form-group" style={{ marginBottom: "12px" }}>
                      <label className="form-label" htmlFor="delivery-address">
                        Delivery Street Address (within 3 miles)
                      </label>
                      <input
                        id="delivery-address"
                        type="text"
                        required
                        className="form-input"
                        placeholder="Street Address & Apt / Suite / Unit"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                      />
                    </div>
                    <div className="form-row two-col">
                      <div className="form-group">
                        <label className="form-label" htmlFor="delivery-city">City</label>
                        <input
                          id="delivery-city"
                          type="text"
                          disabled
                          className="form-input form-input--disabled"
                          value="Chicago, IL"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="delivery-zip">ZIP Code</label>
                        <input
                          id="delivery-zip"
                          type="text"
                          required
                          className="form-input"
                          placeholder="60649"
                          value={deliveryZip}
                          onChange={(e) => setDeliveryZip(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Contact Information */}
              <div className="checkout-card">
                <h2 className="checkout-card__title">
                  <span className="checkout-card__title-num">2</span>
                  <span>Contact Information</span>
                </h2>

                <div className="form-row two-col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cust-name">Full Name</label>
                    <input
                      id="cust-name"
                      type="text"
                      required
                      className="form-input"
                      placeholder="Your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cust-phone">Phone Number</label>
                    <input
                      id="cust-phone"
                      type="tel"
                      required
                      className="form-input"
                      placeholder="(773) 891-2416"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cust-email">Email Address (for order receipt)</label>
                  <input
                    id="cust-email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="email@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Card 3: Store Operating Hours Notice */}
              <div className="checkout-card">
                <h2 className="checkout-card__title">
                  <span className="checkout-card__title-num">3</span>
                  <span>Store Hours &amp; Special Instructions</span>
                </h2>

                {/* Opening Hours Notice */}
                <div className="orders-policy-callout" style={{ marginBottom: "16px" }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffb834"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flexShrink: 0 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <div className="orders-policy-text">
                    <strong style={{ color: "var(--color-gold, #ffb834)" }}>
                      Restaurant Schedule Verification
                    </strong>
                    <div>
                      Orders are accepted during active restaurant operating hours. Live hours validation will synchronize with store schedule.
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="order-notes">
                    Special Cooking / Delivery Instructions
                  </label>
                  <textarea
                    id="order-notes"
                    rows={2}
                    className="form-textarea"
                    placeholder="E.g., Sauce on the side, extra napkins, gate code..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Card 4: Clover Payment Interface */}
              <div className="checkout-card">
                <h2 className="checkout-card__title">
                  <span className="checkout-card__title-num">4</span>
                  <span>Payment Method</span>
                </h2>

                <div className="payment-gateway-box">
                  <div className="payment-gateway-header">
                    <div>
                      <strong style={{ color: "#fff", fontSize: "0.95rem" }}>Clover Hosted iFrame</strong>
                      <div style={{ fontSize: "0.78rem", color: "#a8a29e" }}>
                        Encrypted tokenization powered by Clover SCL
                      </div>
                    </div>
                    <span className="payment-badge-sandbox">Secure Vault</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: "12px" }}>
                    <label className="form-label" htmlFor="card-name">Cardholder Name</label>
                    <input
                      id="card-name"
                      type="text"
                      className="form-input"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "12px" }}>
                    <label className="form-label" htmlFor="card-number">Card Number</label>
                    <div style={{ position: "relative" }}>
                      <input
                        id="card-number"
                        type="text"
                        className="form-input"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                      <div
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          display: "flex",
                          gap: "6px",
                          fontSize: "0.75rem",
                          color: "var(--color-gold, #ffb834)",
                          fontWeight: 700,
                        }}
                      >
                        VISA · MC · AMEX · DISC
                      </div>
                    </div>
                  </div>

                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="form-label" htmlFor="card-exp">Expires (MM/YY)</label>
                      <input
                        id="card-exp"
                        type="text"
                        className="form-input"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="card-cvv">Security Code (CVV)</label>
                      <input
                        id="card-cvv"
                        type="password"
                        className="form-input"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#a8a29e",
                      marginTop: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffb834"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: 0 }}
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>PCI SAQ A compliant. Card details tokenized in Clover's vault without touching our web server.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="checkout-summary-col">
              <div className="checkout-card order-summary-sidebar">
                <h3 className="checkout-card__title" style={{ marginBottom: "14px" }}>
                  <span>Order Summary</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-gold, #ffb834)", fontWeight: 600 }}>
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                </h3>

                {/* Items preview list */}
                <div className="order-items-preview-list">
                  {items.map((it) => (
                    <div key={it.id} className="order-preview-item">
                      <img src={`/${it.img}`} alt={it.name} className="order-preview-thumb" />
                      <div className="order-preview-info">
                        <div className="order-preview-name">
                          {it.quantity}x {it.name}
                        </div>
                        {it.selectedOptions && it.selectedOptions.length > 0 && (
                          <div className="order-preview-opts">
                            {it.selectedOptions.join(" · ")}
                          </div>
                        )}
                        <div style={{ fontSize: "0.78rem", color: "#78716c", marginTop: "2px" }}>
                          ${(it.numericPrice || 0).toFixed(2)} each
                        </div>
                      </div>
                      <div className="order-preview-price">
                        ${((it.numericPrice || 0) * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="summary-calc-row">
                  <span>Items Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-calc-row">
                  <span>Chicago Meal Tax (10.25%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="summary-calc-row">
                  <span>
                    {fulfillmentType === "DELIVERY"
                      ? "Local Delivery (3 miles)"
                      : "Store Pickup"}
                  </span>
                  <span>
                    {fulfillmentType === "DELIVERY" ? `$${deliveryFee.toFixed(2)}` : "FREE"}
                  </span>
                </div>

                <div className="summary-calc-row total-row">
                  <span>Total Amount</span>
                  <span className="gold-val">${grandTotal.toFixed(2)}</span>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  className="place-order-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <span aria-hidden="true">•</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#78716c",
                    textAlign: "center",
                    marginTop: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  By clicking Place Order, you confirm your contact and fulfillment details.
                  Phone cancellation policy applies for prepared items.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
