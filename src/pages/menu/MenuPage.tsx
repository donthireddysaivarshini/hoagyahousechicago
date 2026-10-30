import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import categories from "../../data/categories.json";
import allItems from "../../data/items.json";
import { useCart } from "../../context/CartContext";
import ProductDetailModal, { MenuItemData } from "../../components/menu/ProductDetailModal";
import "../../styles/main-menu.css";

interface MainMenuPageProps {
  onBackToHome: () => void;
  initialCategory?: string;
}

export const MainMenuPage: React.FC<MainMenuPageProps> = ({
  onBackToHome: _onBackToHome,
  initialCategory = "all",
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const contentTopRef = useRef<HTMLDivElement>(null);
  const { addToCart, items: cartItems, updateQuantity } = useCart();
  const lenis = useLenis();

  // State for Product Detail Modal
  const [modalItem, setModalItem] = useState<MenuItemData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (it: (typeof allItems)[0]) => {
    setModalItem(it);
    setIsModalOpen(true);
  };

  const handleModalAddToCart = (it: MenuItemData, qty: number, options: string[]) => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: it.id,
        name: it.name,
        price: it.price,
        numericPrice: it.numericPrice,
        details: it.details,
        img: it.img,
        category: it.category,
        selectedOptions: options,
      });
    }
  };

  // Scroll smoothly to top of menu catalog
  const scrollMenuToTop = (smooth = true) => {
    if (lenis) {
      lenis.scrollTo("#mainMenuPage", { offset: -70, immediate: !smooth, duration: 0.75 });
    } else if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    }
  };

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Reset to page 1 whenever category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return allItems;
    }
    return allItems.filter((it) => it.category === activeCategory);
  }, [activeCategory]);

  // Dynamic pagination calculations
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === safeCurrentPage) return;
    setCurrentPage(newPage);
    scrollMenuToTop(true);
  };

  // Generate intelligent pagination range with ellipsis
  const paginationRange = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    if (safeCurrentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (safeCurrentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("ellipsis");
      pages.push(safeCurrentPage - 1);
      pages.push(safeCurrentPage);
      pages.push(safeCurrentPage + 1);
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  }, [safeCurrentPage, totalPages]);

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
                        scrollMenuToTop(true);
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
        <main className="menu-content" ref={contentTopRef}>
          {/* Section Header */}
          <div className="menu-content__header">
            <div>
              <h1 className="menu-content__title">{activeTitle}</h1>
            </div>
            <span className="menu-content__counter">
              {totalItems > 0 && totalPages > 1
                ? `Showing ${startIndex + 1}–${endIndex} of ${totalItems} items`
                : `${totalItems} ${totalItems === 1 ? "item" : "items"}`}
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
              {paginatedItems.map((it) => {
                const inCartQty = cartQtyMap.get(it.id) || 0;
                return (
                  <article key={it.id} className="menu-card">
                    {/* Image Area with Circular '+' Button in Top-Right */}
                    <div
                      className="menu-card__media"
                      onClick={() => handleOpenDetail(it)}
                      style={{ cursor: "pointer" }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${it.name}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleOpenDetail(it);
                      }}
                    >
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(it);
                        }}
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
                    <div
                      className="menu-card__info"
                      onClick={() => handleOpenDetail(it)}
                      style={{ cursor: "pointer" }}
                    >
                      <h3 className="menu-card__name">{it.name}</h3>
                      {it.details && (
                        <p className="menu-card__details">{it.details}</p>
                      )}

                      {/* Compact Footer Row: Price on Left, Text Button / Stepper on Right */}
                      <div className="menu-card__footer" onClick={(e) => e.stopPropagation()}>
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

          {/* Dynamic Pagination Controls */}
          {totalPages > 1 && (
            <nav className="menu-pagination" aria-label="Products pagination">
              <div className="menu-pagination__summary">
                Showing <strong>{startIndex + 1}–{endIndex}</strong> of <strong>{totalItems}</strong> items
              </div>

              <div className="menu-pagination__controls">
                {/* Previous button */}
                <button
                  type="button"
                  className="menu-pagination__btn menu-pagination__btn--nav"
                  disabled={safeCurrentPage === 1}
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  aria-label="Previous page"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span>Prev</span>
                </button>

                {/* Numbered buttons with ellipsis */}
                <div className="menu-pagination__pages">
                  {paginationRange.map((p, idx) => {
                    if (p === "ellipsis") {
                      return (
                        <span key={`ellipsis-${idx}`} className="menu-pagination__ellipsis" aria-hidden="true">
                          &hellip;
                        </span>
                      );
                    }
                    const isActive = p === safeCurrentPage;
                    return (
                      <button
                        key={p}
                        type="button"
                        className={`menu-pagination__btn menu-pagination__btn--num ${isActive ? "is-active" : ""}`}
                        onClick={() => handlePageChange(p)}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={`Page ${p}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                <button
                  type="button"
                  className="menu-pagination__btn menu-pagination__btn--nav"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Items per page selector */}
              <div className="menu-pagination__per-page">
                <span className="menu-pagination__per-page-label">Per page:</span>
                <div className="menu-pagination__per-page-pills">
                  {[12, 24, 48].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`menu-pagination__size-pill ${itemsPerPage === size ? "is-active" : ""}`}
                      onClick={() => {
                        setItemsPerPage(size);
                        setCurrentPage(1);
                        scrollMenuToTop(true);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          )}
        </main>
      </div>

      {/* Product Customization & Detail Modal */}
      <ProductDetailModal
        item={modalItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
};

export const MenuPage = MainMenuPage;
export default MainMenuPage;
