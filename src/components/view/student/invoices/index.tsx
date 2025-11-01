"use client";

import { observer } from "mobx-react-lite";
import { Download, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authStore, studentStore, invoiceStore } from "@/stores";
import { TransactionStatus } from "@/models/types";

const statusLabel: Record<TransactionStatus, string> = {
  [TransactionStatus.SUCCESS]: "PAID",
  [TransactionStatus.PENDING]: "PENDING",
  [TransactionStatus.FAILED]: "FAILED",
  [TransactionStatus.EXPIRED]: "EXPIRED",
};

const InvoicesView = observer(() => {
  const userId = authStore.getUserId();
  const student = userId ? studentStore.getByUserId(userId) : null;
  const invoices = student ? invoiceStore.list().filter((invoice) => invoice.studentId === student.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Invoices</h1>
        <p className="text-muted-foreground">View and download payment invoices</p>
      </div>

      <div className="grid gap-4">
        {invoices.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No invoices yet
            </CardContent>
          </Card>
        ) : (
          invoices.map((invoice) => {
            const status = statusLabel[invoice.status] ?? invoice.status;
            return (
              <Card key={invoice.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{invoice.visibleNumber}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">Period: {invoice.period}</p>
                    </div>
                    <Badge variant={invoice.status === TransactionStatus.SUCCESS ? "default" : "secondary"}>{status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-2xl font-bold text-primary">Rp {invoice.totalAmount.toLocaleString()}</p>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {invoice.dueDate ? <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p> : null}
                        {invoice.paidAt ? <p className="text-success">Paid: {new Date(invoice.paidAt).toLocaleDateString()}</p> : null}
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
            );
          })
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Bank Transfer:</p>
            <p className="text-muted-foreground">Bank BCA - 1234567890</p>
            <p className="text-muted-foreground">A/N: New Concept English Course</p>
            <p className="mt-4 font-medium">After payment:</p>
            <p className="text-muted-foreground">Please send proof of payment to WhatsApp: +62 812 3456 7890</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default InvoicesView;
