const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jabtmplfjwtrfzwlwjax.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYnRtcGxmand0cmZ6d2x3amF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTM2MzEsImV4cCI6MjA5MzIyOTYzMX0.zrgUdswzN6ZzNH6mDSVuP-QXz4nG-2nOTTReppx_v2M'
);

async function main() {
  const emailA = `admin_${Date.now()}@example.com`;
  const emailB = `user_${Date.now()}@example.com`;
  const password = 'TestPassword123!';

  console.log('1. Signing up Admin A:', emailA);
  const { data: signUpDataA, error: errA } = await supabase.auth.signUp({
    email: emailA,
    password,
  });
  if (errA) return console.error('Sign up A failed:', errA.message);
  const adminId = signUpDataA.user.id;
  console.log('Admin A ID:', adminId);

  console.log('2. Signing up User B:', emailB);
  const { data: signUpDataB, error: errB } = await supabase.auth.signUp({
    email: emailB,
    password,
  });
  if (errB) return console.error('Sign up B failed:', errB.message);
  const userId = signUpDataB.user.id;
  console.log('User B ID:', userId);

  // Wait for triggers
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('3. Logging in as Admin A...');
  const { data: loginData, error: logErr } = await supabase.auth.signInWithPassword({
    email: emailA,
    password,
  });
  if (logErr) return console.error('Login A failed:', logErr.message);
  console.log('Logged in as A.');

  console.log('4. Checking A and B profiles...');
  const { data: profiles } = await supabase.from('user_profiles').select('*');
  console.log('Visible profiles:', profiles);

  console.log('5. Admin A trying to update User B role to "dentista"...');
  const { data: updateData, error: updateError } = await supabase
    .from('user_profiles')
    .update({ role: 'dentista' })
    .eq('id', userId)
    .select();

  console.log('Update B result:', updateData, 'Error:', updateError ? updateError.message : 'none');

  console.log('6. Checking B profile again...');
  const { data: profileB } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  console.log('User B profile:', profileB);
}

main();
