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
        options: ["French Hoagy Roll", "Hot Giardiniera", "Juicy / Dipped"],
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
    destination: "7116 S Yates Blvd, Apt 3B, Chicago, IL 60649",
    items: [
      {
        name: "1/2 Lb Steak Burger",
        quantity: 1,
        price: 10.99,
        options: ["Toasted Brioche", "Melted Cheddar", "Grilled Onions"],
      },
      {
        name: "10 Pc Legs & Thighs w/ Fries",
        quantity: 1,
        price: 14.99,
        options: ["Chicago Mild Sauce"],
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

  // Combine live placed order from current session (if any) with recent records
  const allOrders: HistoricalOrder[] = [
    ...(currentOrder
      ? [
          {
            id: currentOrder.orderId,
            date: currentOrder.timestamp,
            status: "kitchen" as const,
            statusLabel: "Preparing on Grill",
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
    }, 700);
  };

  return (
    <div className="customer-page-container" id="ordersPage">
      <div className="customer-page-inner">
        {/* Page Header */}
        <div className="customer-page-header">
          <div className="customer-page-badge">Order History</div>
          <h1 className="customer-page-title">My Recent Orders</h1>
          <p className="customer-page-subtitle">
            Track your live grill orders, review meal receipts, or quickly reorder your favorite Chicago combos.
          </p>
        </div>

        {/* Store Policy Callout with SVG Icon */}
        <div className="orders-policy-callout">
          <svg
            className="orders-policy-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <div className="orders-policy-text">
            <strong>Need to modify or cancel?</strong> Once food is on the grill, please call the store directly at{" "}
            <a href="tel:7738912416" className="orders-policy-link">
              (773) 891-2416
            </a>{" "}
            with your order number.
          </div>
        </div>

        {/* Empty State */}
        {allOrders.length === 0 ? (
          <div className="orders-empty-state">
            <svg
              className="orders-empty-icon"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffb834"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h2 className="orders-empty-title">No orders placed yet</h2>
            <p className="orders-empty-desc">
              Your recent meal receipts will appear here once you place an order.
            </p>
            <button
              type="button"
              className="orders-action-btn orders-action-btn--primary"
              onClick={onNavigateMenu}
            >
              Explore Our Menu
            </button>
          </div>
        ) : (
          /* Structured, Scannable Orders List (Mobile-First 6-Row Layout) */
          <div className="orders-list-stack">
            {allOrders.map((order) => {
              const isLive = order.status === "kitchen" || order.status === "confirmed";
              return (
                <article
                  key={order.id}
                  className={`order-card-scannable ${isLive ? "order-card-scannable--live" : ""}`}
                >
                  {/* Row 1: Order Number & Total Amount */}
                  <div className="order-row-top">
                    <span className="order-num-tag">Order #{order.id}</span>
                    <span className="order-total-highlight">${order.total.toFixed(2)}</span>
                  </div>

                  {/* Row 2: Status Badge & Date */}
                  <div className="order-row-status">
                    <div className="order-status-badge-wrap">
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
                      {isLive && <span className="order-live-pulse-badge">LIVE TICKET</span>}
                    </div>
                    <span className="order-date-text">{order.date}</span>
                  </div>

                  {/* Row 3: Fulfillment & Location */}
                  <div className="order-row-fulfillment">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffb834"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="order-destination-text">{order.destination}</span>
                  </div>

                  {/* Row 4: Items List */}
                  <div className="order-row-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-line">
                        <div className="order-item-left">
                          <span className="order-item-qty">{item.quantity}×</span>
                          <span className="order-item-title">{item.name}</span>
                          {item.options && item.options.length > 0 && (
                            <span className="order-item-opts">
                              ({item.options.join(" · ")})
                            </span>
                          )}
                        </div>
                        <span className="order-item-cost">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Row 5: Compact Totals Summary */}
                  <div className="order-row-summary">
                    <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                    <span className="order-summary-dot" aria-hidden="true">•</span>
                    <span>Tax (10.25%): ${order.tax.toFixed(2)}</span>
                    {order.deliveryFee > 0 && (
                      <>
                        <span className="order-summary-dot" aria-hidden="true">•</span>
                        <span>Delivery: ${order.deliveryFee.toFixed(2)}</span>
                      </>
                    )}
                  </div>

                  {/* Row 6: Action Buttons */}
                  <div className="order-row-actions">
                    <button
                      type="button"
                      className="orders-action-btn orders-action-btn--primary"
                      onClick={() => handleReorder(order)}
                    >
                      {reorderSuccessId === order.id ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                          </svg>
                          <span>Reorder Combo</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="orders-action-btn orders-action-btn--secondary"
                      onClick={onNavigateMenu}
                    >
                      Browse Menu
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Back Link */}
        <div className="customer-page-footer-nav">
          <button
            type="button"
            className="customer-page-back-link"
            onClick={onNavigateHome}
          >
            ← Back to Storefront Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
