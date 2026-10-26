import React from "react";
import BurgerExplodeSection from "./BurgerExplodeSection";
import FeaturedSection from "./FeaturedSection";

export interface HomePageProps {
  isActive: boolean;
  onNavigateToMenu: (categoryId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isActive,
  onNavigateToMenu,
}) => {
  return (
    <div
      id="homeView"
      style={{ display: isActive ? "block" : "none" }}
    >
      {/* 1st Section: 3D Exploded Burger Hero */}
      <BurgerExplodeSection isActive={isActive} />

      {/* 2nd Section: Featured Signature Categories Showcase */}
      <FeaturedSection onNavigateToMenu={onNavigateToMenu} />
    </div>
  );
};

export default HomePage;
