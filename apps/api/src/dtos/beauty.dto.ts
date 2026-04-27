import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  IsUUID,
  IsArray,
  IsObject,
} from "class-validator";
import {
  SKIN_TYPES,
  SKIN_TONES,
  SKIN_SUBTONES,
  SKIN_CONCERNS,
  FRAGRANCE_PREFERENCES,
  ROUTINE_TYPES,
  BEAUTY_INTERESTS,
  SHADE_CATEGORIES,
} from "@loreal/contracts";

export class UpsertBeautyProfileDto {
  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsIn(SKIN_TYPES)
  skinType?: string;

  @IsOptional()
  @IsIn(SKIN_TONES)
  skinTone?: string;

  @IsOptional()
  @IsIn(SKIN_SUBTONES)
  skinSubtone?: string;

  @IsOptional()
  @IsArray()
  @IsIn(SKIN_CONCERNS, { each: true })
  skinConcerns?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredIngredients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  avoidedIngredients?: string[];

  @IsOptional()
  @IsArray()
  @IsIn(FRAGRANCE_PREFERENCES, { each: true })
  fragrancePreferences?: string[];

  @IsOptional()
  @IsObject()
  makeupPreferences?: Record<string, unknown>;

  @IsOptional()
  @IsIn(ROUTINE_TYPES)
  routineType?: string;

  @IsOptional()
  @IsArray()
  @IsIn(BEAUTY_INTERESTS, { each: true })
  interests?: string[];
}

export class CreateShadeDto {
  @IsUUID()
  beautyProfileId: string;

  @IsIn(SHADE_CATEGORIES)
  category: string;

  @IsUUID()
  brandId: string;

  @IsUUID()
  productId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  shadeCode: string;
}
