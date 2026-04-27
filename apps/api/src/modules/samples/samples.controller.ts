import { Controller, Get, Post, Patch, Param, Body, Inject } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { SamplesService } from "./samples.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { createSampleSchema, type CreateSample } from "@loreal/contracts";
import type { UserSession } from "../../common/types/session";

@Controller()
export class SamplesController {
  constructor(@Inject(SamplesService) private samplesService: SamplesService) {}

  @Get("customers/:customerId/samples")
  findByCustomer(
    @Param("customerId") customerId: string,
    @Session() session: UserSession,
  ) {
    return this.samplesService.findByCustomer(customerId, session.user);
  }

  @Post("samples")
  @Roles(["ba"])
  create(
    @Body(new ZodValidationPipe(createSampleSchema))
    body: CreateSample,
    @Session() session: UserSession,
  ) {
    return this.samplesService.create(body, session.user);
  }

  @Patch("samples/:id/convert")
  markConverted(
    @Param("id") id: string,
    @Body("purchaseId") purchaseId: string,
  ) {
    return this.samplesService.markConverted(id, purchaseId);
  }
}
