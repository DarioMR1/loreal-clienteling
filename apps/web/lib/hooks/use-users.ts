import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

// ── Types ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  storeId: string | null;
  zoneId: string | null;
  brandId: string | null;
  active: boolean;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

// ── Query keys ─────────────────────────────────────────────────────

const userKeys = {
  all: ["users"] as const,
};

// ── Queries ────────────────────────────────────────────────────────

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const res = await authClient.admin.listUsers({
        query: { limit: 100 },
      });
      return (res.data?.users ?? []) as unknown as User[];
    },
  });
}

// ── Mutations ──────────────────────────────────────────────────────

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      role: string;
      fullName: string;
      storeId?: string;
      zoneId?: string;
      brandId?: string;
    }) => {
      const res = await authClient.admin.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as "admin",
        data: {
          fullName: data.fullName,
          storeId: data.storeId,
          zoneId: data.zoneId,
          brandId: data.brandId,
        },
      });
      return res.data as unknown as User;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useSetUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await authClient.admin.setRole({
        userId,
        role: role as "admin",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await authClient.admin.banUser({ userId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await authClient.admin.unbanUser({ userId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
