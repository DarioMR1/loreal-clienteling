import { Controller, Get, Post, Patch, Param, Body, Inject } from "@nestjs/common";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { StoresService } from "./stores.service";
import type { UserSession } from "../../common/types/session";

@Controller("stores")
export class StoresController {
  constructor(@Inject(StoresService) private storesService: StoresService) {}

  @Get()
  findAll(@Session() session: UserSession) {
    return this.storesService.findAll(session.user);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.storesService.findOne(id);
  }

  @Post()
  @Roles(["admin"])
  create(
    @Body()
    body: {
      code: string;
      displayName: string;
      chain: string;
      zoneId?: string;
      address?: string;
      city?: string;
      state?: string;
    },
  ) {
    return this.storesService.create(body);
  }

  @Patch(":id")
  @Roles(["admin"])
  update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.storesService.update(id, body as any);
  }
}
