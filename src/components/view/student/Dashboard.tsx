import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Receipt, ClipboardList, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { studentStore } from "@/stores/StudentStore";
import { Badge } from "@/components/ui/badge";

export const StudentDashboard = observer(() => {
  const userId = authStore.getUserId();
  const student = studentStore.getStudentByUserId(userId || "");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {student?.nickName || "Student"}!
          </p>
        </div>

        {/* Student Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{student?.fullName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-medium font-mono">{student?.registrationNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={student?.status === "ACTIVE" ? "default" : "secondary"}>
                  {student?.status || "UNKNOWN"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {student?.studyStartTime ? new Date(student.studyStartTime).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <User className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">My Profile</h3>
                <p className="text-xs text-muted-foreground">View personal details</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <Receipt className="h-8 w-8 text-secondary" />
                <h3 className="font-semibold">Invoices</h3>
                <p className="text-xs text-muted-foreground">View payment invoices</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <ClipboardList className="h-8 w-8 text-accent" />
                <h3 className="font-semibold">Attendance</h3>
                <p className="text-xs text-muted-foreground">View attendance history</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <h3 className="font-semibold">Reports</h3>
                <p className="text-xs text-muted-foreground">Academic reports</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
});
