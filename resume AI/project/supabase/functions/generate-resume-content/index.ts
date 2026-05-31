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
    const { userProfile, section, jobTitle, company } = await req.json()

    // Mock AI content generation - in production, integrate with OpenAI
    const generateContent = (section: string) => {
      switch (section) {
        case 'summary':
          return `Experienced ${userProfile.professional_title || 'professional'} with ${Math.floor(Math.random() * 5) + 3}+ years of expertise in ${userProfile.skills?.slice(0, 3).map((s: any) => s.name).join(', ') || 'technology'}. Proven track record of delivering scalable solutions and leading cross-functional teams to achieve business objectives. Passionate about innovation and continuous learning.`
        
        case 'experience':
          return `• Led development of innovative solutions that improved system performance by ${Math.floor(Math.random() * 40) + 20}%
• Implemented automated processes, reducing deployment time by ${Math.floor(Math.random() * 50) + 30}%
• Mentored ${Math.floor(Math.random() * 5) + 2} team members and established best practices
• Collaborated with stakeholders to define requirements and deliver features on time
• Managed projects with budgets up to $${Math.floor(Math.random() * 500) + 100}k`

        case 'cover_letter':
          return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background in ${userProfile.professional_title} and proven track record of delivering exceptional results, I am excited about the opportunity to contribute to your team.

In my previous roles, I have successfully:
• Led cross-functional teams to deliver high-impact projects on time and within budget
• Developed innovative solutions that improved operational efficiency by 30%
• Collaborated with stakeholders to align technical solutions with business objectives
• Mentored junior team members and fostered a culture of continuous learning

What particularly excites me about ${company} is your commitment to innovation and excellence. I am eager to bring my expertise in ${userProfile.skills?.slice(0, 3)?.map((s: any) => s.name).join(', ') || 'technology'} to help drive your company's continued success.

Thank you for considering my application. I would welcome the opportunity to discuss how my skills and experience can contribute to ${company}'s success.

Sincerely,
${userProfile.full_name}`

        default:
          return 'Generated content will appear here...'
      }
    }

    const content = generateContent(section)

    return new Response(
      JSON.stringify({ content }),
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