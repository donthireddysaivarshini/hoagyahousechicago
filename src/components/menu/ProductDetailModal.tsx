import React, { useEffect, useState } from "react";
import "../../styles/customer-pages.css";

export interface MenuItemData {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  details?: string;
  price: string;
  numericPrice: number;
  img: string;
}

interface ProductDetailModalProps {
  item: MenuItemData | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItemData, quantity: number, selectedOptions: string[]) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedBread, setSelectedBread] = useState("French Hoagy Roll");
  const [selectedPeppers, setSelectedPeppers] = useState<string[]>(["Sweet Peppers"]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedBread("French Hoagy Roll");
      setSelectedPeppers(["Sweet Peppers"]);
      setSelectedExtras([]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const togglePepper = (option: string) => {
    setSelectedPeppers((prev) =>
      prev.includes(option) ? prev.filter((p) => p !== option) : [...prev, option]
    );
  };

  const toggleExtra = (extra: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]
    );
  };

  // Compute demo extra cost
  let extraCost = 0;
  if (selectedBread === "Toasted Garlic Brioche") extraCost += 0.75;
  if (selectedExtras.includes("Provolone Cheese (+$1.00)")) extraCost += 1.0;
  if (selectedExtras.includes("Melted Cheddar (+$1.00)")) extraCost += 1.0;
  if (selectedExtras.includes("Extra Angus Patty (+$3.50)")) extraCost += 3.5;
  if (selectedExtras.includes("Extra Philly Meat (+$3.50)")) extraCost += 3.5;

  const unitTotal = (item.numericPrice || 0) + extraCost;
  const lineTotal = unitTotal * quantity;

  const handleAdd = () => {
    const options: string[] = [];
    if (item.category === "sandwiches" || item.category === "burgers") {
      options.push(`Bread: ${selectedBread}`);
      if (selectedPeppers.length > 0) options.push(`Peppers: ${selectedPeppers.join(", ")}`);
      if (selectedExtras.length > 0) options.push(`Extras: ${selectedExtras.join(", ")}`);
    } else if (item.category === "chicken" || item.category === "fish") {
      options.push("Sauce: House Mild BBQ");
      options.push("Side: Golden Shoestring Fries");
    }

    onAddToCart(item, quantity, options);
    onClose();
  };

  return (
    <div
      className={`product-modal-backdrop ${isOpen ? "is-open" : ""}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Media */}
        <div className="product-modal-header">
          <img src={`/${item.img}`} alt={item.name} className="product-modal-img" />
          <div className="product-modal-gradient" />
          <button
            type="button"
            className="product-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="product-modal-body">
          <div className="product-modal-meta">
            <div>
              <span className="product-modal-tag">{item.subCategory || item.category}</span>
              <h2 className="product-modal-title">{item.name}</h2>
            </div>
            <div className="product-modal-price">${unitTotal.toFixed(2)}</div>
          </div>

          <p className="product-modal-desc">
            {item.details ||
              "Flame-seared and seasoned fresh to order on Chicago's South Side. Crafted with authentic grill flavors."}
          </p>

          {/* Client Preview Notice */}
          <div className="preview-alert-banner">
            <span className="preview-alert-banner__icon">ℹ️</span>
            <div>
              <strong>Client Preview Mode:</strong> The options below are demonstration modifiers.
              When live, these synchronize directly with your Clover POS Modifier Groups (e.g. Dual-Pricing, Meal MOD).
            </div>
          </div>

          {/* Customization Options (Sandwiches & Burgers) */}
          {(item.category === "sandwiches" || item.category === "burgers") && (
            <div className="product-options-section">
              {/* Option 1: Bread Selection */}
              <div className="product-options-group">
                <div className="product-options-title">
                  <span>Choice of Bread / Roll</span>
                  <span className="product-options-req">Required (Choose 1)</span>
                </div>
                <div className="product-options-grid">
                  {["French Hoagy Roll", "Warm Pita", "Toasted Garlic Brioche"].map((bread) => (
                    <label
                      key={bread}
                      className={`product-option-pill ${selectedBread === bread ? "is-selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="bread"
                        checked={selectedBread === bread}
                        onChange={() => setSelectedBread(bread)}
                      />
                      <span>{bread}</span>
                      {bread === "Toasted Garlic Brioche" && <span>+$0.75</span>}
                    </label>
                  ))}
                </div>
              </div>

              {/* Option 2: Pepper Selection */}
              <div className="product-options-group">
                <div className="product-options-title">
                  <span>Peppers &amp; Heat</span>
                  <span className="product-options-req">Optional</span>
                </div>
                <div className="product-options-grid">
                  {["Sweet Peppers", "Hot Giardiniera", "Jalapeño Slices", "No Peppers"].map((opt) => (
                    <label
                      key={opt}
                      className={`product-option-pill ${selectedPeppers.includes(opt) ? "is-selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPeppers.includes(opt)}
                        onChange={() => togglePepper(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Option 3: Extra Cheese & Meat */}
              <div className="product-options-group">
                <div className="product-options-title">
                  <span>Cheeses &amp; Extra Protein</span>
                  <span className="product-options-req">Optional Add-ons</span>
                </div>
                <div className="product-options-grid">
                  {[
                    "Provolone Cheese (+$1.00)",
                    "Melted Cheddar (+$1.00)",
                    "Caramelized Onions",
                    item.category === "burgers"
                      ? "Extra Angus Patty (+$3.50)"
                      : "Extra Philly Meat (+$3.50)",
                  ].map((extra) => (
                    <label
                      key={extra}
                      className={`product-option-pill ${selectedExtras.includes(extra) ? "is-selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra)}
                        onChange={() => toggleExtra(extra)}
                      />
                      <span>{extra}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sides & Drinks notice */}
          {item.category !== "sandwiches" && item.category !== "burgers" && (
            <div className="product-options-section">
              <div className="product-options-group">
                <div className="product-options-title">
                  <span>Preparation &amp; Serving Style</span>
                  <span className="product-options-req">Included</span>
                </div>
                <div className="product-options-grid">
                  <div className="product-option-pill is-selected">
                    <span>Fresh Made to Order</span>
                    <span>✓</span>
                  </div>
                  <div className="product-option-pill is-selected">
                    <span>Packed Hot &amp; Fresh</span>
                    <span>✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="product-modal-footer">
          <div className="modal-qty-stepper">
            <button
              type="button"
              className="modal-qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="modal-qty-val">{quantity}</span>
            <button
              type="button"
              className="modal-qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button type="button" className="modal-add-cart-btn" onClick={handleAdd}>
            <span>Add to Basket</span>
            <span>•</span>
            <span>${lineTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

