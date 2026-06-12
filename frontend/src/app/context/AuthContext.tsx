import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "../services/supabase";
import type { User, UserRole } from "../types/user";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Generate initials from a full name: "Dr. Arjun Rajan" → "AR" */
export function getAvatarInitials(name: string): string {
  if (!name?.trim()) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  // Skip honorifics like "Dr.", "Prof.", "Mr.", "Ms."
  const honorifics = new Set(["dr.", "prof.", "mr.", "ms.", "mrs.", "sir"]);
  const meaningful = parts.filter(p => !honorifics.has(p.toLowerCase().replace(",", "")));
  if (meaningful.length >= 2) {
    return (meaningful[0][0] + meaningful[1][0]).toUpperCase();
  }
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** Derive a short display name: "Dr. Arjun Rajan" → "Dr. Rajan" */
export function getShortName(name: string): string {
  if (!name?.trim()) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 2) return name;
  // Keep first part (honorific or first name) + last name
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

// ── Context shape ─────────────────────────────────────────────────────────────

export interface AuthContextValue {
  /** Full Supabase-resolved user object */
  user: User | null;
  /** The current user's role */
  role: UserRole | null;
  /** Organization name (consultants only) */
  organization: string;
  /** Two-letter initials generated from the user's name */
  avatarInitials: string;
  /** Short display name, e.g. "Dr. Rajan" */
  shortName: string;
  /** True while the initial session check is in progress */
  isLoading: boolean;
  /** True once the user is fully authenticated */
  isAuthenticated: boolean;
  /** Call after a successful login — sets the user and their role */
  setAuthUser: (user: User) => void;
  /** Clear auth state on logout */
  clearAuth: () => void;
}

// ── Context creation ──────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── On mount: restore session from Supabase ──────────────────────────────

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user || !mounted) {
          if (mounted) setIsLoading(false);
          return;
        }

        const sbUser = session.user;
        const name: string = sbUser.user_metadata?.name ?? sbUser.email?.split("@")[0] ?? "User";
        const role: UserRole = sbUser.user_metadata?.role ?? "patient";

        if (mounted) {
          setUser({
            id: sbUser.id,
            name,
            email: sbUser.email ?? "",
            role,
            avatarInitials: getAvatarInitials(name),
            organization: sbUser.user_metadata?.organization ?? "",
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error("[AuthContext] Failed to restore session:", err);
        if (mounted) setIsLoading(false);
      }
    }

    restoreSession();

    // Subscribe to auth changes (sign-in / sign-out / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (!session?.user) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const sbUser = session.user;
        const name: string = sbUser.user_metadata?.name ?? sbUser.email?.split("@")[0] ?? "User";
        const role: UserRole = sbUser.user_metadata?.role ?? "patient";

        setUser({
          id: sbUser.id,
          name,
          email: sbUser.email ?? "",
          role,
          avatarInitials: getAvatarInitials(name),
          organization: sbUser.user_metadata?.organization ?? "",
        });
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const setAuthUser = useCallback((newUser: User) => {
    setUser({
      ...newUser,
      avatarInitials: getAvatarInitials(newUser.name),
    });
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────

  const name = user?.name ?? "";
  const value: AuthContextValue = {
    user,
    role: user?.role ?? null,
    organization: user?.organization ?? "",
    avatarInitials: user ? getAvatarInitials(name) : "??",
    shortName: user ? getShortName(name) : "",
    isLoading,
    isAuthenticated: user !== null,
    setAuthUser,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

/** Primary hook — use this everywhere instead of local state */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }
  return ctx;
}

/** Convenience hook for consultant-only context (throws if not consultant) */
export function useConsultantAuth() {
  const auth = useAuth();
  if (auth.role && auth.role !== "consultant") {
    console.warn("[useConsultantAuth] Called outside consultant context.");
  }
  return auth;
}

/** Convenience hook for patient-only context */
export function usePatientAuth() {
  const auth = useAuth();
  if (auth.role && auth.role !== "patient") {
    console.warn("[usePatientAuth] Called outside patient context.");
  }
  return auth;
}
