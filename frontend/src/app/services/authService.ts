import type { User, UserRole } from "../types/user";
import { supabase } from "./supabase";

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface PublicUserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_initials: string | null;
  consultants?: { organization: string | null } | null;
}

function getAvatarInitials(name: string): string {
  if (!name?.trim()) return "US";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? parts[0][1] ?? "")).toUpperCase();
}

function mapPublicUser(row: PublicUserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatarInitials: row.avatar_initials ?? getAvatarInitials(row.name),
    organization: row.consultants?.organization ?? undefined,
  };
}

export async function getCurrentPublicUser(): Promise<User | null> {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, avatar_initials, consultants(organization)")
    .eq("auth_id", authUser.id)
    .maybeSingle<PublicUserRow>();

  if (error) throw error;
  if (!data) return null;

  return mapPublicUser(data);
}

export async function login(
  email: string,
  password: string,
  expectedRole: UserRole
): Promise<LoginResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  localStorage.setItem("ciq_token", data.session?.access_token ?? "");

  try {
    const publicUser = await getCurrentPublicUser();

    if (!publicUser) {
      await supabase.auth.signOut();
      localStorage.removeItem("ciq_token");
      return {
        success: false,
        error: "Authenticated user is missing a public profile.",
      };
    }

    if (publicUser.role !== expectedRole) {
      await supabase.auth.signOut();
      localStorage.removeItem("ciq_token");
      return {
        success: false,
        error: `This account is registered as ${publicUser.role}. Please use the ${publicUser.role} login.`,
      };
    }

    return {
      success: true,
      token: data.session?.access_token,
      user: publicUser,
    };
  } catch (profileError: any) {
    return {
      success: false,
      error: profileError?.message ?? "Failed to load user profile.",
    };
  }
}

export async function signup(
  email: string,
  password: string,
  name: string,
  role: UserRole
) {
  const { data, error } = await supabase.auth.signUp({
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
}

export async function getMe(): Promise<User | null> {
  return getCurrentPublicUser();
}
