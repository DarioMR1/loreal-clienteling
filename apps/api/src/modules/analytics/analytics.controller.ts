import { Controller, Get, Query, Inject } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { AnalyticsService } from "./analytics.service";
import type { UserSession } from "../../common/types/session";

@Controller("analytics")
@Roles(["manager", "supervisor", "admin"])
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private analyticsService: AnalyticsService) {}

  @Get("dashboard")
  getDashboard(@Session() session: UserSession) {
    return this.analyticsService.getDashboard(session.user);
  }

  @Get("conversion")
  getConversion(@Session() session: UserSession) {
    return this.analyticsService.getConversion(session.user);
  }

  @Get("customers")
  getCustomerSegments(@Session() session: UserSession) {
    return this.analyticsService.getCustomerSegments(session.user);
  }

  @Get("export")
  exportData(
    @Query("type") type: string,
    @Session() session: UserSession,
  ) {
    return this.analyticsService.exportData(type, session.user);
  }
}
