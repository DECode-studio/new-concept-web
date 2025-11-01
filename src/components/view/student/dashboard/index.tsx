"use client";

import { observer } from "mobx-react-lite";
import { FileText, Receipt, ClipboardList, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authStore, studentStore } from "@/stores";
import { StudentStatus } from "@/models/types";

const DashboardView = observer(() => {
  const userId = authStore.getUserId();
  const student = userId ? studentStore.getByUserId(userId) : null;

  const quickLinks = [
    { icon: User, title: "My Profile", description: "View personal details" },
    { icon: Receipt, title: "Invoices", description: "View payment invoices" },
    { icon: ClipboardList, title: "Attendance", description: "View attendance history" },
    { icon: FileText, title: "Reports", description: "Academic reports" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {student?.nickName || "Student"}!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{student?.fullName ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration Number</p>
              <p className="font-mono font-medium">{student?.registrationNumber ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={student?.status === StudentStatus.ACTIVE ? "default" : "secondary"}>
                {student?.status ?? "UNKNOWN"}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="cursor-pointer transition-colors hover:bg-accent">
            <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default DashboardView;
