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
import { PURCHASE_SOURCES } from "@loreal/contracts";

export class PurchaseItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  @MinLength(1)
  sku: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CreatePurchaseDto {
  @IsUUID()
  customerId: string;

  @IsIn(PURCHASE_SOURCES)
  source: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];

  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsOptional()
  @IsString()
  posTransactionId?: string;
}
