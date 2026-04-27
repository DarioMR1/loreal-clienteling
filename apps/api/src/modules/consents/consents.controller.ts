import { Controller, Get, Post, Delete, Param, Body, Inject } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Session } from "@thallesp/nestjs-better-auth";
import { ConsentsService } from "./consents.service";
import { GrantConsentDto } from "../../dtos/consents.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Consents")
@ApiBearerAuth()
@Controller("customers/:customerId/consents")
export class ConsentsController {
  constructor(@Inject(ConsentsService) private consentsService: ConsentsService) {}

  @Get()
  findByCustomer(@Param("customerId") customerId: string) {
    return this.consentsService.findByCustomer(customerId);
  }

  @Post()
  grant(
    @Param("customerId") customerId: string,
    @Body() body: GrantConsentDto,
    @Session() session: UserSession,
  ) {
    return this.consentsService.grant(
      { ...body, customerId },
      session.user,
    );
  }

  @Delete(":type")
  revoke(
    @Param("customerId") customerId: string,
    @Param("type") type: string,
    @Session() session: UserSession,
  ) {
    return this.consentsService.revoke(customerId, type, session.user);
  }
}
