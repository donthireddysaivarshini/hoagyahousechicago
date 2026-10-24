import React, { useEffect, useMemo, useState } from "react";
import categories from "../data/categories.json";
import allItems from "../data/items.json";
import { useCart } from "../context/CartContext";
import "../styles/main-menu.css";

interface MainMenuPageProps {
  onBackToHome: () => void;
  initialCategory?: string;
}

export const MainMenuPage: React.FC<MainMenuPageProps> = ({
  onBackToHome: _onBackToHome,
  initialCategory = "all",
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const { addToCart, items: cartItems, updateQuantity } = useCart();

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return allItems;
    }
    return allItems.filter((it) => it.category === activeCategory);
  }, [allItems, activeCategory]);

  // Find active category label
  const currentCatObj = categories.find((c) => c.id === activeCategory);
  const activeTitle = currentCatObj ? currentCatObj.name : "All Products";

  // Quick lookup for cart quantities
  const cartQtyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of cartItems) {
      map.set(it.id, it.quantity);
    }
    return map;
  }, [cartItems]);

  const handleAdd = (it: (typeof allItems)[0]) => {
    addToCart({
      id: it.id,
      name: it.name,
      price: it.price,
      numericPrice: it.numericPrice,
      details: it.details,
      img: it.img,
      category: it.category,
    });
  };

  return (
    <div className="main-menu-page" id="mainMenuPage">
      {/* Main Two-Column Layout */}
      <div className="menu-layout-container">
        {/* Left Column: Categories Sidebar */}
        <aside className="menu-sidebar">
          <div className="menu-sidebar__sticky">
            <h3 className="menu-sidebar__heading">Categories</h3>
            <ul className="menu-category-list">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      className={`menu-category-btn ${isActive ? "is-active" : ""}`}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {/* Active green/gold indicator bar on the left edge */}
                      <span className="menu-category-btn__indicator" />

                      {/* Category Icon / Thumbnail */}
                      <div className="menu-category-btn__icon-wrap">
                        {cat.id === "all" ? (
                          <span className="menu-category-btn__all-badge">ALL</span>
                        ) : (
                          <img
                            src={`/${cat.icon}`}
                            alt={cat.name}
                            className="menu-category-btn__thumb"
                            loading="lazy"
                          />
                        )}
                      </div>

                      {/* Label & Count */}
                      <div className="menu-category-btn__text">
                        <span className="menu-category-btn__name">{cat.name}</span>
                        <span className="menu-category-btn__count">
                          {cat.count} items
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Right Column: Products Display */}
        <main className="menu-content">
          {/* Section Header */}
          <div className="menu-content__header">
            <div>
              <h1 className="menu-content__title">{activeTitle}</h1>
            </div>
            <span className="menu-content__counter">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Product Grid / Row-wise Items (Matching reference) */}
          {filteredItems.length === 0 ? (
            <div className="menu-empty-state">
              <p className="menu-empty-state__title">No items found</p>
              <p className="menu-empty-state__sub">
                No items available in this category.
              </p>
              <button
                type="button"
                className="menu-empty-state__reset"
                onClick={() => setActiveCategory("all")}
              >
                View All Items
              </button>
            </div>
          ) : (
            <div className="menu-products-grid">
              {filteredItems.map((it) => {
                const inCartQty = cartQtyMap.get(it.id) || 0;
                return (
                  <article key={it.id} className="menu-card">
                    {/* Image Area with Circular '+' Button in Top-Right */}
                    <div className="menu-card__media">
                      <img
                        src={`/${it.img}`}
                        alt={it.name}
                        className="menu-card__img"
                        loading="lazy"
                      />
                      {/* Circular '+' Button (Reference Images 2 & 3) */}
                      <button
                        type="button"
                        className={`menu-card__add-circle ${inCartQty > 0 ? "is-in-cart" : ""}`}
                        onClick={() => handleAdd(it)}
                        aria-label={`Add ${it.name} to cart`}
                        title={`Add ${it.name} to cart`}
                      >
                        {inCartQty > 0 ? (
                          <span className="menu-card__add-qty">{inCartQty}</span>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        )}
                      </button>

                      {/* Category micro-tag */}
                      <span className="menu-card__subcat">{it.subCategory}</span>
                    </div>

                    {/* Card Content */}
                    <div className="menu-card__info">
                      <h3 className="menu-card__name">{it.name}</h3>
                      {it.details && (
                        <p className="menu-card__details">{it.details}</p>
                      )}

                      {/* Compact Footer Row: Price on Left, Text Button / Stepper on Right */}
                      <div className="menu-card__footer">
                        <span className="menu-card__price">{it.price}</span>

                        {inCartQty > 0 ? (
                          <div className="menu-card__stepper">
                            <button
                              type="button"
                              className="menu-card__stepper-btn"
                              onClick={() => updateQuantity(it.id, inCartQty - 1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="menu-card__stepper-val">
                              {inCartQty}
                            </span>
                            <button
                              type="button"
                              className="menu-card__stepper-btn"
                              onClick={() => updateQuantity(it.id, inCartQty + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="menu-card__text-btn"
                            onClick={() => handleAdd(it)}
                            aria-label={`Add ${it.name} to cart`}
                          >
                            <span className="menu-card__text-btn-label">Add to Cart</span>
                            <span className="menu-card__text-btn-short">Add</span>
                            <span className="menu-card__text-btn-plus">+</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainMenuPage;
