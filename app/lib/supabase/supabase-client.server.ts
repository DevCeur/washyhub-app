import { createServerClient, parse, serialize } from "@supabase/ssr";

import type { Database } from "./database.types";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

if (!SUPABASE_URL) throw new Error("SUPABASE_URL env variable required");
if (!SUPABASE_ANON_KEY) throw new Error("SUPABASE_ANON_KEY env variable required");

export const createSupabaseServerClient = ({ request }: { request: Request }) => {
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const headers = new Headers();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

  return { supabase, headers };
};
