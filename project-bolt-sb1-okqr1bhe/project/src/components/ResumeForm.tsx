import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2, User, Briefcase, GraduationCap, Star, Award, Globe } from 'lucide-react';
import { UserData, PersonalInfo, Experience, Education } from '../types/resume';
import TemplateSelector from './TemplateSelector';
import { ResumeTemplate } from '../utils/resumeGenerator';

interface ResumeFormProps {
  onSubmit: (data: UserData) => void;
  onBack: () => void;
  selectedTemplate: ResumeTemplate;
  onTemplateSelect: (template: ResumeTemplate) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmit, onBack, selectedTemplate, onTemplateSelect }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<UserData>({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [{
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: ['']
    }],
    education: [{
      degree: '',
      field: '',
      institution: '',
      year: '',
      gpa: ''
    }],
    skills: [''],
    certifications: [''],
    languages: ['']
  });

  const sections = [
    { title: 'Template & Personal Info', icon: User },
    { title: 'Professional Summary', icon: Star },
    { title: 'Work Experience', icon: Briefcase },
    { title: 'Education', icon: GraduationCap },
    { title: 'Skills & More', icon: Award }
  ];

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: ['']
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        field: '',
        institution: '',
        year: '',
        gpa: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field: 'skills' | 'certifications' | 'languages', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'skills' | 'certifications' | 'languages') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'skills' | 'certifications' | 'languages', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Clean up empty fields
    const cleanedData = {
      ...formData,
      skills: formData.skills.filter(skill => skill.trim() !== ''),
      certifications: formData.certifications.filter(cert => cert.trim() !== ''),
      languages: formData.languages.filter(lang => lang.trim() !== '')
    };
    onSubmit(cleanedData);
  };

  const renderTemplateAndPersonalInfo = () => (
    <div className="space-y-8">
      {/* Template Selection */}
      <TemplateSelector 
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />
      
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
              <input
                type="text"
                value={formData.personalInfo.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Senior Software Engineer"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={formData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="New York, NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
              <input
                type="url"
                value={formData.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://linkedin.com/in/johnsmith"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
            <input
              type="url"
              value={formData.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://johnsmith.dev"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary *</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Write a compelling summary of your professional experience, key skills, and career objectives. Keep it concise and impactful (2-3 sentences)."
        />
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">✨ AI Enhancement Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Focus on your most relevant achievements and quantifiable results</li>
          <li>• Mention specific skills and years of experience in your field</li>
          <li>• Include industry keywords that match your target job descriptions</li>
          <li>• Our AI will automatically enhance your language with powerful action verbs</li>
        </ul>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {formData.experience.map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Experience {index + 1}</h3>
            {formData.experience.length > 1 && (
              <button
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Tech Corp"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Jan 2020"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="text"
                value={exp.endDate}
                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Present"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(index, 'description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              placeholder="Describe your role, responsibilities, and key achievements. Focus on quantifiable results and impact. Our AI will enhance this with powerful action verbs."
            />
          </div>
        </div>
      ))}
      
      <button
        onClick={addExperience}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus className="h-5 w-5" />
        <span>Add Another Experience</span>
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {formData.education.map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Education {index + 1}</h3>
            {formData.education.length > 1 && (
              <button
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study *</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Computer Science"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Stanford University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year *</label>
              <input
                type="text"
                value={edu.year}
                onChange={(e) => updateEducation(index, 'year', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="2020"
              />
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={addEducation}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus className="h-5 w-5" />
        <span>Add Another Education</span>
      </button>
    </div>
  );

  const renderSkillsAndMore = () => (
    <div className="space-y-8">
      {/* Skills */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
        <div className="space-y-3">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateArrayField('skills', index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="JavaScript, React, Node.js"
              />
              {formData.skills.length > 1 && (
                <button
                  onClick={() => removeArrayField('skills', index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addArrayField('skills')}
            className="text-indigo-600 hover:text-indigo-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          💡 Our AI will automatically categorize your skills (Programming Languages, Frameworks, Tools, etc.)
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
        <div className="space-y-3">
          {formData.certifications.map((cert, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={cert}
                onChange={(e) => updateArrayField('certifications', index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="AWS Solutions Architect"
              />
              {formData.certifications.length > 1 && (
                <button
                  onClick={() => removeArrayField('certifications', index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addArrayField('certifications')}
            className="text-indigo-600 hover:text-indigo-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Certification</span>
          </button>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
        <div className="space-y-3">
          {formData.languages.map((lang, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={lang}
                onChange={(e) => updateArrayField('languages', index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="English (Native), Spanish (Fluent)"
              />
              {formData.languages.length > 1 && (
                <button
                  onClick={() => removeArrayField('languages', index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addArrayField('languages')}
            className="text-indigo-600 hover:text-indigo-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Language</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: return renderTemplateAndPersonalInfo();
      case 1: return renderSummary();
      case 2: return renderExperience();
      case 3: return renderEducation();
      case 4: return renderSkillsAndMore();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create Your Resume</h1>
            <div className="text-sm text-gray-500">
              Step {currentSection + 1} of {sections.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === currentSection
                      ? 'bg-indigo-600 text-white'
                      : index < currentSection
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center">{section.title}</span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {sections[currentSection].title}
          </h2>
          {renderCurrentSection()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>
          
          {currentSection < sections.length - 1 ? (
            <button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <span>Generate Resume</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;