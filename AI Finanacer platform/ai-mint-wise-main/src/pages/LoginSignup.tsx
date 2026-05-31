import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { signIn, signUp } from "@/lib/auth";
import { isSupabaseEnabled } from "@/lib/supabase";

const LoginSignup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSignIn = async () => {
    if (!isSupabaseEnabled()) {
      toast({ title: "Supabase not configured", description: "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." });
      return;
    }
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" as any });
      return;
    }
    if (!password) {
      toast({ title: "Missing password", description: "Please enter your password.", variant: "destructive" as any });
      return;
    }
    try {
      setLoading(true);
      await signIn(email, password);
      toast({ title: "Signed in", description: email });
      window.location.href = "/";
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err?.message ?? "Unknown error", variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!isSupabaseEnabled()) {
      toast({ title: "Supabase not configured", description: "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." });
      return;
    }
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" as any });
      return;
    }
    if (!password || password.length < 6) {
      toast({ title: "Weak password", description: "Minimum 6 characters.", variant: "destructive" as any });
      return;
    }
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" as any });
      return;
    }
    try {
      setLoading(true);
      const data = await signUp(email, password, name.trim());
      if ((data as any)?.session) {
        toast({ title: "Account created", description: "You are signed in." });
        window.location.href = "/";
      } else {
        toast({ title: "Check your email", description: "We sent you a verification link." });
      }
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err?.message ?? "Unknown error", variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100/70 grid place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Use email and password to sign in or create an account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4 pt-4">
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={handleSignIn} disabled={loading}>{loading ? "Loading..." : "Sign In"}</Button>
              </div>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4 pt-4">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="secondary" onClick={handleSignUp} disabled={loading}>Create Account</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginSignup;


