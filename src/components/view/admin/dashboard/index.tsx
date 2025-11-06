"use client";

import { observer } from "mobx-react-lite";
import {
  Activity,
  ArrowUpRight,
  Building2,
  Flame,
  LineChart,
  Sparkles,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { branchStore, studentStore, reportStore, logStore } from "@/stores";
import { TransactionStatus } from "@/models/enums";
import { formatIDR } from "@/utils/number";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "primary" | "secondary" | "emerald";
};

const MetricCard = ({ title, value, subLabel, icon: Icon, accent }: MetricCardProps) => {
  const accentColors: Record<MetricCardProps["accent"], string> = {
    primary: "from-[#FFB300]/70 to-[#FFC542]/80",
    secondary: "from-[#FFE69A]/70 to-[#FFF4D4]/80",
    emerald: "from-[#2EBD7F]/40 to-[#60e5a7]/50",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white shadow-[0_25px_55px_-35px_rgba(61,42,19,0.12)]">
      <div className="flex items-start justify-between gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7611]/70">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-[#3d2a13]">{value}</p>
          <p className="mt-2 text-xs text-[#9c7611]/70">{subLabel}</p>
        </div>
        <div className={cn("rounded-2xl p-[1px] shadow-[0_12px_30px_-20px_rgba(255,179,0,0.35)]", `bg-gradient-to-br ${accentColors[accent]}`)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#FFB300]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = observer(() => {
  const branches = branchStore.getActiveBranches();
  const students = studentStore.list();
  const reports = reportStore.list();
  const recentLogs = logStore.list().slice(0, 6);

  const activeBranches = branches.length;
  const activeStudents = students.filter((student) => student.status === "ACTIVE").length;

  const totalIncome = reports
    .filter((report) => report.status === TransactionStatus.SUCCESS && report.amount > 0)
    .reduce((sum, report) => sum + report.amount, 0);

  const totalExpense = reports
    .filter((report) => report.status === TransactionStatus.SUCCESS && report.amount < 0)
    .reduce((sum, report) => sum + Math.abs(report.amount), 0);

  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome ? (netProfit / totalIncome) * 100 : 0;

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
    .slice(0, 3);

  return (
    <div className="space-y-10 text-[#3d2a13]">
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-hidden rounded-[36px] border border-white/50 bg-gradient-to-br from-[#FFB300] via-[#FFC542] to-[#FFE69A] p-[1.5px] shadow-[0_45px_90px_-50px_rgba(255,179,0,0.45)]">
          <div className="relative rounded-[34px] bg-white/80 p-8 md:p-12">
            <div className="absolute inset-0 rounded-[34px] border border-white/60" />
            <div className="relative flex flex-col gap-8">
              <div className="inline-flex items-center gap-3 self-start rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9c7611]">
                <Sparkles className="h-4 w-4" />
                Executive Pulse
              </div>

              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-4">
                  <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                    Welcome back, Administrator
                  </h1>
                  <p className="text-sm text-[#9c7611]/75">
                    Track the national performance of New Concept in real-time. Surface branch breakthroughs,
                    empower teams with clear priorities, and safeguard the momentum of every learner across
                    Indonesia.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#9c7611]/70">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white px-3 py-2 shadow-sm">
                      <Users className="h-3.5 w-3.5 text-[#FFB300]" />
                      {activeStudents.toLocaleString("id-ID")} active learners
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white px-3 py-2 shadow-sm">
                      <Building2 className="h-3.5 w-3.5 text-[#FFB300]" />
                      {activeBranches} active branches
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white px-3 py-2 shadow-sm">
                      <LineChart className="h-3.5 w-3.5 text-[#FFB300]" />
                      {margin.toFixed(1)}% margin
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-3xl border border-white/60 bg-white px-6 py-6 text-sm text-[#9c7611]/80 shadow-[0_25px_45px_-30px_rgba(255,179,0,0.25)] lg:col-span-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9c7611]/70">Network KPI</p>
                    <p className="mt-4 text-sm font-semibold text-[#3d2a13]">Executive Alignment</p>
                    <p className="mt-2 text-xs leading-5 text-[#9c7611]/70">
                      12 strategic initiatives are on track this quarter. Finance, academics, and growth teams
                      are aligned on the same metrics dashboard.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-6 h-11 rounded-2xl border border-[#FFB300]/40 bg-[#FFB300]/10 text-sm text-[#3d2a13] hover:bg-[#FFB300]/20"
                  >
                    Launch Command Center
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white text-[#3d2a13] shadow-[0_35px_70px_-40px_rgba(61,42,19,0.16)]">
          <CardHeader className="relative pb-2">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              Network Reload
              <Flame className="h-5 w-5 text-[#FFB300]" />
            </CardTitle>
            <p className="text-xs text-[#9c7611]/70">Recent wins and actions requiring your attention.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between rounded-2xl border border-white/60 bg-white/95 px-4 py-3 text-xs text-[#3d2a13]/75 shadow-[0_20px_40px_-35px_rgba(61,42,19,0.12)]"
              >
                <div className="pr-4">
                  <p className="font-medium text-[#3d2a13]">
                    {log.table} • <span className="uppercase text-[#FFB300]">{log.method}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#9c7611]/70">
                    {new Date(log.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="rounded-full border border-white/70 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#9c7611]/70">
                  #{log.id.slice(0, 4)}
                </div>
              </div>
            ))}
            {!recentLogs.length && (
              <div className="rounded-2xl border border-white/60 bg-white/95 px-4 py-6 text-center text-xs text-[#9c7611]/70">
                Activity feed will appear here as your teams collaborate.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Network Revenue"
          value={formatIDR(totalIncome)}
          subLabel="Validated payments across all active branches."
          icon={LineChart}
          accent="primary"
        />
        <MetricCard
          title="Operational Expense"
          value={formatIDR(totalExpense)}
          subLabel="Approved expenditures impacting gross margin."
          icon={Activity}
          accent="secondary"
        />
        <MetricCard
          title="Net Contribution"
          value={formatIDR(netProfit)}
          subLabel={`Margin efficiency at ${margin.toFixed(1)}% of total revenue.`}
          icon={ArrowUpRight}
          accent="emerald"
        />
        <MetricCard
          title="Active Enrolments"
          value={activeStudents.toLocaleString("id-ID")}
          subLabel={`${students.length ? ((activeStudents / students.length) * 100).toFixed(1) : "0.0"}% of total learners engaged.`}
          icon={Users}
          accent="secondary"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-[28px] border border-white/50 bg-white text-[#3d2a13] shadow-[0_35px_70px_-40px_rgba(61,42,19,0.16)]">
          <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Branch Leaderboard</CardTitle>
              <p className="text-xs text-[#9c7611]/70">
                Ranking is computed on year-to-date net contribution and active learner engagement.
              </p>
            </div>
            <Button
              variant="ghost"
              className="h-11 rounded-2xl border border-[#FFB300]/30 bg-white px-5 text-sm text-[#3d2a13] hover:bg-white/90"
            >
              Export leaderboard
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topBranches.map((branch, index) => (
              <div
                key={branch.id}
                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/95 px-4 py-4 shadow-[0_25px_45px_-35px_rgba(61,42,19,0.12)] transition hover:border-white hover:bg-white"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#FFB300]/60 via-transparent to-transparent" />
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white text-base font-semibold text-[#FFB300]">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#3d2a13]">{branch.name}</p>
                      <p className="text-xs text-[#9c7611]/70">
                        {branch.students.toLocaleString("id-ID")} learners • {branch.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#FFB300]">{formatIDR(branch.income)}</p>
                    <p className="text-xs text-[#9c7611]/70">YTD net contribution</p>
                  </div>
                </div>
              </div>
            ))}
            {!topBranches.length && (
              <div className="rounded-3xl border border-white/60 bg-white/95 px-6 py-10 text-center text-sm text-[#9c7611]/70">
                Branch performance data is not available yet. Seed or sync the database to begin monitoring.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/50 bg-white text-[#3d2a13] shadow-[0_35px_70px_-40px_rgba(61,42,19,0.16)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">Elite Highlights</CardTitle>
            <p className="text-xs text-[#9c7611]/70">
              Signals curated from finance, people, and operations across the ecosystem.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-[#9c7611]/75">
            <div className="rounded-3xl border border-white/60 bg-white/95 p-4 leading-5">
              • Net contribution is pacing <span className="text-[#FFB300]">8.3%</span> above forecast. Keep conversion from trial lessons to paid enrolments strong.
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/95 p-4 leading-5">
              • Jakarta Selatan cracked the top 3 in learner satisfaction. Share their playbook with other branches.
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/95 p-4 leading-5">
              • Upcoming launch: blended executive English program. Align marketing assets and ensure finance is ready with the new SKU.
            </div>
            <Button
              variant="ghost"
              className="h-11 w-full rounded-2xl border border-[#FFB300]/30 bg-white px-5 text-sm text-[#3d2a13] hover:bg-white/90"
            >
              View strategic agenda
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
});

export default DashboardView;
