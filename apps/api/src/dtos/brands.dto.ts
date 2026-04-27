import { IsString, MinLength, MaxLength, IsIn, IsOptional, IsBoolean } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { BRAND_TIERS } from "@loreal/contracts";

export class CreateBrandDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  displayName: string;

  @IsIn(BRAND_TIERS)
  tier: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
