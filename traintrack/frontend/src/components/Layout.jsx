import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Train, Search, Heart, LayoutDashboard, User, LogOut, Navigation, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Tracking', path: '/track/live', icon: Navigation },
    { name: 'Favorites', path: '/favorites', icon: Heart },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-[60] p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 active:scale-90 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={cn(
        "fixed left-0 top-0 h-full w-20 md:w-72 glass border-r border-white/5 z-50 flex flex-col transition-all duration-500 ease-out",
        isOpen ? "translate-x-0 w-full" : "max-md:-translate-x-full"
      )}>
        <div className="p-8 flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900 p-3 rounded-2xl border border-white/10">
              <Train className="text-primary w-6 h-6" />
            </div>
          </div>
          <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tighter">
            TrainTrack
          </span>
        </div>

        <div className="flex-1 px-6 py-8 space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group overflow-hidden",
                  isActive 
                    ? "bg-white/5 text-white" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10",
                  isActive ? "text-primary" : "group-hover:text-primary"
                )} />
                <span className="font-bold relative z-10 tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-white/5 space-y-3">
          {user ? (
            <div className="space-y-2">
              <Link
                to="/profile"
                className={cn(
                  "flex items-center gap-4 px-5 py-3 rounded-2xl transition-all hover:bg-white/5 group",
                  location.pathname === '/profile' ? "text-white" : "text-slate-400"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-black text-white">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-sm truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium User</p>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-4 px-5 py-3 rounded-2xl transition-all text-slate-400 hover:text-red-400 hover:bg-red-500/5 group w-full text-left"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 text-white hover:bg-primary transition-all font-bold"
            >
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 min-h-screen">
        <section className="p-4 md:p-10 pt-20 md:pt-10 max-w-7xl mx-auto w-full">
          {children}
        </section>
      </main>
    </>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-cosmic-gradient selection:bg-primary/30 selection:text-white">
      <Navbar />
    </div>
  );
};

export default Layout;

