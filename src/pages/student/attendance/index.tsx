import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblAttendance } from "@/models/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock } from "lucide-react";

const AttendanceView = observer(() => {
  const userId = authStore.getUserId();
  const attendance = getFromLocalStorage<TblAttendance[]>("tblAttendance") || [];

  const myAttendance = attendance.filter(a => a.userId === userId && !a.deleted);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PRESENT": return "default";
      case "LATE": return "secondary";
      case "ABSENT": return "destructive";
      case "PERMISSION": return "outline";
      default: return "outline";
    }
  };

  const presentCount = myAttendance.filter(a => a.status === "PRESENT").length;
  const absentCount = myAttendance.filter(a => a.status === "ABSENT").length;
  const lateCount = myAttendance.filter(a => a.status === "LATE").length;
  const totalCount = myAttendance.length;
  const attendanceRate = totalCount > 0 ? ((presentCount + lateCount) / totalCount * 100).toFixed(1) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground">View attendance history and statistics</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <Clock className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{presentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <Clock className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{absentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rate</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
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
                {myAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No attendance records yet
                    </TableCell>
                  </TableRow>
                ) : (
                  myAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(record.clockIn).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.description || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
});

export default AttendanceView