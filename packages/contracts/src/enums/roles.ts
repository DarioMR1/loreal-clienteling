export const UserRole = {
  BA: "ba",
  MANAGER: "manager",
  SUPERVISOR: "supervisor",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLES = Object.values(UserRole);
