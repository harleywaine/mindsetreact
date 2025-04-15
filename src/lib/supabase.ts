import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hzyxtfwtiqnxcpigtpct.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6eXh0Znd0aXFueGNwaWd0cGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MTU2MjIsImV4cCI6MjA2MDI5MTYyMn0.TejDo-1m7CEIaaHNXDeJ1thtk2BQcw5kor2nNdoVI1g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
}) 