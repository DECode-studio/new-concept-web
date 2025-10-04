import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblClass, TblLevel } from "@/models/types";
import { Badge } from "@/components/ui/badge";

const ClassView = () => {
  const classes = getFromLocalStorage<TblClass[]>("tblClass") || [];
  const levels = getFromLocalStorage<TblLevel[]>("tblLevel") || [];
  const activeClasses = classes.filter(c => !c.deleted);

  const getLevelsByClassId = (classId: string) => {
    return levels.filter(l => l.classId === classId && !l.deleted);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classes & Levels</h1>
            <p className="text-muted-foreground">Manage class categories and their levels</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activeClasses.map((classItem) => (
            <Card key={classItem.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {classItem.description}
                    </p>
                  </div>
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
                <div className="space-y-2">
                  <p className="text-sm font-medium">Levels:</p>
                  <div className="flex flex-wrap gap-2">
                    {getLevelsByClassId(classItem.id).map((level) => (
                      <Badge key={level.id} variant="secondary">
                        {level.name}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Level
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ClassView