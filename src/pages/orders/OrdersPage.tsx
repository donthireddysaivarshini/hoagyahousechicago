import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { PlacedOrderData } from "../checkout/CheckoutPage";
import "../../styles/customer-pages.css";

interface OrdersPageProps {
  currentOrder?: PlacedOrderData | null;
  onNavigateMenu: () => void;
  onNavigateHome: () => void;
}

interface HistoricalOrder {
  id: string;
  date: string;
  status: "fulfilled" | "kitchen" | "confirmed";
  statusLabel: string;
  fulfillmentType: "PICKUP" | "DELIVERY";
  destination: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    options?: string[];
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

const DEMO_HISTORICAL_ORDERS: HistoricalOrder[] = [
  {
    id: "HH-84210",
    date: "Oct 27, 2026 • 6:30 PM",
    status: "fulfilled",
    statusLabel: "Fulfilled & Picked Up",
    fulfillmentType: "PICKUP",
    destination: "Store Pickup: 7116 S Yates Blvd, Chicago, IL",
    items: [
      {
        name: "Hoagy Italian Beef",
        quantity: 2,
        price: 9.99,
        options: ["Bread: French Hoagy Roll", "Peppers: Hot Giardiniera", "Juicy / Dipped"],
      },
      {
        name: "Pizza Puff",
        quantity: 2,
        price: 4.49,
      },
      {
        name: "1.25 Liter Pop (RC Cola)",
        quantity: 1,
        price: 2.99,
      },
    ],
    subtotal: 31.95,
    tax: 3.27,
    deliveryFee: 0.0,
    total: 35.22,
  },
  {
    id: "HH-83955",
    date: "Oct 24, 2026 • 7:15 PM",
    status: "fulfilled",
    statusLabel: "Delivered",
    fulfillmentType: "DELIVERY",
    destination: "7116 S Yates Blvd, Apt 3B, Chicago, IL 60649 (1.4 mi)",
    items: [
      {
        name: "1/2 Lb Steak Burger",
        quantity: 1,
        price: 10.99,
        options: ["Bread: Toasted Brioche", "Extras: Melted Cheddar", "Grilled Onions"],
      },
      {
        name: "10 Pc Legs & Thighs w/ Fries",
        quantity: 1,
        price: 14.99,
        options: ["Sauce: Chicago Mild Sauce"],
      },
      {
        name: "Seasoned Fries (Large)",
        quantity: 1,
        price: 4.99,
      },
    ],
    subtotal: 30.97,
    tax: 3.17,
    deliveryFee: 3.99,
    total: 38.13,
  },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({
  currentOrder,
  onNavigateMenu,
  onNavigateHome,
}) => {
  const { addToCart, showToast, setIsCartOpen } = useCart();
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);

  // Combine live placed order from current session (if any) with demo historical records
  const allOrders: HistoricalOrder[] = [
    ...(currentOrder
      ? [
          {
            id: currentOrder.orderId,
            date: currentOrder.timestamp,
            status: "kitchen" as const,
            statusLabel: "Preparing on the Grill",
            fulfillmentType: currentOrder.fulfillmentType,
            destination:
              currentOrder.fulfillmentType === "PICKUP"
                ? "Store Pickup: 7116 S Yates Blvd, Chicago, IL 60649"
                : currentOrder.deliveryAddress,
            items: currentOrder.items.map((it: any) => ({
              name: it.name,
              quantity: it.quantity,
              price: it.numericPrice || (typeof it.price === "number" ? it.price : 9.99),
              options: it.selectedOptions,
            })),
            subtotal: currentOrder.subtotal,
            tax: currentOrder.tax,
            deliveryFee: currentOrder.deliveryFee,
            total: currentOrder.total,
          },
        ]
      : []),
    ...DEMO_HISTORICAL_ORDERS,
  ];

  const handleReorder = (order: HistoricalOrder) => {
    order.items.forEach((item) => {
      addToCart(
        {
          id: `reorder-${item.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: item.name,
          price: `$${item.price.toFixed(2)}`,
          numericPrice: item.price,
          img: "images/categories/signature-cheeseburger.webp",
          selectedOptions: item.options,
        },
        item.quantity
      );
    });

    setReorderSuccessId(order.id);
    showToast(`Items from order #${order.id} re-added to your cart!`);
    setTimeout(() => {
      setReorderSuccessId(null);
      setIsCartOpen(true);
    }, 800);
  };

  return (
    <div className="customer-page-container" id="ordersPage">
      <div className="customer-page-inner">
        {/* Page Header */}
        <div className="customer-page-header">
          <div className="customer-page-badge">Order History</div>
          <h1 className="customer-page-title">My Recent Orders</h1>
          <p className="customer-page-subtitle">
            Track your live grill orders, review previous meal receipts, or quickly reorder your favorite Chicago combos.
          </p>
        </div>

        {/* Preview Alert Banner */}
        <div className="preview-alert-banner">
          <span className="preview-alert-banner__icon">📋</span>
          <div>
            <strong>Demonstration Order History:</strong> These past orders represent sample customer activity for client demonstration.
            When connected to the production Clover POS &amp; Django customer account, your live store orders will sync automatically.
          </div>
        </div>

        {/* Cancellation Notice Banner */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "12px 18px",
            fontSize: "0.85rem",
            color: "#d6d3d1",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ color: "var(--color-gold, #ffb834)", fontSize: "1.1rem" }}>📞</span>
          <span>
            <strong>Need to modify or cancel?</strong> Per store policy, once food is placed on the grill, please call the store directly at{" "}
            <a href="tel:7735550192" style={{ color: "var(--color-gold, #ffb834)", textDecoration: "underline" }}>
              (773) 555-0192
            </a>{" "}
            with your order number.
          </span>
        </div>

        {/* Orders Listing */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {allOrders.map((order) => {
            const isLive = order.status === "kitchen" || order.status === "confirmed";
            return (
              <div
                key={order.id}
                className="order-history-card"
                style={{
                  border: isLive ? "1px solid rgba(243, 146, 0, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: isLive ? "0 4px 20px rgba(243, 146, 0, 0.15)" : "none",
                }}
              >
                {/* Header Row */}
                <div className="order-history-header">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display, Outfit, sans-serif)",
                          fontWeight: 800,
                          fontSize: "1.1rem",
                          color: "#fff",
                        }}
                      >
                        Order #{order.id}
                      </span>
                      <span
                        className={`order-status-pill ${
                          order.status === "fulfilled"
                            ? "fulfilled"
                            : order.status === "kitchen"
                            ? "kitchen"
                            : "confirmed"
                        }`}
                      >
                        {order.statusLabel}
                      </span>
                      {isLive && (
                        <span
                          style={{
                            background: "rgba(243, 146, 0, 0.2)",
                            color: "var(--color-gold, #ffb834)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                          }}
                        >
                          LIVE SESSION
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#a8a29e" }}>
                      {order.date} • {order.fulfillmentType === "PICKUP" ? "Pickup at Store" : "Local Delivery (3-Mile Radius)"}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#78716c", marginTop: "2px" }}>
                      📍 {order.destination}
                    </div>
                  </div>

                  {/* Total & Reorder Button */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-gold, #ffb834)" }}>
                      ${order.total.toFixed(2)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#a8a29e", marginTop: "2px" }}>
                      {order.items.reduce((s, it) => s + it.quantity, 0)} items total
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        fontSize: "0.9rem",
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: "16px" }}>
                        <div style={{ fontWeight: 600, color: "#f5f5f4" }}>
                          {item.quantity}x {item.name}
                        </div>
                        {item.options && item.options.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                              marginTop: "4px",
                            }}
                          >
                            {item.options.map((opt, oIdx) => (
                              <span
                                key={oIdx}
                                style={{
                                  fontSize: "0.74rem",
                                  background: "rgba(255, 255, 255, 0.05)",
                                  color: "#a8a29e",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                }}
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ fontWeight: 700, color: "#d6d3d1", whiteSpace: "nowrap" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown & Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginTop: "14px",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "#a8a29e", display: "flex", gap: "16px" }}>
                    <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                    <span>Tax (10.25%): ${order.tax.toFixed(2)}</span>
                    {order.deliveryFee > 0 && <span>Delivery: ${order.deliveryFee.toFixed(2)}</span>}
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      style={{
                        background: "linear-gradient(90deg, var(--color-orange, #f39200) 0%, var(--color-flame, #e94e1b) 100%)",
                        border: "none",
                        color: "#0b0704",
                        padding: "9px 20px",
                        borderRadius: "999px",
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        boxShadow: "0 4px 14px rgba(243, 146, 0, 0.35)",
                      }}
                    >
                      {reorderSuccessId === order.id ? "✓ Added to Cart!" : "🔄 Reorder Items"}
                    </button>

                    <button
                      type="button"
                      onClick={onNavigateMenu}
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(243, 146, 0, 0.35)",
                        color: "#f5ede4",
                        padding: "9px 18px",
                        borderRadius: "999px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.22s ease",
                      }}
                    >
                      Browse Menu
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Link */}
        <div style={{ textAlign: "center", marginTop: "36px" }}>
          <button
            type="button"
            onClick={onNavigateHome}
            style={{
              background: "transparent",
              border: "none",
              color: "#a8a29e",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            ← Back to Storefront Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
