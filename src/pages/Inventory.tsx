import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertTriangle, TrendingDown, Edit } from "lucide-react";

const mockInventory = [
  {
    id: "1",
    name: "Shampoo Professional",
    category: "Hair Care",
    quantity: 45,
    reorderLevel: 20,
    unitPrice: 15.99,
    supplier: "Beauty Supplies Co.",
    status: "in_stock",
  },
  {
    id: "2",
    name: "Hair Conditioner",
    category: "Hair Care",
    quantity: 12,
    reorderLevel: 15,
    unitPrice: 18.50,
    supplier: "Beauty Supplies Co.",
    status: "low_stock",
  },
  {
    id: "3",
    name: "Hair Color - Black",
    category: "Coloring",
    quantity: 8,
    reorderLevel: 10,
    unitPrice: 25.00,
    supplier: "Color Masters Ltd.",
    status: "low_stock",
  },
  {
    id: "4",
    name: "Nail Polish Set",
    category: "Nail Care",
    quantity: 120,
    reorderLevel: 30,
    unitPrice: 8.99,
    supplier: "Nail Artistry Inc.",
    status: "in_stock",
  },
  {
    id: "5",
    name: "Facial Mask",
    category: "Spa Products",
    quantity: 3,
    reorderLevel: 10,
    unitPrice: 12.50,
    supplier: "Spa Essentials",
    status: "critical",
  },
];

const Inventory = () => {
  const getStatusBadge = (status: string) => {
    const configs: Record<string, { variant: "default" | "secondary" | "destructive"; className: string; label: string }> = {
      in_stock: { variant: "default", className: "bg-success", label: "In Stock" },
      low_stock: { variant: "secondary", className: "bg-warning text-warning-foreground", label: "Low Stock" },
      critical: { variant: "destructive", className: "", label: "Critical" },
      out_of_stock: { variant: "destructive", className: "", label: "Out of Stock" },
    };

    const config = configs[status] || configs.in_stock;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const lowStockItems = mockInventory.filter(item => item.quantity <= item.reorderLevel);
  const totalValue = mockInventory.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage salon supplies and products</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 transition-base">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">{mockInventory.length}</p>
                </div>
                <Package className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-success">${totalValue.toFixed(2)}</p>
                </div>
                <TrendingDown className="w-10 h-10 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Categories</p>
                  <p className="text-2xl font-bold text-foreground">5</p>
                </div>
                <Package className="w-10 h-10 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Card className="border-warning/50 shadow-md bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg bg-background border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Current: {item.quantity} units</p>
                    <p className="text-sm text-muted-foreground">Reorder at: {item.reorderLevel} units</p>
                    <Button size="sm" className="w-full mt-3" variant="outline">
                      Reorder Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>All Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInventory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-smooth"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        {getStatusBadge(item.status)}
                      </div>
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="text-sm font-semibold text-foreground">{item.quantity} units</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Unit Price</p>
                      <p className="text-sm font-semibold text-foreground">${item.unitPrice}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Total Value</p>
                      <p className="text-sm font-bold text-primary">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    Supplier: {item.supplier} • Reorder Level: {item.reorderLevel} units
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
