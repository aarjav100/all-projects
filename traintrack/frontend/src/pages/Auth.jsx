import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Train, Mail, Lock, User, ArrowRight, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthCard = ({ title, subtitle, children, footer, type }) => (
  <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
    {/* Animated Background Orbs */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse"></div>
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '2s' }}></div>
    
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full max-w-md relative z-10"
    >
      <div className="text-center mb-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-900 border border-white/10 mb-6 shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Train className="w-10 h-10 text-primary relative z-10" />
        </motion.div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">{title}</h1>
        <p className="text-slate-500 font-bold tracking-tight">{subtitle}</p>
      </div>
      
      <div className="glass-card rounded-[3rem] p-10 border border-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        {children}
      </div>
      
      {footer && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-500 mt-8 font-black uppercase text-[10px] tracking-[0.2em]"
        >
          {footer}
        </motion.div>
      )}
    </motion.div>
  </div>
);

const InputField = ({ label, icon: Icon, type, placeholder, value, onChange, required }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <input 
        type={type} 
        required={required}
        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold text-white placeholder:text-slate-700"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Link rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Home" 
      subtitle="Re-establish your neural link to LunarTrack"
      footer={<>New explorer? <Link to="/signup" className="text-primary hover:text-white transition-colors">Initialize Access</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <InputField 
          label="Neural Identifier (Email)"
          icon={Mail}
          type="email"
          placeholder="explorer@lunartrack.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Key</label>
            <Link to="#" className="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors">Forgotten?</Link>
          </div>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input 
              type="password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold text-white placeholder:text-slate-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-black uppercase text-xs tracking-[0.3em] py-5 rounded-3xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-4 group disabled:opacity-70"
        >
          {loading ? (
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Syncing...
             </div>
          ) : (
            <>
              Establish Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>
    </AuthCard>
  );
};

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Initialization failed. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Create Identity" 
      subtitle="Join the global network of rail explorers"
      footer={<>Already linked? <Link to="/login" className="text-primary hover:text-white transition-colors">Establish Path</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <InputField 
          label="Explorer Name"
          icon={User}
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <InputField 
          label="Neural Identifier (Email)"
          icon={Mail}
          type="email"
          placeholder="explorer@lunartrack.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputField 
          label="Access Key (Password)"
          icon={Lock}
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <motion.button 
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-black uppercase text-xs tracking-[0.3em] py-5 rounded-3xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-4 group disabled:opacity-70"
        >
          {loading ? (
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Initializing...
             </div>
          ) : (
            <>
              Grant Access <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </motion.button>

        <div className="flex items-center gap-4 py-2">
           <div className="h-[1px] flex-1 bg-white/5"></div>
           <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Secure Link Active</p>
           <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>
        
        <div className="flex justify-center gap-6">
           <Zap className="w-4 h-4 text-primary opacity-20" />
           <ShieldCheck className="w-4 h-4 text-primary opacity-20" />
           <Train className="w-4 h-4 text-primary opacity-20" />
        </div>
      </form>
    </AuthCard>
  );
};
