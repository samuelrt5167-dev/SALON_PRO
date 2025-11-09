import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Calendar, 
  Users, 
  Star,
  TrendingUp,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data - ready for backend integration
const mockUser = {
  name: "Sarah Johnson",
  email: "sarah@glamoursalon.com",
  avatar: undefined,
};

const mockStats = {
  totalRevenue: 45250,
  revenueChange: 12.5,
  totalAppointments: 156,
  appointmentsChange: 8.3,
  totalClients: 342,
  clientsChange: 15.2,
  averageRating: 4.8,
  ratingChange: 2.1,
};

const mockUpcomingAppointments = [
  {
    id: "1",
    clientName: "Emma Wilson",
    service: "Hair Styling & Color",
    time: "10:00 AM",
    duration: "2h",
    stylist: "Maria Garcia",
    status: "confirmed",
  },
  {
    id: "2",
    clientName: "Olivia Brown",
    service: "Manicure & Pedicure",
    time: "11:30 AM",
    duration: "1h 30m",
    stylist: "Lisa Chen",
    status: "confirmed",
  },
  {
    id: "3",
    clientName: "Sophia Davis",
    service: "Facial Treatment",
    time: "2:00 PM",
    duration: "1h",
    stylist: "Anna Martinez",
    status: "pending",
  },
  {
    id: "4",
    clientName: "Ava Johnson",
    service: "Hair Cut",
    time: "3:30 PM",
    duration: "45m",
    stylist: "Maria Garcia",
    status: "confirmed",
  },
];

const Dashboard = () => {
  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${mockStats.totalRevenue.toLocaleString()}`}
            change={mockStats.revenueChange}
            changeLabel="from last month"
            icon={DollarSign}
            iconClassName="bg-success/10"
          />
          <StatCard
            title="Appointments"
            value={mockStats.totalAppointments}
            change={mockStats.appointmentsChange}
            changeLabel="from last month"
            icon={Calendar}
            iconClassName="bg-primary/10"
          />
          <StatCard
            title="Total Clients"
            value={mockStats.totalClients}
            change={mockStats.clientsChange}
            changeLabel="new this month"
            icon={Users}
            iconClassName="bg-secondary/10"
          />
          <StatCard
            title="Avg Rating"
            value={mockStats.averageRating}
            change={mockStats.ratingChange}
            changeLabel="from last month"
            icon={Star}
            iconClassName="bg-gold/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2 border-border/50 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Today's Appointments</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-smooth"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{appointment.clientName}</h4>
                          <Badge
                            variant={appointment.status === "confirmed" ? "default" : "secondary"}
                            className={appointment.status === "confirmed" ? "bg-success" : ""}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{appointment.service}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.time} ({appointment.duration})
                          </span>
                          <span>• {appointment.stylist}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Today's Revenue</span>
                  <span className="text-lg font-bold text-primary">$2,450</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18% from yesterday</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Appointments Today</span>
                  <span className="text-lg font-bold text-primary">12</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  4 completed • 8 upcoming
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Staff on Duty</span>
                  <span className="text-lg font-bold text-primary">8</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  6 stylists • 2 receptionists
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Inventory Alerts</span>
                  <span className="text-lg font-bold text-warning">3</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Items need reordering
                </div>
              </div>

              <Button className="w-full bg-gradient-primary hover:opacity-90 transition-base">
                Quick Actions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
