import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// The '!' tells TypeScript: "I promise these keys exist in .env.local"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)