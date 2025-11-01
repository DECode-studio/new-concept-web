import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboardPage() {
  return (
    <DashboardTemplate
      title="Student Dashboard"
      description="Your progress and payments at a glance."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Outstanding Invoice", "Next Class", "Attendance", "Reports"].map((title) => (
          <Card key={title} className="border-secondary/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">Coming soon</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardTemplate>
  );
}
