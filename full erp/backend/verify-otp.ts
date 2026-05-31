import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { email, otp } = await req.json()
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const { data } = await supabase
    .from('admin_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (data) {
    await supabase.from('admin_otps').delete().eq('email', email)
    return new Response(JSON.stringify({ success: true }))
  } else {
    return new Response(JSON.stringify({ success: false, error: 'Invalid or expired OTP' }), { status: 400 })
  }
}) 