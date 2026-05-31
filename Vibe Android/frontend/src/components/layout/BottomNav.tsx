import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/create', icon: Plus, label: 'Create', isCreate: true },
  { href: '/communities', icon: Users, label: 'Community' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="mx-auto max-w-lg px-4 pb-4 pt-2">
        <div className="glass-strong rounded-2xl px-2 py-2 shadow-soft-lg">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              if (item.isCreate) {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow transition-transform group-hover:scale-105 group-active:scale-95">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </Link>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center w-16 py-2 rounded-xl transition-all',
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className={cn(
                    "text-[10px] mt-1 font-medium transition-opacity",
                    isActive ? "opacity-100" : "opacity-70"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}