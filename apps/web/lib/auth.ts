import { headers } from "next/headers";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { API_URL } from "./constants";

const serverAuthClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
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

export async function getSession() {
  const session = await serverAuthClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  return session.data;
}
