import React from "react";
import BurgerExplodeSection from "./BurgerExplodeSection";
import FeaturedSection from "./FeaturedSection";

export interface HomePageProps {
  isActive: boolean;
  onNavigateToMenu: (categoryId?: string) => void;
  onOpenOrderModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isActive,
  onNavigateToMenu,
  onOpenOrderModal,
}) => {
  return (
    <div
      id="homeView"
      style={{ display: isActive ? "block" : "none" }}
    >
      {/* 1st Section: Hoagy House Hero & About Section */}
      <BurgerExplodeSection
        isActive={isActive}
        onOpenOrderModal={onOpenOrderModal}
      />

      {/* 2nd Section: Featured Signature Categories Showcase */}
      <FeaturedSection onNavigateToMenu={onNavigateToMenu} />
    </div>
  );
};

export default HomePage;
