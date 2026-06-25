import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ccdvmzzmsnnneinbhkry.supabase.co'

const SUPABASE_ANON_KEY =
  'sb_publishable_FK2RJWYDvlZLwcWojb4Kyw_PSK6hzNq'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)