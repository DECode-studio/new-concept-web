import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AdminInvoices = () => {
  // Mock data - will be replaced with actual store
  const invoices = [
    {
      id: "INV-2024-001",
      studentName: "Ahmad Rizki",
      branch: "Jakarta Pusat",
      amount: 500000,
      status: "PAID",
      dueDate: "2024-02-01",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">View and manage all student invoices</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>

        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{invoice.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {invoice.studentName} - {invoice.branch}
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
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
      </div>
    </Layout>
  );
};
