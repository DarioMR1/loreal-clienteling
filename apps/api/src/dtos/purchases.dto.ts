import {
  IsString,
  MinLength,
  IsOptional,
  IsIn,
  IsUUID,
  IsNumber,
  IsPositive,
  IsInt,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PURCHASE_SOURCES } from "@loreal/contracts";

export class PurchaseItemDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  productId: string;

  @ApiProperty({ type: String, example: "SKU-001", minLength: 1 })
  @IsString()
  @MinLength(1)
  sku: string;

  @ApiProperty({ type: Number, example: 2, minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ type: Number, example: 1299.0, minimum: 0 })
  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CreatePurchaseDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  customerId: string;

  @ApiProperty({ type: String, enum: PURCHASE_SOURCES, example: "manual" })
  @IsIn(PURCHASE_SOURCES)
  source: string;

  @ApiProperty({ type: [PurchaseItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];

  @ApiProperty({ type: Number, example: 2598.0, minimum: 0 })
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @ApiPropertyOptional({ type: String, example: "POS-12345" })
  @IsOptional()
  @IsString()
  posTransactionId?: string;
}
