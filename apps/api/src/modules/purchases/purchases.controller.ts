import { Controller, Get, Post, Param, Body, Inject } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { PurchasesService } from "./purchases.service";
import { CreatePurchaseDto } from "../../dtos/purchases.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Purchases")
@ApiBearerAuth()
@Controller()
export class PurchasesController {
  constructor(@Inject(PurchasesService) private purchasesService: PurchasesService) {}

  @Get("customers/:customerId/purchases")
  findByCustomer(
    @Param("customerId") customerId: string,
    @Session() session: UserSession,
  ) {
    return this.purchasesService.findByCustomer(customerId, session.user);
  }

  @Post("purchases")
  @Roles(["ba", "manager"])
  create(
    @Body() body: CreatePurchaseDto,
    @Session() session: UserSession,
  ) {
    return this.purchasesService.create(body, session.user);
  }

  @Get("purchases/:id")
  findOne(@Param("id") id: string) {
    return this.purchasesService.findOne(id);
  }
}
