"use client";

import { observer } from "mobx-react-lite";
import {
  ArrowUpRight,
  Building2,
  LucideIcon,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { branchStore, studentStore, reportStore, logStore } from "@/stores";
import { TransactionStatus } from "@/models/enums";
import { formatIDR } from "@/utils/number";

const metricCard = (
  title: string,
  value: string,
  delta: string,
  icon: LucideIcon,
  accent: string,
) => (
  <Card className="overflow-hidden border-none bg-gradient-to-br from-white via-white to-muted shadow-sm dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
    <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
        </div>
        <div
          className={`rounded-2xl p-3 text-background ${accent}`}
        >
          {icon({ className: "h-5 w-5" })}
        </div>
      </div>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <ArrowUpRight className="h-3 w-3" />
        {delta}
      </span>
    </CardContent>
  </Card>
);

const DashboardView = observer(() => {
  const branches = branchStore.getActiveBranches();
  const students = studentStore.list();
  const reports = reportStore.list();
  const logs = logStore.list().slice(0, 5);

  const activeBranches = branches.length;
  const activeStudents = students.filter((student) => student.status === "ACTIVE").length;

  const totalIncome = reports
    .filter((report) => report.status === TransactionStatus.SUCCESS && report.amount > 0)
    .reduce((sum, report) => sum + report.amount, 0);

  const totalExpense = reports
    .filter((report) => report.status === TransactionStatus.SUCCESS && report.amount < 0)
    .reduce((sum, report) => sum + Math.abs(report.amount), 0);

  const netProfit = totalIncome - totalExpense;

  const topBranches = branches
    .map((branch) => {
      const branchIncome = reports
        .filter(
          (report) =>
            report.branchId === branch.id &&
            report.status === TransactionStatus.SUCCESS &&
            report.amount > 0,
        )
        .reduce((sum, report) => sum + report.amount, 0);

      const branchStudents = students.filter((student) => student.branchId === branch.id).length;

      return {
        ...branch,
        income: branchIncome,
        students: branchStudents,
      };
    })
    .sort((a, b) => b.income - a.income)
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero / Summary */}
      <Card className="overflow-hidden border-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/15 via-primary/5 to-background shadow-lg">
        <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Executive Overview
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
                Welcome back, Administrator
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Track the pulse of the entire New Concept network in a single glance. Monitor
                momentum, surface branch opportunities, and coordinate faster decisions across teams.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-3 py-2">
                <Users className="h-3 w-3" />
                {activeStudents} active learners
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-3 py-2">
                <Building2 className="h-3 w-3" />
                {activeBranches} active branches
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-3 py-2 text-success">
                <TrendingUp className="h-3 w-3" />
                {formatIDR(netProfit)} net profit
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Global Announcement
            </Button>
            <Button variant="outline" size="lg" className="border-primary/40 text-primary hover:bg-primary/10">
              Export Executive Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCard(
          "Total Income",
          formatIDR(totalIncome),
          "All-time revenue across branches",
          TrendingUp,
          "bg-primary",
        )}
        {metricCard(
          "Total Expense",
          formatIDR(totalExpense),
          "Operational spending to date",
          TrendingDown,
          "bg-destructive",
        )}
        {metricCard(
          "Net Profit",
          formatIDR(netProfit),
          `${((netProfit / (totalIncome || 1)) * 100).toFixed(1)}% of revenue`,
          ArrowUpRight,
          "bg-secondary",
        )}
        {metricCard(
          "Active Learners",
          activeStudents.toLocaleString("id-ID"),
          `${(activeStudents / (students.length || 1) * 100).toFixed(1)}% active engagement`,
          Users,
          "bg-emerald-500",
        )}
      </div>

      {/* Performance */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Branch Leaderboard</CardTitle>
              <p className="text-xs text-muted-foreground">
                Top performing branches ranked by year-to-date revenue.
              </p>
            </div>
            <Button variant="outline" size="sm">
              View all branches
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {topBranches.map((branch, index) => (
              <div
                key={branch.id}
                className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 hover:bg-muted/40"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    #{index + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{branch.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {branch.students.toLocaleString("id-ID")} active students • {branch.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{formatIDR(branch.income)}</p>
                  <p className="text-xs text-muted-foreground">YTD revenue</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Activity</CardTitle>
            <p className="text-xs text-muted-foreground">
              System-wide interactions logged in the last 24 hours.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {logs.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                No activity captured yet. Engage with the platform to populate this feed.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start justify-between gap-3 rounded-lg bg-muted/40 p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {log.table} <span className="text-xs font-normal text-muted-foreground">• {log.method}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Actor: {log.userId} — {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    #{log.reffId ?? "—"}
                  </span>
                </div>
              ))
            )}
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View activity archive
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Operating Snapshot</CardTitle>
            <p className="text-xs text-muted-foreground">
              Key metrics to benchmark performance across the organization.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
              <p className="text-xs text-muted-foreground">Revenue / Branch</p>
              <p className="mt-2 text-2xl font-semibold text-primary">
                {activeBranches ? formatIDR(totalIncome / activeBranches) : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Average of active locations</p>
            </div>
            <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-transparent p-4">
              <p className="text-xs text-muted-foreground">Students / Branch</p>
              <p className="mt-2 text-2xl font-semibold text-success">
                {activeBranches ? Math.round(activeStudents / activeBranches) : 0}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Average classroom capacity</p>
            </div>
            <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-transparent p-4">
              <p className="text-xs text-muted-foreground">Expense Ratio</p>
              <p className="mt-2 text-2xl font-semibold text-amber-600">
                {totalIncome ? `${((totalExpense / totalIncome) * 100).toFixed(1)}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Operational cost vs revenue</p>
            </div>
            <div className="rounded-2xl border bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-transparent p-4">
              <p className="text-xs text-muted-foreground">Engagement</p>
              <p className="mt-2 text-2xl font-semibold text-pink-600">
                {students.length ? `${((activeStudents / students.length) * 100).toFixed(1)}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Learners active this period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Strategic Actions</CardTitle>
            <p className="text-xs text-muted-foreground">
              Suggestions generated from current performance signals.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topBranches.slice(0, 3).map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-primary">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {branch.students.toLocaleString("id-ID")} students • {formatIDR(branch.income)}
                  </p>
                </div>
                <Button size="sm" variant="secondary">
                  Plan visit
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Explore growth playbook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default DashboardView;
