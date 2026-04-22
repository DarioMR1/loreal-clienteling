import { Controller, Get } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Controller()
export class HealthController {
  @Get("health")
  @AllowAnonymous()
  health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
