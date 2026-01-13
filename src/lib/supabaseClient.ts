import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) {
  throw new Error('Missing REACT_APP_SUPABASE_URL environment variable. Please check your .env file.');
}

if (!supabaseKey) {
  throw new Error('Missing REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variable. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
        