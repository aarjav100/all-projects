import { Link, useLocation } from 'react-router-dom';
import { Bell, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TopHeader() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 safe-area-top">
      <div className="mx-auto max-w-lg px-4 py-3">
        <div className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between shadow-soft">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">Vibe</span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link to="/notifications">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-xl h-10 w-10 transition-colors",
                  location.pathname === '/notifications' && "bg-primary/10 text-primary"
                )}
              >
                <Bell className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/messages">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-xl h-10 w-10 transition-colors",
                  location.pathname === '/messages' && "bg-primary/10 text-primary"
                )}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}