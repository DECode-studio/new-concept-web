"use client";

import { observer } from "mobx-react-lite";
import { CalendarCheck, ClipboardCheck, GraduationCap, Receipt, Sparkles, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authStore, studentStore } from "@/stores";
import { StudentStatus } from "@/models/types";

const DashboardView = observer(() => {
  const userId = authStore.getUserId();
  const student = userId ? studentStore.getByUserId(userId) : null;

  const quickLinks = [
    { icon: User, title: "My Profile", description: "Keep your personal details current." },
    { icon: Receipt, title: "Invoices", description: "Review past and upcoming payments." },
    { icon: CalendarCheck, title: "Schedule", description: "See what’s ahead this week." },
    { icon: ClipboardCheck, title: "Attendance", description: "Track your class participation." },
  ];

  return (
    <div className="space-y-10 text-foreground">
      <section className="rounded-[32px] border border-white/50 bg-white p-8 shadow-[0_35px_70px_-40px_rgba(31,36,64,0.16)] md:p-12">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#6c63ff]/20 bg-[#6c63ff]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#6c63ff]">
            <Sparkles className="h-3.5 w-3.5" />
            Learner Portal
          </span>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Hi {student?.nickName || student?.fullName || "there"}, ready for your next milestone?
            </h1>
            <p className="text-sm text-foreground/65">
              Stay on top of your journey. Access your classes, track progress, and plan what’s next using the shortcuts below.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-3 py-2 shadow-sm">
              <GraduationCap className="h-3.5 w-3.5 text-[#6c63ff]" />
              {student?.programId ? "Program enrolled" : "Program assignment pending"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-3 py-2 shadow-sm">
              <CalendarCheck className="h-3.5 w-3.5 text-[#6c63ff]" />
              {student?.studyStartTime
                ? new Date(student.studyStartTime).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Start date pending"}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <Card className="rounded-[28px] border border-white/50 bg-white shadow-[0_30px_60px_-45px_rgba(31,36,64,0.14)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground">My Profile</CardTitle>
            <p className="text-xs text-foreground/60">These details personalise your learning experience.</p>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Full name</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{student?.fullName ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Registration</p>
              <p className="mt-2 font-mono text-sm font-semibold text-foreground">{student?.registrationNumber ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Status</p>
              <div className="mt-2">
                <Badge variant={student?.status === StudentStatus.ACTIVE ? "default" : "secondary"}>
                  {student?.status ?? "UNKNOWN"}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Branch</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{student?.branchId ?? "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Program</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{student?.programId ?? "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/50 bg-white shadow-[0_30px_60px_-45px_rgba(31,36,64,0.14)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Upcoming highlights</CardTitle>
            <p className="text-xs text-foreground/60">Stay prepared and keep your streak alive.</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground/65">
            <div className="rounded-3xl border border-white/60 bg-white/95 p-4 shadow-sm">
              • Next class session is scheduled. Arrive 10 minutes earlier for warm-up activities.
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/95 p-4 shadow-sm">
              • Submit your practice journal before Friday to receive personalised feedback.
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/95 p-4 shadow-sm">
              • Join the pronunciation challenge posted today in the mobile app.
            </div>
            <Button
              variant="ghost"
              className="h-10 w-full rounded-2xl border border-white/70 bg-white px-5 text-xs text-foreground hover:bg-white/90"
            >
              View full agenda
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-foreground/60">
          Quick launch
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map(({ icon: Icon, title, description }) => (
            <Button
              key={title}
              variant="ghost"
              className="h-36 flex-col items-start justify-start gap-3 rounded-[28px] border border-white/50 bg-white/95 p-6 text-left text-sm font-semibold text-foreground shadow-[0_25px_55px_-35px_rgba(31,36,64,0.12)] hover:bg-white/90"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-[#6c63ff]/10 text-[#6c63ff]">
                <Icon className="h-5 w-5" />
              </div>
              <span>{title}</span>
              <span className="text-xs font-normal text-foreground/60">{description}</span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
});

export default DashboardView;
