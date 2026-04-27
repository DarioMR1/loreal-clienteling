import { IsString, MaxLength, IsOptional, IsIn, IsUUID } from "class-validator";
import { RECOMMENDATION_SOURCES, VISIT_REASONS } from "@loreal/contracts";

export class CreateRecommendationDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  productId: string;

  @IsIn(RECOMMENDATION_SOURCES)
  source: string;

  @IsOptional()
  @IsIn(VISIT_REASONS)
  visitReason?: string;

  @IsOptional()
  @IsString()
  aiReasoning?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class AiRecommendationRequestDto {
  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  context?: string;
}
