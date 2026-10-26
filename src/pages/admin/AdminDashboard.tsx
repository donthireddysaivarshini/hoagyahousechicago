import React from "react";

export interface AdminDashboardProps {
  onBackToClient?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToClient }) => {
  return (
    <div className="admin-portal-container" style={{ minHeight: "100vh", padding: "40px 24px", color: "#fff", background: "#0c0a09" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffb834", margin: 0 }}>HOAGY HOUSE · ADMIN CONSOLE</h1>
          <p style={{ margin: "4px 0 0", color: "#a8a29e", fontSize: "0.9rem" }}>Store Management, Kitchen Displays & Menu Orchestration</p>
        </div>
        {onBackToClient && (
          <button
            onClick={onBackToClient}
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ← Back to Storefront
          </button>
        )}
      </header>

      <main style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div style={{ background: "#1c1917", padding: "24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ margin: "0 0 8px", color: "#f5f5f4" }}>Live Orders</h3>
          <p style={{ margin: 0, color: "#78716c", fontSize: "0.85rem" }}>Kitchen display and pending takeout tickets</p>
        </div>
        <div style={{ background: "#1c1917", padding: "24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ margin: "0 0 8px", color: "#f5f5f4" }}>Menu Inventory</h3>
          <p style={{ margin: 0, color: "#78716c", fontSize: "0.85rem" }}>Pricing, 86-list, and stock availability</p>
        </div>
        <div style={{ background: "#1c1917", padding: "24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ margin: "0 0 8px", color: "#f5f5f4" }}>Role & Permissions</h3>
          <p style={{ margin: 0, color: "#78716c", fontSize: "0.85rem" }}>Admin, manager, cashier, and kitchen staff access</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
