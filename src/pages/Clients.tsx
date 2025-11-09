import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  Star,
  History,
  Search,
  Filter,
  User
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockClients = [
  {
    id: "1",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma@example.com",
    phone: "+251 912 345 678",
    avatar: undefined,
    totalVisits: 24,
    totalSpent: 3600,
    lastVisit: "2025-01-10",
    preferredStylist: "Maria Garcia",
    status: "active",
    notes: "Prefers natural hair products. Allergic to certain chemicals.",
    loyalty: "gold",
  },
  {
    id: "2",
    firstName: "Olivia",
    lastName: "Brown",
    email: "olivia@example.com",
    phone: "+251 912 345 679",
    avatar: undefined,
    totalVisits: 18,
    totalSpent: 2700,
    lastVisit: "2025-01-12",
    preferredStylist: "Lisa Chen",
    status: "active",
    notes: "Regular customer for manicures.",
    loyalty: "silver",
  },
  {
    id: "3",
    firstName: "Sophia",
    lastName: "Davis",
    email: "sophia@example.com",
    phone: "+251 912 345 680",
    avatar: undefined,
    totalVisits: 35,
    totalSpent: 5250,
    lastVisit: "2025-01-14",
    preferredStylist: "Anna Martinez",
    status: "active",
    notes: "VIP client. Loves spa treatments.",
    loyalty: "platinum",
  },
  {
    id: "4",
    firstName: "Ava",
    lastName: "Johnson",
    email: "ava@example.com",
    phone: "+251 912 345 681",
    avatar: undefined,
    totalVisits: 8,
    totalSpent: 960,
    lastVisit: "2025-01-08",
    preferredStylist: "Maria Garcia",
    status: "active",
    notes: "New client, building relationship.",
    loyalty: "bronze",
  },
  {
    id: "5",
    firstName: "Isabella",
    lastName: "Martinez",
    email: "isabella@example.com",
    phone: "+251 912 345 682",
    avatar: undefined,
    totalVisits: 42,
    totalSpent: 6300,
    lastVisit: "2025-01-15",
    preferredStylist: "Lisa Chen",
    status: "active",
    notes: "Long-time loyal customer.",
    loyalty: "platinum",
  },
];

const mockAppointmentHistory = [
  {
    id: "1",
    date: "2025-01-10",
    service: "Hair Styling",
    stylist: "Maria Garcia",
    amount: 50,
    status: "completed",
  },
  {
    id: "2",
    date: "2024-12-20",
    service: "Hair Coloring",
    stylist: "Maria Garcia",
    amount: 150,
    status: "completed",
  },
  {
    id: "3",
    date: "2024-11-15",
    service: "Hair Cut",
    stylist: "Maria Garcia",
    amount: 45,
    status: "completed",
  },
];

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getLoyaltyBadge = (loyalty: string) => {
    const configs: Record<string, { className: string; label: string }> = {
      platinum: { className: "bg-gradient-to-r from-slate-400 to-slate-600 text-white", label: "Platinum" },
      gold: { className: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white", label: "Gold" },
      silver: { className: "bg-gradient-to-r from-gray-300 to-gray-500 text-white", label: "Silver" },
      bronze: { className: "bg-gradient-to-r from-orange-400 to-orange-600 text-white", label: "Bronze" },
    };

    const config = configs[loyalty] || configs.bronze;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage your client relationships and history</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 transition-base">
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the client's information to create their profile
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Emma" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Wilson" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="emma@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+251 912 345 678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="Any special preferences or allergies..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-primary" onClick={() => setIsAddDialogOpen(false)}>
                  Add Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clients List */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 shadow-md">
              <CardHeader>
                <CardTitle>All Clients ({mockClients.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {mockClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 rounded-lg border cursor-pointer transition-smooth hover:shadow-md ${
                      selectedClient.id === client.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-gradient-card"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {client.firstName[0]}{client.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">
                          {client.firstName} {client.lastName}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {getLoyaltyBadge(client.loyalty)}
                      <span className="text-xs text-muted-foreground">{client.totalVisits} visits</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Client Details */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarImage src={selectedClient.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {selectedClient.firstName[0]}{selectedClient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {selectedClient.firstName} {selectedClient.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getLoyaltyBadge(selectedClient.loyalty)}
                        <Badge variant="secondary" className="bg-success text-success-foreground">
                          {selectedClient.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Mail className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-sm font-medium">{selectedClient.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Phone className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium">{selectedClient.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Client Statistics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
                          <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="text-2xl font-bold text-foreground">{selectedClient.totalVisits}</p>
                          <p className="text-sm text-muted-foreground">Total Visits</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
                          <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
                          <p className="text-2xl font-bold text-foreground">${selectedClient.totalSpent}</p>
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
                          <Star className="w-8 h-8 text-gold mx-auto mb-2" />
                          <p className="text-2xl font-bold text-foreground">${(selectedClient.totalSpent / selectedClient.totalVisits).toFixed(0)}</p>
                          <p className="text-sm text-muted-foreground">Avg. Visit Value</p>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Preferences</h4>
                      <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Preferred Stylist</span>
                          <span className="text-sm font-medium text-foreground">{selectedClient.preferredStylist}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Last Visit</span>
                          <span className="text-sm font-medium text-foreground">
                            {new Date(selectedClient.lastVisit).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">Appointment History</h4>
                      <Badge variant="secondary">{mockAppointmentHistory.length} appointments</Badge>
                    </div>
                    {mockAppointmentHistory.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-smooth"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-semibold text-foreground">{appointment.service}</h5>
                              <Badge variant="outline" className="border-success text-success">
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {new Date(appointment.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3" />
                                {appointment.stylist}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">${appointment.amount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="notes">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{selectedClient.notes}</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
