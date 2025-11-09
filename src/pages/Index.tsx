import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  Scissors, 
  TrendingUp, 
  CheckCircle, 
  Star,
  Shield,
  Zap
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm items-center justify-center mb-6">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Your Salon Business
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Professional salon management made simple. Streamline appointments, manage staff, 
                track inventory, and grow your business with SalonPro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-3" />
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                      <Calendar className="w-10 h-10 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Smart Scheduling</p>
                        <p className="text-sm text-muted-foreground">Automated appointment management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-secondary/10 rounded-xl">
                      <Users className="w-10 h-10 text-secondary" />
                      <div>
                        <p className="font-semibold text-foreground">Team Management</p>
                        <p className="text-sm text-muted-foreground">Track performance & commissions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-xl">
                      <TrendingUp className="w-10 h-10 text-accent" />
                      <div>
                        <p className="font-semibold text-foreground">Business Analytics</p>
                        <p className="text-sm text-muted-foreground">Real-time insights & reports</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Run Your Salon
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for salon owners, staff, and clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Appointment Management",
                description: "Easy online booking, calendar sync, and automated reminders for clients",
                color: "primary"
              },
              {
                icon: Users,
                title: "Staff Management",
                description: "Track schedules, commissions, performance metrics, and team collaboration",
                color: "secondary"
              },
              {
                icon: Scissors,
                title: "Service Management",
                description: "Create and manage your service menu with pricing and duration settings",
                color: "accent"
              },
              {
                icon: TrendingUp,
                title: "Analytics & Reports",
                description: "Detailed insights on revenue, popular services, and business growth",
                color: "primary"
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Ethiopian payment integration with Chapa and Telebirr support",
                color: "secondary"
              },
              {
                icon: Zap,
                title: "Multi-Branch Support",
                description: "Manage multiple salon locations from a single dashboard",
                color: "accent"
              },
            ].map((feature, index) => (
              <Card key={index} className="border-border/50 shadow-md hover:shadow-lg transition-smooth">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Why Salon Owners Choose SalonPro
              </h2>
              <div className="space-y-6">
                {[
                  "Reduce no-shows with automated SMS and email reminders",
                  "Increase revenue with online booking and upselling features",
                  "Save time with automated scheduling and staff management",
                  "Build client loyalty with personalized service history",
                  "Make data-driven decisions with real-time analytics",
                  "Accept payments seamlessly with Ethiopian payment options"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                    <p className="text-lg text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-card border border-border rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <Star className="w-16 h-16 text-gold mx-auto mb-4 fill-gold" />
                <h3 className="text-3xl font-bold text-foreground mb-2">4.9/5.0</h3>
                <p className="text-muted-foreground">Average Customer Rating</p>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-background rounded-xl">
                  <p className="text-foreground italic mb-3">
                    "SalonPro transformed how we manage our salon. Appointments are organized, 
                    staff love it, and our revenue is up 30%!"
                  </p>
                  <p className="text-sm font-semibold text-primary">- Sarah J., Salon Owner</p>
                </div>
                <div className="p-4 bg-background rounded-xl">
                  <p className="text-foreground italic mb-3">
                    "The best investment we made for our business. Easy to use and our clients 
                    love the online booking feature."
                  </p>
                  <p className="text-sm font-semibold text-primary">- Michael T., Spa Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Salon?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of salon owners who are growing their business with SalonPro. 
            Start your free trial today - no credit card required.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
              Get Started Free
            </Button>
          </Link>
          <p className="text-white/80 mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-sidebar-foreground">SalonPro</h3>
              </div>
              <p className="text-sidebar-foreground/70 text-sm">
                Professional salon management platform for modern businesses
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li>Features</li>
                <li>Pricing</li>
                <li>Case Studies</li>
                <li>Reviews</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-sidebar-border mt-12 pt-8 text-center text-sm text-sidebar-foreground/70">
            <p>© 2025 SalonPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
