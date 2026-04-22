import { z } from "zod";
import { USER_ROLES } from "../enums/roles";

export const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(200),
  role: z.enum(USER_ROLES as [string, ...string[]]),
  storeId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial().omit({ email: true });

export type UpdateUser = z.infer<typeof updateUserSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type Login = z.infer<typeof loginSchema>;
