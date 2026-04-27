import { IsInt, IsPositive, Max, IsOptional, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ type: Number, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  limit: number = 20;
}

export class DateRangeDto {
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
