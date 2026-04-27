import {
  IsString,
  MaxLength,
  IsOptional,
  IsIn,
  IsUUID,
  IsDate,
  IsInt,
  IsPositive,
  Max,
  IsBoolean,
  IsUrl,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { APPOINTMENT_EVENT_TYPES, APPOINTMENT_STATUSES } from "@loreal/contracts";

export class CreateAppointmentDto {
  @IsUUID()
  customerId: string;

  @IsIn(APPOINTMENT_EVENT_TYPES)
  eventType: string;

  @IsDate()
  @Type(() => Date)
  scheduledAt: Date;

  @IsInt()
  @IsPositive()
  @Max(480)
  durationMinutes: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comments?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: false })
  isVirtual?: boolean = false;

  @IsOptional()
  @IsUrl()
  videoLink?: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsIn(APPOINTMENT_STATUSES)
  status?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledAt?: Date;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(480)
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comments?: string;
}
