import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, DollarSign, Edit, Trash2 } from "lucide-react";

const mockServices = [
  {
    id: "1",
    name: "Hair Cut & Styling",
    category: "Hair Services",
    duration: 60,
    price: 50,
    isActive: true,
    description: "Professional haircut with styling",
  },
  {
    id: "2",
    name: "Hair Coloring",
    category: "Hair Services",
    duration: 120,
    price: 150,
    isActive: true,
    description: "Full hair coloring service with premium products",
  },
  {
    id: "3",
    name: "Manicure",
    category: "Nail Services",
    duration: 45,
    price: 35,
    isActive: true,
    description: "Classic manicure with nail care",
  },
  {
    id: "4",
    name: "Pedicure",
    category: "Nail Services",
    duration: 60,
    price: 45,
    isActive: true,
    description: "Relaxing pedicure treatment",
  },
  {
    id: "5",
    name: "Facial Treatment",
    category: "Spa Services",
    duration: 90,
    price: 120,
    isActive: true,
    description: "Deep cleansing facial with massage",
  },
  {
    id: "6",
    name: "Full Body Massage",
    category: "Spa Services",
    duration: 120,
    price: 180,
    isActive: true,
    description: "Relaxing full body massage therapy",
  },
];

const Services = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground mt-1">Manage your salon's service menu</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 transition-base">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServices.map((service) => (
            <Card key={service.id} className="border-border/50 shadow-md hover:shadow-lg transition-smooth overflow-hidden">
              <div className="h-2 bg-gradient-primary" />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-2">{service.name}</CardTitle>
                    <Badge variant="secondary" className="mb-2">
                      {service.category}
                    </Badge>
                  </div>
                  <Badge 
                    variant={service.isActive ? "default" : "secondary"}
                    className={service.isActive ? "bg-success hover:bg-success/90" : ""}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Duration</span>
                    </div>
                    <span className="font-medium">{service.duration} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>Price</span>
                    </div>
                    <span className="font-bold text-lg text-primary">${service.price}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Categories */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Service Categories</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Hair Services", "Nail Services", "Spa Services", "Beauty Treatments"].map((category) => (
                <div
                  key={category}
                  className="p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-smooth text-center"
                >
                  <h4 className="font-semibold text-foreground mb-1">{category}</h4>
                  <p className="text-sm text-muted-foreground">
                    {mockServices.filter((s) => s.category === category).length} services
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Services;
