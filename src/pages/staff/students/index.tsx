import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { studentStore } from "@/stores/StudentStore";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblProgram, TblClass, TblLevel, TblChargeFee, StudentStatus, UserGender, UserTitle, UserBloodGroup, MethodRequest } from "@/models/types";
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

const StudentsView = observer(() => {
  const branchId = authStore.getBranchId();
  const userId = authStore.getUserId();
  const students = studentStore.getStudentsByBranch(branchId || "");
  const programs = getFromLocalStorage<TblProgram[]>("tblProgram") || [];
  const classes = getFromLocalStorage<TblClass[]>("tblClass") || [];
  const levels = getFromLocalStorage<TblLevel[]>("tblLevel") || [];
  const fees = getFromLocalStorage<TblChargeFee[]>("tblChargeFee") || [];
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regNumber = `REG-${Date.now()}`;
    studentStore.addStudent({
      userId: `user-${Date.now()}`,
      branchId: branchId || "",
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
      dateBirth: new Date(),
      gender: formData.gender,
      blodGroup: UserBloodGroup.O,
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
      studyStartTime: new Date(),
    });
    logStore.addLog(userId || "", "tblStudent", MethodRequest.CREATE, "");
    toast({ title: "Student added successfully" });
    setOpen(false);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setFormData({
      programId: student.programId,
      classId: student.classId,
      levelId: student.levelId,
      chargeId: student.chargeId,
      fullName: student.fullName,
      nickName: student.nickName,
      phone: student.phone,
      address: student.address,
      gender: student.gender,
      status: student.status,
    });
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      studentStore.updateStudent(selectedStudent.id, formData);
      logStore.addLog(userId || "", "tblStudent", MethodRequest.UPDATE, selectedStudent.id);
      toast({ title: "Student updated successfully" });
      setEditOpen(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">Add and edit student information</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Nick Name</Label>
                    <Input value={formData.nickName} onChange={(e) => setFormData({...formData, nickName: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={formData.gender} onValueChange={(value: UserGender) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Program</Label>
                    <Select value={formData.programId} onValueChange={(value) => setFormData({...formData, programId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.filter(p => !p.deleted).map((program) => (
                          <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Class</Label>
                    <Select value={formData.classId} onValueChange={(value) => setFormData({...formData, classId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.filter(c => !c.deleted).map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
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
                          <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Fee</Label>
                    <Select value={formData.chargeId} onValueChange={(value) => setFormData({...formData, chargeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee" />
                      </SelectTrigger>
                      <SelectContent>
                        {fees.filter(f => !f.deleted && f.branchId === branchId).map((fee) => (
                          <SelectItem key={fee.id} value={fee.id}>Rp {fee.charge.toLocaleString()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <Button type="submit" className="w-full">Add Student</Button>
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
                  <TableHead>Reg. No.</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Nick Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono font-medium">
                      {student.registrationNumber}
                    </TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>{student.nickName}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "ACTIVE" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(student)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                </div>
                <div>
                  <Label>Nick Name</Label>
                  <Input value={formData.nickName} onChange={(e) => setFormData({...formData, nickName: e.target.value})} required />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full">Update Student</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
});

export default StudentsView