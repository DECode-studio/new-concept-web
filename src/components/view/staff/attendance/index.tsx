"use client";

import { observer } from "mobx-react-lite";

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
import { authStore, attendanceStore, userStore, classStore, levelStore } from "@/stores";
import { AttendanceStatus } from "@/models/types";

const variantForStatus: Record<AttendanceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [AttendanceStatus.PRESENT]: "default",
  [AttendanceStatus.LATE]: "secondary",
  [AttendanceStatus.ABSENT]: "destructive",
  [AttendanceStatus.PERMISSION]: "outline",
};

const AttendanceView = observer(() => {
  const branchId = authStore.getBranchId();
  const attendances = branchId ? attendanceStore.getByBranch(branchId) : [];
  const users = userStore.list();
  const classes = classStore.list();
  const levels = levelStore.list();

  const getUserName = (id: string) => users.find((user) => user.id === id)?.name ?? "-";
  const getClassName = (id?: string) => classes.find((cls) => cls.id === id)?.name ?? "-";
  const getLevelName = (id?: string) => levels.find((level) => level.id === id)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">Record and manage attendance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No attendance records yet
                  </TableCell>
                </TableRow>
              ) : (
                attendances.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="font-medium">{getUserName(record.userId)}</TableCell>
                    <TableCell>{getClassName(record.classId)}</TableCell>
                    <TableCell>{getLevelName(record.levelId)}</TableCell>
                    <TableCell>{record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : "-"}</TableCell>
                    <TableCell>{record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={variantForStatus[record.status] ?? "outline"}>{record.status}</Badge>
                    </TableCell>
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

export default AttendanceView;
