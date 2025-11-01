"use client";

import { observer } from "mobx-react-lite";

import { RoleLayout } from "@/components/templates/RoleLayout";
import { authStore } from "@/stores";
import { UserRoles } from "@/models/enums";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = observer(({ children }: LayoutProps) => {
  const role = authStore.getUserRole() ?? UserRoles.ADMIN;
  return <RoleLayout role={role}>{children}</RoleLayout>;
});
