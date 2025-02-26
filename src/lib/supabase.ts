
import { createClient } from "@supabase/supabase-js";

// Since you're connected to Supabase, we can safely initialize without checking for env vars
export const supabase = createClient(
  "https://your-project-url.supabase.co",  // This will be replaced with your actual URL
  "your-anon-key"  // This will be replaced with your actual anon key
);
