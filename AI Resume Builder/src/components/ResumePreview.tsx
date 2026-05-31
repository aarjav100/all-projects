import React from 'react';
import { ArrowLeft, Download, RefreshCw, Sparkles, FileText, Share2, Edit3, Copy, Eye, Star, Award } from 'lucide-react';
import { UserData } from '../types/resume';
import { ResumeTemplate } from '../utils/resumeGenerator';
import ResumeAnalyzer from './ResumeAnalyzer';

interface ResumePreviewProps {
  userData: UserData | null;
  generatedResume: string;
  isGenerating: boolean;
  onBack: () => void;
  onStartOver: () => void;
  onRegenerate: () => void;
  resumeAnalysis: {
    atsScore: number;
    keywordScore: number;
    readabilityScore: string;
    suggestions: string[];
  } | null;
  selectedTemplate: ResumeTemplate;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  userData,
  generatedResume,
  isGenerating,
  onBack,
  onStartOver,
  onRegenerate,
  resumeAnalysis,
  selectedTemplate
}) => {
  const handleDownload = () => {
    if (!generatedResume || !userData) return;
    
    // Create a clean, professional version for download
    const cleanResume = generatedResume
      .replace(/\*\*/g, '')
      .replace(/═══════════════════════════════════════════════════════════════/g, '────────────────────────────────────────────────────────────────')
      .replace(/───────────────────────────────────────────────────────────────/g, '────────────────────────────────────────────────────────────────')
      .replace(/📧|📱|📍|🔗|🌐|🏆|🌍|✨|🎯/g, '');
    
    const blob = new Blob([cleanResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userData.personalInfo.fullName?.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    if (!generatedResume) return;
    
    const cleanResume = generatedResume
      .replace(/\*\*/g, '')
      .replace(/═══════════════════════════════════════════════════════════════/g, '────────────────────────────────────────────────────────────────')
      .replace(/───────────────────────────────────────────────────────────────/g, '────────────────────────────────────────────────────────────────')
      .replace(/📧|📱|📍|🔗|🌐|🏆|🌍|✨|🎯/g, '');
    
    try {
      await navigator.clipboard.writeText(cleanResume);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatResumeForDisplay = (resume: string) => {
    if (!resume) return [];
    
    return resume
      .split('\n')
      .map((line, index) => {
        // Handle main headers (bold text)
        if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
          const text = line.replace(/\*\*/g, '');
          
          // Special handling for creative template
          if (text.includes('✨') || text.includes('🎯')) {
            return (
              <div key={index} className="text-center mb-6">
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-2">
                  {text.replace(/✨|🎯/g, '').trim()}
                </h1>
              </div>
            );
          }
          
          if (text === text.toUpperCase() && text.length > 10) {
            // Name header
            const nameClass = selectedTemplate.style === 'modern' 
              ? 'text-4xl font-bold text-gray-900 mb-2 text-center tracking-tight'
              : selectedTemplate.style === 'creative'
              ? 'text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text mb-2 text-center tracking-tight'
              : 'text-4xl font-bold text-gray-900 mb-2 text-center tracking-tight';
            
            return (
              <div key={index} className="text-center mb-6 pb-4 border-b-2 border-gray-200">
                <h1 className={nameClass}>
                  {text}
                </h1>
              </div>
            );
          } else {
            // Section headers
            const headerClass = selectedTemplate.style === 'creative'
              ? 'text-2xl font-bold text-purple-700 mt-8 mb-4 pb-2 border-b-3 border-purple-300 uppercase tracking-wider flex items-center'
              : 'text-2xl font-bold text-indigo-700 mt-8 mb-4 pb-2 border-b-3 border-indigo-300 uppercase tracking-wider flex items-center';
            
            const getSectionIcon = (sectionText: string) => {
              if (sectionText.includes('SUMMARY') || sectionText.includes('PROFILE')) return <Star className="h-6 w-6 mr-3" />;
              if (sectionText.includes('EXPERIENCE') || sectionText.includes('WORK')) return <Award className="h-6 w-6 mr-3" />;
              if (sectionText.includes('EDUCATION')) return <Award className="h-6 w-6 mr-3" />;
              if (sectionText.includes('SKILLS') || sectionText.includes('COMPETENCIES')) return <Star className="h-6 w-6 mr-3" />;
              return <Star className="h-6 w-6 mr-3" />;
            };
            
            return (
              <h2 key={index} className={headerClass}>
                {getSectionIcon(text)}
                {text}
              </h2>
            );
          }
        }
        
        // Handle job titles and company names
        if (line.includes('**') && line.includes('|')) {
          const parts = line.split('|');
          const title = parts[0]?.replace(/\*\*/g, '').trim();
          const company = parts[1]?.trim();
          return (
            <div key={index} className="mb-4 bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-lg text-indigo-600 font-semibold">{company}</p>
            </div>
          );
        }
        
        // Handle education entries
        if (line.startsWith('**') && line.includes('in ')) {
          const text = line.replace(/\*\*/g, '');
          return (
            <div key={index} className="mb-3 bg-blue-50 p-3 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">
                {text}
              </h3>
            </div>
          );
        }
        
        // Handle skill categories
        if (line.startsWith('**') && line.includes(':')) {
          const parts = line.split(':');
          const category = parts[0]?.replace(/\*\*/g, '').trim();
          const skills = parts[1]?.trim();
          return (
            <div key={index} className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex flex-wrap items-center">
                <span className="font-bold text-indigo-800 text-lg mr-3 min-w-fit">{category}:</span>
                <div className="flex flex-wrap gap-2">
                  {skills?.split('•').map((skill, skillIndex) => (
                    skill.trim() && (
                      <span key={skillIndex} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-indigo-200 shadow-sm">
                        {skill.trim()}
                      </span>
                    )
                  ))}
                </div>
              </div>
            </div>
          );
        }
        
        // Handle horizontal lines
        if (line.includes('═══') || line.includes('───')) {
          return <hr key={index} className="my-6 border-2 border-gray-300" />;
        }
        
        // Handle bullet points with enhanced styling
        if (line.startsWith('• ')) {
          return (
            <div key={index} className="flex items-start mb-3 pl-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed font-medium">{line.substring(2)}</p>
            </div>
          );
        }
        
        // Handle achievements section
        if (line.includes('Key Achievements:')) {
          return (
            <div key={index} className="mt-4 mb-2">
              <h4 className="font-bold text-gray-900 text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Key Achievements:
              </h4>
            </div>
          );
        }
        
        // Handle emoji bullets with better styling
        if (line.startsWith('🏆 ') || line.startsWith('🌍 ')) {
          return (
            <div key={index} className="mb-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <p className="text-gray-700 font-medium">{line}</p>
            </div>
          );
        }
        
        // Handle contact info with professional styling
        if (line.includes('📧') || line.includes('📱') || line.includes('📍') || line.includes('🔗') || line.includes('🌐')) {
          const contactItems = line.split('|').map(item => item.trim());
          return (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {contactItems.map((item, contactIndex) => (
                  <span key={contactIndex} className="flex items-center text-gray-600 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        
        // Handle job titles (professional title under name)
        if (index > 0 && !line.includes('**') && !line.includes('•') && line.trim() && 
            generatedResume.split('\n')[index - 1]?.includes('**') && 
            generatedResume.split('\n')[index - 1]?.includes(userData?.personalInfo.fullName || '')) {
          const titleClass = selectedTemplate.style === 'creative'
            ? 'text-2xl text-purple-600 mb-6 text-center font-semibold tracking-wide'
            : 'text-2xl text-gray-600 mb-6 text-center font-semibold tracking-wide';
          
          return (
            <div key={index} className="text-center mb-6">
              <p className={titleClass}>
                {line}
              </p>
            </div>
          );
        }
        
        // Handle dates with better formatting
        if (line.match(/\d{4}/) && (line.includes('-') || line.includes('|') || line.includes('Graduated'))) {
          return (
            <div key={index} className="mb-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
              <p className="text-blue-700 text-sm font-semibold italic">
                {line}
              </p>
            </div>
          );
        }
        
        // Handle empty lines
        if (line.trim() === '') {
          return <div key={index} className="mb-3" />;
        }
        
        // Regular paragraphs with enhanced styling
        return (
          <div key={index} className="mb-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <p className="text-gray-700 leading-relaxed font-medium">
              {line}
            </p>
          </div>
        );
      });
  };

  const getTemplateStyles = () => {
    const baseStyles = "bg-white rounded-xl shadow-lg overflow-hidden border";
    
    switch (selectedTemplate.style) {
      case 'creative':
        return `${baseStyles} border-purple-200 shadow-purple-100`;
      case 'modern':
        return `${baseStyles} border-blue-200 shadow-blue-100`;
      case 'minimal':
        return `${baseStyles} border-gray-200`;
      default:
        return `${baseStyles} border-gray-200`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Form</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Interview-Ready Resume</h1>
              <p className="text-sm text-gray-600 flex items-center justify-center">
                <Eye className="h-4 w-4 mr-1" />
                Template: {selectedTemplate.name}
              </p>
            </div>
            <button
              onClick={onStartOver}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Start Over</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Resume Preview */}
          <div className="lg:col-span-2">
            <div className={getTemplateStyles()}>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-7 w-7" />
                    <div>
                      <h2 className="text-xl font-bold">Professional Resume</h2>
                      <p className="text-indigo-100 text-sm">Optimized for ATS & Interviews</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {resumeAnalysis?.atsScore || 85}%
                    </div>
                    <div className="text-indigo-100 text-sm">ATS Score</div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-gradient-to-b from-white to-gray-50">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mb-6"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        🤖 AI is Crafting Your Perfect Resume
                      </h3>
                      <div className="space-y-2 text-gray-600">
                        <p>✨ Enhancing content with powerful action verbs</p>
                        <p>🎯 Optimizing for ATS compatibility</p>
                        <p>📊 Analyzing keyword density</p>
                        <p>🚀 Formatting for maximum impact</p>
                      </div>
                    </div>
                  </div>
                ) : generatedResume ? (
                  <div className="max-w-none space-y-2">
                    {formatResumeForDisplay(generatedResume)}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No resume generated yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Actions Panel */}
          <div className="space-y-6">
            {/* Download Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Download className="h-5 w-5 mr-2 text-indigo-600" />
                Export & Share
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating || !generatedResume}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Resume</span>
                </button>
                
                <button
                  onClick={handleCopyToClipboard}
                  disabled={isGenerating || !generatedResume}
                  className="w-full flex items-center justify-center space-x-2 border-2 border-indigo-600 text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Copy className="h-5 w-5" />
                  <span>Copy to Clipboard</span>
                </button>
                
                <button
                  disabled={isGenerating || !generatedResume}
                  className="w-full flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share Resume</span>
                </button>
              </div>
            </div>

            {/* Edit Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Edit3 className="h-5 w-5 mr-2 text-purple-600" />
                Customize
              </h3>
              <div className="space-y-3">
                <button
                  onClick={onBack}
                  className="w-full flex items-center justify-center space-x-2 border-2 border-indigo-600 text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-semibold"
                >
                  <Edit3 className="h-5 w-5" />
                  <span>Edit Information</span>
                </button>
                
                <button
                  onClick={onRegenerate}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center space-x-2 border-2 border-purple-600 text-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Regenerate with AI</span>
                </button>
              </div>
            </div>

            {/* Resume Analysis */}
            {resumeAnalysis && (
              <ResumeAnalyzer
                atsScore={resumeAnalysis.atsScore}
                keywordScore={resumeAnalysis.keywordScore}
                readabilityScore={resumeAnalysis.readabilityScore}
                suggestions={resumeAnalysis.suggestions}
              />
            )}

            {/* Interview Tips */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-green-600" />
                Interview Success Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span><strong>Quantify achievements:</strong> Use specific numbers and percentages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span><strong>Action verbs:</strong> Start bullet points with powerful action words</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span><strong>Keywords:</strong> Match job description terminology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span><strong>Format:</strong> Keep consistent spacing and alignment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span><strong>Length:</strong> 1-2 pages maximum for most roles</span>
                </li>
              </ul>
            </div>

            {/* ATS Optimization */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                ATS Optimization
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Keyword Density</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {resumeAnalysis?.keywordScore || 80}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${resumeAnalysis?.keywordScore || 80}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Your resume is optimized for Applicant Tracking Systems (ATS) used by most companies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;