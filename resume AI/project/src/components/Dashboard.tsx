import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Mail, 
  Globe, 
  Target, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Sparkles,
  Download,
  Eye,
  Heart,
  Plus
} from 'lucide-react';
import { getResumes, getCoverLetters } from '../lib/database';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

interface DashboardProps {
  onNavigate: (view: string) => void;
  user: User | null;
  profile: Profile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user, profile }) => {
  const [stats, setStats] = useState({
    resumes: 0,
    coverLetters: 0,
    portfolioViews: 247,
    jobMatches: 34
  });

  const [recentActivity, setRecentActivity] = useState([
    { action: 'Welcome to AI Resume Builder!', time: 'Just now', type: 'welcome' }
  ]);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const [resumes, coverLetters] = await Promise.all([
          getResumes(user.id),
          getCoverLetters(user.id)
        ]);

        setStats(prev => ({
          ...prev,
          resumes: resumes.length,
          coverLetters: coverLetters.length
        }));

        // Update recent activity based on actual data
        const activities = [];
        if (resumes.length > 0) {
          activities.push({
            action: `Updated ${resumes[0].title}`,
            time: '2 hours ago',
            type: 'resume'
          });
        }
        if (coverLetters.length > 0) {
          activities.push({
            action: `Created cover letter for ${coverLetters[0].company_name || 'a company'}`,
            time: '1 day ago',
            type: 'cover-letter'
          });
        }
        
        if (activities.length > 0) {
          setRecentActivity(activities);
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };

    loadStats();
  }, [user]);

  const statsDisplay = [
    { label: 'Resumes Created', value: stats.resumes.toString(), icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Cover Letters', value: stats.coverLetters.toString(), icon: Mail, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Portfolio Views', value: stats.portfolioViews.toString(), icon: Eye, color: 'from-purple-500 to-purple-600' },
    { label: 'Job Matches', value: stats.jobMatches.toString(), icon: Target, color: 'from-orange-500 to-orange-600' }
  ];

  const quickActions = [
    {
      id: 'resume',
      title: 'Create Resume',
      description: 'Build a professional resume with AI assistance',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      progress: stats.resumes > 0 ? 65 : 0
    },
    {
      id: 'cover-letter',
      title: 'Write Cover Letter',
      description: 'Generate tailored cover letters for specific jobs',
      icon: Mail,
      color: 'from-emerald-500 to-emerald-600',
      progress: stats.coverLetters > 0 ? 30 : 0
    },
    {
      id: 'portfolio',
      title: 'Build Portfolio',
      description: 'Create a stunning portfolio website',
      icon: Globe,
      color: 'from-purple-500 to-purple-600',
      progress: 15
    },
    {
      id: 'job-matcher',
      title: 'Find Jobs',
      description: 'Discover matching opportunities with AI',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      progress: 0
    }
  ];

  const achievements = [
    { title: 'First Resume', description: 'Created your first AI-powered resume', earned: stats.resumes > 0 },
    { title: 'Cover Letter Pro', description: 'Created your first cover letter', earned: stats.coverLetters > 0 },
    { title: 'Portfolio Master', description: 'Built a complete portfolio website', earned: false },
    { title: 'Job Hunter', description: 'Applied to 10 jobs through the platform', earned: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Career Builder'}! 
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Ready to take your career to the next level? Let's build something amazing together.
            </p>
            <button
              onClick={() => onNavigate('resume')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Start Building</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="p-4 rounded-lg border border-slate-200/50 hover:border-slate-300/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{action.description}</p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${action.color} transition-all duration-300`}
                          style={{ width: `${action.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/40 transition-colors duration-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 1 && recentActivity[0].type === 'welcome' && (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 mb-4">Start creating to see your activity here</p>
                  <button
                    onClick={() => onNavigate('resume')}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Your First Resume</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg">
                  <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-yellow-100' : 'bg-slate-100'}`}>
                    <Award className={`h-5 w-5 ${achievement.earned ? 'text-yellow-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${achievement.earned ? 'text-slate-900' : 'text-slate-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-slate-600">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;