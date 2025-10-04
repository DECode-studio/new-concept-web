import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, TrendingDown, BookOpen } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblStudent, TblReport } from "@/models/types";
import { TransactionStatus } from "@/models/enums";

const DashboardView = observer(() => {
  const branchId = authStore.getBranchId();
  const students = getFromLocalStorage<TblStudent[]>("tblStudent") || [];
  const reports = getFromLocalStorage<TblReport[]>("tblReport") || [];

  const branchStudents = students.filter(s => s.branchId === branchId && !s.deleted);
  const activeStudents = branchStudents.filter(s => s.status === "ACTIVE").length;

  const branchIncome = reports
    .filter(r => r.branchId === branchId && !r.deleted && r.status === TransactionStatus.SUCCESS && r.amount > 0)
    .reduce((sum, r) => sum + r.amount, 0);

  const branchExpense = reports
    .filter(r => r.branchId === branchId && !r.deleted && r.status === TransactionStatus.SUCCESS && r.amount < 0)
    .reduce((sum, r) => sum + Math.abs(r.amount), 0);

  const netProfit = branchIncome - branchExpense;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Branch performance overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStudents}</div>
              <p className="text-xs text-muted-foreground">
                In this branch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                Rp {(branchIncome / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Branch revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                Rp {(branchExpense / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Branch expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Net Profit
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                Rp {(netProfit / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Income - Expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for branch management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Add New Student</h3>
                      <p className="text-sm text-muted-foreground">Register a new student</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Generate Invoice</h3>
                      <p className="text-sm text-muted-foreground">Create student invoice</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
});

export default DashboardView