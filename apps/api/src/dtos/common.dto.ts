import { IsInt, IsPositive, Max, IsOptional, IsDate, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  @ApiPropertyOptional({ default: 20, maximum: 100 })
  limit: number = 20;
}

export class DateRangeDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional()
  from?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional()
  to?: Date;
}
