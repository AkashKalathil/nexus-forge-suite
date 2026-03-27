// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eiftggygyogggtwsdntl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZnRnZ3lneW9nZ2d0d3NkbnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMzA1NTksImV4cCI6MjA2OTYwNjU1OX0.MnxbD5nElo6clfbZ4Cb0MNor-o52scEKvEwo8SyYw2I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});