"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { rootStore } from "@/stores";
import { UserRoles } from "@/models/enums";
import { canAccessRoute, resolveRedirectPath } from "@/utils/routerGuard";

interface UseAuthGuardOptions {
  role?: UserRoles;
}

export const useAuthGuard = ({ role }: UseAuthGuardOptions = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(rootStore.ready);

  useEffect(() => {
    if (!rootStore.ready) {
      rootStore.initialize().then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    const authStore = rootStore.authStore;
    if (!authStore.isAuthenticated) {
      router.replace("/login");
      return;
    }

    const roleFromStore = authStore.getUserRole();
    if (!roleFromStore) {
      router.replace("/login");
      return;
    }

    if (role && roleFromStore !== role) {
      router.replace(resolveRedirectPath(roleFromStore));
      return;
    }

    if (!canAccessRoute(roleFromStore, pathname)) {
      router.replace(resolveRedirectPath(roleFromStore));
    }
  }, [ready, pathname, role, router]);

  return {
    ready,
    user: rootStore.authStore.currentUser,
  };
};
