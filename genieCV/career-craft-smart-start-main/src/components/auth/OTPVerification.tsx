import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Shield, RotateCcw } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOTP, isLoading, pendingUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
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
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <Card className="w-full max-w-md bg-gradient-card shadow-elegant border-border">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-primary rounded-2xl">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We've sent a verification code to<br />
            <span className="font-medium text-foreground">{pendingUser?.email}</span>
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
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
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            ← Back to sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;