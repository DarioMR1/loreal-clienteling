import { Controller, Get, Param, Query, Inject } from "@nestjs/common";
import { Roles } from "@thallesp/nestjs-better-auth";
import { AuditQueryService } from "./audit.service";

@Controller("audit-logs")
@Roles(["admin"])
export class AuditController {
  constructor(@Inject(AuditQueryService) private auditQueryService: AuditQueryService) {}

  @Get()
  findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "20",
    @Query("action") action?: string,
    @Query("entityType") entityType?: string,
    @Query("actorUserId") actorUserId?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    return this.auditQueryService.findAll({
      page: parseInt(page, 10) || 1,
      limit: Math.min(parseInt(limit, 10) || 20, 100),
      action,
      entityType,
      actorUserId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.auditQueryService.findOne(id);
  }
}
