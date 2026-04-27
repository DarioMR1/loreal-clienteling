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
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { COMMUNICATION_CHANNELS, FOLLOWUP_TYPES } from "@loreal/contracts";

export class CreateCommunicationDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  customerId: string;

  @ApiProperty({ type: String, enum: COMMUNICATION_CHANNELS, example: "whatsapp" })
  @IsIn(COMMUNICATION_CHANNELS)
  channel: string;

  @ApiPropertyOptional({ type: String, format: "uuid" })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @ApiPropertyOptional({ type: String, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @ApiProperty({ type: String, example: "Hola María, tu cita está confirmada.", minLength: 1, maxLength: 5000 })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  body: string;

  @ApiProperty({ type: String, enum: FOLLOWUP_TYPES, example: "3_months" })
  @IsIn(FOLLOWUP_TYPES)
  followupType: string;
}

export class CreateTemplateDto {
  @ApiProperty({ type: String, example: "Seguimiento 3 meses", minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ type: String, format: "uuid" })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiProperty({ type: String, enum: COMMUNICATION_CHANNELS, example: "whatsapp" })
  @IsIn(COMMUNICATION_CHANNELS)
  channel: string;

  @ApiProperty({ type: String, enum: FOLLOWUP_TYPES, example: "3_months" })
  @IsIn(FOLLOWUP_TYPES)
  followupType: string;

  @ApiProperty({ type: String, minLength: 1, maxLength: 5000 })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  body: string;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}

export class UpdateTrackingDto {
  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveredAt?: Date;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readAt?: Date;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  respondedAt?: Date;
}
