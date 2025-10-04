import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { attendanceStore } from "@/stores/AttendanceStore";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblUser, TblClass, TblLevel, AttendanceStatus, MethodRequest } from "@/models/types";
import { logStore } from "@/stores/LogStore";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ManagerAttendance = observer(() => {
  const branchId = authStore.getBranchId();
  const userId = authStore.getUserId();
  const attendances = attendanceStore.getAttendancesByBranch(branchId || "");
  const users = getFromLocalStorage<TblUser[]>("tblUser") || [];
  const classes = getFromLocalStorage<TblClass[]>("tblClass") || [];
  const levels = getFromLocalStorage<TblLevel[]>("tblLevel") || [];
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attendanceStore.addAttendance({
      userId: formData.userId,
      branchId: branchId || "",
      classId: formData.classId,
      levelId: formData.levelId,
      description: formData.description,
      clockIn: new Date(formData.clockIn),
      clockOut: formData.clockOut ? new Date(formData.clockOut) : undefined,
      status: formData.status,
    });
    logStore.addLog(userId || "", "tblAttendance", MethodRequest.CREATE, "");
    toast({ title: "Attendance recorded successfully" });
    setOpen(false);
    setFormData({ userId: "", classId: "", levelId: "", description: "", clockIn: "", clockOut: "", status: AttendanceStatus.PRESENT });
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || "-";
  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || "-";
  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || "-";

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="text-muted-foreground">Monitor staff and student attendance</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
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
                  <Select value={formData.userId} onValueChange={(value) => setFormData({...formData, userId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter(u => !u.deleted && u.branchId === branchId).map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Class</Label>
                  <Select value={formData.classId} onValueChange={(value) => setFormData({...formData, classId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.filter(c => !c.deleted).map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Level</Label>
                  <Select value={formData.levelId} onValueChange={(value) => setFormData({...formData, levelId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.filter(l => !l.deleted).map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Clock In</Label>
                  <Input type="datetime-local" value={formData.clockIn} onChange={(e) => setFormData({...formData, clockIn: e.target.value})} required />
                </div>
                <div>
                  <Label>Clock Out</Label>
                  <Input type="datetime-local" value={formData.clockOut} onChange={(e) => setFormData({...formData, clockOut: e.target.value})} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: AttendanceStatus) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <Button type="submit" className="w-full">Record Attendance</Button>
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
                    <TableCell>{new Date(attendance.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{getUserName(attendance.userId)}</TableCell>
                    <TableCell>{getClassName(attendance.classId)}</TableCell>
                    <TableCell>{getLevelName(attendance.levelId)}</TableCell>
                    <TableCell>{new Date(attendance.clockIn).toLocaleTimeString()}</TableCell>
                    <TableCell>{attendance.clockOut ? new Date(attendance.clockOut).toLocaleTimeString() : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={attendance.status === "PRESENT" ? "default" : "secondary"}>
                        {attendance.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
});
