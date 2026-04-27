"use client";

import {
  useCustomerConsents,
  useGrantConsent,
  useRevokeConsent,
  type Consent,
} from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CONSENT_TYPES = [
  { type: "privacy_notice", label: "Aviso de privacidad" },
  { type: "marketing_whatsapp", label: "WhatsApp marketing" },
  { type: "marketing_email", label: "Email marketing" },
  { type: "marketing_sms", label: "SMS marketing" },
] as const;

interface ConsentsSectionProps {
  customerId: string;
  role: string;
}

export function ConsentsSection({ customerId }: ConsentsSectionProps) {
  const { data: consents = [], isLoading } = useCustomerConsents(customerId);
  const grantConsent = useGrantConsent();
  const revokeConsent = useRevokeConsent();

  const isPending = grantConsent.isPending || revokeConsent.isPending;

  function getConsent(type: string): Consent | undefined {
    return consents.find(
      (c) => c.type === type && !c.revokedAt,
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-48 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consentimientos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {CONSENT_TYPES.map(({ type, label }) => {
            const consent = getConsent(type);
            const isActive = !!consent;

            return (
              <div
                key={type}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{label}</p>
                  {isActive && consent.acceptedAt && (
                    <p className="text-xs text-muted-foreground">
                      Otorgado el{" "}
                      {new Date(consent.acceptedAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={isActive ? "success" : "destructive"}
                    size="sm"
                  >
                    {isActive ? "Activo" : "Sin consentimiento"}
                  </Badge>
                  {isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        revokeConsent.mutate({ customerId, type })
                      }
                    >
                      Revocar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        grantConsent.mutate({
                          customerId,
                          type,
                          source: "web_admin",
                        })
                      }
                    >
                      Otorgar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
