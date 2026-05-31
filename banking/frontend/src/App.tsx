import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Shield, 
  CreditCard, 
  Users, 
  Phone, 
  Mail, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  Smartphone,
  MapPin,
  Clock,
  Star,
  Award,
  Globe,
  CheckCircle,
  Activity,
  Download,
  CheckSquare,
  BarChart3,
  MoreVertical,
  UserPlus,
  Database,
  Zap
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { validateEmailWithGemini, getFinancialAdvice } from './lib/gemini';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="floating-particle absolute w-2 h-2 bg-primary-400/30 rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
        }}
      />
    ))}
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, signIn, register, signOut, loading: authLoading } = useAuth();

  // Floating particles animation
  useEffect(() => {
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach((particle, index) => {
      const element = particle as HTMLElement;
      element.style.animationDelay = `${index * 0.5}s`;
      element.style.animationDuration = `${3 + Math.random() * 2}s`;
    });
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <FloatingParticles />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-primary-100">Loading SmartBank...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage signIn={signIn} signUp={register} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'realtime':
        return <Dashboard />;
      case 'transfer':
        return <TransferMoney />;
      case 'transactions':
        return <TransactionHistory />;
      case 'services':
        return <BankingServices />;
      case 'branches':
        return <BranchLocator />;
      case 'support':
        return <CustomerSupport />;
      case 'settings':
        return <Settings />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-hero-gradient relative overflow-hidden">
        <FloatingParticles />
        
        {/* Navigation */}
        <nav className="relative z-10 bg-black/20 backdrop-blur-md border-b border-primary-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold text-white">SmartBank</span>
              </div>
              <div className="hidden md:flex space-x-6">
                {['home', 'dashboard', 'realtime', 'transfer', 'transactions', 'services', 'branches', 'support', 'settings'].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/20'
                        : 'text-gray-300 hover:text-primary-300 hover:bg-primary-500/10'
                    }`}
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-primary-100">Welcome, {user?.fullName || 'User'}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all duration-200 border border-red-500/30"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10">
          {renderPage()}
        </main>
      </div>
    </>
  );
}

function AuthPage({ signIn, signUp }: { signIn: (email: string, password: string) => Promise<void>; signUp: (email: string, password: string, fullName: string) => Promise<void> }) {
  const { signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [geminiValidating, setGeminiValidating] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        await signInWithGoogle(credentialResponse.credential);
      } catch (error) {
        console.error('Google sign-in error:', error);
        alert('Google sign-in failed. Please try again.');
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign-in failed');
    alert('Google sign-in failed. Please try again.');
  };

  const handleGeminiSignIn = async () => {
    setLoading(true);
    try {
      // Demo: Auto-fill with test account for Gemini sign-in
      const testEmail = 'test@smartbank.com';
      const testPassword = 'Test123!';
      await signIn(testEmail, testPassword);
    } catch (error) {
      console.error('Gemini sign-in error:', error);
      alert('Gemini Sign-In: Please use the test account credentials or create a new account.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = async () => {
    if (email && !isLogin) {
      setGeminiValidating(true);
      const isValid = await validateEmailWithGemini(email);
      setEmailValid(isValid);
      setGeminiValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-primary-500/20 shadow-2xl shadow-primary-500/10">
          <div className="text-center mb-8">
            <Building2 className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">SmartBank</h1>
            <p className="text-secondary-200">Your Digital Banking Partner</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-secondary-200 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-primary-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailValid(null);
                  }}
                  onBlur={handleEmailBlur}
                  className={`w-full px-4 py-3 bg-black/30 border ${
                    emailValid === false ? 'border-red-500/50' : 
                    emailValid === true ? 'border-green-500/50' : 
                    'border-primary-500/30'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="Enter your email"
                  required
                />
                {geminiValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-400"></div>
                  </div>
                )}
                {emailValid === true && !geminiValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                )}
              </div>
              {emailValid === true && (
                <p className="text-xs text-green-400 mt-1 flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Validated by Gemini AI
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-primary-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/25 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/20 text-secondary-200">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              width="384"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          {/* Gemini Sign-In Button */}
          <button
            onClick={handleGeminiSignIn}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>Sign in with Gemini AI</span>
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-300 hover:text-secondary-200 transition-colors duration-200"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-300">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Security Notice</span>
            </div>
            <p className="text-xs text-yellow-200 mt-1">
              SmartBank will never ask for your password via email or phone. Always verify the URL before entering your credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Building2 className="h-20 w-20 text-primary-400 mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">SmartBank</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Your Digital Banking Partner for Financial Growth and Prosperity
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25 flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage('branches')}
              className="bg-black/20 backdrop-blur-md border border-primary-500/30 text-primary-300 font-semibold py-4 px-8 rounded-xl hover:bg-primary-500/10 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <MapPin className="h-5 w-5" />
              <span>Find Branches</span>
            </button>
          </div>

          {/* Key Services */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Shield, title: 'Secure Payments', desc: 'Bank-grade security for all transactions' },
              { icon: TrendingUp, title: 'Account Growth', desc: 'Watch your savings grow with competitive rates' },
              { icon: CreditCard, title: 'Loans & Credit', desc: 'Flexible lending solutions for your needs' },
              { icon: Users, title: '24/7 Support', desc: 'Round-the-clock customer assistance' }
            ].map((service, index) => (
              <div key={index} className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20 hover:border-primary-500/40 transition-all duration-200 group">
                <service.icon className="h-12 w-12 text-primary-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-secondary-200 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">8+</div>
              <div className="text-secondary-200">Branch Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">25+</div>
              <div className="text-secondary-200">Banking Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">100K+</div>
              <div className="text-secondary-200">Satisfied Customers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [geminiAdvice, setGeminiAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  const getAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const advice = await getFinancialAdvice('I want to save more money and invest wisely');
      setGeminiAdvice(advice);
    } catch (error) {
      setGeminiAdvice('Unable to fetch advice at this time.');
    } finally {
      setLoadingAdvice(false);
    }
  };
  
  // Mock data for the dashboard
  const stats = [
    { title: 'Total Balance', value: '$30,200', icon: DollarSign, color: 'bg-gradient-to-br from-orange-400 to-orange-500', change: '+12.5%' },
    { title: 'Transactions', value: '290+', icon: Activity, color: 'bg-gradient-to-br from-green-400 to-green-500', change: '+8.2%' },
    { title: 'Tasks Completed', value: '145', icon: CheckSquare, color: 'bg-gradient-to-br from-pink-400 to-pink-500', change: '+15.3%' },
    { title: 'Downloads', value: '500', icon: Download, color: 'bg-gradient-to-br from-primary-400 to-primary-500', change: '+23.1%' },
  ];

  const applications = [
    { name: 'Savings Account', type: 'Premium Plan', sales: 16300, avgPrice: 53, total: 15652, trend: 'up' },
    { name: 'Credit Card', type: 'Gold Tier', sales: 26421, avgPrice: 35, total: 18785, trend: 'down' },
    { name: 'Investment', type: 'Portfolio Pro', sales: 8265, avgPrice: 98, total: 9652, trend: 'down' },
    { name: 'Loan Services', type: 'Fast Track', sales: 10652, avgPrice: 20, total: 7856, trend: 'up' },
  ];

  const userActivities = [
    { user: user?.fullName || 'John Doe', action: 'Completed money transfer', time: '2 min ago' },
    { user: user?.fullName || 'John Doe', action: 'Updated account settings', time: '5 min ago' },
    { user: user?.fullName || 'John Doe', action: 'Viewed transaction history', time: '12 min ago' },
    { user: user?.fullName || 'John Doe', action: 'Added new beneficiary', time: '18 min ago' },
  ];

  const updates = [
    { title: 'New Products Added', desc: 'Congratulations!', time: '4 hrs ago', color: 'bg-pink-500' },
    { title: 'Database Backup Complete', desc: 'All data synced', time: '1 day ago', color: 'bg-orange-500' },
    { title: 'System Update', desc: 'Version 2.0 deployed', time: '2 days ago', color: 'bg-primary-500' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-secondary-200 text-sm">Welcome back, {user?.fullName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-6 text-white shadow-lg`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <stat.icon className="h-8 w-8 opacity-80" />
            </div>
            <div className="flex items-center text-xs text-white/70">
              <Clock className="h-3 w-3 mr-1" />
              <span>update: 2:15 am</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Chart */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-primary-500/20">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Account Analytics</h3>
                <p className="text-secondary-200 text-sm">For more details about usage, please refer to our charts</p>
              </div>
              <button className="text-primary-300 hover:text-primary-200 text-sm">Show all</button>
            </div>
            <div className="h-64 flex items-center justify-center border border-primary-500/10 rounded-lg bg-black/20">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-primary-400 mx-auto mb-2 opacity-50" />
                <p className="text-secondary-200 text-sm">Chart visualization area</p>
              </div>
            </div>
          </div>

          {/* Application Sales Table */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-primary-500/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Account Services</h3>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5 text-secondary-200" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-500/10">
                    <th className="text-left py-3 px-2 text-secondary-200 font-medium text-sm">Service</th>
                    <th className="text-left py-3 px-2 text-secondary-200 font-medium text-sm">Usage</th>
                    <th className="text-left py-3 px-2 text-secondary-200 font-medium text-sm">Change</th>
                    <th className="text-left py-3 px-2 text-secondary-200 font-medium text-sm">Avg Rate</th>
                    <th className="text-left py-3 px-2 text-secondary-200 font-medium text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr key={index} className="border-b border-primary-500/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-primary-500/30" />
                          <div>
                            <p className="text-white font-medium text-sm">{app.name}</p>
                            <p className="text-secondary-200 text-xs">{app.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-white">{app.sales.toLocaleString()}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className={`h-4 w-4 ${app.trend === 'up' ? 'text-green-400' : 'text-red-400'} ${app.trend === 'down' ? 'rotate-180' : ''}`} />
                          <span className="text-xs text-secondary-200">Trend</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-white">${app.avgPrice}</td>
                      <td className="py-4 px-2 text-primary-300 font-semibold">${app.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="text-primary-300 hover:text-primary-200 text-sm font-medium">View all Projects</button>
            </div>
          </div>

          {/* Latest Updates */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-primary-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Latest Updates</h3>
            <div className="space-y-4">
              {updates.map((update, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`${update.color} rounded-full p-2 mt-1`}>
                    {index === 0 ? <UserPlus className="h-4 w-4 text-white" /> : 
                     index === 1 ? <Database className="h-4 w-4 text-white" /> :
                     <Zap className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{update.title}</p>
                    <p className="text-secondary-200 text-xs">{update.desc}</p>
                  </div>
                  <span className="text-xs text-secondary-300">{update.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Financial Advisor */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Gemini AI Financial Advisor</h3>
            </div>
            <p className="text-secondary-200 text-sm mb-4">Get personalized financial advice powered by Google Gemini AI</p>
            {geminiAdvice && (
              <div className="bg-black/30 rounded-lg p-4 mb-4 border border-purple-500/20">
                <p className="text-white text-sm">{geminiAdvice}</p>
              </div>
            )}
            <button
              onClick={getAdvice}
              disabled={loadingAdvice}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loadingAdvice ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Getting advice...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Get Financial Advice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Project Risk */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-primary-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Account Risk</h3>
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#ffffff10" strokeWidth="8"></circle>
                  <circle 
                    cx="64" cy="64" r="56" fill="none" 
                    stroke="url(#gradient)" strokeWidth="8"
                    strokeDasharray="351.68"
                    strokeDashoffset="87.92"
                    strokeLinecap="round"
                  ></circle>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ECDC4" />
                      <stop offset="100%" stopColor="#556FB5" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">75%</span>
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-white font-medium">Balanced</p>
              <button className="text-orange-400 text-sm mt-1 hover:text-orange-300">Change Your Risk</button>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <div>
                <p className="text-secondary-200">Risk</p>
                <p className="text-white font-medium">AWS 2455</p>
              </div>
              <div className="text-right">
                <p className="text-secondary-200">Created</p>
                <p className="text-white font-medium">30th Sep</p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg transition-all duration-200 font-medium">
              Download Overall Report
            </button>
          </div>

          {/* User Activity */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-primary-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">User Activity</h3>
            <div className="space-y-4">
              {userActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{activity.user}</p>
                    <p className="text-secondary-200 text-xs">{activity.action}</p>
                    <p className="text-secondary-300 text-xs flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-primary-300 hover:text-primary-200 text-sm font-medium">View all Projects</button>
            </div>
          </div>

          {/* Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-primary-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-secondary-200 text-xs mb-1">Email</p>
                <p className="text-white text-sm">{user?.email || 'user@smartbank.com'}</p>
              </div>
              <div>
                <p className="text-secondary-200 text-xs mb-1">Phone</p>
                <p className="text-white text-sm">{user?.phone || '0923-333-526136'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchLocator() {
  const branches: any[] = [];
  const employees: any[] = [];
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const loading = false;
  const employeesLoading = false;

  const selectedBranchData = branches.find((b: any) => b.id === selectedBranch);
  const branchEmployees = employees.filter((e: any) => e.branch_id === selectedBranch);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-primary-100">Loading branch information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Branch Locator</h1>
        <p className="text-secondary-200">Find SmartBank branches and meet our team</p>
      </div>

      {/* Branch Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20 text-center">
          <Building2 className="h-8 w-8 text-primary-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{branches.length}</div>
          <div className="text-secondary-200 text-sm">Total Branches</div>
        </div>
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20 text-center">
          <Users className="h-8 w-8 text-primary-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">25+</div>
          <div className="text-secondary-200 text-sm">Banking Professionals</div>
        </div>
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20 text-center">
          <Globe className="h-8 w-8 text-primary-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">6</div>
          <div className="text-secondary-200 text-sm">States Covered</div>
        </div>
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20 text-center">
          <Clock className="h-8 w-8 text-primary-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">24/7</div>
          <div className="text-secondary-200 text-sm">Customer Support</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Branch List */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Our Branches</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {branches.map((branch: any) => (
              <div
                key={branch.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedBranch === branch.id
                    ? 'border-primary-500/50 bg-primary-500/10'
                    : 'border-primary-500/20 hover:border-primary-500/40 hover:bg-primary-500/5'
                }`}
                onClick={() => setSelectedBranch(branch.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{branch.name}</h3>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-secondary-200 text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{branch.address}, {branch.city}, {branch.state}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Manager: {branch.manager_name}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {branch.services.slice(0, 3).map((service: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded">
                      {service}
                    </span>
                  ))}
                  {branch.services.length > 3 && (
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded">
                      +{branch.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Details & Employees */}
        <div className="space-y-6">
          {selectedBranchData ? (
            <>
              {/* Branch Details */}
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">{selectedBranchData.name}</h2>
                <div className="space-y-3 text-secondary-200">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary-400" />
                    <span>{selectedBranchData.address}, {selectedBranchData.city}, {selectedBranchData.state} {selectedBranchData.postal_code}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-400" />
                    <span>{selectedBranchData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-400" />
                    <span>{selectedBranchData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary-400" />
                    <span>Branch Manager: {selectedBranchData.manager_name}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-white font-medium mb-2">Services Available:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBranchData.services.map((service: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-white font-medium mb-2">Working Hours:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(selectedBranchData.working_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-secondary-200 capitalize">{day}:</span>
                        <span className="text-primary-300">{hours as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Branch Employees */}
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">Our Team</h2>
                {employeesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
                    <p className="text-secondary-200">Loading team information...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {branchEmployees.map((employee: any) => (
                      <div key={employee.id} className="flex items-center space-x-4 p-3 bg-black/20 rounded-lg border border-primary-500/10">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-500/20 flex items-center justify-center">
                          {employee.profile_image ? (
                            <img src={employee.profile_image} alt={`${employee.first_name} ${employee.last_name}`} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="h-6 w-6 text-primary-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{employee.first_name} {employee.last_name}</h3>
                          <p className="text-primary-300 text-sm">{employee.position}</p>
                          <p className="text-secondary-200 text-xs">{employee.department}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Award className="h-4 w-4 text-yellow-400" />
                            <span className="text-primary-300 text-sm">Expert</span>
                          </div>
                          <p className="text-secondary-200 text-xs">Since {new Date(employee.hire_date).getFullYear()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20 text-center">
              <Building2 className="h-12 w-12 text-primary-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Select a Branch</h2>
              <p className="text-secondary-200">Choose a branch from the list to view details and meet our team</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TransferMoney() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Transfer Money</h1>
        <p className="text-secondary-200">Send money securely to your beneficiaries</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Transfer Form */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
          <h2 className="text-xl font-semibold text-white mb-6">Send Money</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">Recipient</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-primary-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select recipient</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-primary-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-primary-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Payment description"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/25"
            >
              Send Money
            </button>
          </form>
        </div>

        {/* Beneficiaries */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Beneficiaries</h2>
            <button
              type="button"
              className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 px-4 py-2 rounded-lg transition-all duration-200 border border-primary-500/30"
            >
              Add New
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-secondary-200 text-center py-8">No beneficiaries added yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionHistory() {
  const transactions: any[] = []; // transactions;
  const loading = false; // transactionsLoading;

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-primary-100">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
        <p className="text-secondary-200">View your complete transaction history</p>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-500/20">
                <th className="text-left py-3 px-4 text-secondary-200 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-secondary-200 font-medium">Description</th>
                <th className="text-left py-3 px-4 text-secondary-200 font-medium">Type</th>
                <th className="text-right py-3 px-4 text-secondary-200 font-medium">Amount</th>
                <th className="text-right py-3 px-4 text-secondary-200 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction: any, index: number) => (
                <tr key={index} className="border-b border-primary-500/10 hover:bg-primary-500/5">
                  <td className="py-3 px-4 text-primary-100">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-white">{transaction.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.type === 'credit' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-primary-100">
                    ${transaction.balance?.toLocaleString() || '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BankingServices() {
  const services = [
    {
      icon: CreditCard,
      title: 'Personal Loans',
      description: 'Get instant personal loans with competitive interest rates',
      features: ['Up to $50,000', 'Quick approval', 'Flexible terms'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CreditCard,
      title: 'Credit Cards',
      description: 'Premium credit cards with exclusive benefits',
      features: ['Cashback rewards', 'Travel benefits', 'Zero annual fee'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: PiggyBank,
      title: 'Fixed Deposits',
      description: 'Secure your future with high-yield fixed deposits',
      features: ['Up to 7% interest', 'Flexible tenure', 'Auto-renewal'],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Banking Services</h1>
        <p className="text-secondary-200">Apply for loans, credit cards, and investment products</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20 hover:border-primary-500/40 transition-all duration-200">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}>
              <service.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-secondary-200 mb-4">{service.description}</p>
            <ul className="space-y-2 mb-6">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-2 text-primary-100">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerSupport() {
  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on "Forgot Password" on the login page and following the instructions sent to your email.'
    },
    {
      question: 'How do I add a new beneficiary?',
      answer: 'Go to the Transfer Money section and click "Add New" in the beneficiaries panel. Fill in the required details and verify with OTP.'
    },
    {
      question: 'What are the transaction limits?',
      answer: 'Daily transaction limit is $10,000 for online transfers. For higher amounts, please visit our branch or contact customer support.'
    },
    {
      question: 'How do I apply for a loan?',
      answer: 'Visit the Banking Services section, select the loan type, fill the application form, and upload required documents.'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Customer Support</h1>
        <p className="text-secondary-200">We're here to help you 24/7</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
          <h2 className="text-xl font-semibold text-white mb-6">Contact Us</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Phone Support</h3>
                <p className="text-secondary-200">1-800-SMART-BANK</p>
                <p className="text-primary-300 text-sm">Available 24/7</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Email Support</h3>
                <p className="text-secondary-200">support@smartbank.com</p>
                <p className="text-primary-300 text-sm">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Live Chat</h3>
                <p className="text-secondary-200">Chat with our experts</p>
                <button className="text-primary-400 hover:text-primary-300 text-sm">Start Chat →</button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
          <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-primary-500/20 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-secondary-200 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Shield className="h-6 w-6 text-yellow-400" />
          <h3 className="text-yellow-300 font-semibold">Security Notice</h3>
        </div>
        <p className="text-yellow-200 text-sm">
          SmartBank will never ask for your password, PIN, or OTP via email, phone, or SMS. 
          Always verify the URL before entering your credentials. Report suspicious activities immediately.
        </p>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings & Profile</h1>
        <p className="text-secondary-200">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
          <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue=""
                className="w-full px-4 py-3 bg-black/30 border border-primary-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">Email</label>
              <input
                type="email"
                defaultValue=""
                className="w-full px-4 py-3 bg-black/30 border border-primary-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">Phone</label>
              <input
                type="tel"
                defaultValue=""
                className="w-full px-4 py-3 bg-black/30 border border-primary-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-primary-500/20">
          <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg border border-primary-500/10">
              <div>
                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                <p className="text-secondary-200 text-sm">Add an extra layer of security</p>
              </div>
              <button className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 px-4 py-2 rounded-lg transition-all duration-200 border border-primary-500/30">
                Enable
              </button>
            </div>

            <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg border border-primary-500/10">
              <div>
                <h3 className="text-white font-medium">Change Password</h3>
                <p className="text-secondary-200 text-sm">Update your account password</p>
              </div>
              <button className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 px-4 py-2 rounded-lg transition-all duration-200 border border-primary-500/30">
                Change
              </button>
            </div>

            <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg border border-primary-500/10">
              <div>
                <h3 className="text-white font-medium">Login Notifications</h3>
                <p className="text-secondary-200 text-sm">Get notified of new logins</p>
              </div>
              <button className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg border border-green-500/30">
                Enabled
              </button>
            </div>

            <button
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-red-500/30"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;