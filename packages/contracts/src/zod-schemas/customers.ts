import { z } from "zod";
import { GENDERS, LIFECYCLE_SEGMENTS } from "../enums/customer";

export const createCustomerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  gender: z.enum(GENDERS as [string, ...string[]]).optional(),
  birthDate: z.coerce.date().optional(),
});

export type CreateCustomer = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = createCustomerSchema.partial();

export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;

export const searchCustomerSchema = z.object({
  query: z.string().min(1).max(200),
  type: z.enum(["exact", "name", "semantic"]).optional().default("name"),
});

export type SearchCustomer = z.infer<typeof searchCustomerSchema>;

export const customerFiltersSchema = z.object({
  segment: z.enum(LIFECYCLE_SEGMENTS as [string, ...string[]]).optional(),
  storeId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
});

export type CustomerFilters = z.infer<typeof customerFiltersSchema>;
