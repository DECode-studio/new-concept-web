"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { chargeFeeStore, branchStore, classStore, levelStore, logStore, authStore } from "@/stores";
import { MethodRequest } from "@/models/types";
import { useToast } from "@/hooks/use-toast";

const FeesView = observer(() => {
  const fees = chargeFeeStore.list();
  const branches = branchStore.list();
  const classes = classStore.list();
  const levels = levelStore.list();
  const actorId = authStore.getUserId() ?? "admin";
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    branchId: "",
    classId: "",
    levelId: "",
    charge: "",
    chargeCash: "",
    chargePerMonth: "",
    chargePer2Month: "",
  });

  const resetForm = () =>
    setFormData({
      branchId: "",
      classId: "",
      levelId: "",
      charge: "",
      chargeCash: "",
      chargePerMonth: "",
      chargePer2Month: "",
    });

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const record = chargeFeeStore.addFee({
      branchId: formData.branchId,
      classId: formData.classId,
      levelId: formData.levelId,
      charge: Number(formData.charge) || 0,
      chargeCash: Number(formData.chargeCash) || 0,
      chargePerMonth: Number(formData.chargePerMonth) || 0,
      chargePer2Month: formData.chargePer2Month ? Number(formData.chargePer2Month) : undefined,
    });
    logStore.addLog(actorId, "tblChargeFee", MethodRequest.CREATE, record.id, null, record);
    toast({ title: "Fee structure created" });
    setOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this fee structure?")) return;
    const success = chargeFeeStore.deleteFee(id);
    if (success) {
      logStore.addLog(actorId, "tblChargeFee", MethodRequest.DELETE, id);
      toast({ title: "Fee deleted" });
    }
  };

  const getBranchName = (id: string) => branches.find((b) => b.id === id)?.name ?? "-";
  const getClassName = (id: string) => classes.find((c) => c.id === id)?.name ?? "-";
  const getLevelName = (id: string) => levels.find((l) => l.id === id)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-muted-foreground">Manage course fees for all branches</p>
        </div>
        <Dialog open={open} onOpenChange={(state) => {
          setOpen(state);
          if (!state) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Fee Structure
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Fee Structure</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Branch</Label>
                  <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
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
                  <Label>Full Charge</Label>
                  <Input type="number" value={formData.charge} onChange={(event) => setFormData({ ...formData, charge: event.target.value })} required />
                </div>
                <div>
                  <Label>Cash Price</Label>
                  <Input type="number" value={formData.chargeCash} onChange={(event) => setFormData({ ...formData, chargeCash: event.target.value })} required />
                </div>
                <div>
                  <Label>Per Month</Label>
                  <Input type="number" value={formData.chargePerMonth} onChange={(event) => setFormData({ ...formData, chargePerMonth: event.target.value })} required />
                </div>
                <div>
                  <Label>Per 2 Months</Label>
                  <Input type="number" value={formData.chargePer2Month} onChange={(event) => setFormData({ ...formData, chargePer2Month: event.target.value })} />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Fee</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Full Charge</TableHead>
                <TableHead>Cash Price</TableHead>
                <TableHead>Per Month</TableHead>
                <TableHead>Per 2 Months</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{getBranchName(fee.branchId)}</TableCell>
                  <TableCell>{getClassName(fee.classId)}</TableCell>
                  <TableCell>{getLevelName(fee.levelId)}</TableCell>
                  <TableCell>Rp {fee.charge.toLocaleString()}</TableCell>
                  <TableCell className="text-success">Rp {fee.chargeCash.toLocaleString()}</TableCell>
                  <TableCell>Rp {fee.chargePerMonth.toLocaleString()}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {fee.chargePer2Month ? `Rp ${fee.chargePer2Month.toLocaleString()}` : "-"}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(fee.id)} aria-label="Delete fee">
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
  );
});

export default FeesView;
