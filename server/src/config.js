// Supabase configuration
const SUPABASE_CONFIG = {
  supabaseUrl: "https://tbjozecglteemnrbtjsb.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam96ZWNnbHRlZW1ucmJ0anNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NDcyOTAsImV4cCI6MjA0NjMyMzI5MH0.LLeuhNyCuNYZj2Jl14b_9-yCywKvXArmGWZk1u4qFdY",
  serviceKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam96ZWNnbHRlZW1ucmJ0anNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc0NzI5MCwiZXhwIjoyMDQ2MzIzMjkwfQ.nkvV6RgdgS4ODqTGQJLajOmAAq8sWFiqgF1ZtGU9OLM",
  directUrl: "postgresql://postgres.tbjozecglteemnrbtjsb:wawpep-3pabBe-fyzmaz@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
};

// Server configuration
const SERVER_CONFIG = {
  port: process.env.PORT || 3002,
};

module.exports = {
  SUPABASE_CONFIG,
  SERVER_CONFIG
};
