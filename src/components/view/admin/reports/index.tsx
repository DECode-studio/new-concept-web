import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblReport, TblBranch, TblUser, TblTransactionAccount } from "@/models/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReportsView = () => {
  const reports = getFromLocalStorage<TblReport[]>("tblReport") || [];
  const branches = getFromLocalStorage<TblBranch[]>("tblBranch") || [];
  const users = getFromLocalStorage<TblUser[]>("tblUser") || [];
  const accounts = getFromLocalStorage<TblTransactionAccount[]>("tblTransactionAccount") || [];

  const activeReports = reports.filter(r => !r.deleted);

  const getBranchName = (id: string) => branches.find(b => b.id === id)?.name || "-";
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || "-";
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
                {activeReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {getBranchName(report.branchId)}
                    </TableCell>
                    <TableCell>{getAccountName(report.accountId)}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell className={report.amount >= 0 ? "text-success" : "text-destructive"}>
                      Rp {Math.abs(report.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getUserName(report.userId)}
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
};

export default ReportsView