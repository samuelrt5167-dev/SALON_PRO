import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockPayments = [
  {
    id: "1",
    transactionId: "TXN-2025-001",
    clientName: "Emma Wilson",
    service: "Hair Styling & Color",
    amount: 150,
    paymentMethod: "chapa",
    status: "completed",
    date: "2025-01-15",
    time: "10:30 AM",
  },
  {
    id: "2",
    transactionId: "TXN-2025-002",
    clientName: "Olivia Brown",
    service: "Manicure & Pedicure",
    amount: 85,
    paymentMethod: "cash",
    status: "completed",
    date: "2025-01-15",
    time: "11:45 AM",
  },
  {
    id: "3",
    transactionId: "TXN-2025-003",
    clientName: "Sophia Davis",
    service: "Facial Treatment",
    amount: 120,
    paymentMethod: "card",
    status: "pending",
    date: "2025-01-15",
    time: "2:15 PM",
  },
  {
    id: "4",
    transactionId: "TXN-2025-004",
    clientName: "Michael Johnson",
    service: "Hair Cut",
    amount: 45,
    paymentMethod: "telebirr",
    status: "completed",
    date: "2025-01-14",
    time: "9:00 AM",
  },
  {
    id: "5",
    transactionId: "TXN-2025-005",
    clientName: "Sarah Williams",
    service: "Spa Package",
    amount: 250,
    paymentMethod: "bank_transfer",
    status: "failed",
    date: "2025-01-14",
    time: "3:30 PM",
  },
];

const Payments = () => {
  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: any; className: string; label: string }> = {
      completed: { icon: CheckCircle, className: "bg-success text-success-foreground", label: "Completed" },
      pending: { icon: Clock, className: "bg-warning text-warning-foreground", label: "Pending" },
      failed: { icon: XCircle, className: "bg-destructive text-destructive-foreground", label: "Failed" },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Cash",
      card: "Card",
      chapa: "Chapa",
      telebirr: "Telebirr",
      bank_transfer: "Bank Transfer",
    };

    return <Badge variant="outline">{labels[method] || method}</Badge>;
  };

  const todayTotal = mockPayments
    .filter(p => p.date === "2025-01-15" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const completedPayments = mockPayments.filter(p => p.status === "completed");
  const pendingPayments = mockPayments.filter(p => p.status === "pending");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground mt-1">Track transactions and payment methods</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Today's Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${todayTotal}</p>
                </div>
                <DollarSign className="w-10 h-10 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-2xl font-bold text-success">{completedPayments.length}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-warning">{pendingPayments.length}</p>
                </div>
                <Clock className="w-10 h-10 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Transaction</p>
                  <p className="text-2xl font-bold text-primary">
                    ${(mockPayments.reduce((sum, p) => sum + p.amount, 0) / mockPayments.length).toFixed(0)}
                  </p>
                </div>
                <CreditCard className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {mockPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-smooth"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{payment.clientName}</h4>
                          {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{payment.service}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                        <p className="text-xs font-mono text-foreground">{payment.transactionId}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                        <div className="flex items-center gap-1 text-xs text-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">{payment.time}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                        {getPaymentMethodBadge(payment.paymentMethod)}
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Amount</p>
                        <p className="text-xl font-bold text-primary">${payment.amount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="completed">
                <p className="text-center text-muted-foreground py-8">
                  Filter for completed payments will be applied here
                </p>
              </TabsContent>

              <TabsContent value="pending">
                <p className="text-center text-muted-foreground py-8">
                  Filter for pending payments will be applied here
                </p>
              </TabsContent>

              <TabsContent value="failed">
                <p className="text-center text-muted-foreground py-8">
                  Filter for failed payments will be applied here
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>Accepted Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "Cash", icon: DollarSign, color: "text-success" },
                { name: "Card", icon: CreditCard, color: "text-primary" },
                { name: "Chapa", icon: CreditCard, color: "text-secondary" },
                { name: "Telebirr", icon: CreditCard, color: "text-accent" },
                { name: "Bank Transfer", icon: CreditCard, color: "text-info" },
              ].map((method) => (
                <div
                  key={method.name}
                  className="p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-smooth text-center"
                >
                  <method.icon className={`w-8 h-8 mx-auto mb-2 ${method.color}`} />
                  <p className="text-sm font-medium text-foreground">{method.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
