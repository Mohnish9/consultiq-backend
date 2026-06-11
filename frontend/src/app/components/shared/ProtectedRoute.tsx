import type { ReactNode } from "react";
import type { UserRole } from "../../types/user";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

interface RoleRouteProps {
  role: UserRole | null;
  requiredRole: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ isAuthenticated, children, fallback }: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return fallback ?? null;
  }
  return <>{children}</>;
}

export function ConsultantRoute({ role, children, fallback }: RoleRouteProps) {
  if (role !== "consultant") {
    return fallback ?? null;
  }
  return <>{children}</>;
}

export function PatientRoute({ role, children, fallback }: RoleRouteProps) {
  if (role !== "patient") {
    return fallback ?? null;
  }
  return <>{children}</>;
}
