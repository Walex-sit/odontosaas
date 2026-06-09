const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jabtmplfjwtrfzwlwjax.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYnRtcGxmand0cmZ6d2x3amF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTM2MzEsImV4cCI6MjA5MzIyOTYzMX0.zrgUdswzN6ZzNH6mDSVuP-QXz4nG-2nOTTReppx_v2M'
);

async function main() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  
  console.log('1. Signing up user:', email);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError) {
    console.error('Signup failed:', signUpError.message);
    return;
  }
  const userId = signUpData.user.id;
  console.log('Signup succeeded. User ID:', userId);

  // Wait 2 seconds for trigger to execute
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('2. Checking if profile was created in user_profiles...');
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  console.log('Profile after signup:', profileData, 'Error:', profileError ? profileError.message : 'none');

  if (!profileData) {
    console.log('No profile row was created by trigger in database.');
    return;
  }

  console.log('3. Updating role to "recepcao" in database...');
  const { data: updateData, error: updateError } = await supabase
    .from('user_profiles')
    .update({ role: 'recepcao' })
    .eq('id', userId)
    .select();

  console.log('Update result:', updateData, 'Error:', updateError ? updateError.message : 'none');

  console.log('4. Querying profile again...');
  const { data: profileData2, error: profileError2 } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  console.log('Profile after update:', profileData2);

  console.log('5. Simulating login / page refresh by fetching session and querying profile...');
  // We already have the user session. Let's query public.user_profiles again
  const { data: profileData3, error: profileError3 } = await supabase
    .from('user_profiles')
    .select('id, nome, role')
    .eq('id', userId)
    .maybeSingle();

  console.log('Profile in simulated login/refresh:', profileData3);
}

main();
