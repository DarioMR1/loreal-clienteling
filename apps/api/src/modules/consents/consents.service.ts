import { Injectable, Inject } from "@nestjs/common";
import { eq, and, isNull } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { consents } from "@loreal/database";
import type { GrantConsentDto } from "../../dtos/consents.dto";
import type { SessionUser } from "../../common/types/session";
import { AuditService } from "../../common/services/audit.service";

const CHANNEL_TO_CONSENT: Record<string, string> = {
  whatsapp: "marketing_whatsapp",
  sms: "marketing_sms",
  email: "marketing_email",
};

@Injectable()
export class ConsentsService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    @Inject(AuditService) private auditService: AuditService,
  ) {}

  async findByCustomer(customerId: string) {
    return this.db
      .select()
      .from(consents)
      .where(
        and(
          eq(consents.customerId, customerId),
          isNull(consents.revokedAt),
        ),
      );
  }

  async grant(data: GrantConsentDto, user: SessionUser) {
    const [consent] = await this.db
      .insert(consents)
      .values(data)
      .returning();

    await this.auditService.log(
      user,
      "consent_granted",
      "consent",
      consent.id,
      { customerId: data.customerId, type: data.type, version: data.version },
    );

    return consent;
  }

  async revoke(customerId: string, type: string, user: SessionUser) {
    const [consent] = await this.db
      .update(consents)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(consents.customerId, customerId),
          eq(consents.type, type),
          isNull(consents.revokedAt),
        ),
      )
      .returning();

    if (consent) {
      await this.auditService.log(
        user,
        "consent_revoked",
        "consent",
        consent.id,
        { customerId, type },
      );
    }

    return consent ?? null;
  }

  async hasActiveConsent(
    customerId: string,
    channelType: string,
  ): Promise<boolean> {
    const consentType = CHANNEL_TO_CONSENT[channelType] ?? channelType;

    const [consent] = await this.db
      .select()
      .from(consents)
      .where(
        and(
          eq(consents.customerId, customerId),
          eq(consents.type, consentType),
          isNull(consents.revokedAt),
        ),
      )
      .limit(1);

    return !!consent;
  }
}
