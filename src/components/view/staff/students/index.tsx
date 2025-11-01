"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Plus, Edit } from "lucide-react";

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
import {
  authStore,
  studentStore,
  programStore,
  classStore,
  levelStore,
  chargeFeeStore,
  logStore,
} from "@/stores";
import { useToast } from "@/hooks/use-toast";
import {
  StudentStatus,
  UserGender,
  UserTitle,
  UserBloodGroup,
  MethodRequest,
} from "@/models/types";

const defaultForm = {
  programId: "",
  classId: "",
  levelId: "",
  chargeId: "",
  fullName: "",
  nickName: "",
  phone: "",
  address: "",
  gender: UserGender.MALE,
  status: StudentStatus.ACTIVE,
};

type FormState = typeof defaultForm;

const StudentsView = observer(() => {
  const branchId = authStore.getBranchId();
  const userId = authStore.getUserId();
  const students = branchId ? studentStore.getByBranch(branchId) : [];
  const programs = programStore.list();
  const classes = classStore.list();
  const levels = levelStore.list();
  const fees = branchId ? chargeFeeStore.findByBranch(branchId) : chargeFeeStore.list();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(defaultForm);

  const resetForm = () => setFormData(defaultForm);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const regNumber = `REG-${Date.now()}`;
    const now = new Date().toISOString();

    const record = studentStore.addStudent({
      userId: `user-${Date.now()}`,
      branchId: branchId ?? "",
      programId: formData.programId,
      classId: formData.classId,
      chargeId: formData.chargeId,
      levelId: formData.levelId,
      status: formData.status,
      registrationNumber: regNumber,
      imageProfile: "",
      fullName: formData.fullName,
      nickName: formData.nickName,
      title: UserTitle.MR,
      placeBirth: "",
      dateBirth: now,
      gender: formData.gender,
      bloodGroup: UserBloodGroup.O,
      address: formData.address,
      postCode: "",
      phone: formData.phone,
      citizenship: "Indonesia",
      reportMark: "",
      school: "",
      religion: "",
      class: "",
      hobby: "",
      organizationName: "",
      organizationAddress: "",
      isUnderAge: false,
      parentName: "",
      parentOccupation: "",
      parentAddress: "",
      studyStartTime: now,
    });

    logStore.addLog(userId ?? "system", "tblStudent", MethodRequest.CREATE, record.id, null, record);
    toast({ title: "Student added successfully" });
    setOpen(false);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const student = students.find((item) => item.id === id);
    if (!student) return;
    setSelectedStudent(id);
    setFormData({
      programId: student.programId,
      classId: student.classId,
      levelId: student.levelId,
      chargeId: student.chargeId,
      fullName: student.fullName,
      nickName: student.nickName ?? "",
      phone: student.phone ?? "",
      address: student.address ?? "",
      gender: student.gender ?? UserGender.MALE,
      status: student.status,
    });
    setEditOpen(true);
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedStudent) return;

    const updated = studentStore.updateStudent(selectedStudent, {
      programId: formData.programId,
      classId: formData.classId,
      levelId: formData.levelId,
      chargeId: formData.chargeId,
      fullName: formData.fullName,
      nickName: formData.nickName,
      phone: formData.phone,
      address: formData.address,
      gender: formData.gender,
      status: formData.status,
    });

    if (updated) {
      logStore.addLog(userId ?? "system", "tblStudent", MethodRequest.UPDATE, updated.id, null, updated);
      toast({ title: "Student updated successfully" });
    }

    setEditOpen(false);
    setSelectedStudent(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Add and edit student information</p>
        </div>
        <Dialog open={open} onOpenChange={(state) => {
          setOpen(state);
          if (!state) {
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Full Name</Label>
                  <Input value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} required />
                </div>
                <div>
                  <Label>Nick Name</Label>
                  <Input value={formData.nickName} onChange={(event) => setFormData({ ...formData, nickName: event.target.value })} required />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={(value: UserGender) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserGender.MALE}>Male</SelectItem>
                      <SelectItem value={UserGender.FEMALE}>Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Program</Label>
                  <Select value={formData.programId} onValueChange={(value) => setFormData({ ...formData, programId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
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
                  <Label>Fee Structure</Label>
                  <Select value={formData.chargeId} onValueChange={(value) => setFormData({ ...formData, chargeId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee" />
                    </SelectTrigger>
                    <SelectContent>
                      {fees.map((fee) => (
                        <SelectItem key={fee.id} value={fee.id}>
                          Rp {fee.charge.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} />
              </div>
              <Button type="submit" className="w-full">
                Add Student
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Nick Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono font-medium">{student.registrationNumber}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.nickName}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === StudentStatus.ACTIVE ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.studyStartTime ? new Date(student.studyStartTime).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(student.id)}
                      aria-label="Edit student"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={(state) => {
        setEditOpen(state);
        if (!state) {
          setSelectedStudent(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} required />
              </div>
              <div>
                <Label>Nick Name</Label>
                <Input value={formData.nickName} onChange={(event) => setFormData({ ...formData, nickName: event.target.value })} required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(value: UserGender) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserGender.MALE}>Male</SelectItem>
                    <SelectItem value={UserGender.FEMALE}>Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Program</Label>
                <Select value={formData.programId} onValueChange={(value) => setFormData({ ...formData, programId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
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
                <Label>Fee Structure</Label>
                <Select value={formData.chargeId} onValueChange={(value) => setFormData({ ...formData, chargeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee" />
                  </SelectTrigger>
                  <SelectContent>
                    {fees.map((fee) => (
                      <SelectItem key={fee.id} value={fee.id}>
                        Rp {fee.charge.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} />
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

export default StudentsView;
