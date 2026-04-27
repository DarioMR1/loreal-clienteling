import { Controller, Get, Post, Patch, Put, Param, Body, Inject } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { BrandsService } from "./brands.service";
import { CreateBrandDto, UpdateBrandDto } from "../../dtos/brands.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Brands")
@ApiBearerAuth()
@Controller("brands")
export class BrandsController {
  constructor(@Inject(BrandsService) private brandsService: BrandsService) {}

  @Get()
  findAll(@Session() session: UserSession) {
    return this.brandsService.findAll(session.user);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.brandsService.findOne(id);
  }

  @Post()
  @Roles(["admin"])
  create(@Body() body: CreateBrandDto) {
    return this.brandsService.create(body);
  }

  @Patch(":id")
  @Roles(["admin"])
  update(@Param("id") id: string, @Body() body: UpdateBrandDto) {
    return this.brandsService.update(id, body);
  }

  @Put(":id/config")
  @Roles(["admin"])
  upsertConfig(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.brandsService.upsertConfig(id, body);
  }
}
