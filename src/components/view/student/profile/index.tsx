"use client";

import { observer } from "mobx-react-lite";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authStore, studentStore } from "@/stores";
import { StudentStatus } from "@/models/types";

const ProfileView = observer(() => {
  const userId = authStore.getUserId();
  const student = userId ? studentStore.getByUserId(userId) : null;

  if (!student) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Student profile not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Personal information and details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Full Name" value={student.fullName} />
            <Info label="Nick Name" value={student.nickName} />
            <Info label="Registration Number" value={student.registrationNumber} mono />
            <Info label="Title" value={student.title} />
            <Info label="Gender" value={student.gender} />
            <Info label="Blood Group" value={student.bloodGroup} />
            <Info label="Place of Birth" value={student.placeBirth} />
            <Info label="Date of Birth" value={student.dateBirth ? new Date(student.dateBirth).toLocaleDateString() : "-"} />
            <Info label="Phone" value={student.phone} />
            <Info label="Citizenship" value={student.citizenship} />
            <Info label="Address" value={student.address} full />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="School" value={student.school} />
            <Info label="Class" value={student.class} />
            <Info label="Study Start Time" value={student.studyStartTime ? new Date(student.studyStartTime).toLocaleDateString() : "-"} />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={student.status === StudentStatus.ACTIVE ? "default" : "secondary"}>
                {student.status}
              </Badge>
            </div>
            <Info label="Religion" value={student.religion} />
            <Info label="Hobby" value={student.hobby} />
          </div>
        </CardContent>
      </Card>

      {student.isUnderAge && (
        <Card>
          <CardHeader>
            <CardTitle>Parent/Guardian Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Parent Name" value={student.parentName} />
              <Info label="Occupation" value={student.parentOccupation} />
              <Info label="Address" value={student.parentAddress} full />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

interface InfoProps {
  label: string;
  value?: string | null;
  mono?: boolean;
  full?: boolean;
}

const Info = ({ label, value, mono, full }: InfoProps) => (
  <div className={full ? "md:col-span-2" : undefined}>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className={mono ? "font-mono font-medium" : "font-medium"}>{value ?? "-"}</p>
  </div>
);

export default ProfileView;
