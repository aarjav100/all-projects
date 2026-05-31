import { 
  BrainCircuit, 
  FileText, 
  Globe, 
  MessageSquare, 
  Target, 
  Zap,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Resume Generation",
    description: "Advanced AI analyzes your experience and creates tailored resumes for any job position.",
    highlights: ["ATS-optimized formatting", "Industry-specific keywords", "Professional templates"]
  },
  {
    icon: MessageSquare,
    title: "Smart Cover Letters",
    description: "Generate compelling cover letters that match your resume and target specific roles.",
    highlights: ["Personalized content", "Company research", "Tone matching"]
  },
  {
    icon: Globe,
    title: "Portfolio Websites",
    description: "Create stunning portfolio sites that showcase your work and professional brand.",
    highlights: ["Mobile responsive", "Custom domains", "SEO optimized"]
  },
  {
    icon: Target,
    title: "Job Matching AI",
    description: "Real-time job recommendations based on your skills, experience, and career goals.",
    highlights: ["Smart filtering", "Salary insights", "Application tracking"]
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your application success rate and get insights to improve your job search.",
    highlights: ["Application metrics", "Success predictions", "Market trends"]
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get AI-powered feedback on resume quality, formatting, and content optimization.",
    highlights: ["Grammar checking", "Impact scoring", "Improvement suggestions"]
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Land Your Dream Job</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with career expertise 
            to give you the competitive edge in today's job market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-elegant transition-smooth group">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gradient-primary rounded-xl group-hover:scale-110 transition-bounce">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;