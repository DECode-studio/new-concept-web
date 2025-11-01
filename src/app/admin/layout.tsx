import type { Metadata } from "next";

import { RoleLayout } from "@/components/templates/RoleLayout";
import { UserRoles } from "@/models/enums";

export const metadata: Metadata = {
  title: "New Concept • Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role={UserRoles.ADMIN}>{children}</RoleLayout>;
}
