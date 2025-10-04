import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { Badge } from "@/components/ui/badge";

export const StudentInvoices = observer(() => {
  const userId = authStore.getUserId();

  // Mock data - will be replaced with actual invoice store
  const invoices = [
    {
      id: "INV-2024-001",
      month: "February 2024",
      amount: 500000,
      status: "PAID",
      dueDate: "2024-02-01",
      paidDate: "2024-02-01",
    },
    {
      id: "INV-2024-002",
      month: "March 2024",
      amount: 500000,
      status: "PENDING",
      dueDate: "2024-03-01",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Invoices</h1>
          <p className="text-muted-foreground">View and download payment invoices</p>
        </div>

        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{invoice.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {invoice.month}
                    </p>
                  </div>
                  <Badge variant={invoice.status === "PAID" ? "default" : "secondary"}>
                    {invoice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      Rp {invoice.amount.toLocaleString()}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground space-y-1">
                      <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                      {invoice.paidDate && (
                        <p className="text-success">
                          Paid: {new Date(invoice.paidDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Bank Transfer:</p>
              <p className="text-muted-foreground">Bank BCA - 1234567890</p>
              <p className="text-muted-foreground">A/N: New Concept English Course</p>
              <p className="font-medium mt-4">After payment:</p>
              <p className="text-muted-foreground">
                Please send proof of payment to WhatsApp: +62 812 3456 7890
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
});
