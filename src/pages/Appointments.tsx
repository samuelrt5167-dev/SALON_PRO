import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Plus, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockAppointments = [
  {
    id: "1",
    clientName: "Emma Wilson",
    clientEmail: "emma@example.com",
    service: "Hair Styling & Color",
    date: "2025-01-15",
    time: "10:00 AM",
    duration: "2h",
    stylist: "Maria Garcia",
    status: "confirmed",
    price: 150,
  },
  {
    id: "2",
    clientName: "Olivia Brown",
    clientEmail: "olivia@example.com",
    service: "Manicure & Pedicure",
    date: "2025-01-15",
    time: "11:30 AM",
    duration: "1h 30m",
    stylist: "Lisa Chen",
    status: "confirmed",
    price: 85,
  },
  {
    id: "3",
    clientName: "Sophia Davis",
    clientEmail: "sophia@example.com",
    service: "Facial Treatment",
    date: "2025-01-15",
    time: "2:00 PM",
    duration: "1h",
    stylist: "Anna Martinez",
    status: "pending",
    price: 120,
  },
  {
    id: "4",
    clientName: "Michael Johnson",
    clientEmail: "michael@example.com",
    service: "Hair Cut",
    date: "2025-01-16",
    time: "9:00 AM",
    duration: "45m",
    stylist: "David Kim",
    status: "confirmed",
    price: 45,
  },
  {
    id: "5",
    clientName: "Sarah Williams",
    clientEmail: "sarah@example.com",
    service: "Spa Package",
    date: "2025-01-16",
    time: "1:00 PM",
    duration: "3h",
    stylist: "Anna Martinez",
    status: "cancelled",
    price: 250,
  },
];

const Appointments = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", className: string }> = {
      confirmed: { variant: "default", className: "bg-success hover:bg-success/90" },
      pending: { variant: "secondary", className: "bg-warning text-warning-foreground hover:bg-warning/90" },
      completed: { variant: "outline", className: "border-primary text-primary" },
      cancelled: { variant: "destructive", className: "" },
      no_show: { variant: "outline", className: "border-muted-foreground text-muted-foreground" },
    };

    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage and track all salon appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 transition-base">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Appointments List */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {mockAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-smooth"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{appointment.clientName}</h4>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{appointment.clientEmail}</p>
                          <p className="text-sm font-medium text-primary">{appointment.service}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time} ({appointment.duration})</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <User className="w-4 h-4" />
                            <span>{appointment.stylist}</span>
                          </div>
                          <p className="text-lg font-bold text-foreground">${appointment.price}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="today">
                <p className="text-center text-muted-foreground py-8">
                  Filter for today's appointments will be applied here
                </p>
              </TabsContent>

              <TabsContent value="upcoming">
                <p className="text-center text-muted-foreground py-8">
                  Filter for upcoming appointments will be applied here
                </p>
              </TabsContent>

              <TabsContent value="completed">
                <p className="text-center text-muted-foreground py-8">
                  Filter for completed appointments will be applied here
                </p>
              </TabsContent>

              <TabsContent value="cancelled">
                <p className="text-center text-muted-foreground py-8">
                  Filter for cancelled appointments will be applied here
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
