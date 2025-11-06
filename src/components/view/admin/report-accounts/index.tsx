"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus, Edit, Trash2 } from "lucide-react";

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
import { accountStore, authStore, logStore } from "@/stores";
import { AccountCategory, MethodRequest } from "@/models/types";
import { useToast } from "@/hooks/use-toast";

const createEmptyAccountForm = () => {
  const categories = Object.values(AccountCategory);
  const defaultCategory = (categories[0] as AccountCategory | undefined) ?? AccountCategory.PENDAPATAN;
  return {
    code: "",
    name: "",
    category: defaultCategory,
  };
};

const ReportAccountsView = observer(() => {
  const accounts = accountStore.list();
  const sortedAccounts = [...accounts].sort((a, b) => a.code.localeCompare(b.code));
  const { toast } = useToast();
  const actorId = authStore.getUserId() ?? "admin";

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState(createEmptyAccountForm);

  const resetForm = () => setFormState(createEmptyAccountForm());

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    const code = formState.code.trim();
    const name = formState.name.trim();

    if (!code || !name) {
      toast({
        title: "Incomplete data",
        description: "Please provide both account code and name.",
        variant: "destructive",
      });
      return;
    }

    const created = accountStore.addAccount({
      code,
      name,
      category: formState.category,
    });
    logStore.addLog(actorId, "tblTransactionAccount", MethodRequest.CREATE, created.id, null, created);
    toast({ title: "Account type created" });
    setAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (accountId: string) => {
    const existing = accountStore.getById(accountId);
    if (!existing) return;
    setSelectedId(accountId);
    setFormState({
      code: existing.code,
      name: existing.name,
      category: existing.category,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedId) return;

    const code = formState.code.trim();
    const name = formState.name.trim();
    if (!code || !name) {
      toast({
        title: "Incomplete data",
        description: "Please provide both account code and name.",
        variant: "destructive",
      });
      return;
    }

    const current = accountStore.getById(selectedId);
    if (!current) return;
    const before = { ...current };
    const updated = accountStore.updateAccount(selectedId, {
      code,
      name,
      category: formState.category,
    });
    if (updated) {
      logStore.addLog(actorId, "tblTransactionAccount", MethodRequest.UPDATE, updated.id, before, updated);
      toast({ title: "Account type updated" });
    }
    setEditDialogOpen(false);
    setSelectedId(null);
    resetForm();
  };

  const handleDelete = (accountId: string) => {
    const existing = accountStore.getById(accountId);
    if (!existing) return;
    if (!window.confirm("Delete this account type?")) return;
    const before = { ...existing };
    const success = accountStore.deleteAccount(accountId);
    if (success) {
      logStore.addLog(actorId, "tblTransactionAccount", MethodRequest.DELETE, accountId, before, null);
      toast({ title: "Account type removed" });
      if (selectedId === accountId) {
        setSelectedId(null);
        resetForm();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Account Types</h1>
          <p className="text-muted-foreground">
            Configure transaction accounts used when categorising financial reports.
          </p>
        </div>
        <Dialog
          open={addDialogOpen}
          onOpenChange={(state) => {
            setAddDialogOpen(state);
            if (!state) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Account Type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="new-account-code">Code</Label>
                  <Input
                    id="new-account-code"
                    value={formState.code}
                    onChange={(event) => setFormState({ ...formState, code: event.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="new-account-category">Category</Label>
                  <Select
                    value={formState.category}
                    onValueChange={(value: AccountCategory) => setFormState({ ...formState, category: value })}
                  >
                    <SelectTrigger id="new-account-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AccountCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="new-account-name">Name</Label>
                  <Input
                    id="new-account-name"
                    value={formState.name}
                    onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Account Type
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Types</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    No account types configured yet.
                  </TableCell>
                </TableRow>
              ) : (
                sortedAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.category}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(account.id)} aria-label="Edit account type">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)} aria-label="Delete account type">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={editDialogOpen}
        onOpenChange={(state) => {
          setEditDialogOpen(state);
          if (!state) {
            setSelectedId(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-account-code">Code</Label>
                <Input
                  id="edit-account-code"
                  value={formState.code}
                  onChange={(event) => setFormState({ ...formState, code: event.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-account-category">Category</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value: AccountCategory) => setFormState({ ...formState, category: value })}
                >
                  <SelectTrigger id="edit-account-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AccountCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-account-name">Name</Label>
                <Input
                  id="edit-account-name"
                  value={formState.name}
                  onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default ReportAccountsView;
