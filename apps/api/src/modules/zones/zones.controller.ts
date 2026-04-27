import { Controller, Get, Post, Patch, Param, Body, Inject } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { ZonesService } from "./zones.service";
import type { UserSession } from "../../common/types/session";

@Controller("zones")
export class ZonesController {
  constructor(@Inject(ZonesService) private zonesService: ZonesService) {}

  @Get()
  @Roles(["admin", "supervisor"])
  findAll(@Session() session: UserSession) {
    return this.zonesService.findAll(session.user);
  }

  @Get(":id")
  @Roles(["admin", "supervisor"])
  findOne(@Param("id") id: string) {
    return this.zonesService.findOne(id);
  }

  @Post()
  @Roles(["admin"])
  create(@Body() body: { code: string; displayName: string; region?: string }) {
    return this.zonesService.create(body);
  }

  @Patch(":id")
  @Roles(["admin"])
  update(
    @Param("id") id: string,
    @Body() body: Partial<{ code: string; displayName: string; region: string }>,
  ) {
    return this.zonesService.update(id, body);
  }
}
