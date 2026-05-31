import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { signOut } from './lib/auth';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import CoverLetterBuilder from './components/CoverLetterBuilder';
import PortfolioBuilder from './components/PortfolioBuilder';
import JobMatcher from './components/JobMatcher';
import AIFeedback from './components/AIFeedback';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import LoadingSpinner from './components/LoadingSpinner';

type View = 'dashboard' | 'resume' | 'cover-letter' | 'portfolio' | 'job-matcher' | 'ai-feedback';

function App() {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
              <span className="text-2xl font-bold text-white">AI</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Resume Builder</h1>
            <p className="text-slate-600">Create professional resumes with AI-powered assistance</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8">
            <div className="space-y-4">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuthModal(true);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="w-full bg-white text-slate-700 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
              >
                Create Account
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Features:</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• AI-powered resume generation</li>
                <li>• Professional templates</li>
                <li>• Cover letter builder</li>
                <li>• Portfolio websites</li>
                <li>• Job matching</li>
                <li>• AI feedback & optimization</li>
              </ul>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />

        <Toaster position="top-right" />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'resume':
        return <ResumeBuilder user={user} profile={profile} />;
      case 'cover-letter':
        return <CoverLetterBuilder user={user} profile={profile} />;
      case 'portfolio':
        return <PortfolioBuilder user={user} profile={profile} />;
      case 'job-matcher':
        return <JobMatcher user={user} profile={profile} />;
      case 'ai-feedback':
        return <AIFeedback user={user} profile={profile} />;
      default:
        return <Dashboard onNavigate={setCurrentView} user={user} profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView}
        user={user}
        profile={profile}
        onSignOut={signOut}
      />
      <main className="pt-16">
        {renderCurrentView()}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;