import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';
import { useEffect } from 'react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, adminSignIn, adminOTP, sendOTP } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<'signin' | 'signup' | 'admin'>('signin');
  // Admin 2FA state
  const [adminStep, setAdminStep] = useState<'login' | 'otp'>('login');
  const [adminOtp, setAdminOtp] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminTrust, setAdminTrust] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (tab === 'admin' && document.cookie.includes('trusted_admin_device=1')) {
      // Skip OTP, log in admin directly
      toast({ title: 'Success', description: 'Trusted device: Admin login successful!' });
      // Set admin session, redirect, etc.
    }
  }, [tab, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password, firstName, lastName, studentId || undefined, phone || undefined);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    
    const { error } = await adminSignIn(adminEmail, adminPassword);
    
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    }
    
    setAdminLoading(false);
  };

  const handleAdminOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    
    const { error } = await adminOTP(adminEmail, adminOtp);
    
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      if (adminTrust) {
        document.cookie = `trusted_admin_device=1; max-age=${30 * 24 * 60 * 60}; path=/; secure; samesite=strict`;
      }
    }
    
    setAdminLoading(false);
  };

  const handleSendOTP = async () => {
    if (!adminEmail) {
      toast({ title: 'Error', description: 'Please enter admin email first', variant: 'destructive' });
      return;
    }

    setAdminLoading(true);
    const { error } = await sendOTP(adminEmail);
    
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      setAdminStep('otp');
      toast({ title: 'OTP Sent', description: 'Check your email for the code.' });
    }
    
    setAdminLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Student ERP Portal</CardTitle>
          <CardDescription>
            Access your academic information and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={tab} className="w-full" onValueChange={v => setTab(v as 'signin' | 'signup' | 'admin')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            {/* User Sign In */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            {/* User Sign Up */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID (Optional)</Label>
                  <Input
                    id="studentId"
                    placeholder="Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
            
            {/* Admin Login/OTP */}
            <TabsContent value="admin">
              {adminStep === 'login' ? (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@erp.com"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={adminLoading}>
                    {adminLoading ? 'Verifying...' : 'Admin Login'}
                  </Button>
                  <div className="text-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSendOTP}
                      disabled={adminLoading || !adminEmail}
                      className="w-full"
                    >
                      Send OTP Instead
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAdminOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-otp">Enter OTP</Label>
                    <Input
                      id="admin-otp"
                      type="text"
                      placeholder="6-digit code"
                      value={adminOtp}
                      onChange={e => setAdminOtp(e.target.value)}
                      required
                      maxLength={6}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="admin-trust"
                      type="checkbox"
                      checked={adminTrust}
                      onChange={e => setAdminTrust(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="admin-trust">Trust this device for 30 days</Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={adminLoading}>
                    {adminLoading ? 'Verifying OTP...' : 'Verify OTP'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setAdminStep('login')}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;