import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";
import { env } from "../config/env";
import type { User, UserRole } from "../types/user";

interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

const MOCK_CREDENTIALS: Record<string, { password: string; user: User }> = {
  "arjun@consultiq.io": {
    password: "password",
    user: { id: "U-001", name: "Dr. Arjun Rajan", email: "arjun@consultiq.io", role: "consultant", avatarInitials: "AR", organization: "Apollo Wellness" },
  },
  "priya.mehta@email.com": {
    password: "password",
    user: { id: "U-002", name: "Priya Mehta", email: "priya.mehta@email.com", role: "patient", avatarInitials: "PM" },
  },
};

export async function login(email: string, password: string, role: UserRole): Promise<LoginResponse> {
  if (!env.IS_MOCK) {
    const payload: LoginRequest = { email, password, role };
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
  }

  await new Promise(r => setTimeout(r, 800));
  const entry = MOCK_CREDENTIALS[email];
  if (entry && entry.user.role === role) {
    return { success: true, user: entry.user };
  }
  return {
    success: true,
    user: { id: "U-demo", name: role === "consultant" ? "Dr. Demo User" : "Demo Patient", email, role, avatarInitials: "DU" },
  };
}
interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export async function signup(
  email: string,
  password: string,
  name: string,
  role: UserRole
) {
  const payload: SignupRequest = {
    email,
    password,
    name,
    role,
  };

  return apiClient.post(
    API_ENDPOINTS.AUTH.SIGNUP,
    payload
  );
}
export async function logout(): Promise<void> {
  if (!env.IS_MOCK) {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem("ciq_token");
    return;
  }
  await new Promise(r => setTimeout(r, 200));
}

export async function getMe(): Promise<User | null> {
  if (!env.IS_MOCK) {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  }
  return null;
}
