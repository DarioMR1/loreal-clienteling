import { Controller, Get, Query, Inject, Res, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { AnalyticsService } from "./analytics.service";
import type { UserSession } from "../../common/types/session";
import type { Response } from "express";

@ApiTags("Analytics")
@ApiBearerAuth()
@Controller("analytics")
@Roles(["ba", "manager", "supervisor", "admin"])
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private analyticsService: AnalyticsService) {}

  private parseDateRange(from?: string, to?: string) {
    return {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };
  }

  @Get("dashboard")
  @ApiQuery({ name: "from", type: String, required: false })
  @ApiQuery({ name: "to", type: String, required: false })
  getDashboard(
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.analyticsService.getDashboard(session.user, this.parseDateRange(from, to));
  }

  @Get("appointments")
  @ApiQuery({ name: "from", type: String, required: false })
  @ApiQuery({ name: "to", type: String, required: false })
  getAppointmentMetrics(
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.analyticsService.getAppointmentMetrics(session.user, this.parseDateRange(from, to));
  }

  @Get("ba-performance")
  @ApiQuery({ name: "from", type: String, required: false })
  @ApiQuery({ name: "to", type: String, required: false })
  getBaPerformance(
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.analyticsService.getBaPerformance(session.user, this.parseDateRange(from, to));
  }

  @Get("sales-breakdown")
  @ApiQuery({ name: "groupBy", enum: ["category", "brand"], required: true })
  @ApiQuery({ name: "from", type: String, required: false })
  @ApiQuery({ name: "to", type: String, required: false })
  getSalesBreakdown(
    @Query("groupBy") groupBy: string,
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Session() session: UserSession,
  ) {
    if (groupBy !== "category" && groupBy !== "brand") {
      throw new BadRequestException("groupBy must be 'category' or 'brand'");
    }
    return this.analyticsService.getSalesBreakdown(session.user, groupBy, this.parseDateRange(from, to));
  }

  @Get("sales-trend")
  @ApiQuery({ name: "interval", enum: ["day", "week", "month"], required: false })
  @ApiQuery({ name: "from", type: String, required: false })
  @ApiQuery({ name: "to", type: String, required: false })
  getSalesTrend(
    @Query("interval") interval: string | undefined,
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Session() session: UserSession,
  ) {
    const validInterval = interval === "day" || interval === "week" ? interval : "month";
    return this.analyticsService.getSalesTrend(session.user, validInterval, this.parseDateRange(from, to));
  }

  @Get("conversion")
  @ApiQuery({ name: "from", type: String, required: false })
  @ApiQuery({ name: "to", type: String, required: false })
  getConversion(
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.analyticsService.getConversion(session.user, this.parseDateRange(from, to));
  }

  @Get("customers")
  getCustomerSegments(@Session() session: UserSession) {
    return this.analyticsService.getCustomerSegments(session.user);
  }

  @Get("export")
  @ApiQuery({ name: "type", enum: ["customers", "sales", "appointments"], required: true })
  @ApiQuery({ name: "format", enum: ["json", "csv"], required: false })
  @ApiQuery({ name: "from", type: String, required: false })
  @ApiQuery({ name: "to", type: String, required: false })
  async exportData(
    @Query("type") type: string,
    @Query("format") format: string | undefined,
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Session() session: UserSession,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.analyticsService.exportData(type, session.user, this.parseDateRange(from, to));

    if (format === "csv") {
      const rows = data as Record<string, any>[];
      if (rows.length === 0) {
        res.set({
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${type}-export.csv"`,
        });
        return "";
      }

      const headers = Object.keys(rows[0]);
      const csvLines = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((h) => {
              const val = row[h];
              if (val === null || val === undefined) return "";
              const str = String(val);
              return str.includes(",") || str.includes('"') || str.includes("\n")
                ? `"${str.replace(/"/g, '""')}"`
                : str;
            })
            .join(","),
        ),
      ];

      res.set({
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-export.csv"`,
      });
      return csvLines.join("\n");
    }

    // Default: JSON
    return data;
  }
}
