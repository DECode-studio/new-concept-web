import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <DashboardTemplate
      title="Admin Dashboard"
      description="National overview for all branches."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Revenue", "Expenses", "Active Branches", "Active Students"].map((title) => (
          <Card key={title} className="border-primary/10">
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
