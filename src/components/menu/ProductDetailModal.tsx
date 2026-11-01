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

  // Bulletproof lock of background scroll & Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      setQuantity(1);
      setSelectedBread("French Hoagy Roll");
      setSelectedPeppers(["Sweet Peppers"]);
      setSelectedExtras([]);
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, item, onClose]);

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

  // Compute modifier pricing
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
      aria-labelledby="product-modal-title"
    >
      <div
        className="product-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile pull handle indicator */}
        <div className="product-modal-sheet-handle" aria-hidden="true" />

        {/* Header Media */}
        <div className="product-modal-header">
          <img src={`/${item.img}`} alt={item.name} className="product-modal-img" />
          <div className="product-modal-gradient" />
          <button
            type="button"
            className="product-modal-close-btn"
            onClick={onClose}
            aria-label="Close product modal"
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
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Modal Body with momentum & isolation */}
        <div className="product-modal-body">
          <div className="product-modal-meta">
            <div className="product-modal-info-col">
              <span className="product-modal-tag">{item.subCategory || item.category}</span>
              <h2 className="product-modal-title" id="product-modal-title">{item.name}</h2>
            </div>
            <div className="product-modal-price" aria-label={`Price $${unitTotal.toFixed(2)}`}>
              ${unitTotal.toFixed(2)}
            </div>
          </div>

          <p className="product-modal-desc">
            {item.details ||
              "Flame-seared and seasoned fresh to order on Chicago's South Side. Crafted with authentic grill flavors."}
          </p>

          {/* Customization Options (Sandwiches & Burgers) */}
          {(item.category === "sandwiches" || item.category === "burgers") && (
            <div className="product-options-section">
              {/* Option 1: Bread Selection */}
              <div className="product-options-group">
                <div className="product-options-title">
                  <span>Choice of Bread / Roll</span>
                  <span className="product-options-req">Required</span>
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
                      <span className="product-option-text">{bread}</span>
                      {bread === "Toasted Garlic Brioche" && <span className="product-option-addon">+$0.75</span>}
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
                      <span className="product-option-text">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Option 3: Extra Cheese & Meat */}
              <div className="product-options-group">
                <div className="product-options-title">
                  <span>Cheeses &amp; Extra Protein</span>
                  <span className="product-options-req">Optional</span>
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
                      <span className="product-option-text">{extra}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sides & Serving Style */}
          {item.category !== "sandwiches" && item.category !== "burgers" && (
            <div className="product-options-section">
              <div className="product-options-group">
                <div className="product-options-title">
                  <span>Preparation &amp; Serving Style</span>
                  <span className="product-options-req">Included</span>
                </div>
                <div className="product-options-grid">
                  <div className="product-option-pill is-selected">
                    <span className="product-option-text">Fresh Made to Order</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="product-option-pill is-selected">
                    <span className="product-option-text">Packed Hot &amp; Fresh</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer with Safe Area Protection */}
        <div className="product-modal-footer">
          <div className="modal-qty-stepper" role="group" aria-label="Quantity selector">
            <button
              type="button"
              className="modal-qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="modal-qty-val" aria-live="polite">{quantity}</span>
            <button
              type="button"
              className="modal-qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="modal-add-cart-btn"
            onClick={handleAdd}
            aria-label={`Add to Basket, total $${lineTotal.toFixed(2)}`}
          >
            <span className="modal-add-text">Add to Basket</span>
            <span className="modal-add-price">${lineTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
