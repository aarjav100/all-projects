import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Award, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                AI-Powered Career Tools
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Build Your
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Dream Career</span>
                <br />
                with AI
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Create professional resumes, cover letters, and portfolio sites in minutes. 
                Get AI-powered feedback and real-time job matching to land your next role.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8">
                <Sparkles className="h-5 w-5" />
                Start Building Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">50K+ professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">95% success rate</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">3x faster hiring</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-20 blur-3xl"></div>
            <div className="relative bg-gradient-card rounded-3xl p-8 shadow-elegant">
              <img 
                src={heroImage} 
                alt="AI Resume Builder Interface" 
                className="w-full rounded-2xl shadow-card"
              />
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium shadow-button">
                <Sparkles className="h-4 w-4 inline mr-2" />
                AI Generated
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;