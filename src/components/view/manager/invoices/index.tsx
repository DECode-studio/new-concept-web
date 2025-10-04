import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const InvoicesView = observer(() => {
  const branchId = authStore.getBranchId();

  // Mock invoice data for branch
  const invoices = [
    { id: "INV-001", studentName: "Ahmad Fauzi", amount: 1500000, dueDate: new Date("2024-02-15"), status: "PAID" },
    { id: "INV-002", studentName: "Siti Nurhaliza", amount: 1500000, dueDate: new Date("2024-02-20"), status: "PENDING" },
    { id: "INV-003", studentName: "Budi Santoso", amount: 1800000, dueDate: new Date("2024-02-25"), status: "OVERDUE" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">Manage student invoices</p>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.studentName}</TableCell>
                    <TableCell>Rp {invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{invoice.dueDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice.status === "PAID" ? "default" : 
                        invoice.status === "PENDING" ? "secondary" : 
                        "destructive"
                      }>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
});

export default InvoicesView