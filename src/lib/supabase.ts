
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabaseReady = Boolean(supabaseUrl && supabaseKey);

export const supabase = supabaseReady
  ? createClient(supabaseUrl, supabaseKey)
  : null;
