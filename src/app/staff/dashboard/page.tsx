import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffDashboardPage() {
  return (
    <DashboardTemplate
      title="Staff Dashboard"
      description="Daily operations overview."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Today\'s Attendance", "Invoices Generated", "Reports Draft", "Tasks"].map(
          (title) => (
            <Card key={title} className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">Coming soon</p>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </DashboardTemplate>
  );
}
