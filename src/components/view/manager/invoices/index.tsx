"use client";

import { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { FileText, Download, Plus, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  authStore,
  invoiceStore,
  studentStore,
  voucherStore,
  chargeFeeStore,
  logStore,
} from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { TransactionStatus, TblVoucher, MethodRequest } from "@/models/types";

const variantForStatus: Record<TransactionStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [TransactionStatus.SUCCESS]: "default",
  [TransactionStatus.PENDING]: "secondary",
  [TransactionStatus.FAILED]: "destructive",
  [TransactionStatus.EXPIRED]: "outline",
};

const statusLabel: Record<TransactionStatus, string> = {
  [TransactionStatus.SUCCESS]: "PAID",
  [TransactionStatus.PENDING]: "PENDING",
  [TransactionStatus.FAILED]: "FAILED",
  [TransactionStatus.EXPIRED]: "EXPIRED",
};

const InvoicesView = observer(() => {
  const branchId = authStore.getBranchId();
  const invoices = branchId ? invoiceStore.list().filter((invoice) => invoice.branchId === branchId) : [];
  const students = studentStore.list();
  const vouchers = voucherStore.list();
  const chargeFees = branchId ? chargeFeeStore.findByBranch(branchId) : chargeFeeStore.list();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.SUCCESS);
  const [form, setForm] = useState({
    studentId: "",
    chargeId: "",
    period: "",
    dueDate: "",
    voucherId: "",
    notes: "",
  });
  const [items, setItems] = useState<Array<{ description: string; qty: number; price: string }>>([
    { description: "", qty: 1, price: "" },
  ]);

  const branchStudents = useMemo(() => {
    if (!branchId) return [];
    return students.filter((student) => student.branchId === branchId);
  }, [students, branchId]);

  const applicableVouchers = useMemo(() => {
    if (!branchId) return [] as TblVoucher[];
    return vouchers.filter((voucher) => {
      if (!voucher.active) return false;
      const now = Date.now();
      if (voucher.startAt && Date.parse(voucher.startAt) > now) return false;
      if (voucher.endAt && Date.parse(voucher.endAt) < now) return false;

      switch (voucher.scope) {
        case "GLOBAL":
          return true;
        case "BRANCH":
          return voucher.branchId === branchId;
        case "STUDENT":
          return voucher.studentId === form.studentId;
        case "PROGRAM":
          return voucher.programId !== undefined; // program-specific validation occurs later
        case "CLASS":
          return voucher.classId !== undefined;
        case "LEVEL":
          return voucher.levelId !== undefined;
        default:
          return false;
      }
    });
  }, [vouchers, branchId, form.studentId]);

  const autoCharge = (chargeId?: string) => {
    if (!chargeId) return;
    const fee = chargeFees.find((record) => record.id === chargeId);
    if (fee) {
      setItems([{ description: "Tuition Fee", qty: 1, price: fee.chargePerMonth.toString() }]);
    }
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, { description: "", qty: 1, price: "" }]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateItem = (index: number, patch: Partial<{ description: string; qty: number; price: string }>) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          ...patch,
        };
      }),
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!branchId) return;
    if (!form.studentId) {
      toast({ title: "Select a student", variant: "destructive" });
      return;
    }
    const preparedItems = items
      .filter((item) => item.description.trim())
      .map((item) => ({ description: item.description.trim(), qty: Number(item.qty) || 0, price: Number(item.price) || 0 }));
    if (preparedItems.length === 0) {
      toast({ title: "Invoice items required", variant: "destructive" });
      return;
    }

    try {
      const { invoice } = invoiceStore.createInvoice({
        branchId,
        studentId: form.studentId,
        chargeId: form.chargeId || undefined,
        period: form.period,
        dueDate: form.dueDate || undefined,
        discountVoucherId: form.voucherId || undefined,
        status,
        createdBy: authStore.getUserId() ?? "system",
        notes: form.notes || undefined,
        items: preparedItems,
      });

      logStore.addLog(authStore.getUserId() ?? "system", "tblInvoice", MethodRequest.CREATE, invoice.id, null, invoice);
      toast({ title: "Invoice generated", description: invoice.visibleNumber });
      setOpen(false);
      setForm({ studentId: "", chargeId: "", period: "", dueDate: "", voucherId: "", notes: "" });
      setStatus(TransactionStatus.SUCCESS);
      setItems([{ description: "", qty: 1, price: "" }]);
    } catch (error: any) {
      toast({ title: "Failed to generate invoice", description: String(error), variant: "destructive" });
    }
  };

  const getStudentName = (id: string) => students.find((student) => student.id === id)?.fullName ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage student invoices</p>
        </div>
        <Dialog open={open} onOpenChange={(state) => {
          setOpen(state);
          if (!state) {
            setForm({ studentId: "", chargeId: "", period: "", dueDate: "", voucherId: "", notes: "" });
            setStatus(TransactionStatus.SUCCESS);
            setItems([{ description: "", qty: 1, price: "" }]);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Invoice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Student</Label>
                  <Select value={form.studentId} onValueChange={(value) => setForm({ ...form, studentId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fee Structure</Label>
                  <Select
                    value={form.chargeId}
                    onValueChange={(value) => {
                      setForm({ ...form, chargeId: value });
                      autoCharge(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee" />
                    </SelectTrigger>
                    <SelectContent>
                      {chargeFees.map((fee) => (
                        <SelectItem key={fee.id} value={fee.id}>
                          Rp {fee.chargePerMonth.toLocaleString()} ({fee.classId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period (YYYY-MM)</Label>
                  <Input
                    value={form.period}
                    onChange={(event) => setForm({ ...form, period: event.target.value })}
                    placeholder="2024-02"
                    required
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(value: TransactionStatus) => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TransactionStatus.SUCCESS}>Paid</SelectItem>
                      <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
                      <SelectItem value={TransactionStatus.EXPIRED}>Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Voucher</Label>
                  <Select value={form.voucherId} onValueChange={(value) => setForm({ ...form, voucherId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="No voucher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No voucher</SelectItem>
                      {applicableVouchers.map((voucher) => (
                        <SelectItem key={voucher.id} value={voucher.id}>
                          {voucher.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Items</Label>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="grid gap-2 md:grid-cols-[1fr_120px_120px_auto]">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(event) => updateItem(index, { description: event.target.value })}
                        required
                      />
                      <Input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(event) => updateItem(index, { qty: Number(event.target.value) || 0 })}
                        required
                      />
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(event) => updateItem(index, { price: event.target.value })}
                        required
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItemRow(index)} disabled={items.length === 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addItemRow} className="mt-2 w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
              </div>

              <Button type="submit" className="w-full">
                Save Invoice
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-medium">{invoice.visibleNumber}</TableCell>
                  <TableCell>{getStudentName(invoice.studentId)}</TableCell>
                  <TableCell>Rp {invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={variantForStatus[invoice.status] ?? "outline"}>{statusLabel[invoice.status] ?? invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Download
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

export default InvoicesView;
