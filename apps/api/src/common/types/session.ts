export interface SessionUser {
  id: string;
  email: string;
  role: "ba" | "manager" | "supervisor" | "admin";
  storeId: string | null;
  brandId: string | null;
  zoneId: string | null;
  active: boolean;
  fullName: string;
}

export interface UserSession {
  user: SessionUser;
  session: {
    id: string;
    token: string;
    expiresAt: Date;
    userId: string;
  };
}
