import React from 'react';
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, FileText, Download, Sparkles, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Ready to craft your perfect resume? Let's get started.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-elegant hover:shadow-xl transition-smooth cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth">
                <BrainCircuit className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle>Create New Resume</CardTitle>
              <CardDescription>
                Generate a professional resume with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => navigate('/resume-builder')}
              >
                Start Creating
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elegant hover:shadow-xl transition-smooth cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle>Cover Letters</CardTitle>
              <CardDescription>
                Create compelling cover letters for any position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/cover-letter-builder')}
              >
                Write Letter
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elegant hover:shadow-xl transition-smooth cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth">
                <Download className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle>My Documents</CardTitle>
              <CardDescription>
                Access and download your created documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/documents')}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-elegant">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-foreground">3</span>
              </div>
              <p className="text-muted-foreground">Resumes Created</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elegant">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-foreground">85%</span>
              </div>
              <p className="text-muted-foreground">Profile Strength</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elegant">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-foreground">12</span>
              </div>
              <p className="text-muted-foreground">Job Matches</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest resume building activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Software Engineer Resume</p>
                  <p className="text-sm text-muted-foreground">Created 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Marketing Manager Cover Letter</p>
                  <p className="text-sm text-muted-foreground">Created yesterday</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;