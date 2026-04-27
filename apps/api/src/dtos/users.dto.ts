import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  IsUUID,
  IsEmail,
} from "class-validator";
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from "@nestjs/swagger";
import { USER_ROLES } from "@loreal/contracts";

export class CreateUserDto {
  @ApiProperty({ type: String, example: "user@loreal.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: "María López", minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  fullName: string;

  @ApiProperty({ type: String, enum: USER_ROLES, example: "ba" })
  @IsIn(USER_ROLES)
  role: string;

  @ApiPropertyOptional({ type: String, format: "uuid" })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @ApiPropertyOptional({ type: String, format: "uuid" })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiPropertyOptional({ type: String, format: "uuid" })
  @IsOptional()
  @IsUUID()
  brandId?: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["email"] as const),
) {}

export class LoginDto {
  @ApiProperty({ type: String, example: "user@loreal.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: "password123", minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
