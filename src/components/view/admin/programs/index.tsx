"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus, Edit, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { programStore, logStore, authStore } from "@/stores";
import { MethodRequest } from "@/models/types";
import { useToast } from "@/hooks/use-toast";

const ProgramsView = observer(() => {
  const programs = programStore.list();
  const { toast } = useToast();
  const actorId = authStore.getUserId() ?? "admin";

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ key: "", name: "", description: "" });

  const resetForm = () => setFormData({ key: "", name: "", description: "" });

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const record = programStore.addProgram({
      key: formData.key,
      name: formData.name,
      description: formData.description,
    });
    logStore.addLog(actorId, "tblProgram", MethodRequest.CREATE, record.id, null, record);
    toast({ title: "Program created" });
    setOpen(false);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const program = programStore.getById(id);
    if (!program) return;
    setSelectedId(id);
    setFormData({ key: program.key, name: program.name, description: program.description ?? "" });
    setEditOpen(true);
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedId) return;
    const updated = programStore.updateProgram(selectedId, {
      key: formData.key,
      name: formData.name,
      description: formData.description,
    });
    if (updated) {
      logStore.addLog(actorId, "tblProgram", MethodRequest.UPDATE, updated.id, null, updated);
      toast({ title: "Program updated" });
    }
    setEditOpen(false);
    setSelectedId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this program?")) return;
    const success = programStore.deleteProgram(id);
    if (success) {
      logStore.addLog(actorId, "tblProgram", MethodRequest.DELETE, id);
      toast({ title: "Program deleted" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground">Manage course programs</p>
        </div>
        <Dialog open={open} onOpenChange={(state) => {
          setOpen(state);
          if (!state) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Program</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label>Key</Label>
                <Input value={formData.key} onChange={(event) => setFormData({ ...formData, key: event.target.value })} required />
              </div>
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
              </div>
              <Button type="submit" className="w-full">Create Program</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{program.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(program.id)} aria-label="Edit program">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(program.id)} aria-label="Delete program">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {program.description ? (
                <p className="text-sm text-muted-foreground">{program.description}</p>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">Key: {program.key}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={(state) => {
        setEditOpen(state);
        if (!state) {
          setSelectedId(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label>Key</Label>
              <Input value={formData.key} onChange={(event) => setFormData({ ...formData, key: event.target.value })} required />
            </div>
            <div>
              <Label>Name</Label>
              <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
            </div>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default ProgramsView;
