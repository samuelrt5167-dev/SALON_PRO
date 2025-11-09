import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Mail, Phone, Star, TrendingUp } from "lucide-react";

const mockStaff = [
  {
    id: "1",
    name: "Maria Garcia",
    role: "stylist",
    email: "maria@glamoursalon.com",
    phone: "+251 912 345 678",
    specialization: "Hair Styling & Coloring",
    avatar: undefined,
    rating: 4.9,
    appointmentsToday: 8,
    monthlyRevenue: 12500,
    commissionRate: 50,
    isActive: true,
  },
  {
    id: "2",
    name: "Lisa Chen",
    role: "stylist",
    email: "lisa@glamoursalon.com",
    phone: "+251 912 345 679",
    specialization: "Nail Art & Design",
    avatar: undefined,
    rating: 4.8,
    appointmentsToday: 6,
    monthlyRevenue: 9800,
    commissionRate: 45,
    isActive: true,
  },
  {
    id: "3",
    name: "Anna Martinez",
    role: "stylist",
    email: "anna@glamoursalon.com",
    phone: "+251 912 345 680",
    specialization: "Spa & Facial Treatments",
    avatar: undefined,
    rating: 4.9,
    appointmentsToday: 5,
    monthlyRevenue: 11200,
    commissionRate: 50,
    isActive: true,
  },
  {
    id: "4",
    name: "David Kim",
    role: "stylist",
    email: "david@glamoursalon.com",
    phone: "+251 912 345 681",
    specialization: "Men's Grooming",
    avatar: undefined,
    rating: 4.7,
    appointmentsToday: 7,
    monthlyRevenue: 8900,
    commissionRate: 45,
    isActive: true,
  },
  {
    id: "5",
    name: "Sophie Williams",
    role: "receptionist",
    email: "sophie@glamoursalon.com",
    phone: "+251 912 345 682",
    specialization: "Customer Service",
    avatar: undefined,
    rating: 4.9,
    appointmentsToday: 0,
    monthlyRevenue: 0,
    commissionRate: 0,
    isActive: true,
  },
];

const Staff = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground mt-1">Manage your salon team and their performance</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 transition-base">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockStaff.map((staff) => (
            <Card key={staff.id} className="border-border/50 shadow-md hover:shadow-lg transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarImage src={staff.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{staff.name}</h3>
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {staff.role}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    variant={staff.isActive ? "default" : "secondary"}
                    className={staff.isActive ? "bg-success hover:bg-success/90" : ""}
                  >
                    {staff.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Specialization</p>
                    <p className="text-sm text-foreground">{staff.specialization}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground truncate">{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">{staff.phone}</span>
                    </div>
                  </div>

                  {staff.role === "stylist" && (
                    <>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-gold fill-gold" />
                            <span className="font-semibold text-foreground">{staff.rating}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Today</p>
                          <p className="font-semibold text-foreground">{staff.appointmentsToday} appts</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Commission</p>
                          <p className="font-semibold text-foreground">{staff.commissionRate}%</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              ${staff.monthlyRevenue.toLocaleString()}
                            </span>
                            <TrendingUp className="w-4 h-4 text-success" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Staff Stats */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-gradient-card border border-border">
                <p className="text-2xl font-bold text-primary mb-1">{mockStaff.length}</p>
                <p className="text-sm text-muted-foreground">Total Staff</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-card border border-border">
                <p className="text-2xl font-bold text-primary mb-1">
                  {mockStaff.filter(s => s.role === "stylist").length}
                </p>
                <p className="text-sm text-muted-foreground">Stylists</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-card border border-border">
                <p className="text-2xl font-bold text-primary mb-1">
                  {mockStaff.reduce((acc, s) => acc + s.appointmentsToday, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Appointments Today</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-card border border-border">
                <p className="text-2xl font-bold text-primary mb-1">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Staff;
