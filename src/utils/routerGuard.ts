import { UserRoles } from "@/models/enums";

const roleBase: Record<UserRoles, string> = {
  [UserRoles.ADMIN]: "admin",
  [UserRoles.MANAGER]: "manager",
  [UserRoles.STAFF]: "staff",
  [UserRoles.STUDENT]: "student",
};

export const getRoleBasePath = (role: UserRoles) => `/${roleBase[role]}`;

export const getDashboardPath = (role: UserRoles) => `${getRoleBasePath(role)}/dashboard`;

export const canAccessRoute = (role: UserRoles, pathname: string) => {
  const base = getRoleBasePath(role);
  return pathname === base || pathname.startsWith(`${base}/`);
};

export const resolveRedirectPath = (role: UserRoles | null) => {
  if (!role) return "/login";
  return getDashboardPath(role);
};
