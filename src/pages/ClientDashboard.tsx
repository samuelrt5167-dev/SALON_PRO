import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Star,
  Gift,
  TrendingUp,
  Sparkles,
  Award,
  RefreshCw,
} from "lucide-react";

// Mock data for client dashboard
const mockClientUser = {
  name: "Sarah Johnson",
  email: "sarah@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
};

const mockUpcomingAppointments = [
  {
    id: "1",
    service: "Haircut & Styling",
    salon: "Glamour Studio",
    stylist: "Emma Wilson",
    stylistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    date: "2024-03-20",
    time: "10:00 AM",
    duration: "1h 30m",
    price: "ETB 850",
    status: "confirmed",
    location: "Bole, Addis Ababa",
  },
  {
    id: "2",
    service: "Manicure & Pedicure",
    salon: "Beauty Haven",
    stylist: "Lily Chen",
    stylistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
    date: "2024-03-25",
    time: "2:00 PM",
    duration: "1h",
    price: "ETB 500",
    status: "pending",
    location: "CMC, Addis Ababa",
  },
];

const mockBookingHistory = [
  {
    id: "1",
    service: "Hair Coloring",
    salon: "Glamour Studio",
    stylist: "Emma Wilson",
    date: "2024-02-15",
    price: "ETB 1,200",
    rating: 5,
    canRebook: true,
  },
  {
    id: "2",
    service: "Facial Treatment",
    salon: "Spa Serenity",
    stylist: "Maya Anderson",
    date: "2024-02-10",
    price: "ETB 650",
    rating: 4,
    canRebook: true,
  },
  {
    id: "3",
    service: "Haircut",
    salon: "Beauty Haven",
    stylist: "Lily Chen",
    date: "2024-01-28",
    price: "ETB 400",
    rating: 5,
    canRebook: true,
  },
];

const mockFavoriteSalons = [
  {
    id: "1",
    name: "Glamour Studio",
    rating: 4.8,
    location: "Bole, Addis Ababa",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300",
    specialties: ["Hair", "Nails", "Makeup"],
    visits: 12,
  },
  {
    id: "2",
    name: "Beauty Haven",
    rating: 4.9,
    location: "CMC, Addis Ababa",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300",
    specialties: ["Spa", "Massage", "Facial"],
    visits: 8,
  },
];

const mockFavoriteStylists = [
  {
    id: "1",
    name: "Emma Wilson",
    salon: "Glamour Studio",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    rating: 4.9,
    specialties: ["Hair Styling", "Coloring"],
    appointments: 15,
  },
  {
    id: "2",
    name: "Lily Chen",
    salon: "Beauty Haven",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
    rating: 5.0,
    specialties: ["Nails", "Pedicure"],
    appointments: 10,
  },
];

const mockLoyaltyData = {
  points: 2450,
  tier: "Gold",
  tierColor: "text-yellow-600",
  nextTier: "Platinum",
  pointsToNextTier: 550,
  rewards: [
    { id: "1", title: "Free Haircut", points: 500, available: true },
    { id: "2", title: "20% Off Next Service", points: 300, available: true },
    { id: "3", title: "Spa Package", points: 1000, available: true },
    { id: "4", title: "VIP Treatment", points: 2000, available: true },
  ],
};

const ClientDashboard = () => {
  return (
    <DashboardLayout user={mockClientUser}>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {mockClientUser.name.split(" ")[0]}! 💅
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to book your next beauty appointment?
            </p>
          </div>
          <Button size="lg" className="shadow-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Book New Appointment
          </Button>
        </div>

        {/* Loyalty Points Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-primary/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Award className={`w-8 h-8 ${mockLoyaltyData.tierColor}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-foreground">
                      {mockLoyaltyData.points} Points
                    </h3>
                    <Badge variant="secondary" className={mockLoyaltyData.tierColor}>
                      {mockLoyaltyData.tier} Member
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mockLoyaltyData.pointsToNextTier} points to {mockLoyaltyData.nextTier}
                  </p>
                </div>
              </div>
              <Button variant="outline">
                <Gift className="mr-2 h-4 w-4" />
                View Rewards
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Favorite Stylists */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Favorite Stylists
              </CardTitle>
              <CardDescription>Book with your preferred stylists</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockFavoriteStylists.map((stylist) => (
                <div
                  key={stylist.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={stylist.avatar} />
                      <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{stylist.name}</h4>
                      <p className="text-sm text-muted-foreground">{stylist.salon}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-medium">{stylist.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          • {stylist.appointments} visits
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Book Now</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Special Offers */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Special Offers
              </CardTitle>
              <CardDescription>Limited time deals for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-primary">New Customer</Badge>
                  <span className="text-xs text-muted-foreground">Valid till Mar 31</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  30% Off First Visit
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get 30% discount on your first service at Spa Serenity
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  Claim Offer
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">Loyalty Reward</Badge>
                  <span className="text-xs text-muted-foreground">500 points</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  Free Haircut Voucher
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Redeem this voucher for a complimentary haircut
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Redeem Now
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">Weekend Deal</Badge>
                  <span className="text-xs text-muted-foreground">This Weekend</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  Spa Package - 20% Off
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Facial + Massage combo at special weekend price
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Your scheduled beauty sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {mockUpcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {mockUpcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-smooth"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={appointment.stylistAvatar} />
                          <AvatarFallback>{appointment.stylist[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground text-lg">
                                {appointment.service}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {appointment.salon} • {appointment.stylist}
                              </p>
                            </div>
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.time} ({appointment.duration})
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {appointment.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-2">
                        <span className="text-xl font-bold text-primary">
                          {appointment.price}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
                <Button className="mt-4">Book Your First Appointment</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking History & Favorite Salons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Booking History
              </CardTitle>
              <CardDescription>Your past appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockBookingHistory.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-lg border bg-card hover:shadow-sm transition-smooth"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {booking.service}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {booking.salon} • {booking.stylist}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < booking.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{booking.date}</span>
                      <span className="font-semibold text-foreground">
                        {booking.price}
                      </span>
                    </div>
                    {booking.canRebook && (
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Rebook
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All History
              </Button>
            </CardContent>
          </Card>

          {/* Favorite Salons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Favorite Salons
              </CardTitle>
              <CardDescription>Your preferred beauty destinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockFavoriteSalons.map((salon) => (
                <div
                  key={salon.id}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-smooth group cursor-pointer"
                >
                  <div className="flex gap-4">
                    <img
                      src={salon.image}
                      alt={salon.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {salon.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">{salon.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {salon.location}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {salon.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        {salon.visits} visits
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Explore More Salons
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
