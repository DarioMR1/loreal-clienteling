import { Controller, Get, Post, Patch, Param, Body, Inject } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { ZonesService } from "./zones.service";
import { CreateZoneDto, UpdateZoneDto } from "../../dtos/zones.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Zones")
@ApiBearerAuth()
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
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.zonesService.findOne(id);
  }

  @Post()
  @Roles(["admin"])
  @ApiBody({ type: CreateZoneDto })
  create(@Body() body: CreateZoneDto) {
    return this.zonesService.create(body);
  }

  @Patch(":id")
  @Roles(["admin"])
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateZoneDto })
  update(@Param("id") id: string, @Body() body: UpdateZoneDto) {
    return this.zonesService.update(id, body);
  }
}
