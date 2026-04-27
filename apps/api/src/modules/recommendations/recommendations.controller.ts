import { Controller, Get, Post, Patch, Param, Body, Inject } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { RecommendationsService } from "./recommendations.service";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  createRecommendationSchema,
  aiRecommendationRequestSchema,
  type CreateRecommendation,
  type AiRecommendationRequest,
} from "@loreal/contracts";
import type { UserSession } from "../../common/types/session";

@Controller()
export class RecommendationsController {
  constructor(@Inject(RecommendationsService) private recommendationsService: RecommendationsService) {}

  @Get("customers/:customerId/recommendations")
  findByCustomer(
    @Param("customerId") customerId: string,
    @Session() session: UserSession,
  ) {
    return this.recommendationsService.findByCustomer(
      customerId,
      session.user,
    );
  }

  @Post("recommendations")
  @Roles(["ba"])
  create(
    @Body(new ZodValidationPipe(createRecommendationSchema))
    body: CreateRecommendation,
    @Session() session: UserSession,
  ) {
    return this.recommendationsService.create(body, session.user);
  }

  @Post("recommendations/ai")
  @Roles(["ba"])
  requestAi(
    @Body(new ZodValidationPipe(aiRecommendationRequestSchema))
    body: AiRecommendationRequest,
    @Session() session: UserSession,
  ) {
    return this.recommendationsService.requestAiRecommendation(
      body.customerId,
      body.context,
      session.user,
    );
  }

  @Patch("recommendations/:id/convert")
  markConverted(
    @Param("id") id: string,
    @Body("purchaseId") purchaseId: string,
  ) {
    return this.recommendationsService.markConverted(id, purchaseId);
  }
}
