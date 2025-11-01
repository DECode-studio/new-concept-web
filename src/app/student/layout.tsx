import type { Metadata } from "next";

import { RoleLayout } from "@/components/templates/RoleLayout";
import { UserRoles } from "@/models/enums";

export const metadata: Metadata = {
  title: "New Concept • Student",
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role={UserRoles.STUDENT}>{children}</RoleLayout>;
}
