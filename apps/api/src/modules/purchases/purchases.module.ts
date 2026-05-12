import { Module } from "@nestjs/common";
import { PurchasesController } from "./purchases.controller";
import { PurchasesService } from "./purchases.service";
import { RecommendationsModule } from "../recommendations/recommendations.module";
import { SamplesModule } from "../samples/samples.module";

@Module({
  imports: [RecommendationsModule, SamplesModule],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
