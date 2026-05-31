import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { email } = await req.json()
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // Store OTP with 10 min expiry
  await supabase.from('admin_otps').insert({ email, otp, expires_at: new Date(Date.now() + 10 * 60 * 1000) })

  // TODO: Send OTP via email (replace with your email logic)
  // Example: use SendGrid, Supabase SMTP, or another provider
  // await sendEmail(email, `Your OTP is: ${otp}`)

  return new Response(JSON.stringify({ success: true }))
}) 