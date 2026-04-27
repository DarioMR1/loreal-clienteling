import {
  IsString,
  MinLength,
  MaxLength,
  IsIn,
  IsOptional,
  IsUUID,
  IsNumber,
  IsPositive,
  IsInt,
} from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { PRODUCT_CATEGORIES, STOCK_STATUSES } from "@loreal/contracts";

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  sku: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @IsUUID()
  brandId: string;

  @IsIn(PRODUCT_CATEGORIES)
  category: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  subcategory?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  estimatedDurationDays?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class UpdateAvailabilityDto {
  @IsIn(STOCK_STATUSES)
  stockStatus: string;
}
