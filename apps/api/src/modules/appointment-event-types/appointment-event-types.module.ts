import { Module } from "@nestjs/common";
import { AppointmentEventTypesController } from "./appointment-event-types.controller";
import { AppointmentEventTypesService } from "./appointment-event-types.service";

@Module({
  controllers: [AppointmentEventTypesController],
  providers: [AppointmentEventTypesService],
  exports: [AppointmentEventTypesService],
})
export class AppointmentEventTypesModule {}
