import { Controller, Get, Post, Patch, Param, Body } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { CommunicationsService } from "./communications.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { createCommunicationSchema } from "@loreal/contracts";
import type { CreateCommunication } from "@loreal/contracts";
import type { UserSession } from "../../common/types/session";

@Controller()
export class CommunicationsController {
  constructor(private communicationsService: CommunicationsService) {}

  @Get("customers/:customerId/communications")
  findByCustomer(@Param("customerId") customerId: string) {
    return this.communicationsService.findByCustomer(customerId);
  }

  @Post("communications")
  @Roles(["ba", "manager"])
  create(
    @Body(new ZodValidationPipe(createCommunicationSchema)) body: CreateCommunication,
    @Session() session: UserSession,
  ) {
    return this.communicationsService.create(body, session.user);
  }

  @Get("communications/templates")
  findTemplates(@Session() session: UserSession) {
    return this.communicationsService.findTemplates(session.user);
  }

  @Post("communications/templates")
  @Roles(["admin", "manager"])
  createTemplate(
    @Body() body: { brandId?: string; name: string; channel: string; body: string; followupType: string },
  ) {
    return this.communicationsService.createTemplate(body);
  }

  @Patch("communications/templates/:id")
  @Roles(["admin", "manager"])
  updateTemplate(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.communicationsService.updateTemplate(id, body as any);
  }

  @Patch("communications/:id/tracking")
  updateTracking(@Param("id") id: string, @Body() body: { deliveredAt?: string; readAt?: string; respondedAt?: string }) {
    return this.communicationsService.updateTracking(id, {
      deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : undefined,
      readAt: body.readAt ? new Date(body.readAt) : undefined,
      respondedAt: body.respondedAt ? new Date(body.respondedAt) : undefined,
    });
  }
}
