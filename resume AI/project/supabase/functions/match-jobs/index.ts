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
    const { userProfile, searchQuery, location, jobType } = await req.json()

    // Mock job data - in production, integrate with job APIs like Indeed, LinkedIn, etc.
    const mockJobs = [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: '$120k - $150k',
        type: 'Full-time',
        posted: '2 days ago',
        description: 'We are looking for a senior software engineer to join our team...',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        logo: '🏢'
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        salary: '$80k - $110k',
        type: 'Full-time',
        posted: '1 day ago',
        description: 'Join our dynamic team to build cutting-edge web applications...',
        skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
        logo: '🚀'
      },
      {
        id: 3,
        title: 'Full Stack Developer',
        company: 'Digital Solutions',
        location: 'New York, NY',
        salary: '$90k - $130k',
        type: 'Full-time',
        posted: '3 days ago',
        description: 'Looking for a versatile full stack developer...',
        skills: ['React', 'Python', 'PostgreSQL', 'Docker'],
        logo: '💼'
      },
      {
        id: 4,
        title: 'Software Engineer',
        company: 'InnovateTech',
        location: 'Austin, TX',
        salary: '$70k - $100k',
        type: 'Full-time',
        posted: '5 days ago',
        description: 'Entry to mid-level software engineer position...',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        logo: '⚡'
      },
      {
        id: 5,
        title: 'React Developer',
        company: 'WebFlow Agency',
        location: 'Los Angeles, CA',
        salary: '$85k - $115k',
        type: 'Contract',
        posted: '1 week ago',
        description: 'Contract position for an experienced React developer...',
        skills: ['React', 'Redux', 'TypeScript', 'Tailwind CSS'],
        logo: '🎨'
      }
    ]

    // Calculate match scores based on user skills
    const userSkills = userProfile.skills?.map((s: any) => s.name.toLowerCase()) || []
    
    const jobsWithScores = mockJobs.map(job => {
      const jobSkills = job.skills.map(s => s.toLowerCase())
      const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
      )
      
      const skillMatch = jobSkills.length > 0 ? (matchingSkills.length / jobSkills.length) * 100 : 0
      const titleMatch = userProfile.professional_title?.toLowerCase().includes(job.title.toLowerCase().split(' ')[0]) ? 20 : 0
      const match = Math.min(95, Math.round(skillMatch * 0.7 + titleMatch + Math.random() * 15))
      
      return { ...job, match }
    })

    // Filter and sort jobs
    let filteredJobs = jobsWithScores

    if (searchQuery) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (jobType) {
      filteredJobs = filteredJobs.filter(job => job.type === jobType)
    }

    // Sort by match score
    filteredJobs.sort((a, b) => b.match - a.match)

    return new Response(
      JSON.stringify({ jobs: filteredJobs }),
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