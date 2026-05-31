import React, { useState } from 'react';
import { Globe, Palette, Layout, Code, Image, Save, Eye, Download } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

interface PortfolioBuilderProps {
  user: User | null;
  profile: Profile | null;
}

const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ user, profile }) => {
  const [portfolioData, setPortfolioData] = useState({
    theme: 'modern',
    layout: 'single-page',
    colorScheme: 'blue',
    sections: {
      about: true,
      experience: true,
      projects: true,
      skills: true,
      contact: true
    },
    projects: [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        image: '',
        link: 'https://example.com',
        github: 'https://github.com/example'
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('design');

  const themes = [
    { id: 'modern', name: 'Modern', description: 'Clean, contemporary design' },
    { id: 'creative', name: 'Creative', description: 'Bold, artistic layout' },
    { id: 'minimal', name: 'Minimal', description: 'Simple, elegant design' },
    { id: 'dark', name: 'Dark', description: 'Dark theme with highlights' }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Blue', colors: ['#3B82F6', '#1E40AF'] },
    { id: 'purple', name: 'Purple', colors: ['#8B5CF6', '#6D28D9'] },
    { id: 'green', name: 'Green', colors: ['#10B981', '#047857'] },
    { id: 'orange', name: 'Orange', colors: ['#F59E0B', '#D97706'] }
  ];

  const layouts = [
    { id: 'single-page', name: 'Single Page', description: 'Everything on one scrollable page' },
    { id: 'multi-page', name: 'Multi Page', description: 'Separate pages for each section' },
    { id: 'card-based', name: 'Card Based', description: 'Card-style sections' }
  ];

  const updatePortfolioData = (field: string, value: any) => {
    setPortfolioData({ ...portfolioData, [field]: value });
  };

  const toggleSection = (section: string) => {
    setPortfolioData({
      ...portfolioData,
      sections: {
        ...portfolioData.sections,
        [section]: !portfolioData.sections[section as keyof typeof portfolioData.sections]
      }
    });
  };

  const renderDesignTab = () => (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => updatePortfolioData('theme', theme.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                portfolioData.theme === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <Layout className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{theme.name}</h4>
                  <p className="text-sm text-slate-600">{theme.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Color Scheme</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colorSchemes.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => updatePortfolioData('colorScheme', scheme.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                portfolioData.colorScheme === scheme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: scheme.colors[0] }}
                ></div>
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: scheme.colors[1] }}
                ></div>
              </div>
              <p className="text-sm font-medium text-slate-900">{scheme.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Options */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Layout Style</h3>
        <div className="space-y-3">
          {layouts.map((layout) => (
            <label key={layout.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="layout"
                value={layout.id}
                checked={portfolioData.layout === layout.id}
                onChange={(e) => updatePortfolioData('layout', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-slate-900">{layout.name}</p>
                <p className="text-sm text-slate-600">{layout.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSectionsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Portfolio Sections</h3>
      
      <div className="space-y-4">
        {Object.entries(portfolioData.sections).map(([section, enabled]) => (
          <div key={section} className="flex items-center justify-between p-4 bg-white/40 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900 capitalize">{section}</h4>
              <p className="text-sm text-slate-600">
                {section === 'about' && 'Personal introduction and background'}
                {section === 'experience' && 'Work history and achievements'}
                {section === 'projects' && 'Portfolio projects and case studies'}
                {section === 'skills' && 'Technical and soft skills'}
                {section === 'contact' && 'Contact information and social links'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleSection(section)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Portfolio Projects</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Globe className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {portfolioData.projects.map((project) => (
          <div key={project.id} className="bg-white/40 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="Project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Live Demo URL</label>
                <input
                  type="url"
                  value={project.link}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={project.description}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Describe your project..."
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Technologies Used</label>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-lg p-6 min-h-96">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {profile?.full_name || 'Your Name'}
        </h1>
        <p className="text-lg text-blue-600">{profile?.professional_title || 'Professional Title'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">About Me</h2>
          <p className="text-slate-600 mb-6">
            {profile?.summary || 'Your professional summary will appear here...'}
          </p>
          
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact</h2>
          <div className="space-y-2 text-slate-600">
            <p>{profile?.email}</p>
            <p>{profile?.phone}</p>
            <p>{profile?.location}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Featured Projects</h2>
          <div className="space-y-4">
            {portfolioData.projects.map((project) => (
              <div key={project.id} className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">{project.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'sections', label: 'Sections', icon: Layout },
    { id: 'projects', label: 'Projects', icon: Code }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Portfolio Builder</h1>
        <p className="text-slate-600">Create a stunning portfolio website to showcase your work</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6 sticky top-24">
            <nav className="space-y-2 mb-6">
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
            
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-2 px-4 py-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </button>
              
              <button className="w-full flex items-center space-x-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                <Globe className="h-5 w-5" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 mb-6">
            {activeTab === 'design' && renderDesignTab()}
            {activeTab === 'sections' && renderSectionsTab()}
            {activeTab === 'projects' && renderProjectsTab()}
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Live Preview</h2>
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;