export interface ResumeTemplate {
  name: string;
  description: string;
  style: 'modern' | 'classic' | 'creative' | 'minimal';
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    name: 'Modern Professional',
    description: 'Clean, contemporary design with subtle colors',
    style: 'modern'
  },
  {
    name: 'Classic Executive',
    description: 'Traditional format perfect for corporate roles',
    style: 'classic'
  },
  {
    name: 'Creative Designer',
    description: 'Bold layout for creative professionals',
    style: 'creative'
  },
  {
    name: 'Minimal Tech',
    description: 'Simple, focused design for tech roles',
    style: 'minimal'
  }
];

export const generateActionVerbs = (role: string): string[] => {
  const verbsByRole: Record<string, string[]> = {
    'software': ['Architected', 'Developed', 'Implemented', 'Optimized', 'Engineered', 'Deployed', 'Automated', 'Refactored', 'Designed', 'Built'],
    'marketing': ['Launched', 'Executed', 'Strategized', 'Optimized', 'Increased', 'Generated', 'Managed', 'Coordinated', 'Analyzed', 'Drove'],
    'sales': ['Achieved', 'Exceeded', 'Negotiated', 'Closed', 'Generated', 'Cultivated', 'Expanded', 'Converted', 'Secured', 'Delivered'],
    'management': ['Led', 'Directed', 'Supervised', 'Coordinated', 'Streamlined', 'Implemented', 'Established', 'Mentored', 'Transformed', 'Spearheaded'],
    'design': ['Created', 'Designed', 'Conceptualized', 'Illustrated', 'Prototyped', 'Collaborated', 'Refined', 'Delivered', 'Crafted', 'Innovated'],
    'finance': ['Analyzed', 'Forecasted', 'Managed', 'Optimized', 'Reduced', 'Improved', 'Calculated', 'Audited', 'Evaluated', 'Projected'],
    'data': ['Analyzed', 'Modeled', 'Processed', 'Visualized', 'Interpreted', 'Extracted', 'Transformed', 'Predicted', 'Optimized', 'Automated'],
    'product': ['Launched', 'Developed', 'Managed', 'Prioritized', 'Coordinated', 'Analyzed', 'Optimized', 'Delivered', 'Strategized', 'Executed']
  };

  const roleKey = Object.keys(verbsByRole).find(key => 
    role.toLowerCase().includes(key)
  ) || 'management';

  return verbsByRole[roleKey];
};

export const enhanceDescription = (description: string, role: string): string => {
  if (!description) return '';
  
  const actionVerbs = generateActionVerbs(role);
  const sentences = description.split('.').filter(s => s.trim());
  
  const enhancedSentences = sentences.map(sentence => {
    let trimmed = sentence.trim();
    if (!trimmed) return '';
    
    // Check if sentence already starts with an action verb
    const startsWithActionVerb = actionVerbs.some(verb => 
      trimmed.toLowerCase().startsWith(verb.toLowerCase())
    );
    
    if (!startsWithActionVerb) {
      // Add a relevant action verb
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      trimmed = `${randomVerb} ${trimmed.toLowerCase()}`;
    }
    
    // Add quantifiable elements if missing
    if (!trimmed.match(/\d+%|\d+\+|\$\d+|\d+ (years?|months?|weeks?)/i)) {
      const quantifiers = [
        'resulting in 25% improvement',
        'achieving 95% success rate',
        'saving 15+ hours weekly',
        'increasing efficiency by 30%',
        'managing $500K+ budget',
        'leading team of 8+ members',
        'serving 1000+ customers',
        'processing 200+ requests daily'
      ];
      
      const randomQuantifier = quantifiers[Math.floor(Math.random() * quantifiers.length)];
      trimmed = `${trimmed}, ${randomQuantifier}`;
    }
    
    return trimmed;
  });
  
  return enhancedSentences.join('. ') + '.';
};

export const generateSkillCategories = (skills: string[]): Record<string, string[]> => {
  const categories: Record<string, string[]> = {
    'Programming Languages': [],
    'Frameworks & Libraries': [],
    'Tools & Technologies': [],
    'Cloud & DevOps': [],
    'Databases': [],
    'Soft Skills': [],
    'Other': []
  };

  const programmingLanguages = ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'scala', 'r'];
  const frameworks = ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'next', 'nuxt', 'svelte'];
  const tools = ['git', 'jira', 'confluence', 'slack', 'figma', 'photoshop', 'illustrator', 'sketch', 'webpack', 'babel', 'vscode', 'intellij'];
  const cloudDevOps = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'gitlab', 'github', 'terraform', 'ansible', 'nginx', 'apache'];
  const databases = ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite', 'cassandra', 'dynamodb'];
  const softSkills = ['leadership', 'communication', 'teamwork', 'problem-solving', 'analytical', 'creative', 'adaptable', 'project management', 'agile', 'scrum'];

  skills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    
    if (programmingLanguages.some(lang => lowerSkill.includes(lang))) {
      categories['Programming Languages'].push(skill);
    } else if (frameworks.some(fw => lowerSkill.includes(fw))) {
      categories['Frameworks & Libraries'].push(skill);
    } else if (cloudDevOps.some(cloud => lowerSkill.includes(cloud))) {
      categories['Cloud & DevOps'].push(skill);
    } else if (databases.some(db => lowerSkill.includes(db))) {
      categories['Databases'].push(skill);
    } else if (tools.some(tool => lowerSkill.includes(tool))) {
      categories['Tools & Technologies'].push(skill);
    } else if (softSkills.some(soft => lowerSkill.includes(soft))) {
      categories['Soft Skills'].push(skill);
    } else {
      categories['Other'].push(skill);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};

export const calculateResumeScore = (resume: string): {
  atsScore: number;
  keywordScore: number;
  readabilityScore: string;
  suggestions: string[];
} => {
  const suggestions: string[] = [];
  let atsScore = 90;
  let keywordScore = 85;

  // Check for strong action verbs
  const strongActionVerbs = ['Architected', 'Spearheaded', 'Transformed', 'Optimized', 'Achieved', 'Exceeded', 'Generated', 'Implemented', 'Led', 'Managed'];
  const actionVerbCount = strongActionVerbs.filter(verb => 
    resume.toLowerCase().includes(verb.toLowerCase())
  ).length;
  
  if (actionVerbCount < 3) {
    suggestions.push('Use more powerful action verbs like "Spearheaded," "Transformed," or "Optimized"');
    atsScore -= 10;
  }

  // Check for quantifiable achievements
  const quantifiablePatterns = [
    /\d+%/g,
    /\d+\+/g,
    /\$\d+[KMB]?/g,
    /\d+ (years?|months?|weeks?)/g,
    /\d+ (team|people|members|employees)/g,
    /\d+ (projects?|clients?|customers?)/g
  ];
  
  const quantifiableCount = quantifiablePatterns.reduce((count, pattern) => {
    return count + (resume.match(pattern) || []).length;
  }, 0);
  
  if (quantifiableCount < 5) {
    suggestions.push('Add more quantifiable achievements with specific numbers, percentages, and metrics');
    keywordScore -= 15;
  }

  // Check for industry keywords
  const techKeywords = ['API', 'database', 'cloud', 'agile', 'scrum', 'CI/CD', 'microservices', 'scalable', 'performance', 'security'];
  const keywordCount = techKeywords.filter(keyword => 
    resume.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  if (keywordCount < 3) {
    suggestions.push('Include more industry-specific keywords relevant to your target role');
    keywordScore -= 10;
  }

  // Check resume length
  const wordCount = resume.split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push('Consider adding more detail to showcase your full experience and achievements');
    atsScore -= 10;
  } else if (wordCount > 1000) {
    suggestions.push('Consider condensing content to maintain recruiter attention (aim for 1-2 pages)');
    atsScore -= 5;
  }

  // Check for contact information completeness
  const hasEmail = resume.includes('@');
  const hasPhone = resume.includes('📱') || /\(\d{3}\)|\d{3}-\d{3}-\d{4}/.test(resume);
  const hasLocation = resume.includes('📍');
  
  if (!hasEmail || !hasPhone || !hasLocation) {
    suggestions.push('Ensure all essential contact information is included (email, phone, location)');
    atsScore -= 15;
  }

  // Check for professional summary
  if (!resume.toLowerCase().includes('summary') && !resume.toLowerCase().includes('profile')) {
    suggestions.push('Add a compelling professional summary to grab recruiter attention');
    atsScore -= 10;
  }

  // Check for skills section
  if (!resume.toLowerCase().includes('skills') && !resume.toLowerCase().includes('competencies')) {
    suggestions.push('Include a dedicated skills section with relevant technical and soft skills');
    keywordScore -= 20;
  }

  // Bonus points for excellent formatting
  if (resume.includes('**') && resume.includes('•')) {
    atsScore += 5;
    keywordScore += 5;
  }

  const finalAtsScore = Math.max(60, Math.min(100, atsScore));
  const finalKeywordScore = Math.max(60, Math.min(100, keywordScore));
  
  const readabilityScore = finalAtsScore >= 95 ? 'Excellent' : 
                          finalAtsScore >= 85 ? 'Very Good' : 
                          finalAtsScore >= 75 ? 'Good' : 
                          finalAtsScore >= 65 ? 'Fair' : 'Needs Improvement';

  return {
    atsScore: finalAtsScore,
    keywordScore: finalKeywordScore,
    readabilityScore,
    suggestions: suggestions.slice(0, 5) // Limit to top 5 suggestions
  };
};