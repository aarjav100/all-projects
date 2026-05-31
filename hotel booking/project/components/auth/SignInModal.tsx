'use client';

import { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSuccessfulSignIn?: () => void;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInModal({ isOpen, onClose, onSwitchToSignUp, onSuccessfulSignIn }: SignInModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Memoized form field update handler
  const updateFormData = useCallback((field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Validate form inputs
  const validateForm = useCallback(() => {
    const { email, password } = formData;
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [formData, toast]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success case
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        
        // Reset form and close modal
        setFormData({ email: '', password: '', rememberMe: false });
        setShowPassword(false);
        onClose();
        
        // Call the success callback
        onSuccessfulSignIn();
      } else {
        toast({
          title: "Sign In Failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, toast, onClose, onSuccessfulSignIn]);

  // Handle modal close with form reset
  const handleClose = useCallback(() => {
    if (!isLoading) {
      setFormData({ email: '', password: '', rememberMe: false });
      setShowPassword(false);
      onClose();
    }
  }, [isLoading, onClose]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="sign-in-description">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Sign In to Your Account
          </DialogTitle>
        </DialogHeader>
        
        <div id="sign-in-description" className="sr-only">
          Sign in to access your account using your email and password
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="signin-email" className="text-sm font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                aria-describedby="email-error"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="signin-password" className="text-sm font-medium">
              Password *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                aria-describedby="password-error"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                checked={formData.rememberMe}
                onChange={(e) => updateFormData('rememberMe', e.target.checked)}
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
              disabled={isLoading}
              onClick={() => {
                // Handle forgot password logic
                toast({
                  title: "Forgot Password",
                  description: "Password reset functionality would be implemented here.",
                });
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Switch to Sign Up */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
              disabled={isLoading}
            >
              Create account
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="text-center text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-md">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: password</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
