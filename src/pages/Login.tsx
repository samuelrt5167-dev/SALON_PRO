import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Integrate with backend authentication
    // Simulating API call with role-based routing
    console.log("Login attempt with email:", email);
    
    setTimeout(() => {
      // Mock role detection - in production this will come from backend
      // For demo: emails ending with @client.com go to client dashboard
      const isClient = email.toLowerCase().includes("@client.com");
      
      console.log("Is client?", isClient);
      console.log("Redirecting to:", isClient ? "/client-dashboard" : "/dashboard");
      
      toast({
        title: "Welcome back!",
        description: `You have successfully logged in as ${isClient ? "a client" : "salon owner"}.`,
      });
      
      if (isClient) {
        navigate("/client-dashboard");
      } else {
        navigate("/dashboard");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    // TODO: Integrate with Google OAuth
    toast({
      title: "Google Sign-In",
      description: "Google authentication will be integrated with backend.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex w-20 h-20 rounded-3xl bg-white shadow-glow items-center justify-center mb-4 relative">
            <Scissors className="w-10 h-10 text-primary" />
            <Sparkles className="w-4 h-4 text-gold absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">SalonPro</h1>
          <p className="text-white/90 text-lg">Professional Salon Management</p>
        </div>

        <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/95 animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">Sign in to manage your salon</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-base text-lg h-12 font-semibold shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                Or continue with
              </span>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 text-base font-medium hover:bg-muted/50 transition-smooth"
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
              Sign in with Google
            </Button>

            <div className="text-center mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline transition-colors">
                  Sign up for free
                </Link>
              </p>
              
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">💡 Demo Tip:</span> Use email with{" "}
                  <code className="px-1.5 py-0.5 bg-primary/10 rounded text-xs font-mono">@client.com</code>{" "}
                  to access client dashboard, or any other email for salon owner dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-white/70">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 1000+ salons worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
