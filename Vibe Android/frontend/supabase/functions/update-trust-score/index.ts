import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, action } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (profileError || !profile) {
      console.error("Profile not found:", profileError);
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get helpful count
    const { count: helpfulCount } = await supabase
      .from("helpful_marks")
      .select("*", { count: "exact", head: true })
      .eq("helper_id", user_id);

    // Get report count (unresolved reports against user)
    const { count: reportCount } = await supabase
      .from("user_reports")
      .select("*", { count: "exact", head: true })
      .eq("reported_user_id", user_id)
      .eq("resolved", false);

    // Get activity streak
    const { data: streak } = await supabase
      .from("activity_streaks")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    // Calculate account age
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const accountAgeDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate trust score (0-100)
    let trustScore = 0;
    
    // Helpful contributions (+2 per helpful mark, max 40)
    trustScore += Math.min((helpfulCount || 0) * 2, 40);
    
    // Activity streak (+1 per streak day, max 20)
    trustScore += Math.min(streak?.current_streak || 0, 20);
    
    // Total active days (+0.5 per day, max 20)
    trustScore += Math.min((streak?.total_active_days || 0) * 0.5, 20);
    
    // Account age bonus (+0.2 per day, max 10)
    trustScore += Math.min(accountAgeDays * 0.2, 10);
    
    // Penalty for reports (-15 per unresolved report)
    trustScore -= (reportCount || 0) * 15;
    
    // Clamp to 0-100
    trustScore = Math.max(0, Math.min(100, Math.round(trustScore)));

    // Determine badge level
    let badge = 'none';
    const helpful = helpfulCount || 0;
    const reports = reportCount || 0;
    const currentStreak = streak?.current_streak || 0;
    const totalActiveDays = streak?.total_active_days || 0;

    if (reports >= 3) {
      badge = 'none';
    } else if (helpful >= 50 && reports === 0 && totalActiveDays >= 60 && currentStreak >= 14) {
      badge = 'champion';
    } else if (helpful >= 20 && reports === 0 && totalActiveDays >= 30 && currentStreak >= 7) {
      badge = 'verified';
    } else if (helpful >= 10 && reports <= 1 && totalActiveDays >= 14) {
      badge = 'trusted';
    } else if (helpful >= 3 && totalActiveDays >= 7) {
      badge = 'contributor';
    } else if (accountAgeDays >= 3 && totalActiveDays >= 2) {
      badge = 'newcomer';
    }

    // Update profile with new trust score and badge
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        trust_score: trustScore,
        trust_badge: badge,
        helpful_count: helpful,
        report_count: reports,
        is_verified: badge === 'verified' || badge === 'champion',
      })
      .eq("user_id", user_id);

    if (updateError) {
      console.error("Failed to update profile:", updateError);
      throw updateError;
    }

    console.log(`Updated trust for user ${user_id}: score=${trustScore}, badge=${badge}`);

    return new Response(
      JSON.stringify({
        trust_score: trustScore,
        trust_badge: badge,
        helpful_count: helpful,
        report_count: reports,
        current_streak: currentStreak,
        total_active_days: totalActiveDays,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in update-trust-score function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
