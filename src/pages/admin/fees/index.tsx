import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getFromLocalStorage } from "@/utils/localStorageHelper";
import { TblChargeFee, TblBranch, TblClass, TblLevel } from "@/models/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FeesView = () => {
  const fees = getFromLocalStorage<TblChargeFee[]>("tblChargeFee") || [];
  const branches = getFromLocalStorage<TblBranch[]>("tblBranch") || [];
  const classes = getFromLocalStorage<TblClass[]>("tblClass") || [];
  const levels = getFromLocalStorage<TblLevel[]>("tblLevel") || [];

  const activeFees = fees.filter(f => !f.deleted);

  const getBranchName = (id: string) => branches.find(b => b.id === id)?.name || "-";
  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || "-";
  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || "-";

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground">Manage course fees for all branches</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Fee Structure
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fee Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Full Charge</TableHead>
                  <TableHead>Cash Price</TableHead>
                  <TableHead>Per Month</TableHead>
                  <TableHead>Per 2 Months</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">
                      {getBranchName(fee.branchId)}
                    </TableCell>
                    <TableCell>{getClassName(fee.classId)}</TableCell>
                    <TableCell>{getLevelName(fee.levelId)}</TableCell>
                    <TableCell>Rp {fee.charge.toLocaleString()}</TableCell>
                    <TableCell className="text-success">
                      Rp {fee.chargeCash.toLocaleString()}
                    </TableCell>
                    <TableCell>Rp {fee.chargePerMonth.toLocaleString()}</TableCell>
                    <TableCell>Rp {fee.chargePer2Month.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FeesView