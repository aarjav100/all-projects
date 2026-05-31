import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Eye, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CoverLetterBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    jobDescription: '',
    yourName: '',
    yourEmail: '',
    yourPhone: '',
    content: '',
    tone: 'professional'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateWithAI = async () => {
    if (!formData.jobTitle || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in the job title and company name first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const aiGeneratedContent = `Dear ${formData.hiringManager || 'Hiring Manager'},

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. With my background and passion for this field, I am confident that I would be a valuable addition to your team.

In my previous roles, I have developed expertise that aligns perfectly with the requirements for this position. I am particularly drawn to ${formData.companyName} because of your reputation for innovation and commitment to excellence.

I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's continued success. Thank you for considering my application.

Sincerely,
${formData.yourName || '[Your Name]'}`;

      setFormData(prev => ({ ...prev, content: aiGeneratedContent }));
      setIsGenerating(false);
      
      toast({
        title: "Cover Letter Generated!",
        description: "AI has created your personalized cover letter. Review and customize as needed.",
      });
    }, 3000);
  };

  const downloadLetter = () => {
    toast({
      title: "Download Started",
      description: "Your cover letter is being prepared for download.",
    });
  };

  const previewLetter = () => {
    if (!formData.content) {
      toast({
        title: "No Content",
        description: "Please generate or write your cover letter content first.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Preview Ready",
      description: "Opening cover letter preview...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cover Letter Builder</h1>
              <p className="text-muted-foreground">Create compelling cover letters</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={previewLetter}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="hero" onClick={downloadLetter}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="bg-gradient-card shadow-elegant">
            <CardHeader>
              <CardTitle>Job & Company Details</CardTitle>
              <CardDescription>Provide details about the position you're applying for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Tech Company Inc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hiringManager">Hiring Manager Name</Label>
                <Input
                  id="hiringManager"
                  value={formData.hiringManager}
                  onChange={(e) => handleInputChange('hiringManager', e.target.value)}
                  placeholder="John Doe (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Writing Tone</Label>
                <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  placeholder="Paste the job description here to help AI create a more targeted cover letter..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={generateWithAI} 
                disabled={isGenerating}
                className="w-full"
                variant="secondary"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Generating with AI...
                  </div>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="bg-gradient-card shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cover Letter Content</CardTitle>
                  <CardDescription>Write or customize your cover letter</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={generateWithAI}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Enhance
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yourName">Your Name</Label>
                  <Input
                    id="yourName"
                    value={formData.yourName}
                    onChange={(e) => handleInputChange('yourName', e.target.value)}
                    placeholder="Your Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yourEmail">Your Email</Label>
                  <Input
                    id="yourEmail"
                    type="email"
                    value={formData.yourEmail}
                    onChange={(e) => handleInputChange('yourEmail', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yourPhone">Your Phone</Label>
                  <Input
                    id="yourPhone"
                    value={formData.yourPhone}
                    onChange={(e) => handleInputChange('yourPhone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Cover Letter Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder={formData.content || "Write your cover letter here or use the AI generator to get started..."}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Save Draft
                </Button>
                <Button variant="secondary" className="flex-1">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="bg-gradient-card shadow-elegant mt-6">
          <CardHeader>
            <CardTitle>Cover Letter Tips</CardTitle>
            <CardDescription>Make your cover letter stand out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Personalize</h4>
                <p className="text-muted-foreground">Research the company and mention specific details that show you've done your homework.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Show Value</h4>
                <p className="text-muted-foreground">Focus on what you can bring to the company, not just what you want from them.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Keep it Concise</h4>
                <p className="text-muted-foreground">Aim for 3-4 paragraphs that are clear, direct, and compelling.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;