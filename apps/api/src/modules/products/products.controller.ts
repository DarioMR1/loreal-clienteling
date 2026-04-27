import { Controller, Get, Post, Patch, Param, Body, Query, Inject } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto, UpdateAvailabilityDto } from "../../dtos/products.dto";
import { PaginationDto } from "../../dtos/common.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Products")
@ApiBearerAuth()
@Controller("products")
export class ProductsController {
  constructor(@Inject(ProductsService) private productsService: ProductsService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
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
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Patch(":id")
  @Roles(["admin"])
  update(@Param("id") id: string, @Body() body: UpdateProductDto) {
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
    @Body() body: UpdateAvailabilityDto,
  ) {
    return this.productsService.updateAvailability(id, storeId, body.stockStatus);
  }
}
