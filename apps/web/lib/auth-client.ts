import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  twoFactorClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { API_URL } from "./constants";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    adminClient(),
    twoFactorClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: true,
          defaultValue: "ba",
        },
        storeId: {
          type: "string",
          required: false,
        },
        zoneId: {
          type: "string",
          required: false,
        },
        brandId: {
          type: "string",
          required: false,
        },
        active: {
          type: "boolean",
          required: true,
          defaultValue: true,
        },
        fullName: {
          type: "string",
          required: true,
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
