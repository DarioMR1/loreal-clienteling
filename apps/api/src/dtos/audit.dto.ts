import { IsString, IsOptional, IsUUID, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "./common.dto";

export class AuditQueryDto extends PaginationDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ type: String, format: "uuid" })
  @IsOptional()
  @IsUUID()
  actorUserId?: string;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date;
}
