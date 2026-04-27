import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
  IsIn,
  IsDate,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType, ApiPropertyOptional } from "@nestjs/swagger";
import { GENDERS, LIFECYCLE_SEGMENTS } from "@loreal/contracts";

export class CreateCustomerDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phone?: string;

  @IsOptional()
  @IsIn(GENDERS)
  gender?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class SearchCustomerDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  query: string;

  @IsOptional()
  @IsIn(["exact", "name", "semantic"])
  @ApiPropertyOptional({ default: "name", enum: ["exact", "name", "semantic"] })
  type: string = "name";
}

export class CustomerFiltersDto {
  @IsOptional()
  @IsIn(LIFECYCLE_SEGMENTS)
  segment?: string;

  @IsOptional()
  @IsUUID()
  storeId?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;
}
