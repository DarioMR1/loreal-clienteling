import { Controller, Get, Post, Patch, Param, Body, Inject } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { RecommendationsService } from "./recommendations.service";
import { CreateRecommendationDto, AiRecommendationRequestDto } from "../../dtos/recommendations.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Recommendations")
@ApiBearerAuth()
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
    @Body() body: CreateRecommendationDto,
    @Session() session: UserSession,
  ) {
    return this.recommendationsService.create(body, session.user);
  }

  @Post("recommendations/ai")
  @Roles(["ba"])
  requestAi(
    @Body() body: AiRecommendationRequestDto,
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
