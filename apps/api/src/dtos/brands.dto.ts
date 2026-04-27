import { IsString, MinLength, MaxLength, IsIn, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BRAND_TIERS } from "@loreal/contracts";

export class CreateBrandDto {
  @ApiProperty({ type: String, example: "LANCOME", minLength: 1, maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @ApiProperty({ type: String, example: "Lancôme", minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  displayName: string;

  @ApiProperty({ type: String, enum: BRAND_TIERS, example: "luxury" })
  @IsIn(BRAND_TIERS)
  tier: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
