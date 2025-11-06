"use client";

import { observer } from "mobx-react-lite";
import { Download, Filter } from "lucide-react";

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
import { reportStore, branchStore, userStore, accountStore } from "@/stores";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUCCESS: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  EXPIRED: "outline",
};

const ReportsView = observer(() => {
  const reports = reportStore.list();
  const branches = branchStore.list();
  const users = userStore.list();
  const accounts = accountStore.list();

  const getBranchName = (id: string) => branches.find((branch) => branch.id === id)?.name ?? "-";
  const getUserName = (id: string) => users.find((user) => user.id === id)?.name ?? "-";
  const getAccountName = (id: string) => accounts.find((acc) => acc.id === id)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">View all branch financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recorded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{getBranchName(report.branchId)}</TableCell>
                  <TableCell>{getAccountName(report.accountId)}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell className={report.amount >= 0 ? "text-success" : "text-destructive"}>
                    Rp {Math.abs(report.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[report.status] ?? "outline"}>{report.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{getUserName(report.userId)}</TableCell>
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
