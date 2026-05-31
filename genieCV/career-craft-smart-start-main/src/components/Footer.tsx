import { BrainCircuit, Twitter, Linkedin, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BrainCircuit className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">CareerCraft</h3>
                <p className="text-xs text-muted-foreground">AI Resume Builder</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Empowering professionals worldwide with AI-powered career tools. 
              Build your future with confidence.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Resume Builder</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Cover Letters</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Portfolio Sites</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Job Matching</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Templates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Career Tips</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Interview Guide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Salary Insights</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Industry Trends</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 CareerCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-smooth">Privacy</a>
            <a href="#" className="hover:text-foreground transition-smooth">Terms</a>
            <a href="#" className="hover:text-foreground transition-smooth">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;