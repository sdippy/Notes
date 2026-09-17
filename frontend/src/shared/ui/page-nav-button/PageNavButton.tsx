import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageNavButtonProps {
  to: string;
  label: ReactNode;
  className?: string;
}

export default function PageNavButton({
  to,
  label,
  className = "",
}: PageNavButtonProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${className}`}
    >
      {label}
    </Link>
  );
}
