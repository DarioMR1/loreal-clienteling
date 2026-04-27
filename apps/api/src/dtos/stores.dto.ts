import { IsString, MinLength, MaxLength, IsIn, IsOptional, IsUUID } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { STORE_CHAINS } from "@loreal/contracts";

export class CreateStoreDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  displayName: string;

  @IsIn(STORE_CHAINS)
  chain: string;

  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;
}

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
