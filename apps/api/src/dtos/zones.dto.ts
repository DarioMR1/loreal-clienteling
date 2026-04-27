import { IsString, MinLength, MaxLength, IsOptional } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class CreateZoneDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  displayName: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  region?: string;
}

export class UpdateZoneDto extends PartialType(CreateZoneDto) {}
