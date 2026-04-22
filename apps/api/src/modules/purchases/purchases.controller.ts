import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { PurchasesService } from "./purchases.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  createPurchaseSchema,
  type CreatePurchase,
} from "@loreal/contracts";
import type { UserSession } from "../../common/types/session";

@Controller()
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

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
    @Body(new ZodValidationPipe(createPurchaseSchema))
    body: CreatePurchase,
    @Session() session: UserSession,
  ) {
    return this.purchasesService.create(body, session.user);
  }

  @Get("purchases/:id")
  findOne(@Param("id") id: string) {
    return this.purchasesService.findOne(id);
  }
}
