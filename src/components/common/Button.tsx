import React from "react";

interface ButtonProps {
  variant?: "primary" | "secondary";
  className?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  href,
  onClick,
  children,
  type = "button",
  ariaLabel
}) => {
  const combinedClass = `btn btn--${variant} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={combinedClass} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={combinedClass} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
};

export default Button;
