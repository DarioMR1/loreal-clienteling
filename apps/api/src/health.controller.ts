import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@ApiTags("Health")
@Controller()
export class HealthController {
  @Get("health")
  @AllowAnonymous()
  health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
