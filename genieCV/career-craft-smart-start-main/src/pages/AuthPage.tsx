import React from 'react';
import AuthForm from "@/components/auth/AuthForm";
import { BrainCircuit, Sparkles, Users, Award, TrendingUp } from "lucide-react";

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>

      {/* Right Side - Branding & Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center p-12 max-w-lg">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CareerCraft</h1>
                <p className="text-primary-foreground/80">AI Resume Builder</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Build Your Dream Career with AI
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Create professional resumes, cover letters, and portfolio sites in minutes. 
              Join thousands of successful professionals.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI-Powered Generation</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Advanced AI creates tailored resumes for any job position
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">50K+ Professionals</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Join our community of successful career builders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">95% Success Rate</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Our users land interviews 3x faster than average
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Feedback</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Get instant AI feedback and job matching recommendations
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
            <blockquote className="text-primary-foreground/90 mb-4">
              "CareerCraft helped me land my dream job in tech. The AI-generated resume 
              was perfectly tailored and got me interviews at top companies!"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">SC</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Sarah Chen</p>
                <p className="text-primary-foreground/70 text-xs">Software Engineer at Google</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-40 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
      </div>
    </div>
  );
};

export default AuthPage;