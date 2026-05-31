import React, { useState } from 'react';
import { User, FileText, Download, Sparkles, ArrowRight, Check, Briefcase, GraduationCap, Star } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import GitDashboard from './components/collaboration/GitDashboard';
import CreateRepository from './components/collaboration/CreateRepository';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { UserData } from './types/resume';
import { ResumeTemplate, resumeTemplates, enhanceDescription, generateSkillCategories, calculateResumeScore } from './utils/resumeGenerator';

type AppView = 'landing' | 'auth' | 'form' | 'preview' | 'git' | 'create-repo';
type AuthView = 'login' | 'signup';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [generatedResume, setGeneratedResume] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(resumeTemplates[0]);
  const [resumeAnalysis, setResumeAnalysis] = useState<{
    atsScore: number;
    keywordScore: number;
    readabilityScore: string;
    suggestions: string[];
  } | null>(null);

  const handleFormSubmit = async (data: UserData) => {
    setUserData(data);
    setIsGenerating(true);
    setCurrentView('preview');
    
    // Simulate AI generation with more realistic timing
    setTimeout(() => {
      const resume = generateResumeFromData(data);
      setGeneratedResume(resume);
      setResumeAnalysis(calculateResumeScore(resume));
      setIsGenerating(false);
    }, 3000);
  };

  const generateResumeFromData = (data: UserData): string => {
    const sections = [];
    
    // Header section with template styling
    if (selectedTemplate.style === 'modern') {
      sections.push(`**${data.personalInfo.fullName.toUpperCase()}**`);
      sections.push(`${data.personalInfo.title}`);
    } else if (selectedTemplate.style === 'creative') {
      sections.push(`✨ **${data.personalInfo.fullName.toUpperCase()}** ✨`);
      sections.push(`🎯 ${data.personalInfo.title}`);
    } else {
      sections.push(`**${data.personalInfo.fullName}**`);
      sections.push(`${data.personalInfo.title}`);
    }
    
    sections.push('');
    
    // Contact information with enhanced formatting
    const contactInfo = [];
    if (data.personalInfo.email) contactInfo.push(`📧 ${data.personalInfo.email}`);
    if (data.personalInfo.phone) contactInfo.push(`📱 ${data.personalInfo.phone}`);
    if (data.personalInfo.location) contactInfo.push(`📍 ${data.personalInfo.location}`);
    if (data.personalInfo.linkedin) contactInfo.push(`🔗 ${data.personalInfo.linkedin}`);
    if (data.personalInfo.website) contactInfo.push(`🌐 ${data.personalInfo.website}`);
    
    sections.push(contactInfo.join(' | '));
    sections.push('');
    sections.push('═══════════════════════════════════════════════════════════════');
    sections.push('');

    // Professional Summary with AI enhancement
    if (data.summary) {
      sections.push('**PROFESSIONAL SUMMARY**');
      sections.push('');
      
      // Enhance summary with better formatting
      const enhancedSummary = data.summary
        .split('.')
        .filter(s => s.trim())
        .map(sentence => sentence.trim())
        .join('. ') + '.';
      
      sections.push(enhancedSummary);
      sections.push('');
    }

    // Core Competencies (if we have skills)
    if (data.skills.length > 0 && data.skills[0]) {
      const skillCategories = generateSkillCategories(data.skills.filter(skill => skill.trim()));
      
      sections.push('**CORE COMPETENCIES**');
      sections.push('');
      
      Object.entries(skillCategories).forEach(([category, skills]) => {
        if (skills.length > 0) {
          sections.push(`**${category}:** ${skills.join(' • ')}`);
        }
      });
      sections.push('');
    }

    // Professional Experience with enhanced descriptions
    if (data.experience.length > 0 && data.experience[0].title) {
      sections.push('**PROFESSIONAL EXPERIENCE**');
      sections.push('');
      
      data.experience.forEach((exp, index) => {
        if (exp.title && exp.company) {
          sections.push(`**${exp.title}** | ${exp.company}`);
          sections.push(`${exp.startDate} - ${exp.endDate}`);
          sections.push('');
          
          if (exp.description) {
            const enhancedDesc = enhanceDescription(exp.description, exp.title);
            sections.push(enhancedDesc);
            sections.push('');
          }
          
          if (exp.achievements && exp.achievements.length > 0 && exp.achievements[0]) {
            sections.push('**Key Achievements:**');
            exp.achievements.forEach(achievement => {
              if (achievement.trim()) {
                sections.push(`• ${achievement}`);
              }
            });
            sections.push('');
          }
          
          // Add separator between experiences
          if (index < data.experience.length - 1) {
            sections.push('───────────────────────────────────────────────────────────────');
            sections.push('');
          }
        }
      });
    }

    // Education Section with enhanced formatting
    if (data.education.length > 0 && data.education[0].degree) {
      sections.push('**EDUCATION**');
      sections.push('');
      
      data.education.forEach(edu => {
        if (edu.degree && edu.institution) {
          sections.push(`**${edu.degree}** in ${edu.field || 'General Studies'}`);
          sections.push(`${edu.institution} | Graduated: ${edu.year}`);
          if (edu.gpa) {
            sections.push(`GPA: ${edu.gpa}`);
          }
          sections.push('');
        }
      });
    }

    // Certifications Section
    if (data.certifications.length > 0 && data.certifications[0]) {
      sections.push('**CERTIFICATIONS & LICENSES**');
      sections.push('');
      data.certifications.forEach(cert => {
        if (cert.trim()) {
          sections.push(`🏆 ${cert}`);
        }
      });
      sections.push('');
    }

    // Languages Section
    if (data.languages.length > 0 && data.languages[0]) {
      sections.push('**LANGUAGES**');
      sections.push('');
      const languagesList = data.languages.filter(lang => lang.trim()).join(' • ');
      sections.push(`🌍 ${languagesList}`);
      sections.push('');
    }

    // Add footer based on template
    if (selectedTemplate.style === 'creative') {
      sections.push('');
      sections.push('✨ Ready to make an impact! ✨');
    }

    return sections.join('\n').trim();
  };

  const handleRegenerateResume = () => {
    if (!userData) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const newResume = generateResumeFromData(userData);
      setGeneratedResume(newResume);
      setResumeAnalysis(calculateResumeScore(newResume));
      setIsGenerating(false);
    }, 2000);
  };

  const handleCreateRepository = (repoData: any) => {
    console.log('Creating repository:', repoData);
    // Here you would typically save to your backend
    setCurrentView('git');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Auth Views
  if (currentView === 'auth') {
    if (authView === 'login') {
      return (
        <LoginPage
          onSwitchToSignup={() => setAuthView('signup')}
          onClose={() => setCurrentView('landing')}
        />
      );
    } else {
      return (
        <SignupPage
          onSwitchToLogin={() => setAuthView('login')}
          onClose={() => setCurrentView('landing')}
        />
      );
    }
  }

  // Git Collaboration Views
  if (currentView === 'git') {
    return (
      <GitDashboard
        onCreateRepository={() => setCurrentView('create-repo')}
        onOpenRepository={(repo) => {
          console.log('Opening repository:', repo);
          // Navigate to repository view
        }}
      />
    );
  }

  if (currentView === 'create-repo') {
    return (
      <CreateRepository
        onBack={() => setCurrentView('git')}
        onCreate={handleCreateRepository}
      />
    );
  }

  // Resume Creation Views
  if (currentView === 'form') {
    return (
      <ResumeForm 
        onSubmit={handleFormSubmit} 
        onBack={() => setCurrentView('landing')}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
      />
    );
  }

  if (currentView === 'preview') {
    return (
      <ResumePreview
        userData={userData}
        generatedResume={generatedResume}
        isGenerating={isGenerating}
        onBack={() => setCurrentView('form')}
        onStartOver={() => {
          setCurrentView('landing');
          setUserData(null);
          setGeneratedResume('');
          setResumeAnalysis(null);
        }}
        onRegenerate={handleRegenerateResume}
        resumeAnalysis={resumeAnalysis}
        selectedTemplate={selectedTemplate}
      />
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header 
        onAuthClick={() => {
          setAuthView('login');
          setCurrentView('auth');
        }}
        onGitClick={() => setCurrentView('git')}
      />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Your Perfect Resume with
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Advanced AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your career story into a professional, ATS-optimized resume in minutes. Our enhanced AI analyzes your experience, suggests improvements, and crafts compelling content that gets you noticed by recruiters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setCurrentView('form');
                } else {
                  setAuthView('signup');
                  setCurrentView('auth');
                }
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>{isAuthenticated ? 'Generate My Resume' : 'Get Started Free'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-indigo-600 font-medium flex items-center space-x-2 transition-colors">
              <span>Watch Demo</span>
            </button>
          </div>
          
          {/* New Features Highlight */}
          <div className="mt-12 grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-sm font-medium text-gray-900">4 Templates</div>
              <div className="text-xs text-gray-600">Professional designs</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-medium text-gray-900">AI Enhancement</div>
              <div className="text-xs text-gray-600">Smart content optimization</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">ATS Analysis</div>
              <div className="text-xs text-gray-600">Real-time scoring</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-2">🤝</div>
              <div className="text-sm font-medium text-gray-900">Team Collaboration</div>
              <div className="text-xs text-gray-600">Git-based workflow</div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced AI Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience next-generation resume creation with intelligent analysis and team collaboration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Content Enhancement</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI automatically improves your descriptions with powerful action verbs and industry-specific language that resonates with hiring managers.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Check className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time ATS Scoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant feedback on your resume's ATS compatibility with detailed scoring and actionable suggestions for improvement.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Work together with colleagues, mentors, or career coaches using our Git-based collaboration system with version control.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create your professional resume in four simple steps with AI assistance and team collaboration.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <User className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up & Enter Info</h3>
                  <p className="text-gray-600">
                    Create your account and fill out our comprehensive form with your details, experience, and skills.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Template</h3>
                  <p className="text-gray-600">
                    Select from our collection of professional templates designed for your industry and career level.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Enhancement</h3>
                  <p className="text-gray-600">
                    Our AI optimizes your content with powerful language, industry keywords, and professional formatting.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborate & Download</h3>
                  <p className="text-gray-600">
                    Share with your team for feedback, get ATS scoring, and download your optimized resume.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">75K+</div>
              <div className="text-gray-600">Resumes Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">15K+</div>
              <div className="text-gray-600">Team Collaborations</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ResumeAI Pro</span>
          </div>
          <p className="text-gray-400 mb-8">
            Empowering careers with advanced AI-driven resume creation and team collaboration.
          </p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;