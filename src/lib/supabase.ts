import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { supabase } from "./supabase"

export async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    console.error("Unable to get user ID", error)
    return null
  }

  return data.user.id
}

