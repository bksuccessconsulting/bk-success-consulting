import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ccdvmzzmsnnneinbhkry.supabase.co/rest/v1/'
const supabaseKey = 'sb_publishable_FK2RJWYDvlZLwcWojb4Kyw_PSK6hzNq'

export const supabase = createClient(supabaseUrl, supabaseKey)