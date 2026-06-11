// supabase/functions/_shared/utils.ts
// Shared helpers used across all Edge Functions

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-requested-with",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

// ── Response helpers ─────────────────────────────────────────

export function ok(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function created(data: unknown): Response {
  return ok(data, 201);
}

export function accepted(data: unknown): Response {
  return ok(data, 202);
}

export function noContent(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function error(
  code: string,
  message: string,
  statusCode = 400
): Response {
  return new Response(JSON.stringify({ error: code, message, statusCode }), {
    status: statusCode,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export const Errors = {
  unauthorized: () => error("UNAUTHORIZED", "Missing or invalid token.", 401),
  forbidden: () => error("FORBIDDEN", "Insufficient permissions.", 403),
  notFound: (resource = "Resource") =>
    error("NOT_FOUND", `${resource} not found.`, 404),
  validation: (msg: string) => error("VALIDATION_ERROR", msg, 422),
  fileTooLarge: () => error("FILE_TOO_LARGE", "Upload exceeds 500 MB.", 413),
  unsupportedMedia: () =>
    error("UNSUPPORTED_MEDIA", "File type must be audio or video.", 415),
  processing: (msg = "Async job is in progress.") =>
    error("PROCESSING", msg, 202),
  internal: (msg = "Unhandled server error.") =>
    error("INTERNAL_ERROR", msg, 500),
};

// ── Supabase clients ─────────────────────────────────────────

export function getServiceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

export function getAnonClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );
}

/** Creates a user-scoped client from the request Authorization header */
export function getUserClient(req: Request): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
      auth: { persistSession: false },
    }
  );
}

// ── Auth helpers ─────────────────────────────────────────────

export async function requireAuth(req: Request) {
  const client = getUserClient(req);
  const {
    data: { user },
    error: authErr,
  } = await client.auth.getUser();
  if (authErr || !user) throw { response: Errors.unauthorized() };

  // Fetch role from public.users
  const svc = getServiceClient();
  const { data: profile } = await svc
    .from("users")
    .select("id, role, name, email, avatar_initials, is_active")
    .eq("auth_id", user.id)
    .single();

  if (!profile || !profile.is_active) throw { response: Errors.unauthorized() };

  return { user, profile, client, svc };
}

export async function requireRole(
  req: Request,
  ...roles: string[]
) {
  const ctx = await requireAuth(req);
  if (!roles.includes(ctx.profile.role)) {
    throw { response: Errors.forbidden() };
  }
  return ctx;
}

// ── Pagination ───────────────────────────────────────────────

export interface PageParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  offset: number;
}

export function parsePagination(url: URL, defaultSort = "created_at"): PageParams {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20"))
  );
  const sortBy = url.searchParams.get("sortBy") ?? defaultSort;
  const sortDir =
    (url.searchParams.get("sortDir") ?? "desc") === "asc" ? "asc" : "desc";
  return { page, pageSize, sortBy, sortDir, offset: (page - 1) * pageSize };
}

export function paginatedResponse(
  data: unknown[],
  total: number,
  page: number,
  pageSize: number
) {
  return { data, total, page, pageSize };
}

// ── Route dispatcher ─────────────────────────────────────────

type Handler = (req: Request, params: Record<string, string>) => Promise<Response>;

interface Route {
  method: string;
  pattern: URLPattern;
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  add(method: string, pathname: string, handler: Handler) {
    this.routes.push({
      method: method.toUpperCase(),
      pattern: new URLPattern({ pathname }),
      handler,
    });
    return this;
  }

  get(pathname: string, handler: Handler) { return this.add("GET", pathname, handler); }
  post(pathname: string, handler: Handler) { return this.add("POST", pathname, handler); }
  put(pathname: string, handler: Handler) { return this.add("PUT", pathname, handler); }
  patch(pathname: string, handler: Handler) { return this.add("PATCH", pathname, handler); }
  delete(pathname: string, handler: Handler) { return this.add("DELETE", pathname, handler); }

  async dispatch(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(req.url);

    for (const route of this.routes) {
      if (route.method !== req.method) continue;
      const match = route.pattern.exec({ pathname: url.pathname });
      if (match) {
        try {
          return await route.handler(req, match.pathname.groups as Record<string, string>);
        } catch (e: unknown) {
          if (e && typeof e === "object" && "response" in e) {
            return (e as { response: Response }).response;
          }
          console.error("Unhandled error:", e);
          return Errors.internal();
        }
      }
    }

    return error("NOT_FOUND", "Route not found.", 404);
  }
}