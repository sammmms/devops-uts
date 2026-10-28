import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://agagcdciaetblonyodwo.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_1YuXj-Ujm1sMn2e3uqJMXA_JYQdjT2k";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
