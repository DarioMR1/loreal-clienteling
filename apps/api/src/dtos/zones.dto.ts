import { IsString, MinLength, MaxLength, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateZoneDto {
  @ApiProperty({ type: String, example: "CDMX-NOR", minLength: 1, maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @ApiProperty({ type: String, example: "CDMX Norte", minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  displayName: string;

  @ApiPropertyOptional({ type: String, example: "Centro", maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  region?: string;
}

export class UpdateZoneDto extends PartialType(CreateZoneDto) {}
