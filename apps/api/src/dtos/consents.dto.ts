import { IsString, MinLength, MaxLength, IsIn, IsUUID } from "class-validator";
import { CONSENT_TYPES } from "@loreal/contracts";

export class GrantConsentDto {
  @IsUUID()
  customerId: string;

  @IsIn(CONSENT_TYPES)
  type: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  version: string;

  @IsString()
  @MaxLength(100)
  source: string;
}
