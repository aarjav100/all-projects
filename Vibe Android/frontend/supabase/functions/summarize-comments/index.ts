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
    const { post_id } = await req.json();
    
    if (!post_id) {
      return new Response(
        JSON.stringify({ error: "post_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch comments for the post
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select(`
        content,
        created_at,
        profiles:user_id (username, display_name)
      `)
      .eq("post_id", post_id)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      throw new Error("Failed to fetch comments");
    }

    if (!comments || comments.length < 5) {
      return new Response(
        JSON.stringify({ summary: null, message: "Not enough comments to summarize" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    console.log(`Summarizing ${comments.length} comments for post ${post_id}`);

    const commentsText = comments.map((c: any, i: number) => 
      `${i + 1}. ${c.profiles?.display_name || c.profiles?.username || 'Anonymous'}: "${c.content}"`
    ).join("\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a discussion summarizer. Analyze comment threads and provide a helpful summary.

Return a JSON object with:
- summary: A 2-3 sentence overview of the discussion
- top_opinions: Array of 2-3 objects with {opinion: string, support_count: number} representing main viewpoints
- agreements: Array of 1-2 strings showing what people generally agree on
- conflicts: Array of 1-2 strings showing points of disagreement

Be objective and fair. Capture the essence of the discussion.`
          },
          {
            role: "user",
            content: `Summarize this discussion:\n\n${commentsText}`
          }
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to summarize comments");
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content || "";
    
    console.log("AI summary response:", aiContent);

    // Parse JSON from AI response
    let result = { summary: "", top_opinions: [], agreements: [], conflicts: [] };
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
    }

    // Store the summary in the database
    const { error: upsertError } = await supabase
      .from("comment_summaries")
      .upsert({
        post_id,
        summary: result.summary,
        top_opinions: result.top_opinions,
        agreements: result.agreements,
        conflicts: result.conflicts,
        comment_count: comments.length,
        updated_at: new Date().toISOString(),
      }, { onConflict: "post_id" });

    if (upsertError) {
      console.error("Error storing summary:", upsertError);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in summarize-comments function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
