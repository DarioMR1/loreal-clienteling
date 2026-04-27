import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  IsUUID,
  IsEmail,
} from "class-validator";
import { OmitType, PartialType } from "@nestjs/swagger";
import { USER_ROLES } from "@loreal/contracts";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  fullName: string;

  @IsIn(USER_ROLES)
  role: string;

  @IsOptional()
  @IsUUID()
  storeId?: string;

  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["email"] as const),
) {}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
