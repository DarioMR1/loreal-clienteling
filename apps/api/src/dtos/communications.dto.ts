import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  IsUUID,
  IsDate,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/swagger";
import { COMMUNICATION_CHANNELS, FOLLOWUP_TYPES } from "@loreal/contracts";

export class CreateCommunicationDto {
  @IsUUID()
  customerId: string;

  @IsIn(COMMUNICATION_CHANNELS)
  channel: string;

  @IsOptional()
  @IsUUID()
  templateId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  body: string;

  @IsIn(FOLLOWUP_TYPES)
  followupType: string;
}

export class CreateTemplateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsIn(COMMUNICATION_CHANNELS)
  channel: string;

  @IsIn(FOLLOWUP_TYPES)
  followupType: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  body: string;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}

export class UpdateTrackingDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveredAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  respondedAt?: Date;
}
