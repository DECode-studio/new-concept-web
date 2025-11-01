"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus, Trash2, CheckSquare } from "lucide-react";

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
import { authStore, reportStore, accountStore, logStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { TransactionStatus, MethodRequest } from "@/models/types";

const ReportsView = observer(() => {
  const branchId = authStore.getBranchId();
  const userId = authStore.getUserId();
  const reports = branchId ? reportStore.getByBranch(branchId) : [];
  const accounts = accountStore.list();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountId: "",
    name: "",
    description: "",
    amount: "",
    status: TransactionStatus.SUCCESS,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const amountValue = Number(formData.amount) || 0;

    const newReport = reportStore.addReport({
      accountId: formData.accountId,
      userId: userId ?? "",
      branchId: branchId ?? "",
      name: formData.name,
      description: formData.description,
      amount: amountValue,
      status: formData.status,
    });

    logStore.addLog(userId ?? "system", "tblReport", MethodRequest.CREATE, newReport.id, null, newReport);
    toast({ title: "Report added successfully" });
    setOpen(false);
    setFormData({ accountId: "", name: "", description: "", amount: "", status: TransactionStatus.SUCCESS });
  };

  const handleDelete = (reportId: string) => {
    const report = reportStore.getById(reportId);
    if (!report) return;
    if (report.finalized) {
      toast({ title: "Report already finalized", description: "Finalized reports cannot be removed.", variant: "destructive" });
      return;
    }
    const success = reportStore.deleteReport(reportId);
    if (success) {
      logStore.addLog(userId ?? "system", "tblReport", MethodRequest.DELETE, reportId, report, null);
      toast({ title: "Report deleted successfully" });
    }
  };

  const handleFinalize = (reportId: string) => {
    const report = reportStore.finalizeReport(reportId);
    if (report) {
      logStore.addLog(userId ?? "system", "tblReport", MethodRequest.UPDATE, reportId, null, report);
      toast({ title: "Report finalized" });
    }
  };

  return (
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
                <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TransactionStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TransactionStatus.SUCCESS}>Success</SelectItem>
                    <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
                    <SelectItem value={TransactionStatus.EXPIRED}>Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Add Report
              </Button>
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
                <TableHead>Account</TableHead>
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
                  <TableCell className="text-sm text-muted-foreground">
                    {accounts.find((account) => account.id === report.accountId)?.name ?? "-"}
                  </TableCell>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>Rp {report.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === TransactionStatus.SUCCESS ? "default" : "secondary"}>
                      {report.finalized ? "FINALIZED" : report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFinalize(report.id)}
                        disabled={report.finalized || report.status !== TransactionStatus.SUCCESS}
                        aria-label="Finalize report"
                      >
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(report.id)}
                        disabled={report.finalized}
                        aria-label="Delete report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default ReportsView;
