'use client';

import { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
  onSuccessfulSignUp?: () => void;
}

// Validation constants and regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
const PASSWORD_MIN_LENGTH = 8;
const NAME_MIN_LENGTH = 2;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
};

export default function SignUpModal({ isOpen, onClose, onSwitchToSignIn, onSuccessfulSignUp }: SignUpModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Memoized form field update handler
  const updateFormData = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Password strength validation
  const validatePasswordStrength = useCallback((password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: password.length >= PASSWORD_MIN_LENGTH && hasUpperCase && hasLowerCase && hasNumbers,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    };
  }, []);

  // Comprehensive form validation
  const validateForm = useCallback(() => {
    const { firstName, lastName, email, phone, password, confirmPassword, agreeToTerms } = formData;
    
    // Required fields validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    // Name validation
    if (firstName.trim().length < NAME_MIN_LENGTH || lastName.trim().length < NAME_MIN_LENGTH) {
      toast({
        title: "Invalid Name",
        description: "First name and last name must be at least 2 characters long",
        variant: "destructive",
      });
      return false;
    }

    // Email validation
    if (!EMAIL_REGEX.test(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    // Phone validation (if provided)
    if (phone.trim() && !PHONE_REGEX.test(phone.trim().replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return false;
    }

    // Password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers",
        variant: "destructive",
      });
      return false;
    }

    // Password confirmation validation
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please check and try again.",
        variant: "destructive",
      });
      return false;
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service and Privacy Policy",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [formData, validatePasswordStrength, toast]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('Submitting registration data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone ? 'provided' : 'not provided'
      });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        const textResponse = await response.text();
        console.log('Raw response:', textResponse);
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        // Success case
        toast({
          title: "Welcome aboard! 🎉",
          description: "Your account has been created successfully. Please sign in to continue.",
        });
        
        // Reset form and switch to sign in
        setFormData(initialFormData);
        setShowPassword(false);
        setShowConfirmPassword(false);
        onClose();
        
        // Call success callback if provided
        if (onSuccessfulSignUp) {
          onSuccessfulSignUp();
        }
        
        // Small delay before switching to sign in for better UX
        setTimeout(() => {
          onSwitchToSignIn();
        }, 300);
      } else {
        if (response.status === 409) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Failed",
            description: data.message || `Server error (${response.status}). Please try again.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      toast({
        title: "Registration Failed",
        description: `${errorMessage}. Please check your connection and try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, toast, onClose, onSwitchToSignIn, onSuccessfulSignUp]);

  // Handle modal close with form reset
  const handleClose = useCallback(() => {
    if (!isLoading) {
      setFormData(initialFormData);
      setShowPassword(false);
      setShowConfirmPassword(false);
      onClose();
    }
  }, [isLoading, onClose]);

  // Toggle password visibility handlers
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  // Handle terms and privacy policy clicks
  const handleTermsClick = useCallback(() => {
    toast({
      title: "Terms of Service",
      description: "Terms of Service would open here in a real application.",
    });
  }, [toast]);

  const handlePrivacyClick = useCallback(() => {
    toast({
      title: "Privacy Policy",
      description: "Privacy Policy would open here in a real application.",
    });
  }, [toast]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md max-h-[90vh] overflow-y-auto" 
        aria-describedby="signup-description"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Create Your Account
          </DialogTitle>
        </DialogHeader>
        
        <div id="signup-description" className="sr-only">
          Create a new account by providing your personal information, email, and password
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-firstName" className="text-sm font-medium">
                First Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="signup-firstName"
                  type="text"
                  placeholder="First name"
                  className="pl-10"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  disabled={isLoading}
                  autoComplete="given-name"
                  maxLength={50}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-lastName" className="text-sm font-medium">
                Last Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="signup-lastName"
                  type="text"
                  placeholder="Last name"
                  className="pl-10"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  disabled={isLoading}
                  autoComplete="family-name"
                  maxLength={50}
                  required
                />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="signup-phone" className="text-sm font-medium">
              Phone Number (Optional)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="signup-phone"
                type="tel"
                placeholder="Enter your phone number"
                className="pl-10"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                disabled={isLoading}
                autoComplete="tel"
                maxLength={20}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-sm font-medium">
              Password *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
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
            {formData.password && (
              <div className="text-xs text-muted-foreground">
                Password must be at least 8 characters with uppercase, lowercase, and numbers
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="signup-confirmPassword" className="text-sm font-medium">
              Confirm Password *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="signup-confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 pr-10"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="text-xs text-destructive">
                Passwords do not match
              </div>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="signup-terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => updateFormData('agreeToTerms', checked as boolean)}
              disabled={isLoading}
              required
            />
            <label htmlFor="signup-terms" className="text-sm text-muted-foreground leading-relaxed">
              I agree to the{' '}
              <button
                type="button"
                onClick={handleTermsClick}
                className="text-primary hover:text-primary/80 underline transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                disabled={isLoading}
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={handlePrivacyClick}
                className="text-primary hover:text-primary/80 underline transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                disabled={isLoading}
              >
                Privacy Policy
              </button>
              {' *'}
            </label>
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Switch to Sign In */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
              disabled={isLoading}
            >
              Sign in instead
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
