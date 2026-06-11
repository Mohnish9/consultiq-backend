/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPENAI_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const env = {
  API_URL: import.meta.env.VITE_API_URL,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  OPENAI_API_URL: import.meta.env.VITE_OPENAI_API_URL,
  IS_MOCK: false,
} as const;

