import React from "react";
import { PlacedOrderData } from "./CheckoutPage";
import "../../styles/customer-pages.css";

interface OrderConfirmationPageProps {
  order: PlacedOrderData | null;
  onNavigateMenu: () => void;
  onNavigateOrders: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigateMenu,
  onNavigateOrders,
}) => {
  // Fallback demo data if navigated directly
  const orderData = order || {
    orderId: "HH-94820",
    timestamp: "Oct 30, 2026, 8:45 PM",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    customerPhone: "(773) 555-0192",
    fulfillmentType: "PICKUP" as const,
    deliveryAddress: "Store Pickup: 7116 S Yates Blvd, Chicago, IL 60649",
    orderNotes: "Extra sweet peppers on the side please",
    subtotal: 21.98,
    tax: 2.25,
    deliveryFee: 0.0,
    total: 24.23,
    items: [
      {
        id: "hoagy-italian-beef-regular-12-inch",
        name: "Hoagy Italian Beef",
        price: "$9.99",
        numericPrice: 9.99,
        quantity: 1,
        img: "images/italian-beef-sandwich.webp",
        selectedOptions: ["Bread: French Hoagy Roll", "Peppers: Sweet Peppers"],
      },
      {
        id: "classic-cheeseburger",
        name: "1/2 Lb Steak Burger",
        price: "$10.99",
        numericPrice: 10.99,
        quantity: 1,
        img: "images/categories/signature-cheeseburger.webp",
        selectedOptions: ["Bread: Toasted Brioche", "Extras: Melted Cheddar"],
      },
    ],
  };

  return (
    <div className="customer-page-container" id="orderConfirmationPage">
      <div className="customer-page-inner">
        <div className="confirmation-card">
          {/* Top Hero Checkmark */}
          <div className="confirmation-hero">
            <div className="confirmation-badge-icon">✓</div>
            <span className="confirmation-order-num">Order #{orderData.orderId}</span>
            <h1 className="customer-page-title" style={{ marginTop: "8px" }}>
              Order Received! (Preview)
            </h1>
            <p className="customer-page-subtitle" style={{ margin: "6px auto 0" }}>
              Thank you, <strong style={{ color: "#fff" }}>{orderData.customerName}</strong>. Your demonstration order
              ticket has been generated.
            </p>
          </div>

          {/* Prominent Preview Disclaimer Box (Mandatory Requirement) */}
          <div className="preview-alert-banner" style={{ background: "rgba(243, 146, 0, 0.12)" }}>
            <span className="preview-alert-banner__icon">ℹ️</span>
            <div>
              <strong>Demonstration Preview Mode Notice:</strong> This is a client testing preview. No actual credit card
              transaction was processed, and no food order was transmitted to the physical restaurant kitchen or kitchen
              printers. This screen demonstrates the verified post-checkout confirmation interface for client review.
            </div>
          </div>

          {/* Order Metadata Details */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              padding: "18px",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "0.88rem" }}>
              <div>
                <span style={{ color: "#a8a29e", display: "block", fontSize: "0.76rem", textTransform: "uppercase" }}>
                  Order Timestamp
                </span>
                <span style={{ fontWeight: 600, color: "#fff" }}>{orderData.timestamp}</span>
              </div>

              <div>
                <span style={{ color: "#a8a29e", display: "block", fontSize: "0.76rem", textTransform: "uppercase" }}>
                  Fulfillment Status
                </span>
                <span style={{ fontWeight: 700, color: "var(--color-gold, #ffb834)" }}>
                  {orderData.fulfillmentType === "DELIVERY" ? "Local Delivery (3 mi)" : "Store Pickup Ready ~20m"}
                </span>
              </div>

              <div>
                <span style={{ color: "#a8a29e", display: "block", fontSize: "0.76rem", textTransform: "uppercase" }}>
                  Contact Details
                </span>
                <span style={{ color: "#fff" }}>{orderData.customerPhone}</span>
                <span style={{ color: "#78716c", display: "block", fontSize: "0.8rem" }}>{orderData.customerEmail}</span>
              </div>

              <div>
                <span style={{ color: "#a8a29e", display: "block", fontSize: "0.76rem", textTransform: "uppercase" }}>
                  Destination / Pickup
                </span>
                <span style={{ color: "#fff", fontSize: "0.82rem", lineHeight: "1.3" }}>
                  {orderData.deliveryAddress}
                </span>
              </div>
            </div>

            {orderData.orderNotes && (
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#a8a29e", fontSize: "0.76rem", textTransform: "uppercase", display: "block" }}>
                  Special Instructions
                </span>
                <span style={{ color: "#d6d3d1", fontSize: "0.85rem", fontStyle: "italic" }}>
                  "{orderData.orderNotes}"
                </span>
              </div>
            )}
          </div>

          {/* Items Breakdown */}
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
            Items in this Order
          </h3>
          <div style={{ marginBottom: "20px" }}>
            {orderData.items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={`/${it.img}`}
                    alt={it.name}
                    style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.92rem" }}>
                      {it.quantity}x {it.name}
                    </div>
                    {it.selectedOptions && it.selectedOptions.length > 0 && (
                      <div style={{ fontSize: "0.75rem", color: "var(--color-gold, #ffb834)" }}>
                        {it.selectedOptions.join(" · ")}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "#f5f5f4" }}>
                  ${((it.numericPrice || 0) * it.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "14px", marginBottom: "28px" }}>
            <div className="summary-calc-row">
              <span>Subtotal</span>
              <span>${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-calc-row">
              <span>Chicago Meal Tax (10.25%)</span>
              <span>${orderData.tax.toFixed(2)}</span>
            </div>
            {orderData.deliveryFee > 0 && (
              <div className="summary-calc-row">
                <span>Local Delivery Fee (3 miles)</span>
                <span>${orderData.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-calc-row total-row">
              <span>Total Paid (Preview)</span>
              <span className="gold-val">${orderData.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "24px" }}>
            <button
              type="button"
              className="modal-add-cart-btn"
              style={{ flex: 1, minWidth: "180px", height: "48px" }}
              onClick={onNavigateOrders}
            >
              <span>View in My Orders</span>
            </button>
            <button
              type="button"
              onClick={onNavigateMenu}
              style={{
                flex: 1,
                minWidth: "180px",
                height: "48px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(243, 146, 0, 0.35)",
                color: "#f5ede4",
                borderRadius: "999px",
                padding: "12px 24px",
                fontWeight: 700,
                fontSize: "0.92rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.22s ease",
              }}
            >
              Order More Food
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

