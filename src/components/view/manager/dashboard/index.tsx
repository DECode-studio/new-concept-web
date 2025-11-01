"use client";

import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { ArrowUpRight, ClipboardList, DollarSign, LineChart, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authStore, studentStore, reportStore } from "@/stores";
import { TransactionStatus } from "@/models/enums";
import { formatIDR } from "@/utils/number";

const ManagerDashboard = observer(() => {
  const branchId = authStore.getBranchId();
  const branchStudents = branchId ? studentStore.getByBranch(branchId) : [];
  const branchReports = branchId ? reportStore.getByBranch(branchId) : [];

  const activeStudents = branchStudents.filter((student) => student.status === "ACTIVE").length;

  const { income, expense, net } = useMemo(() => {
    const successReports = branchReports.filter(
      (report) => report.status === TransactionStatus.SUCCESS,
    );

    const incomeTotal = successReports
      .filter((report) => report.amount > 0)
      .reduce((acc, report) => acc + report.amount, 0);

    const expenseTotal = successReports
      .filter((report) => report.amount < 0)
      .reduce((acc, report) => acc + Math.abs(report.amount), 0);

    return {
      income: incomeTotal,
      expense: expenseTotal,
      net: incomeTotal - expenseTotal,
    };
  }, [branchReports]);

  const pendingReports = branchReports.filter(
    (report) => report.status === TransactionStatus.PENDING && !report.finalized,
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Hero banner */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-secondary/20 via-secondary/10 to-background">
        <CardContent className="flex flex-col gap-5 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
              <LineChart className="h-3 w-3" />
              Branch Overview
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                Hello, Branch Manager
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Monitor your branch growth in real-time. Identify opportunities, act on pending tasks,
                and rally your team around the next milestone.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Schedule Team Huddle
            </Button>
            <Button variant="outline" size="lg" className="border-secondary/40 text-secondary hover:bg-secondary/10">
              Export Branch Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-none bg-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Revenue (Month)
              </p>
              <p className="text-3xl font-semibold text-primary">{formatIDR(income)}</p>
            </div>
            <p className="text-xs text-muted-foreground">Only settled payments included</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Expense (Month)
              </p>
              <p className="text-3xl font-semibold text-destructive">{formatIDR(expense)}</p>
            </div>
            <p className="text-xs text-muted-foreground">Approved branch expenditure</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Net Result
              </p>
              <p className="text-3xl font-semibold text-emerald-600">{formatIDR(net)}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {income ? `${((net / income) * 100).toFixed(1)}% of monthly revenue` : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Students
              </p>
              <p className="text-3xl font-semibold text-foreground">
                {activeStudents.toLocaleString("id-ID")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {branchStudents.length
                ? `${((activeStudents / branchStudents.length) * 100).toFixed(1)}% engagement`
                : "No enrolment yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasking & Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Today&apos;s Focus</CardTitle>
              <p className="text-xs text-muted-foreground">
                Next best actions derived from your current performance.
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              View task board
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Engage Learners</p>
                  <p className="text-xs text-muted-foreground">
                    {branchStudents.length - activeStudents} dormant students need a check-in.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-500/10 p-2 text-amber-600">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Approve Finance</p>
                  <p className="text-xs text-muted-foreground">
                    {pendingReports.length} reports waiting for final verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Revenue streak</p>
                  <p className="text-xs text-muted-foreground">
                    Keep daily intakes above {formatIDR(income / 30 || 0)} to hit monthly goal.
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Review pipeline
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Coach briefing</p>
                  <p className="text-xs text-muted-foreground">
                    Summarize today&apos;s wins for your teaching staff.
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Draft update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Financial Snapshot</CardTitle>
            <p className="text-xs text-muted-foreground">Revenue, expense, and net balance.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2 text-xl font-semibold text-primary">{formatIDR(income)}</p>
              <p className="text-xs text-muted-foreground">Updated {new Date().toLocaleDateString()}</p>
            </div>
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Expense</p>
                <ArrowUpRight className="h-4 w-4 text-destructive" />
              </div>
              <p className="mt-2 text-xl font-semibold text-destructive">{formatIDR(expense)}</p>
              <p className="text-xs text-muted-foreground">Awaiting approvals included</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Net Balance</p>
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-xl font-semibold text-emerald-600">{formatIDR(net)}</p>
              <p className="text-xs text-muted-foreground">
                {expense ? `${((net / expense) * 100).toFixed(1)}%` : "0.0"} vs expense
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default ManagerDashboard;
