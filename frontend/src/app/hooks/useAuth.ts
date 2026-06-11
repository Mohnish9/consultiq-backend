import { useState, useCallback } from "react";
import type { User, UserRole } from "../types/user";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const MOCK_USERS: Record<UserRole, User> = {
  consultant: {
    id: "U-001",
    name: "Dr. Arjun Rajan",
    email: "arjun@consultiq.io",
    role: "consultant",
    avatarInitials: "AR",
    organization: "Apollo Wellness",
  },
  patient: {
    id: "U-002",
    name: "Priya Mehta",
    email: "priya.mehta@email.com",
    role: "patient",
    avatarInitials: "PM",
  },
};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };
}
