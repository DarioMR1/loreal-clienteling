import { IsUUID } from "class-validator";

export class CreateSampleDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  productId: string;
}
