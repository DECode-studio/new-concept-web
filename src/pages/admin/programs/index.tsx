import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblProgram } from "@/models/types";

const ProgramsView = () => {
  const programs = getFromLocalStorage<TblProgram[]>("tblProgram") || [];
  const activePrograms = programs.filter(p => !p.deleted);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
            <p className="text-muted-foreground">Manage course programs</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Program
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activePrograms.map((program) => (
            <Card key={program.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{program.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Key: {program.key}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProgramsView