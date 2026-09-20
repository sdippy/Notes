import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageNavButtonProps {
  to: string;
  label: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function PageNavButton({
  to,
  label,
  icon,
  className = "",
}: PageNavButtonProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 justify-center rounded-xl transition-all duration-200 cursor-pointer ${className}`}
    >
      {icon}
      {label}
    </Link>
  );
}
