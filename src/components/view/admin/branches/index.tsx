import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, MapPin, Phone } from "lucide-react";
import { observer } from "mobx-react-lite";
import { branchStore } from "@/stores/BranchStore";
import { Badge } from "@/components/ui/badge";

const BranchView = observer(() => {
    const branches = branchStore.getAllBranches();

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
                        <p className="text-muted-foreground">Manage all branch locations</p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Branch
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {branches.map((branch) => (
                        <Card key={branch.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{branch.name}</CardTitle>
                                        <Badge variant={branch.type === "MAIN" ? "default" : "secondary"} className="mt-2">
                                            {branch.type}
                                        </Badge>
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
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">{branch.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{branch.phone}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <p className="text-xs text-muted-foreground">Registration Fee</p>
                                        <p className="text-lg font-semibold text-primary">
                                            Rp {branch.registerFee.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
});


export default BranchView