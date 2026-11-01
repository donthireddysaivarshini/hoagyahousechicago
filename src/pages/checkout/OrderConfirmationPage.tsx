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
  // Fallback data if navigated directly
  const orderData = order || {
    orderId: "HH-94820",
    timestamp: "Oct 30, 2026, 8:45 PM",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    customerPhone: "(773) 891-2416",
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
            <div className="confirmation-badge-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffb834" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="confirmation-order-num">Order #{orderData.orderId}</span>
            <h1 className="customer-page-title" style={{ marginTop: "8px" }}>
              Order Received!
            </h1>
            <p className="customer-page-subtitle" style={{ margin: "6px auto 0" }}>
              Thank you, <strong style={{ color: "#fff" }}>{orderData.customerName}</strong>. Your ticket has been submitted to the grill.
            </p>
          </div>

          {/* Order Metadata Details */}
          <div className="confirmation-meta-box">
            <div className="confirmation-meta-grid">
              <div>
                <span className="confirmation-meta-label">Order Timestamp</span>
                <span className="confirmation-meta-value">{orderData.timestamp}</span>
              </div>

              <div>
                <span className="confirmation-meta-label">Fulfillment Status</span>
                <span className="confirmation-meta-value confirmation-meta-value--gold">
                  {orderData.fulfillmentType === "DELIVERY" ? "Local Delivery (3 mi)" : "Store Pickup Ready ~20m"}
                </span>
              </div>

              <div>
                <span className="confirmation-meta-label">Contact Details</span>
                <span className="confirmation-meta-value">{orderData.customerPhone}</span>
                <span className="confirmation-meta-sub">{orderData.customerEmail}</span>
              </div>

              <div>
                <span className="confirmation-meta-label">Destination / Pickup</span>
                <span className="confirmation-meta-value" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                  {orderData.deliveryAddress}
                </span>
              </div>
            </div>

            {orderData.orderNotes && (
              <div className="confirmation-notes-box">
                <span className="confirmation-notes-label">Special Cooking Instructions:</span>
                <span className="confirmation-notes-text">"{orderData.orderNotes}"</span>
              </div>
            )}
          </div>

          {/* Ordered Items Preview */}
          <div className="confirmation-items-box">
            <h3 className="confirmation-items-title">Ordered Items</h3>
            <div className="confirmation-items-list">
              {orderData.items.map((item: any, idx: number) => (
                <div key={idx} className="confirmation-item-row">
                  <div>
                    <div style={{ fontWeight: 700, color: "#fff8ee" }}>
                      {item.quantity}× {item.name}
                    </div>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="order-item-modifiers" style={{ marginTop: "4px" }}>
                        {item.selectedOptions.map((opt: string, oIdx: number) => (
                          <span key={oIdx} className="order-modifier-pill">
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--color-gold, #ffb834)" }}>
                    ${((item.numericPrice || 9.99) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="confirmation-totals-box">
              <div className="summary-calc-row">
                <span>Items Subtotal</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-calc-row">
                <span>Chicago Meal Tax (10.25%)</span>
                <span>${orderData.tax.toFixed(2)}</span>
              </div>
              {orderData.deliveryFee > 0 && (
                <div className="summary-calc-row">
                  <span>Local Delivery Fee</span>
                  <span>${orderData.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-calc-row total-row">
                <span>Grand Total</span>
                <span className="gold-val">${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="confirmation-next-steps">
            <h4 className="confirmation-next-title">What happens next?</h4>
            <ul className="confirmation-steps-list">
              <li>Our South Side kitchen is seasoning and grilling your order fresh.</li>
              <li>You will receive an automated text receipt and status notification at {orderData.customerPhone}.</li>
              <li>
                {orderData.fulfillmentType === "DELIVERY"
                  ? "Our driver will contact you upon arriving within your 3-mile delivery zone."
                  : "Head to 7116 S Yates Blvd counter for quick pickup in ~15-25 minutes."}
              </li>
            </ul>
          </div>

          {/* Action Navigation */}
          <div className="confirmation-actions-row">
            <button
              type="button"
              className="orders-action-btn orders-action-btn--primary"
              onClick={onNavigateOrders}
            >
              View in My Orders
            </button>
            <button
              type="button"
              className="orders-action-btn orders-action-btn--secondary"
              onClick={onNavigateMenu}
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
