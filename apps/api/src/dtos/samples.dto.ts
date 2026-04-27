import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSampleDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  customerId: string;

  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  productId: string;
}
