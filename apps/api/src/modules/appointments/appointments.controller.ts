import { Controller, Get, Post, Patch, Param, Body, Query, Inject } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto, UpdateAppointmentDto } from "../../dtos/appointments.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Appointments")
@ApiBearerAuth()
@Controller("appointments")
export class AppointmentsController {
  constructor(@Inject(AppointmentsService) private appointmentsService: AppointmentsService) {}

  @Get()
  findAll(
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.appointmentsService.findAll(session.user, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Get("calendar")
  getCalendar(
    @Query("from") from: string,
    @Query("to") to: string,
    @Session() session: UserSession,
  ) {
    return this.appointmentsService.getCalendar(new Date(from), new Date(to), session.user);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Roles(["ba", "manager"])
  create(
    @Body() body: CreateAppointmentDto,
    @Session() session: UserSession,
  ) {
    return this.appointmentsService.create(body, session.user);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() body: UpdateAppointmentDto,
    @Session() session: UserSession,
  ) {
    return this.appointmentsService.update(id, body, session.user);
  }
}
