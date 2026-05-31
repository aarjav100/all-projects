import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resumeData } = await req.json()

    // Mock AI analysis - in production, integrate with OpenAI for detailed analysis
    const analyzeResume = (data: any) => {
      const hasName = data.full_name?.length > 0
      const hasTitle = data.professional_title?.length > 0
      const hasSummary = data.summary?.length > 50
      const hasExperience = data.experiences?.length > 0
      const hasEducation = data.educations?.length > 0
      const hasSkills = data.skills?.length > 0
      const hasContact = data.email?.length > 0 && data.phone?.length > 0

      // Calculate scores
      const contentScore = Math.min(100, (
        (hasName ? 15 : 0) +
        (hasTitle ? 15 : 0) +
        (hasSummary ? 20 : 0) +
        (hasExperience ? 25 : 0) +
        (hasEducation ? 15 : 0) +
        (hasContact ? 10 : 0)
      ))

      const skillsScore = Math.min(100, (hasSkills ? 70 : 0) + (data.skills?.length * 5 || 0))
      
      const experienceScore = Math.min(100, (
        (hasExperience ? 50 : 0) +
        (data.experiences?.reduce((acc: number, exp: any) => 
          acc + (exp.description?.length > 100 ? 25 : 10), 0) || 0)
      ))

      const formattingScore = Math.min(100, (
        (hasName && hasTitle ? 30 : 0) +
        (hasContact ? 20 : 0) +
        (data.experiences?.every((exp: any) => exp.start_date && exp.title && exp.company) ? 25 : 0) +
        (data.educations?.every((edu: any) => edu.degree && edu.school) ? 25 : 0)
      ))

      const overallScore = Math.round((contentScore + skillsScore + experienceScore + formattingScore) / 4)

      return {
        overall_score: overallScore,
        content_score: contentScore,
        skills_score: skillsScore,
        experience_score: experienceScore,
        formatting_score: formattingScore,
        strengths: [
          hasName && hasTitle ? 'Professional header with clear identification' : null,
          hasSummary ? 'Compelling professional summary' : null,
          hasExperience ? 'Relevant work experience documented' : null,
          hasSkills ? 'Comprehensive skills section' : null,
          hasContact ? 'Complete contact information' : null
        ].filter(Boolean),
        improvements: [
          !hasSummary ? 'Add a professional summary to highlight your value proposition' : null,
          !hasExperience ? 'Include work experience with specific achievements' : null,
          !hasSkills ? 'Add relevant skills to match job requirements' : null,
          data.experiences?.some((exp: any) => !exp.description || exp.description.length < 50) ? 'Expand job descriptions with quantifiable achievements' : null,
          !hasContact ? 'Complete your contact information' : null
        ].filter(Boolean),
        suggestions: [
          'Use action verbs to start each bullet point',
          'Include specific metrics and numbers where possible',
          'Tailor your resume to match job descriptions',
          'Keep formatting consistent throughout',
          'Proofread for grammar and spelling errors'
        ]
      }
    }

    const analysis = analyzeResume(resumeData)

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})