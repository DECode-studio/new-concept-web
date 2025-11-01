"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { userStore, branchStore, authStore, logStore } from "@/stores";
import { MethodRequest, UserRoles, UserStatus } from "@/models/types";
import { useToast } from "@/hooks/use-toast";

const roleVariants: Record<string, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  MANAGER: "secondary",
  STAFF: "outline",
  STUDENT: "outline",
};

const UsersView = observer(() => {
  const users = userStore.list();
  const branches = branchStore.list();
  const actorId = authStore.getUserId() ?? "admin";
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: UserRoles.STAFF,
    status: UserStatus.ACTIVE,
    branchId: "",
  });

  const resetForm = () =>
    setFormData({
      name: "",
      email: "",
      password: "",
      role: UserRoles.STAFF,
      status: UserStatus.ACTIVE,
      branchId: "",
    });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (formData.role !== UserRoles.ADMIN && !formData.branchId) {
        toast({
          title: "Branch required",
          description: "Please select a branch for this user.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }
      const branchId = formData.role === UserRoles.ADMIN ? null : formData.branchId || null;
      const created = await userStore.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: formData.status,
        branchId,
      });
      logStore.addLog(actorId, "tblUser", MethodRequest.CREATE, created.id, null, {
        id: created.id,
        email: created.email,
        role: created.role,
      });
      toast({ title: "User created" });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Failed to create user", description: String(error), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    const success = userStore.softDeleteById(id);
    if (success) {
      logStore.addLog(actorId, "tblUser", MethodRequest.DELETE, id);
      toast({ title: "User deleted" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage all system users</p>
        </div>
        <Dialog open={open} onOpenChange={(state) => {
          setOpen(state);
          if (!state) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: UserRoles) =>
                      setFormData({
                        ...formData,
                        role: value,
                        branchId: value === UserRoles.ADMIN ? "" : formData.branchId,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserRoles).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: UserStatus) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Branch</Label>
                  <Select
                    value={formData.branchId}
                    onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                    disabled={formData.role === UserRoles.ADMIN}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.role === UserRoles.ADMIN ? "Not Applicable" : "Select branch"} />
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
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleVariants[user.role] ?? "outline"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} aria-label="Delete user">
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

export default UsersView;
