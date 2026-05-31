import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, AlertCircle, Info, Star, TrendingUp, Target, Award } from 'lucide-react';
import { analyzeResume, getAIFeedback, saveAIFeedback, getResumes, getExperiences, getEducations, getSkills } from '../lib/database';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

interface AIFeedbackProps {
  user: User | null;
  profile: Profile | null;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ user, profile }) => {
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [currentResume, setCurrentResume] = useState<any>(null);

  const categories = [
    { id: 'overall', label: 'Overall', icon: Star },
    { id: 'content', label: 'Content', icon: Info },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'experience', label: 'Experience', icon: Award },
    { id: 'formatting', label: 'Formatting', icon: CheckCircle }
  ];

  useEffect(() => {
    if (user) {
      loadResumeData();
    }
  }, [user]);

  const loadResumeData = async () => {
    if (!user) return;

    try {
      const resumes = await getResumes(user.id);
      if (resumes.length > 0) {
        const resume = resumes[0];
        setCurrentResume(resume);
        
        // Load existing feedback
        const existingFeedback = await getAIFeedback(user.id, resume.id);
        if (existingFeedback) {
          setFeedback(existingFeedback);
        }
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    }
  };

  const runAnalysis = async () => {
    if (!user || !profile || !currentResume) return;

    setIsAnalyzing(true);
    
    try {
      // Gather all resume data
      const [experiences, educations, skills] = await Promise.all([
        getExperiences(user.id, currentResume.id),
        getEducations(user.id, currentResume.id),
        getSkills(user.id, currentResume.id)
      ]);

      const resumeData = {
        ...profile,
        experiences,
        educations,
        skills
      };

      // Analyze with AI
      const analysis = await analyzeResume(resumeData);
      
      // Save feedback
      const savedFeedback = await saveAIFeedback(user.id, currentResume.id, analysis);
      setFeedback(savedFeedback);
      
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 55) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return CheckCircle;
    if (score >= 70) return TrendingUp;
    if (score >= 55) return AlertCircle;
    return AlertCircle;
  };

  const getCurrentFeedback = () => {
    if (!feedback) return null;
    
    const categoryData = {
      overall: {
        score: feedback.overall_score,
        strengths: feedback.strengths || [],
        improvements: feedback.improvements || [],
        suggestions: feedback.suggestions || []
      },
      content: {
        score: feedback.content_score,
        strengths: feedback.strengths?.filter((_: any, i: number) => i < 2) || [],
        improvements: feedback.improvements?.filter((_: any, i: number) => i < 2) || [],
        suggestions: feedback.suggestions?.filter((_: any, i: number) => i < 2) || []
      },
      skills: {
        score: feedback.skills_score,
        strengths: feedback.strengths?.filter((_: any, i: number) => i >= 2 && i < 4) || [],
        improvements: feedback.improvements?.filter((_: any, i: number) => i >= 2 && i < 4) || [],
        suggestions: feedback.suggestions?.filter((_: any, i: number) => i >= 2 && i < 4) || []
      },
      experience: {
        score: feedback.experience_score,
        strengths: feedback.strengths?.filter((_: any, i: number) => i >= 4) || [],
        improvements: feedback.improvements?.filter((_: any, i: number) => i >= 4) || [],
        suggestions: feedback.suggestions?.filter((_: any, i: number) => i >= 4) || []
      },
      formatting: {
        score: feedback.formatting_score,
        strengths: ['Clean and professional layout', 'Consistent formatting throughout'],
        improvements: ['Some sections could use better visual hierarchy'],
        suggestions: ['Use consistent indentation and spacing', 'Consider using a modern, professional font']
      }
    };

    return categoryData[selectedCategory as keyof typeof categoryData];
  };

  const currentFeedback = getCurrentFeedback();
  const overallScore = feedback?.overall_score || 0;
  const ScoreIcon = currentFeedback ? getScoreIcon(currentFeedback.score) : CheckCircle;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Feedback</h1>
        <p className="text-slate-600">Get intelligent insights and recommendations to improve your resume</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6 sticky top-24">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
                <span className="font-semibold text-slate-900">AI Analysis</span>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${getScoreColor(overallScore)}`}>
                  <span className="text-2xl font-bold">{overallScore}</span>
                </div>
                <p className="text-sm text-slate-600">Overall Score</p>
              </div>
            </div>

            <nav className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const score = feedback ? feedback[`${category.id}_score`] || overallScore : 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </button>
                );
              })}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || !currentResume}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Brain className="h-5 w-5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8">
            {!currentResume ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No resume found</p>
                <p className="text-sm text-slate-400">Create a resume first to get AI feedback</p>
              </div>
            ) : isAnalyzing ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-slate-600 mb-2">Analyzing your resume...</p>
                <p className="text-sm text-slate-500">This may take a few moments</p>
              </div>
            ) : !feedback ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No analysis available yet</p>
                <p className="text-sm text-slate-400">Click "Run Analysis" to get AI feedback on your resume</p>
              </div>
            ) : currentFeedback ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {categories.find(c => c.id === selectedCategory)?.label} Analysis
                    </h2>
                    <p className="text-slate-600">AI-powered insights for your resume</p>
                  </div>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getScoreColor(currentFeedback.score)}`}>
                    <ScoreIcon className="h-5 w-5" />
                    <span className="font-semibold">{currentFeedback.score}/100</span>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Strengths */}
                  {currentFeedback.strengths.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Strengths</span>
                      </h3>
                      <div className="space-y-3">
                        {currentFeedback.strengths.map((strength: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-slate-700">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {currentFeedback.improvements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <span>Areas for Improvement</span>
                      </h3>
                      <div className="space-y-3">
                        {currentFeedback.improvements.map((improvement: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-slate-700">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {currentFeedback.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span>AI Suggestions</span>
                      </h3>
                      <div className="space-y-3">
                        {currentFeedback.suggestions.map((suggestion: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-slate-700">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Priority Action Items */}
                  {selectedCategory === 'overall' && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Priority Action Items</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                          <p className="text-slate-700">Add quantifiable achievements to your experience section</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                          <p className="text-slate-700">Update your professional summary with specific value propositions</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                          <p className="text-slate-700">Include relevant industry keywords for ATS optimization</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeedback;