import { z } from "zod";
import { USER_ROLES } from "@loreal/contracts";

export const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(200),
  role: z.enum(USER_ROLES as [string, ...string[]]),
  storeId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ email: true });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
