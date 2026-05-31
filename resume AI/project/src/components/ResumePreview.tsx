import React from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { generatePDF } from '../lib/pdf';
import toast from 'react-hot-toast';

interface ResumePreviewProps {
  userProfile: any;
  template: string;
  onClose: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ userProfile, template, onClose }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF('resume-preview', `${userProfile.full_name || 'resume'}.pdf`);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const renderModernTemplate = () => (
    <div id="resume-preview" className="bg-white p-8 shadow-lg min-h-[11in] w-[8.5in] mx-auto">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {userProfile.full_name || 'Your Name'}
        </h1>
        <p className="text-xl text-blue-600 font-medium mb-4">
          {userProfile.professional_title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {userProfile.email && <span>{userProfile.email}</span>}
          {userProfile.phone && <span>{userProfile.phone}</span>}
          {userProfile.location && <span>{userProfile.location}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {userProfile.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed">{userProfile.summary}</p>
        </div>
      )}

      {/* Experience */}
      {userProfile.experiences && userProfile.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {userProfile.experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                {exp.description && (
                  <div className="mt-2 text-slate-700 text-sm whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {userProfile.educations && userProfile.educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {userProfile.educations.map((edu: any) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                  <p className="text-blue-600">{edu.school}</p>
                  {edu.gpa && <p className="text-sm text-slate-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-right text-sm text-slate-600">
                  <p>{formatDate(edu.graduation_date)}</p>
                  <p>{edu.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {userProfile.skills && userProfile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {['Technical', 'Languages', 'Soft Skills', 'Tools'].map((category) => {
              const categorySkills = userProfile.skills.filter((skill: any) => skill.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="font-semibold text-slate-900 mb-2">{category}</h3>
                  <div className="space-y-1">
                    {categorySkills.map((skill: any) => (
                      <div key={skill.id} className="flex justify-between items-center">
                        <span className="text-slate-700">{skill.name}</span>
                        <span className="text-xs text-slate-500">{skill.proficiency_level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Resume Preview</h2>
            <p className="text-slate-600">Modern Template</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="transform scale-75 origin-top">
            {renderModernTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;