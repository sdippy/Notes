import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/features/auth/lib/authStorage";

export function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
