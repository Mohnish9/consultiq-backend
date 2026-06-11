import { env } from "../config/env";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const baseUrl = env.API_URL ?? "";
  const url = `${baseUrl}${path}`;

  const token = typeof window !== "undefined" ? localStorage.getItem("ciq_token") : null;

  const res = await fetch(url, {
    method,
    headers: {
  "Content-Type": "application/json",
  apikey: env.SUPABASE_ANON_KEY ?? "",
  ...(token
    ? { Authorization: `Bearer ${token}` }
    : {}),
},
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function upload<T>(path: string, formData: FormData): Promise<T> {
  const baseUrl = env.API_URL ?? "";
  const url = `${baseUrl}${path}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("ciq_token") : null;

  const res = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T = void>(path: string) => request<T>("DELETE", path),
  upload: <T>(path: string, formData: FormData) => upload<T>(path, formData),
};

export { ApiError };
