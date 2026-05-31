import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const benefits = [
  "Free to start - no credit card required",
  "Professional templates and designs", 
  "ATS-compatible formatting",
  "AI-powered content optimization",
  "Export to PDF, Word, and web formats"
];

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Ready to Get Started?
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Your Dream Job is Just
              <span className="bg-gradient-hero bg-clip-text text-transparent"> One Click Away</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of professionals who've accelerated their careers with AI-powered 
              resume building. Start creating your perfect resume today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-8 shadow-elegant">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Start Building Now</h3>
                  <p className="text-muted-foreground">
                    Create your first AI-powered resume in less than 5 minutes
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Button variant="hero" size="lg" className="w-full text-lg">
                    <Sparkles className="h-5 w-5" />
                    Create My Resume Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  
                  <Button variant="outline" size="lg" className="w-full">
                    View Sample Resumes
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  No spam, unsubscribe at any time. Your data is secure and private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;