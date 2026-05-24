const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jabtmplfjwtrfzwlwjax.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYnRtcGxmand0cmZ6d2x3amF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTM2MzEsImV4cCI6MjA5MzIyOTYzMX0.zrgUdswzN6ZzNH6mDSVuP-QXz4nG-2nOTTReppx_v2M'
);

async function main() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  console.log(`Attempting signup with email: ${email}`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Signup failed:', error);
  } else {
    console.log('Signup succeeded:', data);
  }
}
main();
