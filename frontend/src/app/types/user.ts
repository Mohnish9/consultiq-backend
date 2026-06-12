export type UserRole = "consultant" | "patient" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  organization?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
