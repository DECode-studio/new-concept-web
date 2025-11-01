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
import { authStore, logStore, userStore } from "@/stores";
import { MethodRequest } from "@/models/types";

const variantForMethod: Record<MethodRequest, "default" | "secondary" | "destructive" | "outline"> = {
  [MethodRequest.CREATE]: "default",
  [MethodRequest.UPDATE]: "secondary",
  [MethodRequest.DELETE]: "destructive",
};

const LogsView = observer(() => {
  const branchId = authStore.getBranchId();
  const users = userStore.list();
  const branchUserIds = branchId ? users.filter((user) => user.branchId === branchId).map((user) => user.id) : [];
  const logs = logStore.list().filter((log) => branchUserIds.includes(log.userId));

  const getUserName = (id: string) => users.find((user) => user.id === id)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground">Branch activity and audit trail</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Reference ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No activity logs yet
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{getUserName(log.userId)}</TableCell>
                    <TableCell>
                      <Badge variant={variantForMethod[log.method] ?? "outline"}>{log.method}</Badge>
                    </TableCell>
                    <TableCell>{log.table}</TableCell>
                    <TableCell className="font-mono text-xs">{log.reffId ?? "-"}</TableCell>
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

export default LogsView;
