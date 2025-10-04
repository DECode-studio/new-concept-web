import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, Receipt, TrendingUp, TrendingDown } from "lucide-react";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblBranch, TblStudent, TblReport } from "@/models/types";
import { TransactionStatus } from "@/models/enums";

const DashbaordView = () => {
  const branches = getFromLocalStorage<TblBranch[]>("tblBranch") || [];
  const students = getFromLocalStorage<TblStudent[]>("tblStudent") || [];
  const reports = getFromLocalStorage<TblReport[]>("tblReport") || [];

  const activeBranches = branches.filter(b => !b.deleted).length;
  const activeStudents = students.filter(s => !s.deleted && s.status === "ACTIVE").length;
  
  const totalIncome = reports
    .filter(r => !r.deleted && r.status === TransactionStatus.SUCCESS && r.amount > 0)
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalExpense = reports
    .filter(r => !r.deleted && r.status === TransactionStatus.SUCCESS && r.amount < 0)
    .reduce((sum, r) => sum + Math.abs(r.amount), 0);

  const branchStats = branches
    .filter(b => !b.deleted)
    .map(branch => {
      const branchStudents = students.filter(s => s.branchId === branch.id && !s.deleted).length;
      const branchIncome = reports
        .filter(r => r.branchId === branch.id && !r.deleted && r.status === TransactionStatus.SUCCESS && r.amount > 0)
        .reduce((sum, r) => sum + r.amount, 0);
      
      return {
        id: branch.id,
        name: branch.name,
        students: branchStudents,
        income: branchIncome,
        type: branch.type,
      };
    });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all branches and activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Branches
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBranches}</div>
              <p className="text-xs text-muted-foreground">
                Active branches nationwide
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all branches
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
                Rp {(totalIncome / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                All time revenue
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
                Rp {(totalExpense / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                All time expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Branch Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
            <CardDescription>
              Overview of each branch's students and revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {branchStats.map((branch) => (
                <div key={branch.id} className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {branch.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {branch.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{branch.students}</span>
                      <span className="text-muted-foreground">students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="font-medium text-success">
                        Rp {(branch.income / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Income Overview</CardTitle>
              <CardDescription>
                Total revenue from all branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Income</span>
                  <span className="text-lg font-bold text-success">
                    Rp {(totalIncome / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Per Branch Average</span>
                  <span className="text-lg font-semibold">
                    Rp {(totalIncome / activeBranches / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Overview</CardTitle>
              <CardDescription>
                Total expenses from all branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                  <span className="text-lg font-bold text-destructive">
                    Rp {(totalExpense / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Net Profit</span>
                  <span className="text-lg font-semibold text-primary">
                    Rp {((totalIncome - totalExpense) / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashbaordView