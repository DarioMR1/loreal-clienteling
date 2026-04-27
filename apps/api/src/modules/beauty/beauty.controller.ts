import { Controller, Get, Put, Post, Param, Body, Query, Inject } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { BeautyService } from "./beauty.service";
import { UpsertBeautyProfileDto, CreateShadeDto } from "../../dtos/beauty.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Beauty Profiles")
@ApiBearerAuth()
@Controller("customers/:customerId")
export class BeautyController {
  constructor(@Inject(BeautyService) private beautyService: BeautyService) {}

  @Get("beauty-profile")
  findProfile(@Param("customerId") customerId: string) {
    return this.beautyService.findProfile(customerId);
  }

  @Put("beauty-profile")
  upsertProfile(
    @Param("customerId") customerId: string,
    @Body() body: UpsertBeautyProfileDto,
    @Session() session: UserSession,
  ) {
    return this.beautyService.upsertProfile(
      { ...body, customerId },
      session.user,
    );
  }

  @Post("shades")
  addShade(
    @Body() body: CreateShadeDto,
    @Session() session: UserSession,
  ) {
    return this.beautyService.addShade(body, session.user);
  }

  @Get("shade-matches")
  getShadeMatches(
    @Param("customerId") customerId: string,
    @Query("category") category: string,
    @Query("brandId") brandId: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.beautyService.getShadeMatches(
      customerId,
      category,
      brandId,
      session.user,
    );
  }
}
