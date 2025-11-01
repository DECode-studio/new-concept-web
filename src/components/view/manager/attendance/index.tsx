"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  authStore,
  attendanceStore,
  userStore,
  classStore,
  levelStore,
  logStore,
} from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { AttendanceStatus, MethodRequest } from "@/models/types";

const variantForStatus: Record<AttendanceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [AttendanceStatus.PRESENT]: "default",
  [AttendanceStatus.LATE]: "secondary",
  [AttendanceStatus.ABSENT]: "destructive",
  [AttendanceStatus.PERMISSION]: "outline",
};

const AttendanceView = observer(() => {
  const branchId = authStore.getBranchId();
  const userId = authStore.getUserId();
  const attendances = branchId ? attendanceStore.getByBranch(branchId) : [];
  const users = userStore.list();
  const classes = classStore.list();
  const levels = levelStore.list();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    classId: "",
    levelId: "",
    description: "",
    clockIn: "",
    clockOut: "",
    status: AttendanceStatus.PRESENT,
  });

  const resetForm = () =>
    setFormData({
      userId: "",
      classId: "",
      levelId: "",
      description: "",
      clockIn: "",
      clockOut: "",
      status: AttendanceStatus.PRESENT,
    });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!branchId) return;

    const record = attendanceStore.addAttendance({
      userId: formData.userId,
      branchId,
      classId: formData.classId || undefined,
      levelId: formData.levelId || undefined,
      description: formData.description,
      clockIn: formData.clockIn ? new Date(formData.clockIn).toISOString() : undefined,
      clockOut: formData.clockOut ? new Date(formData.clockOut).toISOString() : undefined,
      status: formData.status,
    });

    logStore.addLog(userId ?? "system", "tblAttendance", MethodRequest.CREATE, record.id, null, record);
    toast({ title: "Attendance recorded successfully" });
    setOpen(false);
    resetForm();
  };

  const branchUsers = branchId ? users.filter((user) => user.branchId === branchId && !user.deleted) : [];
  const getUserName = (id: string) => users.find((user) => user.id === id)?.name ?? "-";
  const getClassName = (id?: string) => classes.find((cls) => cls.id === id)?.name ?? "-";
  const getLevelName = (id?: string) => levels.find((level) => level.id === id)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Monitor staff and student attendance</p>
        </div>
        <Dialog open={open} onOpenChange={(state) => {
          setOpen(state);
          if (!state) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Attendance</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>User</Label>
                <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Class</Label>
                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level</Label>
                <Select value={formData.levelId} onValueChange={(value) => setFormData({ ...formData, levelId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Clock In</Label>
                <Input type="datetime-local" value={formData.clockIn} onChange={(event) => setFormData({ ...formData, clockIn: event.target.value })} required />
              </div>
              <div>
                <Label>Clock Out</Label>
                <Input type="datetime-local" value={formData.clockOut} onChange={(event) => setFormData({ ...formData, clockOut: event.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: AttendanceStatus) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AttendanceStatus.PRESENT}>Present</SelectItem>
                    <SelectItem value={AttendanceStatus.ABSENT}>Absent</SelectItem>
                    <SelectItem value={AttendanceStatus.LATE}>Late</SelectItem>
                    <SelectItem value={AttendanceStatus.PERMISSION}>Permission</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
              </div>
              <Button type="submit" className="w-full">
                Record Attendance
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                <TableHead>User</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{attendance.createdAt ? new Date(attendance.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="font-medium">{getUserName(attendance.userId)}</TableCell>
                  <TableCell>{getClassName(attendance.classId)}</TableCell>
                  <TableCell>{getLevelName(attendance.levelId)}</TableCell>
                  <TableCell>{attendance.clockIn ? new Date(attendance.clockIn).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>{attendance.clockOut ? new Date(attendance.clockOut).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={variantForStatus[attendance.status]}>{attendance.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
});

export default AttendanceView;
