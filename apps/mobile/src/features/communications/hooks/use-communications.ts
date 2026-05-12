import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { MessageTemplate } from "@/types";

/** Fetch message templates for the BA's brand. */
export function useMessageTemplates() {
  return useApi<MessageTemplate[]>(
    () => api.get<MessageTemplate[]>("/communications/templates"),
    []
  );
}
