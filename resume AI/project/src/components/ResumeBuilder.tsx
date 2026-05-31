import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Download, Eye, Sparkles, FileText, Award, Briefcase } from 'lucide-react';
import { 
  createResume, 
  getResumes, 
  updateResume,
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
  createEducation,
  getEducations,
  updateEducation,
  deleteEducation,
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  updateProfile,
  generateContent
} from '../lib/database';
import { generatePDF } from '../lib/pdf';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import toast from 'react-hot-toast';
import type { User } from '@supabase/supabase-js';
import type { Profile, Resume, Experience, Education, Skill } from '../lib/supabase';

interface ResumeBuilderProps {
  user: User | null;
  profile: Profile | null;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ user, profile }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    professional_title: profile?.professional_title || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    summary: profile?.summary || ''
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: Award },
    { id: 'skills', label: 'Skills', icon: Sparkles }
  ];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        professional_title: profile.professional_title || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        summary: profile.summary || ''
      });
    }
  }, [profile]);

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [resumesData, experiencesData, educationsData, skillsData] = await Promise.all([
        getResumes(user.id),
        getExperiences(user.id),
        getEducations(user.id),
        getSkills(user.id)
      ]);

      setResumes(resumesData);
      setExperiences(experiencesData);
      setEducations(educationsData);
      setSkills(skillsData);

      // Set current resume to the first one or create a new one
      if (resumesData.length > 0) {
        setCurrentResume(resumesData[0]);
      } else {
        const newResume = await createResume(user.id, 'My Resume');
        setCurrentResume(newResume);
        setResumes([newResume]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (field: string, value: string) => {
    if (!user) return;

    const updatedData = { ...profileData, [field]: value };
    setProfileData(updatedData);

    try {
      await updateProfile(user.id, { [field]: value });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleGenerateContent = async (section: string) => {
    if (!user || !profile) return;

    try {
      setIsLoading(true);
      const content = await generateContent(profile, section);
      
      if (section === 'summary') {
        handleProfileUpdate('summary', content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExperience = async () => {
    if (!user || !currentResume) return;

    try {
      const newExperience = await createExperience(user.id, {
        resume_id: currentResume.id,
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        sort_order: experiences.length
      });
      setExperiences([...experiences, newExperience]);
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const handleUpdateExperience = async (id: string, field: string, value: any) => {
    try {
      const updatedExperience = await updateExperience(id, { [field]: value });
      setExperiences(experiences.map(exp => exp.id === id ? updatedExperience : exp));
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleAddEducation = async () => {
    if (!user || !currentResume) return;

    try {
      const newEducation = await createEducation(user.id, {
        resume_id: currentResume.id,
        degree: '',
        school: '',
        location: '',
        graduation_date: '',
        gpa: '',
        description: '',
        sort_order: educations.length
      });
      setEducations([...educations, newEducation]);
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  const handleUpdateEducation = async (id: string, field: string, value: any) => {
    try {
      const updatedEducation = await updateEducation(id, { [field]: value });
      setEducations(educations.map(edu => edu.id === id ? updatedEducation : edu));
    } catch (error) {
      console.error('Error updating education:', error);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await deleteEducation(id);
      setEducations(educations.filter(edu => edu.id !== id));
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!user || !currentResume) return;

    try {
      const newSkill = await createSkill(user.id, {
        resume_id: currentResume.id,
        name: '',
        category: 'Technical',
        proficiency_level: 'Intermediate',
        sort_order: skills.length
      });
      setSkills([...skills, newSkill]);
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleUpdateSkill = async (id: string, field: string, value: any) => {
    try {
      const updatedSkill = await updateSkill(id, { [field]: value });
      setSkills(skills.map(skill => skill.id === id ? updatedSkill : skill));
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter(skill => skill.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF('resume-preview', `${profileData.full_name || 'resume'}.pdf`);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.full_name}
            onChange={(e) => handleProfileUpdate('full_name', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Professional Title</label>
          <input
            type="text"
            value={profileData.professional_title}
            onChange={(e) => handleProfileUpdate('professional_title', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            placeholder="Software Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => handleProfileUpdate('email', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleProfileUpdate('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => handleProfileUpdate('location', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">Professional Summary</label>
          <button
            onClick={() => handleGenerateContent('summary')}
            disabled={isLoading}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? 'Generating...' : 'AI Generate'}</span>
          </button>
        </div>
        <textarea
          value={profileData.summary}
          onChange={(e) => handleProfileUpdate('summary', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          placeholder="A brief summary of your professional background and key achievements..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Work Experience</h3>
        <button
          onClick={handleAddExperience}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>
      
      {experiences.map((exp) => (
        <div key={exp.id} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-slate-900">Experience Entry</h4>
            <button
              onClick={() => handleDeleteExperience(exp.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={exp.title}
              onChange={(e) => handleUpdateExperience(exp.id, 'title', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="Job Title"
            />
            <input
              type="text"
              value={exp.company}
              onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="Company Name"
            />
            <input
              type="text"
              value={exp.location || ''}
              onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="Location"
            />
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={exp.start_date || ''}
                onChange={(e) => handleUpdateExperience(exp.id, 'start_date', e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={exp.end_date || ''}
                onChange={(e) => handleUpdateExperience(exp.id, 'end_date', e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                disabled={exp.is_current}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exp.is_current}
                onChange={(e) => handleUpdateExperience(exp.id, 'is_current', e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">I currently work here</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
            <textarea
              value={exp.description || ''}
              onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="Describe your key responsibilities and achievements..."
            />
          </div>
        </div>
      ))}
      
      {experiences.length === 0 && (
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No work experience added yet</p>
          <button
            onClick={handleAddExperience}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Experience
          </button>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Education</h3>
        <button
          onClick={handleAddEducation}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>
      
      {educations.map((edu) => (
        <div key={edu.id} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-slate-900">Education Entry</h4>
            <button
              onClick={() => handleDeleteEducation(edu.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
            />
            <input
              type="text"
              value={edu.school}
              onChange={(e) => handleUpdateEducation(edu.id, 'school', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="School Name"
            />
            <input
              type="text"
              value={edu.location || ''}
              onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="Location"
            />
            <input
              type="date"
              value={edu.graduation_date || ''}
              onChange={(e) => handleUpdateEducation(edu.id, 'graduation_date', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              value={edu.gpa || ''}
              onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="GPA (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Details</label>
            <textarea
              value={edu.description || ''}
              onChange={(e) => handleUpdateEducation(edu.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="Relevant coursework, achievements, honors..."
            />
          </div>
        </div>
      ))}
      
      {educations.length === 0 && (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No education added yet</p>
          <button
            onClick={handleAddEducation}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your Education
          </button>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
        <button
          onClick={handleAddSkill}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-slate-900">Skill</h4>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleUpdateSkill(skill.id, 'name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Skill name"
              />
              
              <select
                value={skill.proficiency_level}
                onChange={(e) => handleUpdateSkill(skill.id, 'proficiency_level', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              
              <select
                value={skill.category}
                onChange={(e) => handleUpdateSkill(skill.id, 'category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="Technical">Technical</option>
                <option value="Languages">Languages</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      
      {skills.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No skills added yet</p>
          <button
            onClick={handleAddSkill}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your Skills
          </button>
        </div>
      )}
    </div>
  );

  const userProfileData = {
    ...profileData,
    experiences,
    educations,
    skills
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Resume Builder</h1>
        <p className="text-slate-600">Create a professional resume with AI-powered suggestions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6 sticky top-24">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="w-full flex items-center space-x-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Templates</span>
              </button>
              
              <button
                onClick={() => setShowPreview(true)}
                className="w-full flex items-center space-x-2 px-4 py-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors mt-2"
              >
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8">
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'experience' && renderExperience()}
            {activeTab === 'education' && renderEducation()}
            {activeTab === 'skills' && renderSkills()}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button className="flex items-center space-x-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <Save className="h-5 w-5" />
              <span>Auto-saved</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </button>
              
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Resume Preview Modal */}
      {showPreview && (
        <ResumePreview
          userProfile={userProfileData}
          template={selectedTemplate}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;