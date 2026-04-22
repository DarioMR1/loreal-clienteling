import { Global, Module } from "@nestjs/common";
import { ScopeService } from "./services/scope.service";
import { AuditService } from "./services/audit.service";

@Global()
@Module({
  providers: [ScopeService, AuditService],
  exports: [ScopeService, AuditService],
})
export class CommonModule {}
