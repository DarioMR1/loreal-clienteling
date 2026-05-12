import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: "loreal-clienteling",
      storagePrefix: "loreal-clienteling",
      storage: SecureStore,
    }),
    inferAdditionalFields({
      user: {
        role: { type: "string" as const },
        storeId: { type: "string" as const, required: false },
        zoneId: { type: "string" as const, required: false },
        brandId: { type: "string" as const, required: false },
        active: { type: "boolean" as const },
        fullName: { type: "string" as const },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
