"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus, Edit, Trash2, MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { branchStore, logStore, authStore } from "@/stores";
import { BranchType, MethodRequest } from "@/models/types";
import { useToast } from "@/hooks/use-toast";

const BranchView = observer(() => {
  const branches = branchStore.getActiveBranches();
  const actorId = authStore.getUserId() ?? "admin";
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    phone: "",
    description: "",
    type: "MAIN",
    address: "",
    postCode: "",
    registerFee: "",
  });

  const resetForm = () =>
    setFormData({
      code: "",
      name: "",
      phone: "",
      description: "",
      type: "MAIN",
      address: "",
      postCode: "",
      registerFee: "",
    });

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const registerFee = Number(formData.registerFee) || 0;
    const record = branchStore.addBranch({
      code: formData.code,
      name: formData.name,
      phone: formData.phone,
      description: formData.description,
      type: formData.type as BranchType,
      address: formData.address,
      postCode: formData.postCode,
      registerFee,
    });
    logStore.addLog(actorId, "tblBranch", MethodRequest.CREATE, record.id, null, record);
    toast({ title: "Branch created" });
    setOpen(false);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const branch = branchStore.getById(id);
    if (!branch) return;
    setSelectedBranchId(id);
    setFormData({
      code: branch.code,
      name: branch.name,
      phone: branch.phone,
      description: branch.description ?? "",
      type: branch.type,
      address: branch.address,
      postCode: branch.postCode,
      registerFee: branch.registerFee.toString(),
    });
    setEditOpen(true);
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedBranchId) return;
    const registerFee = Number(formData.registerFee) || 0;
    const updated = branchStore.updateBranch(selectedBranchId, {
      code: formData.code,
      name: formData.name,
      phone: formData.phone,
      description: formData.description,
      type: formData.type as BranchType,
      address: formData.address,
      postCode: formData.postCode,
      registerFee,
    });
    if (updated) {
      logStore.addLog(actorId, "tblBranch", MethodRequest.UPDATE, updated.id, null, updated);
      toast({ title: "Branch updated" });
    }
    setEditOpen(false);
    setSelectedBranchId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    const success = branchStore.deleteBranch(id);
    if (success) {
      logStore.addLog(actorId, "tblBranch", MethodRequest.DELETE, id);
      toast({ title: "Branch deleted" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">Manage all branch locations</p>
        </div>
        <Dialog open={open} onOpenChange={(state) => {
          setOpen(state);
          if (!state) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Branch</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Code</Label>
                  <Input value={formData.code} onChange={(event) => setFormData({ ...formData, code: event.target.value })} required />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAIN">Main</SelectItem>
                      <SelectItem value="FRANCHISE">Franchise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Post Code</Label>
                  <Input value={formData.postCode} onChange={(event) => setFormData({ ...formData, postCode: event.target.value })} />
                </div>
                <div>
                  <Label>Registration Fee</Label>
                  <Input type="number" value={formData.registerFee} onChange={(event) => setFormData({ ...formData, registerFee: event.target.value })} required />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
              </div>
              <Button type="submit">Create Branch</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <Badge variant={branch.type === "MAIN" ? "default" : "secondary"} className="mt-2">
                    {branch.type}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(branch.id)}
                    aria-label="Edit branch"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(branch.id)}
                    aria-label="Delete branch"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{branch.phone}</span>
                </div>
                <div className="border-t pt-2">
                  <p className="text-xs text-muted-foreground">Registration Fee</p>
                  <p className="text-lg font-semibold text-primary">Rp {branch.registerFee.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={(state) => {
        setEditOpen(state);
        if (!state) {
          setSelectedBranchId(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Code</Label>
                <Input value={formData.code} onChange={(event) => setFormData({ ...formData, code: event.target.value })} required />
              </div>
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAIN">Main</SelectItem>
                    <SelectItem value="FRANCHISE">Franchise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Post Code</Label>
                <Input value={formData.postCode} onChange={(event) => setFormData({ ...formData, postCode: event.target.value })} />
              </div>
              <div>
                <Label>Registration Fee</Label>
                <Input type="number" value={formData.registerFee} onChange={(event) => setFormData({ ...formData, registerFee: event.target.value })} required />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Textarea value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default BranchView;
