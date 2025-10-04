import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblReport, TblTransactionAccount } from "@/models/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReportsView = observer(() => {
  const branchId = authStore.getBranchId();
  const reports = getFromLocalStorage<TblReport[]>("tblReport") || [];
  const accounts = getFromLocalStorage<TblTransactionAccount[]>("tblTransactionAccount") || [];

  const branchReports = reports.filter(r => r.branchId === branchId && !r.deleted);
  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || "-";

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SUCCESS": return "default";
      case "PENDING": return "secondary";
      case "FAILED": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Layout>
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
                {branchReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {getAccountName(report.accountId)}
                    </TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {report.description}
                    </TableCell>
                    <TableCell className={report.amount >= 0 ? "text-success" : "text-destructive"}>
                      Rp {Math.abs(report.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </Badge>
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

export default ReportsView