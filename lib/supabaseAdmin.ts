// lib/supabaseAdmin.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

// ⛔ DO NOT expose this key to the frontend in production
const supabaseUrl = 'https://hzyxtfwtiqnxcpigtpct.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6eXh0Znd0aXFueGNwaWd0cGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDcxNTYyMiwiZXhwIjoyMDYwMjkxNjIyfQ.wj8hCsWRe4KSawkdIfqQS1VWOn40Ejz9bQbNffAHGM0'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
