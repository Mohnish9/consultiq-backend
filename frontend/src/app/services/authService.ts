import type { User, UserRole } from "../types/user";
import { supabase } from "./supabase";

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


export async function login(
  email: string,
  password: string,
  role: UserRole
): Promise<LoginResponse> {

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  const user = data.user;

  localStorage.setItem(
    "ciq_token",
    data.session?.access_token ?? ""
  );

  return {
    success: true,
    token: data.session?.access_token,
    user: {
      id: user.id,
      name: user.user_metadata?.name ?? "User",
      email: user.email ?? "",
      role: (user.user_metadata?.role ?? role) as UserRole,
      avatarInitials: (
        user.user_metadata?.name?.substring(0, 2) ?? "US"
      ).toUpperCase(),
    },
  };
}
export async function signup(
  email: string,
  password: string,
  name: string,
  role: UserRole
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

  if (error) {
    throw error;
  }

  return data;
}
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  localStorage.removeItem("ciq_token");
  return;
  await new Promise(r => setTimeout(r, 200));
}

export async function getMe(): Promise<User | null> {
  const {
  data: { user },
  } = await supabase.auth.getUser();

if (!user) return null;

return {
  id: user.id,
  name: user.user_metadata?.name ?? "User",
  email: user.email ?? "",
  role: user.user_metadata?.role ?? "patient",
  avatarInitials: (
    user.user_metadata?.name?.substring(0, 2) ?? "US"
  ).toUpperCase(),
};
}
