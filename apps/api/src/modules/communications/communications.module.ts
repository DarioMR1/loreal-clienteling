import { Module } from "@nestjs/common";
import { CommunicationsController } from "./communications.controller";
import { CommunicationsService } from "./communications.service";
import { ConsentsModule } from "../consents/consents.module";

@Module({
  imports: [ConsentsModule],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [CommunicationsService],
})
export class CommunicationsModule {}
