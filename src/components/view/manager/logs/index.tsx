import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { logStore } from "@/stores/LogStore";
import { Badge } from "@/components/ui/badge";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblUser } from "@/models/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LogsView = observer(() => {
  const branchId = authStore.getBranchId();
  const logs = logStore.getAllLogs();
  const users = getFromLocalStorage<TblUser[]>("tblUser") || [];

  // Filter logs for branch users only
  const branchUserIds = users.filter(u => u.branchId === branchId).map(u => u.id);
  const branchLogs = logs.filter(l => branchUserIds.includes(l.userId));

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || "-";

  const getMethodVariant = (method: string) => {
    switch (method) {
      case "CREATE": return "default";
      case "UPDATE": return "secondary";
      case "DELETE": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Layout>
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
                {branchLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No activity logs yet
                    </TableCell>
                  </TableRow>
                ) : (
                  branchLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{getUserName(log.userId)}</TableCell>
                      <TableCell>
                        <Badge variant={getMethodVariant(log.method)}>
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.table}</TableCell>
                      <TableCell className="font-mono text-xs">{log.reffId}</TableCell>
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

export default LogsView