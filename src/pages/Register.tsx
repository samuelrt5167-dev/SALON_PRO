import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Mail, Lock, User, Phone, Building2, Sparkles, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [activeTab, setActiveTab] = useState<string>("salon");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSalonRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Integrate with backend
    setTimeout(() => {
      toast({
        title: "Account created successfully!",
        description: "Welcome to SalonPro. Let's set up your salon.",
      });
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  const handleClientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Integrate with backend
    setTimeout(() => {
      toast({
        title: "Account created successfully!",
        description: "Welcome to SalonPro. Start booking appointments now.",
      });
      // Clients go to client dashboard
      navigate("/client-dashboard");
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleSignup = () => {
    // TODO: Integrate with Google OAuth
    toast({
      title: "Google Sign-Up",
      description: "Google authentication will be integrated with backend.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden py-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex w-20 h-20 rounded-3xl bg-white shadow-glow items-center justify-center mb-4 relative">
            <Scissors className="w-10 h-10 text-primary" />
            <Sparkles className="w-4 h-4 text-gold absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Join SalonPro</h1>
          <p className="text-white/90 text-lg">Start managing your salon or book appointments</p>
          
          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            {["Free 14-day trial", "No credit card required", "Cancel anytime"].map((benefit) => (
              <div key={benefit} className="flex items-center gap-1 text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/95 animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">Choose your account type to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                <TabsTrigger value="salon" className="text-base">🏪 Salon Owner</TabsTrigger>
                <TabsTrigger value="client" className="text-base">👤 Client</TabsTrigger>
              </TabsList>

              <TabsContent value="salon">
                <form onSubmit={handleSalonRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salon-name">Salon Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="salon-name"
                          placeholder="Glamour Salon & Spa"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salon-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="salon-phone"
                          type="tel"
                          placeholder="+251 912 345 678"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salon-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="salon-email"
                        type="email"
                        placeholder="owner@glamoursalon.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salon-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="salon-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-base text-lg h-12 font-semibold shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Salon Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="client">
                <form onSubmit={handleClientRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-fname">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="client-fname"
                          placeholder="Emma"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-lname">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="client-lname"
                          placeholder="Wilson"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="client-email"
                        type="email"
                        placeholder="emma@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="client-phone"
                        type="tel"
                        placeholder="+251 912 345 678"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="client-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-base text-lg h-12 font-semibold shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Client Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                Or continue with
              </span>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignup}
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
              Sign up with Google
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-white/70">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Join 1000+ salons growing with SalonPro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
