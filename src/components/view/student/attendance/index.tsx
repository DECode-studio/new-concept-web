"use client";

import { observer } from "mobx-react-lite";
import type { ComponentType } from "react";
import { Calendar, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authStore, attendanceStore } from "@/stores";
import { AttendanceStatus } from "@/models/types";
import { JSX } from "react";

const variantForStatus: Record<AttendanceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [AttendanceStatus.PRESENT]: "default",
  [AttendanceStatus.ABSENT]: "destructive",
  [AttendanceStatus.LATE]: "secondary",
  [AttendanceStatus.PERMISSION]: "outline",
};

const AttendanceView = observer(() => {
  const userId = authStore.getUserId();
  const records = userId ? attendanceStore.getByUser(userId) : [];

  const presentCount = records.filter((record) => record.status === AttendanceStatus.PRESENT).length;
  const absentCount = records.filter((record) => record.status === AttendanceStatus.ABSENT).length;
  const lateCount = records.filter((record) => record.status === AttendanceStatus.LATE).length;
  const totalCount = records.length;
  const rate = totalCount > 0 ? (((presentCount + lateCount) / totalCount) * 100).toFixed(1) : "0";

  const formatTime = (value?: string) => (value ? new Date(value).toLocaleTimeString() : "-");
  const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString() : "-");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
        <p className="text-muted-foreground">View attendance history and statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Calendar} label="Total Days" value={totalCount.toString()} className="text-primary" />
        <StatCard icon={Clock} label="Present" value={presentCount.toString()} className="text-success" />
        <StatCard icon={Clock} label="Late" value={lateCount.toString()} className="text-secondary" />
        <StatCard icon={Clock} label="Attendance Rate" value={`${rate}%`} className="text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No attendance records yet
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.createdAt)}</TableCell>
                    <TableCell>{formatTime(record.clockIn)}</TableCell>
                    <TableCell>{formatTime(record.clockOut)}</TableCell>
                    <TableCell>
                      <Badge variant={variantForStatus[record.status]}>{record.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.description ?? "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
});

interface StatCardProps {
  icon: ComponentType<React.ComponentProps<typeof Clock>>;
  label: string;
  value: string;
  className?: string;
}

const StatCard = ({ icon: Icon, label, value, className }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className={`h-4 w-4 ${className ?? "text-muted-foreground"}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default AttendanceView;
