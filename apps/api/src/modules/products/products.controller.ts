import { Controller, Get, Post, Patch, Param, Body, Query, Inject } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { ProductsService } from "./products.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { paginationSchema } from "@loreal/contracts";
import type { UserSession } from "../../common/types/session";

@Controller("products")
export class ProductsController {
  constructor(@Inject(ProductsService) private productsService: ProductsService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(paginationSchema)) pagination: { page: number; limit: number },
    @Query("category") category: string | undefined,
    @Query("search") search: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.productsService.findAll(session.user, pagination, { category, search });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(["admin"])
  create(@Body() body: Record<string, unknown>) {
    return this.productsService.create(body);
  }

  @Patch(":id")
  @Roles(["admin"])
  update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.productsService.update(id, body);
  }

  @Get(":id/availability")
  getAvailability(@Param("id") id: string, @Session() session: UserSession) {
    return this.productsService.getAvailability(id, session.user);
  }

  @Patch(":id/availability/:storeId")
  @Roles(["admin", "manager"])
  updateAvailability(
    @Param("id") id: string,
    @Param("storeId") storeId: string,
    @Body("stockStatus") stockStatus: string,
  ) {
    return this.productsService.updateAvailability(id, storeId, stockStatus);
  }
}
