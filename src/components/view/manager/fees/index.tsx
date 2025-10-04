import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { chargeFeeStore } from "@/stores/ChargeFeeStore";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblClass, TblLevel, MethodRequest } from "@/models/types";
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

const FeesView = observer(() => {
  const branchId = authStore.getBranchId();
  const userId = authStore.getUserId();
  const fees = chargeFeeStore.getFeesByBranch(branchId || "");
  const classes = getFromLocalStorage<TblClass[]>("tblClass") || [];
  const levels = getFromLocalStorage<TblLevel[]>("tblLevel") || [];
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    classId: "",
    levelId: "",
    charge: "",
    chargeCash: "",
    chargePerMonth: "",
    chargePer2Month: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    chargeFeeStore.addFee({
      branchId: branchId || "",
      classId: formData.classId,
      levelId: formData.levelId,
      charge: Number(formData.charge),
      chargeCash: Number(formData.chargeCash),
      chargePerMonth: Number(formData.chargePerMonth),
      chargePer2Month: Number(formData.chargePer2Month),
    });
    logStore.addLog(userId || "", "tblChargeFee", MethodRequest.CREATE, "");
    toast({ title: "Fee structure added successfully" });
    setOpen(false);
    setFormData({ classId: "", levelId: "", charge: "", chargeCash: "", chargePerMonth: "", chargePer2Month: "" });
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || "-";
  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || "-";

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground">Manage course fees for your branch</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label>Full Charge</Label>
                  <Input type="number" value={formData.charge} onChange={(e) => setFormData({...formData, charge: e.target.value})} required />
                </div>
                <div>
                  <Label>Cash Price</Label>
                  <Input type="number" value={formData.chargeCash} onChange={(e) => setFormData({...formData, chargeCash: e.target.value})} required />
                </div>
                <div>
                  <Label>Per Month</Label>
                  <Input type="number" value={formData.chargePerMonth} onChange={(e) => setFormData({...formData, chargePerMonth: e.target.value})} required />
                </div>
                <div>
                  <Label>Per 2 Months</Label>
                  <Input type="number" value={formData.chargePer2Month} onChange={(e) => setFormData({...formData, chargePer2Month: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full">Add Fee Structure</Button>
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
                    <TableCell className="font-medium">{getClassName(fee.classId)}</TableCell>
                    <TableCell>{getLevelName(fee.levelId)}</TableCell>
                    <TableCell>Rp {fee.charge.toLocaleString()}</TableCell>
                    <TableCell className="text-success">Rp {fee.chargeCash.toLocaleString()}</TableCell>
                    <TableCell>Rp {fee.chargePerMonth.toLocaleString()}</TableCell>
                    <TableCell>Rp {fee.chargePer2Month.toLocaleString()}</TableCell>
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

export default FeesView