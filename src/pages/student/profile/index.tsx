import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { studentStore } from "@/stores/StudentStore";
import { Badge } from "@/components/ui/badge";

const ProfileView = observer(() => {
  const userId = authStore.getUserId();
  const student = studentStore.getStudentByUserId(userId || "");

  if (!student) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Student profile not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Personal information and details</p>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{student.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nick Name</p>
                <p className="font-medium">{student.nickName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-medium font-mono">{student.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{student.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{student.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium">{student.blodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Place of Birth</p>
                <p className="font-medium">{student.placeBirth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{new Date(student.dateBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{student.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Citizenship</p>
                <p className="font-medium">{student.citizenship}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{student.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">School</p>
                <p className="font-medium">{student.school}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">{student.class}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Start Time</p>
                <p className="font-medium">{new Date(student.studyStartTime).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={student.status === "ACTIVE" ? "default" : "secondary"}>
                  {student.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Religion</p>
                <p className="font-medium">{student.religion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hobby</p>
                <p className="font-medium">{student.hobby}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent Information */}
        {student.isUnderAge && (
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Parent Name</p>
                  <p className="font-medium">{student.parentName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p className="font-medium">{student.parentOccupation || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{student.parentAddress || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
});

export default ProfileView