import { Module } from "@nestjs/common";
import { BeautyController } from "./beauty.controller";
import { BeautyService } from "./beauty.service";

@Module({
  controllers: [BeautyController],
  providers: [BeautyService],
  exports: [BeautyService],
})
export class BeautyModule {}
