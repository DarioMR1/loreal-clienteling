import { IsString, MinLength, MaxLength, IsIn, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CONSENT_TYPES } from "@loreal/contracts";

export class GrantConsentDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  customerId: string;

  @ApiProperty({ type: String, enum: CONSENT_TYPES, example: "privacy_notice" })
  @IsIn(CONSENT_TYPES)
  type: string;

  @ApiProperty({ type: String, example: "1.0", minLength: 1, maxLength: 20 })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  version: string;

  @ApiProperty({ type: String, example: "app", maxLength: 100 })
  @IsString()
  @MaxLength(100)
  source: string;
}
