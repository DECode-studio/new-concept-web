import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { reportStore } from "@/stores/ReportStore";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblTransactionAccount, TransactionStatus, MethodRequest } from "@/models/types";
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

export const ManagerReports = observer(() => {
  const branchId = authStore.getBranchId();
  const userId = authStore.getUserId();
  const reports = reportStore.getReportsByBranch(branchId || "");
  const accounts = getFromLocalStorage<TblTransactionAccount[]>("tblTransactionAccount") || [];
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountId: "",
    name: "",
    description: "",
    amount: "",
    status: TransactionStatus.SUCCESS,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportStore.addReport({
      accountId: formData.accountId,
      userId: userId || "",
      branchId: branchId || "",
      name: formData.name,
      description: formData.description,
      amount: Number(formData.amount),
      status: formData.status,
    });
    logStore.addLog(userId || "", "tblReport", MethodRequest.CREATE, "");
    toast({ title: "Report added successfully" });
    setOpen(false);
    setFormData({ accountId: "", name: "", description: "", amount: "", status: TransactionStatus.SUCCESS });
  };

  const handleDelete = (id: string) => {
    reportStore.deleteReport(id);
    logStore.addLog(userId || "", "tblReport", MethodRequest.DELETE, id);
    toast({ title: "Report deleted successfully" });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Manage financial reports for your branch</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Report</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Account</Label>
                  <Select value={formData.accountId} onValueChange={(value) => setFormData({...formData, accountId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.filter(a => !a.deleted).map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: TransactionStatus) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TransactionStatus.SUCCESS}>Success</SelectItem>
                      <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
                      <SelectItem value={TransactionStatus.EXPIRED}>Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add Report</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{report.description}</TableCell>
                    <TableCell>Rp {report.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === "SUCCESS" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(report.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
