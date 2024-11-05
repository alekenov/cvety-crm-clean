import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tbjozecglteemnrbtjsb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam96ZWNnbHRlZW1ucmJ0anNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NDcyOTAsImV4cCI6MjA0NjMyMzI5MH0.LLeuhNyCuNYZj2Jl14b_9-yCywKvXArmGWZk1u4qFdY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)