import { Controller, Get, Put, Post, Param, Body, Query, Inject } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { BeautyService } from "./beauty.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  upsertBeautyProfileSchema,
  createShadeSchema,
  type UpsertBeautyProfile,
  type CreateShade,
} from "@loreal/contracts";
import type { UserSession } from "../../common/types/session";

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
    @Body(new ZodValidationPipe(upsertBeautyProfileSchema))
    body: UpsertBeautyProfile,
    @Session() session: UserSession,
  ) {
    return this.beautyService.upsertProfile(
      { ...body, customerId },
      session.user,
    );
  }

  @Post("shades")
  addShade(
    @Body(new ZodValidationPipe(createShadeSchema)) body: CreateShade,
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
