import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserCheck, 
  BrainCircuit, 
  FileCheck, 
  Send,
  ArrowRight,
  Sparkles
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserCheck,
    title: "Share Your Details",
    description: "Tell us about your experience, skills, and career goals. Our AI analyzes your background.",
    color: "from-blue-500 to-blue-600"
  },
  {
    step: "02", 
    icon: BrainCircuit,
    title: "AI Creates Content",
    description: "Our advanced AI generates tailored resumes, cover letters, and portfolio content for your target roles.",
    color: "from-purple-500 to-purple-600"
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Review & Customize",
    description: "Review AI-generated content, make adjustments, and get instant feedback on improvements.",
    color: "from-green-500 to-green-600"
  },
  {
    step: "04",
    icon: Send,
    title: "Apply with Confidence",
    description: "Download professional documents and apply to jobs with AI-matched recommendations.",
    color: "from-orange-500 to-orange-600"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BrainCircuit className="h-4 w-4" />
            How It Works
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            From Profile to
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Perfect Resume</span>
            <br />in 4 Simple Steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process leverages AI to transform your career information 
            into professional documents that get results.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-gradient-card border-border shadow-card hover:shadow-elegant transition-smooth group h-full">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} mx-auto flex items-center justify-center group-hover:scale-110 transition-bounce`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" className="text-lg px-8">
            <Sparkles className="h-5 w-5" />
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;