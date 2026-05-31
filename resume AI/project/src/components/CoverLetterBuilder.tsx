import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Download, Eye, Mail, Building, MapPin } from 'lucide-react';
import { createCoverLetter, getCoverLetters, updateCoverLetter, generateContent } from '../lib/database';
import toast from 'react-hot-toast';
import type { User } from '@supabase/supabase-js';
import type { Profile, CoverLetter } from '../lib/supabase';

interface CoverLetterBuilderProps {
  user: User | null;
  profile: Profile | null;
}

const CoverLetterBuilder: React.FC<CoverLetterBuilderProps> = ({ user, profile }) => {
  const [letterData, setLetterData] = useState({
    title: '',
    job_title: '',
    company_name: '',
    hiring_manager: '',
    content: '',
    tone: 'professional',
    industry: 'technology'
  });

  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [currentLetter, setCurrentLetter] = useState<CoverLetter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (user) {
      loadCoverLetters();
    }
  }, [user]);

  const loadCoverLetters = async () => {
    if (!user) return;

    try {
      const letters = await getCoverLetters(user.id);
      setCoverLetters(letters);
      if (letters.length > 0) {
        setCurrentLetter(letters[0]);
        setLetterData({
          title: letters[0].title,
          job_title: letters[0].job_title || '',
          company_name: letters[0].company_name || '',
          hiring_manager: letters[0].hiring_manager || '',
          content: letters[0].content || '',
          tone: letters[0].tone,
          industry: letters[0].industry
        });
      }
    } catch (error) {
      console.error('Error loading cover letters:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLetterData({ ...letterData, [field]: value });
  };

  const generateAICoverLetter = async () => {
    if (!user || !profile) return;

    setIsGenerating(true);
    
    try {
      const content = await generateContent(
        profile, 
        'cover_letter', 
        letterData.job_title, 
        letterData.company_name
      );
      
      setLetterData({ ...letterData, content });
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      if (currentLetter) {
        const updated = await updateCoverLetter(currentLetter.id, letterData);
        setCurrentLetter(updated);
        setCoverLetters(coverLetters.map(letter => 
          letter.id === currentLetter.id ? updated : letter
        ));
      } else {
        const newLetter = await createCoverLetter(user.id, {
          ...letterData,
          title: letterData.title || `Cover Letter for ${letterData.company_name || 'Company'}`
        });
        setCurrentLetter(newLetter);
        setCoverLetters([newLetter, ...coverLetters]);
      }
      toast.success('Cover letter saved successfully!');
    } catch (error) {
      console.error('Error saving cover letter:', error);
    }
  };

  const handleNewLetter = () => {
    setCurrentLetter(null);
    setLetterData({
      title: '',
      job_title: '',
      company_name: '',
      hiring_manager: '',
      content: '',
      tone: 'professional',
      industry: 'technology'
    });
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'confident', label: 'Confident' },
    { value: 'friendly', label: 'Friendly' }
  ];

  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' }
  ];

  const renderPreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="text-right mb-6">
          <p className="text-slate-600">{new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-slate-900">{letterData.hiring_manager || 'Hiring Manager'}</p>
          <p className="text-slate-900">{letterData.company_name}</p>
        </div>
        
        <div className="whitespace-pre-line text-slate-700 leading-relaxed">
          {letterData.content}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Cover Letter Builder</h1>
            <p className="text-slate-600">Create compelling cover letters tailored to specific job opportunities</p>
          </div>
          <button
            onClick={handleNewLetter}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>New Letter</span>
          </button>
        </div>

        {/* Cover Letter Selector */}
        {coverLetters.length > 0 && (
          <div className="mt-4">
            <select
              value={currentLetter?.id || ''}
              onChange={(e) => {
                const letter = coverLetters.find(l => l.id === e.target.value);
                if (letter) {
                  setCurrentLetter(letter);
                  setLetterData({
                    title: letter.title,
                    job_title: letter.job_title || '',
                    company_name: letter.company_name || '',
                    hiring_manager: letter.hiring_manager || '',
                    content: letter.content || '',
                    tone: letter.tone,
                    industry: letter.industry
                  });
                }
              }}
              className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            >
              <option value="">Select a cover letter...</option>
              {coverLetters.map((letter) => (
                <option key={letter.id} value={letter.id}>
                  {letter.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Job Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cover Letter Title</label>
              <input
                type="text"
                value={letterData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Cover Letter for Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={letterData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="Senior Software Engineer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={letterData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="Google Inc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hiring Manager</label>
              <input
                type="text"
                value={letterData.hiring_manager}
                onChange={(e) => handleInputChange('hiring_manager', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Jane Smith (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tone</label>
                <select
                  value={letterData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                >
                  {toneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                <select
                  value={letterData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                >
                  {industryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Cover Letter Content</label>
                <button
                  onClick={generateAICoverLetter}
                  disabled={isGenerating || !letterData.job_title || !letterData.company_name}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
                </button>
              </div>
              <textarea
                value={letterData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Your cover letter content will appear here..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button 
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Live Preview</h2>
          
          {letterData.content ? (
            <div className="max-h-96 overflow-y-auto">
              {renderPreview()}
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">Your cover letter preview will appear here</p>
              <p className="text-sm text-slate-400">Fill in the job details and generate content to see the preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;