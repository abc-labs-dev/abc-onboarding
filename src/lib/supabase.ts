
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pzepjyttlrjlxzzafgzx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZXBqeXR0bHJqbHh6emFmZ3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5MTk2NTQsImV4cCI6MjAyMzQ5NTY1NH0.NeZ_yVGPgEHXCbIe0hRbdczK-u5gqGGVv8SgGKqkdCI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
