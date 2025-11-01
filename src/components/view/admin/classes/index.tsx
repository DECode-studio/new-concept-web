"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus, Edit, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { classStore, levelStore, logStore, authStore } from "@/stores";
import { MethodRequest } from "@/models/types";
import { useToast } from "@/hooks/use-toast";

const ClassView = observer(() => {
  const classes = classStore.list();
  const levels = levelStore.list();
  const actorId = authStore.getUserId() ?? "admin";
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [classForm, setClassForm] = useState({ name: "", description: "" });
  const [levelForm, setLevelForm] = useState({ classId: "", name: "", description: "" });

  const resetClassForm = () => setClassForm({ name: "", description: "" });
  const resetLevelForm = () => setLevelForm({ classId: "", name: "", description: "" });

  const getLevelsByClassId = (classId: string) => levels.filter((level) => level.classId === classId);

  const handleAddClass = (event: React.FormEvent) => {
    event.preventDefault();
    const record = classStore.addClass({
      name: classForm.name,
      description: classForm.description,
    });
    logStore.addLog(actorId, "tblClass", MethodRequest.CREATE, record.id, null, record);
    toast({ title: "Class created" });
    setOpen(false);
    resetClassForm();
  };

  const handleEditClass = (classId: string) => {
    const item = classStore.getById(classId);
    if (!item) return;
    setSelectedClassId(classId);
    setClassForm({ name: item.name, description: item.description ?? "" });
    setEditOpen(true);
  };

  const handleUpdateClass = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClassId) return;
    const updated = classStore.updateClass(selectedClassId, {
      name: classForm.name,
      description: classForm.description,
    });
    if (updated) {
      logStore.addLog(actorId, "tblClass", MethodRequest.UPDATE, updated.id, null, updated);
      toast({ title: "Class updated" });
    }
    setEditOpen(false);
    setSelectedClassId(null);
    resetClassForm();
  };

  const handleDeleteClass = (classId: string) => {
    if (!window.confirm("Delete this class?")) return;
    const success = classStore.deleteClass(classId);
    if (success) {
      logStore.addLog(actorId, "tblClass", MethodRequest.DELETE, classId);
      toast({ title: "Class deleted" });
    }
  };

  const handleAddLevel = (event: React.FormEvent) => {
    event.preventDefault();
    if (!levelForm.classId) return;
    const record = levelStore.addLevel({
      classId: levelForm.classId,
      name: levelForm.name,
      description: levelForm.description,
    });
    logStore.addLog(actorId, "tblLevel", MethodRequest.CREATE, record.id, null, record);
    toast({ title: "Level added" });
    setLevelOpen(false);
    resetLevelForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes &amp; Levels</h1>
          <p className="text-muted-foreground">Manage class categories and their levels</p>
        </div>
        <Dialog open={open} onOpenChange={(state) => {
          setOpen(state);
          if (!state) resetClassForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={classForm.name} onChange={(event) => setClassForm({ ...classForm, name: event.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={classForm.description} onChange={(event) => setClassForm({ ...classForm, description: event.target.value })} />
              </div>
              <Button type="submit" className="w-full">Create Class</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  {classItem.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{classItem.description}</p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClass(classItem.id)} aria-label="Edit class">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClass(classItem.id)} aria-label="Delete class">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Levels:</p>
                <div className="flex flex-wrap gap-2">
                  {getLevelsByClassId(classItem.id).map((level) => (
                    <Badge key={level.id} variant="secondary">
                      {level.name}
                    </Badge>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLevelForm({ classId: classItem.id, name: "", description: "" });
                      setLevelOpen(true);
                    }}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Level
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={levelOpen} onOpenChange={(state) => {
        setLevelOpen(state);
        if (!state) resetLevelForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Level</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLevel} className="space-y-4">
            <div>
              <Label>Level Name</Label>
              <Input value={levelForm.name} onChange={(event) => setLevelForm({ ...levelForm, name: event.target.value })} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={levelForm.description} onChange={(event) => setLevelForm({ ...levelForm, description: event.target.value })} />
            </div>
            <Button type="submit" className="w-full">Add Level</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={(state) => {
        setEditOpen(state);
        if (!state) {
          setSelectedClassId(null);
          resetClassForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateClass} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={classForm.name} onChange={(event) => setClassForm({ ...classForm, name: event.target.value })} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={classForm.description} onChange={(event) => setClassForm({ ...classForm, description: event.target.value })} />
            </div>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default ClassView;
