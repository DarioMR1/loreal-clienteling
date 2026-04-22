import { Module } from "@nestjs/common";
import { PurchasesController } from "./purchases.controller";
import { PurchasesService } from "./purchases.service";
import { RecommendationsModule } from "../recommendations/recommendations.module";

@Module({
  imports: [RecommendationsModule],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
