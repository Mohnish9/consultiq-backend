// supabase/functions/auth/index.ts
import {
  Router, ok, noContent, Errors,
  getAnonClient, getServiceClient, getUserClient,
  corsHeaders,
} from "../_shared/utils.ts";

const router = new Router();

// ── POST /auth/login ─────────────────────────────────────────

router.post("/v1/auth/login", async (req) => {
  const { email, password, role } = await req.json();

  if (!email || !password) {
    return Errors.validation("email and password are required.");
  }

  const anon = getAnonClient();
  const { data, error: authErr } = await anon.auth.signInWithPassword({
    email,
    password,
  });

  if (authErr || !data.session) {
    return Errors.unauthorized();
  }

  // Fetch profile from public.users
  const svc = getServiceClient();
  const { data: profile } = await svc
    .from("users")
    .select(`
      id, role, name, email, avatar_initials, is_active,
      consultants ( organization ),
      patients ( phone )
    `)
    .eq("auth_id", data.user.id)
    .single();

  if (!profile || !profile.is_active) {
    return Errors.unauthorized();
  }

  // Validate requested role matches actual role
  if (role && profile.role !== role && profile.role !== "admin") {
    return Errors.forbidden();
  }

  return ok({
    success: true,
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatarInitials: profile.avatar_initials,
      organization:
        profile.role === "consultant"
          ? (profile as any).consultants?.organization
          : undefined,
    },
  });
});
// ── POST /auth/signup ───────────────────────────────────────

router.post("/v1/auth/signup", async (req) => {
  const {
    email,
    password,
    name,
    role = "patient",
  } = await req.json();

  if (!email || !password) {
    return Errors.validation(
      "email and password are required."
    );
  }

  const anon = getAnonClient();

  const { data, error } = await anon.auth.signUp({
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
    return Errors.validation(error.message);
  }

  return ok({
    success: true,
    user: data.user,
  });
});
// ── POST /auth/logout ────────────────────────────────────────

router.post("/v1/auth/logout", async (req) => {
  const client = getUserClient(req);
  await client.auth.signOut();
  return noContent();
});

// ── GET /auth/me ─────────────────────────────────────────────

router.get("/v1/auth/me", async (req) => {
  const client = getUserClient(req);
  const {
    data: { user },
    error: authErr,
  } = await client.auth.getUser();

  if (authErr || !user) return Errors.unauthorized();

  const svc = getServiceClient();
  const { data: profile } = await svc
    .from("users")
    .select(`
      id, role, name, email, avatar_initials,
      consultants ( organization, specialty, clinic_name, storage_used_bytes, storage_limit_bytes ),
      patients ( phone, city, state, date_of_birth )
    `)
    .eq("auth_id", user.id)
    .single();

  if (!profile) return Errors.unauthorized();
  return ok(profile);
});

// ── POST /auth/refresh ───────────────────────────────────────

router.post("/v1/auth/refresh", async (req) => {
  const { refreshToken } = await req.json();
  if (!refreshToken) return Errors.validation("refreshToken is required.");

  const anon = getAnonClient();
  const { data, error: authErr } = await anon.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (authErr || !data.session) {
    return Errors.unauthorized();
  }

  return ok({
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
  });
});

Deno.serve((req) => router.dispatch(req));