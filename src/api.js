import { createClient } from "@supabase/supabase-js";

export const API_URL = "http://localhost:3001"
export const SUPABASE_URL = "https://bulzcydlenmnkhxahvwa.supabase.co"
export const SUPABASE_ANON_KEY = "sb_secret_j-iO_Pf-y1tkTNP0N7XWWA_OkpiIGZv"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);