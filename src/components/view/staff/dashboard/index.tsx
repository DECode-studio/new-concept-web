"use client";

import { observer } from "mobx-react-lite";
import { ClipboardList, FileText, Users, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authStore, studentStore, reportStore } from "@/stores";
import { TransactionStatus } from "@/models/enums";
import { formatIDR } from "@/utils/number";

const StaffDashboard = observer(() => {
  const branchId = authStore.getBranchId();
  const students = branchId ? studentStore.getByBranch(branchId) : [];
  const reports = branchId ? reportStore.getByBranch(branchId) : [];

  const todaysReports = reports.filter((report) => {
    const today = new Date().toDateString();
    return new Date(report.createdAt).toDateString() === today;
  });

  const successReportsToday = todaysReports.filter(
    (report) => report.status === TransactionStatus.SUCCESS,
  );

  const incomeToday = successReportsToday
    .filter((report) => report.amount > 0)
    .reduce((acc, report) => acc + report.amount, 0);

  const pendingToday = todaysReports.filter(
    (report) => report.status === TransactionStatus.PENDING,
  ).length;

  return (
    <div className="space-y-8 pb-8">
      <Card className="border-none bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <CardContent className="flex flex-col gap-5 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="h-3 w-3" />
              Daily Operations
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                Ready for a productive day?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Log today&apos;s activity, stay ahead of pending invoices, and keep student data tidy.
                Everything you need lives right here.
              </p>
            </div>
          </div>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start checklist
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Today&apos;s Reports
              </p>
              <p className="text-3xl font-semibold text-foreground">{todaysReports.length}</p>
            </div>
            <p className="text-xs text-muted-foreground">Entries submitted today</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Revenue Logged
              </p>
              <p className="text-3xl font-semibold text-primary">{formatIDR(incomeToday)}</p>
            </div>
            <p className="text-xs text-muted-foreground">Successful payments captured today</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Items
              </p>
              <p className="text-3xl font-semibold text-amber-600">{pendingToday}</p>
            </div>
            <p className="text-xs text-muted-foreground">Awaiting manager review</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Branch Students
              </p>
              <p className="text-3xl font-semibold text-foreground">
                {students.length.toLocaleString("id-ID")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Keep profiles up to date</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <p className="text-xs text-muted-foreground">Frequently used workflows.</p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" className="h-24 flex-col items-start justify-start gap-2 text-left">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Register Student</span>
              <span className="text-xs text-muted-foreground">Onboard a new learner instantly</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col items-start justify-start gap-2 text-left">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Log Payment</span>
              <span className="text-xs text-muted-foreground">Record tuition or material fees</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col items-start justify-start gap-2 text-left">
              <ClipboardList className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Update Attendance</span>
              <span className="text-xs text-muted-foreground">Mark today&apos;s attendance sheet</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col items-start justify-start gap-2 text-left">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Create Task</span>
              <span className="text-xs text-muted-foreground">Assign follow-up to coaches</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Checklist</CardTitle>
            <p className="text-xs text-muted-foreground">
              Work down this list to keep operations humming.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: "Verify tuition receipts",
                detail: `${successReportsToday.length} payments logged today`,
              },
              {
                title: "Update classroom roster",
                detail: `${students.filter((student) => student.status !== "ACTIVE").length} profiles need attention`,
              },
              {
                title: "Sync with manager",
                detail: `${pendingToday} finance entries pending approval`,
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Complete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default StaffDashboard;
