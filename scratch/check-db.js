const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jabtmplfjwtrfzwlwjax.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYnRtcGxmand0cmZ6d2x3amF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTM2MzEsImV4cCI6MjA5MzIyOTYzMX0.zrgUdswzN6ZzNH6mDSVuP-QXz4nG-2nOTTReppx_v2M'
);

async function main() {
  console.log('Querying triggers...');
  const { data, error } = await supabase.rpc('get_triggers');
  if (error) {
    console.error('Error fetching triggers via RPC (might not exist):', error.message);
    // Let's try executing a raw SQL query or fetching metadata if we can, or just inspect user profiles
    console.log('Fetching profiles list:');
    const { data: profiles, error: pError } = await supabase.from('user_profiles').select('*');
    console.log('Profiles:', profiles, 'Error:', pError);
  } else {
    console.log('Triggers:', data);
  }
}
main();
