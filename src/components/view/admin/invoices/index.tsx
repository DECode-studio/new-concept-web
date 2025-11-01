"use client";

import { observer } from "mobx-react-lite";
import { Download, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { invoiceStore, studentStore, branchStore } from "@/stores";

const statusLabel: Record<string, string> = {
  SUCCESS: "PAID",
  PENDING: "PENDING",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
};

const InvoicesView = observer(() => {
  const invoices = invoiceStore.list();
  const students = studentStore.list();
  const branches = branchStore.list();

  const getStudentName = (id: string) => students.find((student) => student.id === id)?.fullName ?? "Unknown";
  const getBranchName = (id: string) => branches.find((branch) => branch.id === id)?.name ?? "-";

  return (
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
        {invoices.map((invoice) => {
          const status = statusLabel[invoice.status] ?? invoice.status;
          return (
            <Card key={invoice.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{invoice.visibleNumber}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {getStudentName(invoice.studentId)} — {getBranchName(invoice.branchId)}
                    </p>
                  </div>
                  <Badge variant={invoice.status === "SUCCESS" ? "default" : "secondary"}>{status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold text-primary">Rp {invoice.totalAmount.toLocaleString()}</p>
                    {invoice.dueDate ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    ) : null}
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
          );
        })}
      </div>
    </div>
  );
});

export default InvoicesView;
