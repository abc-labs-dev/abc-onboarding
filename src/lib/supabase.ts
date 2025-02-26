
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iwnuimseszcgdabjsdqb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3bnVpbXNlc3pjZ2RhYmpzZHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NjI2MjIsImV4cCI6MjA1NjEzODYyMn0.Y3LyIeIIHDEbjTi37iQFRTm7C8eyW8BSLVrQH7B4AwU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
