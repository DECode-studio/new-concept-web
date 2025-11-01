"use client";

import { observer } from "mobx-react-lite";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authStore } from "@/stores";
import { reportStore, accountStore } from "@/stores";
import { TransactionStatus } from "@/models/types";

const statusVariant: Record<TransactionStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [TransactionStatus.SUCCESS]: "default",
  [TransactionStatus.PENDING]: "secondary",
  [TransactionStatus.FAILED]: "destructive",
  [TransactionStatus.EXPIRED]: "outline",
};

const ReportsView = observer(() => {
  const branchId = authStore.getBranchId();
  const reports = branchId ? reportStore.getByBranch(branchId) : [];
  const accounts = accountStore.list();

  const getAccountName = (id: string) => accounts.find((account) => account.id === id)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Input and edit branch financial data</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{getAccountName(report.accountId)}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell className="text-muted-foreground">{report.description}</TableCell>
                  <TableCell className={report.amount >= 0 ? "text-success" : "text-destructive"}>
                    Rp {Math.abs(report.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[report.status] ?? "outline"}>{report.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
});

export default ReportsView;
