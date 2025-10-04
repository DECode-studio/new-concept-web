import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ClipboardList, TrendingUp } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblStudent, TblReport } from "@/models/types";

export const StaffDashboard = observer(() => {
  const branchId = authStore.getBranchId();
  const students = getFromLocalStorage<TblStudent[]>("tblStudent") || [];
  const reports = getFromLocalStorage<TblReport[]>("tblReport") || [];

  const branchStudents = students.filter(s => s.branchId === branchId && !s.deleted);
  const activeStudents = branchStudents.filter(s => s.status === "ACTIVE").length;

  const todayReports = reports.filter(r => {
    const today = new Date().toDateString();
    const reportDate = new Date(r.createdAt).toDateString();
    return r.branchId === branchId && !r.deleted && reportDate === today;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Daily operations and data entry
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
                Today's Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayReports.length}</div>
              <p className="text-xs text-muted-foreground">
                Entries today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Tasks
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Tasks to complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Good</div>
              <p className="text-xs text-muted-foreground">
                Work status
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common daily tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Users className="h-8 w-8 text-primary" />
                    <h3 className="font-semibold">Add Student</h3>
                    <p className="text-xs text-muted-foreground">Register new student</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <FileText className="h-8 w-8 text-secondary" />
                    <h3 className="font-semibold">Add Report</h3>
                    <p className="text-xs text-muted-foreground">Input financial report</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <ClipboardList className="h-8 w-8 text-accent" />
                    <h3 className="font-semibold">Mark Attendance</h3>
                    <p className="text-xs text-muted-foreground">Record attendance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayReports.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activity today. Start by adding reports or student data.
                </p>
              ) : (
                todayReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      Rp {Math.abs(report.amount).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
});
