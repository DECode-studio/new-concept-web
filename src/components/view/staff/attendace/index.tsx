import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblAttendance, TblUser, TblClass, TblLevel } from "@/models/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AttendanceView = observer(() => {
  const branchId = authStore.getBranchId();
  const attendance = getFromLocalStorage<TblAttendance[]>("tblAttendance") || [];
  const users = getFromLocalStorage<TblUser[]>("tblUser") || [];
  const classes = getFromLocalStorage<TblClass[]>("tblClass") || [];
  const levels = getFromLocalStorage<TblLevel[]>("tblLevel") || [];

  const branchAttendance = attendance.filter(a => a.branchId === branchId && !a.deleted);
  
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || "-";
  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || "-";
  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || "-";

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PRESENT": return "default";
      case "LATE": return "secondary";
      case "ABSENT": return "destructive";
      case "PERMISSION": return "outline";
      default: return "outline";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="text-muted-foreground">Record and manage attendance</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
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
                {branchAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No attendance records yet
                    </TableCell>
                  </TableRow>
                ) : (
                  branchAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getUserName(record.userId)}
                      </TableCell>
                      <TableCell>{getClassName(record.classId)}</TableCell>
                      <TableCell>{getLevelName(record.levelId)}</TableCell>
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