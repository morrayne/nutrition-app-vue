import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xjitwqdszairtfchtlgm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXR3cWRzemFpcnRmY2h0bGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjI0MzAsImV4cCI6MjA4NDU5ODQzMH0.pzB166Cy96241tiXBoEXY7CaTOqKSqQJpvWkf42OA_E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
