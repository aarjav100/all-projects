import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Mail, Lock, User, Eye, EyeOff, Shield, RotateCcw } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login, signup, verifyOTP, isLoading, pendingUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (showOTP) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showOTP]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, showOTP:', showOTP);
    
    if (showOTP) {
      // Handle OTP verification
      const otpString = otp.join('');
      
      if (otpString.length !== 6) {
        toast({
          title: "Error",
          description: "Please enter all 6 digits",
          variant: "destructive",
        });
        return;
      }
      
      const result = await verifyOTP(otpString);
      
      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } else {
      // Handle login/signup
      const result = isLogin 
        ? await login(email, password)
        : await signup(email, password, name);
      
      console.log('Auth result:', result);
      if (result.success && result.requiresOTP) {
        console.log('Setting showOTP to true');
        setShowOTP(true);
        setTimeLeft(60);
        setCanResend(false);
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${email}. Use 123456 for demo.`,
        });
      } else if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${pendingUser?.email}`,
    });
  };

  const handleBackToLogin = () => {
    setShowOTP(false);
    setOtp(['', '', '', '', '', '']);
    setTimeLeft(60);
    setCanResend(false);
  };

  return (
    <Card className="w-full max-w-md bg-gradient-card shadow-elegant border-border">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-primary rounded-2xl">
            {showOTP ? (
              <Shield className="h-8 w-8 text-primary-foreground" />
            ) : (
              <BrainCircuit className="h-8 w-8 text-primary-foreground" />
            )}
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">
            {showOTP ? 'Verify Your Email' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {showOTP ? (
              <>
                We've sent a verification code to<br />
                <span className="font-medium text-foreground">{pendingUser?.email || email}</span>
              </>
            ) : (
              isLogin 
                ? 'Sign in to your CareerCraft account' 
                : 'Start building your dream career today'
            )}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showOTP ? (
          // OTP Verification Section
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-smooth bg-background"
                    autoComplete="off"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">Enter the 6-digit code we sent to your email</p>
                <p className="text-xs">For demo purposes, use: <span className="font-mono font-semibold text-foreground">123456</span></p>
              </div>
              
              <Button 
                type="submit" 
                variant="hero" 
                className="w-full" 
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  'Verify Code'
                )}
              </Button>
            </form>
            
            <div className="text-center space-y-3">
              <div className="text-sm text-muted-foreground">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-primary hover:underline font-medium transition-smooth flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Resend Code
                  </button>
                ) : (
                  <span>Resend code in {timeLeft}s</span>
                )}
              </div>
              
              <button
                onClick={handleBackToLogin}
                className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                ← Back to sign in
              </button>
            </div>
          </>
        ) : (
          // Login/Signup Form Section
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                variant="hero" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-primary hover:underline font-medium transition-smooth"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthForm;