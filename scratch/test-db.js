const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jabtmplfjwtrfzwlwjax.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYnRtcGxmand0cmZ6d2x3amF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTM2MzEsImV4cCI6MjA5MzIyOTYzMX0.zrgUdswzN6ZzNH6mDSVuP-QXz4nG-2nOTTReppx_v2M'
);

async function main() {
  const dummyId = '00000000-0000-0000-0000-000000000000';
  
  console.log('Attempting dummy insert...');
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      { id: dummyId, nome: 'Test User', role: 'admin' }
    ]);
    
  console.log('Insert result:', { data, error });
}
main();
