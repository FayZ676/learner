import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export const client = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
