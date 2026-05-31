import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Eye, EyeOff, Sparkles, Mail, Phone, ArrowLeft, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const usernameSchema = z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');
const phoneSchema = z.string().min(10, 'Please enter a valid phone number');

type AuthView = 'login' | 'signup' | 'forgot' | 'reset' | 'phone' | 'verify-email';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const [view, setView] = useState<AuthView>(mode === 'reset' ? 'reset' : 'login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signIn, signUp, signInWithGoogle, signInWithPhone, verifyOtp, resetPassword, updatePassword, user } = useAuth();
  const navigate = useNavigate();

  // Handle cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (user && view !== 'verify-email') {
      // Check if email is confirmed
      if (user.email_confirmed_at) {
        navigate('/');
      } else {
        setView('verify-email');
        setEmail(user.email || '');
      }
    }
  }, [user, navigate, view]);

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    const usernameResult = usernameSchema.safeParse(username);
    if (!usernameResult.success) {
      newErrors.username = usernameResult.error.errors[0].message;
    }
    
    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhone = () => {
    const newErrors: Record<string, string> = {};
    
    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      newErrors.phone = phoneResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          // User exists but email not confirmed - show verification screen
          setView('verify-email');
          toast.info('Please verify your email to continue');
        } else if (error.message.includes('Invalid login credentials')) {
          // Check if user might exist but email unverified by attempting to check
          toast.error('Invalid email or password. If you recently signed up, please check your email for verification.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Welcome back!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await signUp(email, password, username, displayName);
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered');
        } else {
          toast.error(error.message);
        }
      } else {
        setView('verify-email');
        toast.success('Check your email to verify your account!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset link sent to your email!');
        setView('login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setErrors({ password: passwordResult.error.errors[0].message });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully!');
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phone login now handled by handlePhoneLoginSubmit below

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await verifyOtp(phone, otp);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Phone verified successfully!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        if (error.message.includes('provider is not enabled') || error.message.includes('Unsupported provider')) {
          toast.error('Google login is not configured yet. Please use email/password or contact the admin.');
        } else {
          toast.error(error.message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await signInWithPhone(phone);
      if (error) {
        if (error.message.includes('provider is not enabled') || error.message.includes('not supported')) {
          toast.error('Phone login is not configured yet. Please use email/password.');
        } else {
          toast.error(error.message);
        }
      } else {
        setOtpSent(true);
        toast.success('OTP sent to your phone!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderHeader = () => {
    const headers: Record<AuthView, { title: string; description: string }> = {
      login: { title: 'Welcome back', description: 'Sign in to connect with your friends' },
      signup: { title: 'Join the community', description: 'Create an account to start sharing' },
      forgot: { title: 'Forgot password?', description: "We'll send you a reset link" },
      reset: { title: 'Set new password', description: 'Enter your new password below' },
      phone: { title: 'Phone login', description: "We'll text you a verification code" },
      'verify-email': { title: 'Check your email', description: 'We sent you a verification link' },
    };

    const { title, description } = headers[view];

    return (
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          {view === 'verify-email' ? (
            <CheckCircle className="w-8 h-8 text-primary-foreground" />
          ) : (
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          )}
        </div>
        <CardTitle className="font-display text-3xl font-bold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
    );
  };

  const renderBackButton = () => (
    <button
      type="button"
      onClick={() => {
        setView('login');
        setErrors({});
        setOtpSent(false);
        setOtp('');
      }}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to sign in
    </button>
  );

  const renderSocialButtons = () => (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="rounded-xl h-11"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setView('phone')}
          disabled={isSubmitting}
          className="rounded-xl h-11"
        >
          <Phone className="w-5 h-5 mr-2" />
          Phone
        </Button>
      </div>
    </div>
  );

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email sent!');
        setResendCooldown(60); // 60 second cooldown
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (view === 'verify-email') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <Card className="w-full max-w-md animate-fade-in floating-card">
          {renderHeader()}
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-float">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  We've sent a verification link to:
                </p>
                <p className="font-medium text-foreground text-lg">{email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the link in your email to verify your account. Check your spam folder if you don't see it.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={handleResendVerification}
                disabled={isSubmitting || resendCooldown > 0}
                className="w-full rounded-xl h-11"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend verification email'}
              </Button>

              <Button
                variant="ghost"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setView('login');
                  setEmail('');
                  setPassword('');
                }}
                className="w-full rounded-xl h-11 text-muted-foreground"
              >
                Use a different email
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Already verified?{' '}
                <button
                  onClick={() => {
                    supabase.auth.refreshSession();
                    navigate('/');
                  }}
                  className="text-primary hover:underline"
                >
                  Continue to app
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md animate-fade-in floating-card">
          {renderHeader()}
          <CardContent>
            {renderBackButton()}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`rounded-xl h-11 ${errors.email ? 'border-destructive' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground rounded-xl h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Send reset link
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md animate-fade-in floating-card">
          {renderHeader()}
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`rounded-xl h-11 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`rounded-xl h-11 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground rounded-xl h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'phone') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md animate-fade-in floating-card">
          {renderHeader()}
          <CardContent>
            {renderBackButton()}
            
            {!otpSent ? (
              <form onSubmit={handlePhoneLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`rounded-xl h-11 ${errors.phone ? 'border-destructive' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Include country code (e.g., +1 for US)
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-primary-foreground rounded-xl h-11"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Send OTP
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <Label>Enter verification code</Label>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to {phone}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    onComplete={handleVerifyOtp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="rounded-lg" />
                      <InputOTPSlot index={1} className="rounded-lg" />
                      <InputOTPSlot index={2} className="rounded-lg" />
                      <InputOTPSlot index={3} className="rounded-lg" />
                      <InputOTPSlot index={4} className="rounded-lg" />
                      <InputOTPSlot index={5} className="rounded-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button 
                  onClick={handleVerifyOtp}
                  className="w-full gradient-primary text-primary-foreground rounded-xl h-11"
                  disabled={isSubmitting || otp.length !== 6}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Verify
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Use a different phone number
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <Card className="w-full max-w-md animate-fade-in floating-card">
        {renderHeader()}
        
        <CardContent className="space-y-6">
          <Tabs value={view === 'signup' ? 'signup' : 'login'} onValueChange={(v) => setView(v as AuthView)}>
            <TabsList className="grid w-full grid-cols-2 rounded-xl h-11">
              <TabsTrigger value="login" className="rounded-lg">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`rounded-xl h-11 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`rounded-xl h-11 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-primary-foreground rounded-xl h-11"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>
              </form>

              {renderSocialButtons()}
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      className={`rounded-xl h-11 ${errors.username ? 'border-destructive' : ''}`}
                    />
                    {errors.username && (
                      <p className="text-xs text-destructive">{errors.username}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      placeholder="John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={`rounded-xl h-11 ${errors.displayName ? 'border-destructive' : ''}`}
                    />
                    {errors.displayName && (
                      <p className="text-xs text-destructive">{errors.displayName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`rounded-xl h-11 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`rounded-xl h-11 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-primary-foreground rounded-xl h-11"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Account
                </Button>
              </form>

              {renderSocialButtons()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}