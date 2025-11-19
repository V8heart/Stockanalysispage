import { createClient as createServerClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () => {
  if (typeof window === "undefined") {
    return createServerClient(url, key);
  }
  return createBrowserClient(url, key);
};
