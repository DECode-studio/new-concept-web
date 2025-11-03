"use client";

import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  Activity,
  ArrowUpRight,
  ClipboardList,
  Users,
  TrendingUp,
  CalendarCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authStore, studentStore, reportStore } from "@/stores";
import { TransactionStatus } from "@/models/enums";
import { formatIDR } from "@/utils/number";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  caption: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "primary" | "secondary" | "emerald";
};

const MetricCard = ({ title, value, caption, icon: Icon, accent }: MetricCardProps) => {
  const accentMap: Record<MetricCardProps["accent"], string> = {
    primary: "from-[#6c63ff] to-[#9a8cff]",
    secondary: "from-[#ffcfde] to-[#ffe7f1]",
    emerald: "from-[#5fd2b8] to-[#8ff0d3]",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white shadow-[0_25px_55px_-35px_rgba(31,36,64,0.12)]">
      <div className="flex items-start justify-between gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
          <p className="mt-2 text-xs text-foreground/60">{caption}</p>
        </div>
        <div className={cn("rounded-2xl p-[1px] shadow-[0_12px_30px_-20px_rgba(108,99,255,0.4)]", `bg-gradient-to-br ${accentMap[accent]}`)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6c63ff]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const dormantStudents = branchStudents.length - activeStudents;

  return (
    <div className="space-y-10 text-foreground">
      <section className="rounded-[32px] border border-white/50 bg-white p-8 shadow-[0_35px_70px_-40px_rgba(31,36,64,0.16)] md:p-12">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6c63ff]/20 bg-[#6c63ff]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#6c63ff]">
              <TrendingUp className="h-3.5 w-3.5" />
              Branch Snapshot
            </span>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Hello, Branch Manager
              </h1>
              <p className="text-sm text-foreground/65">
                Keep your branch momentum high. Review today’s focus, align the team, and close the loop on
                pending tasks in a single glance.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-3 py-2 shadow-sm">
                <Users className="h-3.5 w-3.5 text-[#6c63ff]" />
                {activeStudents.toLocaleString("id-ID")} active students
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-3 py-2 shadow-sm">
                <TrendingUp className="h-3.5 w-3.5 text-[#6c63ff]" />
                {formatIDR(income)} revenue this cycle
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/60 bg-white p-6 shadow-[0_30px_60px_-45px_rgba(31,36,64,0.14)]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Today’s highlights</p>
              <p className="mt-3 text-sm font-semibold text-foreground/80">
                3 initiatives flagged for immediate action.
              </p>
            </div>
            <div className="mt-5 space-y-3 text-xs text-foreground/65">
              <p>• {pendingReports.length} finance entries awaiting approval.</p>
              <p>• {dormantStudents > 0 ? `${dormantStudents} learners` : "All learners"} need check-ins.</p>
              <p>• Keep daily intakes above {formatIDR(income / 30 || 0)} to stay on track.</p>
            </div>
            <Button
              variant="ghost"
              className="mt-6 h-11 rounded-2xl border border-white/70 bg-white text-sm text-foreground hover:bg-white/90"
            >
              Open task planner
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Monthly Revenue"
          value={formatIDR(income)}
          caption="Settled payments recorded this month."
          icon={TrendingUp}
          accent="primary"
        />
        <MetricCard
          title="Operational Spend"
          value={formatIDR(expense)}
          caption="Approved expenses impacting the ledger."
          icon={Activity}
          accent="secondary"
        />
        <MetricCard
          title="Net Contribution"
          value={formatIDR(net)}
          caption={
            income ? `${((net / income) * 100).toFixed(1)}% of revenue retained.` : "Awaiting revenue."
          }
          icon={ArrowUpRight}
          accent="emerald"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-[28px] border border-white/60 bg-white shadow-[0_30px_60px_-45px_rgba(31,36,64,0.14)]">
          <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Action Board</CardTitle>
              <p className="text-xs text-foreground/60">
                Quick wins to keep operations humming today.
              </p>
            </div>
            <Button
              variant="ghost"
              className="h-10 rounded-2xl border border-white/70 bg-white px-4 text-xs text-foreground hover:bg-white/90"
            >
              View Kanban
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/70 bg-white/95 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl border border-white/70 bg-[#6c63ff]/10 p-2 text-[#6c63ff]">
                  <Users className="h-4 w-4" />
                </div>
                <p className="font-semibold text-foreground">Re-engage learners</p>
              </div>
              <p className="text-xs text-foreground/60">
                {dormantStudents > 0
                  ? `${dormantStudents.toLocaleString("id-ID")} learners are dormant, assign a coach follow-up.`
                  : "All students are active — keep the pulse conversations going."}
              </p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/95 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl border border-white/70 bg-[#ffcfde]/40 p-2 text-[#f25757]">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <p className="font-semibold text-foreground">Approve finances</p>
              </div>
              <p className="text-xs text-foreground/60">
                {pendingReports.length} expense items are pending your go-ahead. Review before day end.
              </p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/95 p-4 text-sm shadow-sm md:col-span-2">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Coach stand-up</p>
                  <p className="text-xs text-foreground/60">
                    Summarise daily wins and blockers for the teaching team before the evening batch.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="h-9 rounded-2xl border border-white/70 bg-white px-4 text-xs text-foreground hover:bg-white/90"
                >
                  Draft outline
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/60 bg-white shadow-[0_30px_60px_-45px_rgba(31,36,64,0.14)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Today&apos;s Numbers</CardTitle>
            <p className="text-xs text-foreground/60">Snapshot ready for standup or management sync.</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground/65">
            <div className="rounded-3xl border border-white/70 bg-white/95 p-4 shadow-[0_18px_40px_-30px_rgba(31,36,64,0.11)]">
              <div className="flex items-center justify-between text-xs text-foreground/55">
                Revenue today
                <ArrowUpRight className="h-4 w-4 text-[#6c63ff]" />
              </div>
              <p className="mt-2 text-xl font-semibold text-foreground">{formatIDR(income / 30 || 0)}</p>
              <p className="text-xs text-foreground/55">Daily average needed to stay on target.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/95 p-4 shadow-[0_18px_40px_-30px_rgba(31,36,64,0.11)]">
              <div className="flex items-center justify-between text-xs text-foreground/55">
                Pending approvals
                <CalendarCheck className="h-4 w-4 text-[#f25757]" />
              </div>
              <p className="mt-2 text-xl font-semibold text-foreground">{pendingReports.length}</p>
              <p className="text-xs text-foreground/55">Items to clear before closing the day.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
});

export default ManagerDashboard;
