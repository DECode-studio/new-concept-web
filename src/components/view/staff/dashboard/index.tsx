"use client";

import { observer } from "mobx-react-lite";
import { ClipboardList, FileText, TrendingUp, Users, Wallet, BadgeCheck } from "lucide-react";

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

  const attentionStudents = students.filter((student) => student.status !== "ACTIVE").length;

  return (
    <div className="space-y-10 text-foreground">
      <section className="rounded-[32px] border border-white/50 bg-white p-8 shadow-[0_35px_70px_-40px_rgba(31,36,64,0.16)] md:p-12">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6c63ff]/20 bg-[#6c63ff]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#6c63ff]">
              <Wallet className="h-3.5 w-3.5" />
              Daily Operations
            </span>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Ready for a productive day?
              </h1>
              <p className="text-sm text-foreground/65">
                Keep student records spotless, log payments on time, and prepare quick updates for your manager.
                This board shows everything that needs your attention today.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-3 py-2 shadow-sm">
                <Users className="h-3.5 w-3.5 text-[#6c63ff]" />
                {students.length.toLocaleString("id-ID")} student profiles
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-3 py-2 shadow-sm">
                <TrendingUp className="h-3.5 w-3.5 text-[#6c63ff]" />
                {todaysReports.length} entries logged today
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-white/60 bg-white p-6 shadow-[0_30px_60px_-45px_rgba(31,36,64,0.14)]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Quick numbers</p>
              <p className="mt-3 text-sm font-semibold text-foreground/80">Snapshot for your shift stand-up.</p>
            </div>
            <div className="mt-5 space-y-3 text-xs text-foreground/60">
              <p>• {successReportsToday.length} payments confirmed and synced.</p>
              <p>• {pendingToday} finance entries pending manager approval.</p>
              <p>• {attentionStudents} student records requiring a quick update.</p>
            </div>
            <Button
              variant="ghost"
              className="mt-6 h-11 rounded-2xl border border-white/70 bg-white text-sm text-foreground hover:bg-white/90"
            >
              Open daily checklist
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border border-white/50 bg-white shadow-[0_25px_55px_-35px_rgba(31,36,64,0.12)]">
          <CardContent className="rounded-[26px] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">
              Today&apos;s Reports
            </p>
            <p className="mt-4 text-3xl font-semibold text-foreground">{todaysReports.length}</p>
            <p className="mt-2 text-xs text-foreground/60">Entries captured so far.</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-white/50 bg-white shadow-[0_25px_55px_-35px_rgba(31,36,64,0.12)]">
          <CardContent className="rounded-[26px] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">
              Revenue Logged
            </p>
            <p className="mt-4 text-3xl font-semibold text-[#6c63ff]">{formatIDR(incomeToday)}</p>
            <p className="mt-2 text-xs text-foreground/60">Successful transactions today.</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-white/50 bg-white shadow-[0_25px_55px_-35px_rgba(31,36,64,0.12)]">
          <CardContent className="rounded-[26px] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">
              Pending Approvals
            </p>
            <p className="mt-4 text-3xl font-semibold text-[#f25757]">{pendingToday}</p>
            <p className="mt-2 text-xs text-foreground/60">Awaiting manager review.</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-white/50 bg-white shadow-[0_25px_55px_-35px_rgba(31,36,64,0.12)]">
          <CardContent className="rounded-[26px] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">
              Profiles To Update
            </p>
            <p className="mt-4 text-3xl font-semibold text-foreground">{attentionStudents}</p>
            <p className="mt-2 text-xs text-foreground/60">Students needing record updates.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-[28px] border border-white/50 bg-white shadow-[0_30px_60px_-45px_rgba(31,36,64,0.14)]">
          <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
              <p className="text-xs text-foreground/60">
                A few taps to keep operations sharp.
              </p>
            </div>
            <Button
              variant="ghost"
              className="h-10 rounded-2xl border border-white/70 bg-white px-4 text-xs text-foreground hover:bg-white/90"
            >
              View knowledge base
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Register new student",
                detail: "Onboard a learner and assign their pathway.",
                icon: Users,
              },
              {
                title: "Log payment receipt",
                detail: "Capture tuition or material payment instantly.",
                icon: FileText,
              },
              {
                title: "Update attendance",
                detail: "Record today’s classroom participation.",
                icon: ClipboardList,
              },
              {
                title: "Create follow-up task",
                detail: "Assign actions to coaches or finance.",
                icon: TrendingUp,
              },
            ].map(({ title, detail, icon: Icon }) => (
              <Button
                key={title}
                variant="ghost"
                className="h-32 flex-col items-start justify-start gap-3 rounded-[26px] border border-white/60 bg-white/95 p-5 text-left text-sm font-semibold text-foreground hover:bg-white/90"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-[#6c63ff]/10 text-[#6c63ff]">
                  <Icon className="h-4 w-4" />
                </div>
                <span>{title}</span>
                <span className="text-xs font-normal text-foreground/60">{detail}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/50 bg-white shadow-[0_30px_60px_-45px_rgba(31,36,64,0.14)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Today&apos;s Checklist</CardTitle>
            <p className="text-xs text-foreground/60">Complete these to close the shift smoothly.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: "Verify receipts",
                subtitle: `${successReportsToday.length} payments confirmed`,
              },
              {
                title: "Sync student records",
                subtitle: `${attentionStudents} profiles waiting for an update`,
              },
              {
                title: "Brief manager",
                subtitle: `${pendingToday} finance items pending consent`,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/95 px-4 py-4 text-sm shadow-sm"
              >
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-foreground/60">{item.subtitle}</p>
                </div>
                <Button
                  variant="ghost"
                  className="h-9 rounded-2xl border border-white/70 bg-white px-3 text-xs text-foreground hover:bg-white/90"
                >
                  Complete
                </Button>
              </div>
            ))}
            <div className="rounded-3xl border border-white/60 bg-white/95 px-4 py-4 text-xs text-foreground/65 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-foreground/70">
                <BadgeCheck className="h-4 w-4 text-[#6c63ff]" />
                Shift summary tip
              </div>
              Close the day with a two-line update for your manager. Capture wins, blockers, and anything
              the team should know tomorrow.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
});

export default StaffDashboard;
