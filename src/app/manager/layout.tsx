import type { Metadata } from "next";

import { RoleLayout } from "@/components/templates/RoleLayout";
import { UserRoles } from "@/models/enums";

export const metadata: Metadata = {
  title: "New Concept • Manager",
};

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role={UserRoles.MANAGER}>{children}</RoleLayout>;
}
