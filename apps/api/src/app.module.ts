import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { DatabaseModule } from "./config/database.module";
import { CommonModule } from "./common/common.module";
import { ZonesModule } from "./modules/zones/zones.module";
import { BrandsModule } from "./modules/brands/brands.module";
import { StoresModule } from "./modules/stores/stores.module";
import { ProductsModule } from "./modules/products/products.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { BeautyModule } from "./modules/beauty/beauty.module";
import { ConsentsModule } from "./modules/consents/consents.module";
import { RecommendationsModule } from "./modules/recommendations/recommendations.module";
import { PurchasesModule } from "./modules/purchases/purchases.module";
import { SamplesModule } from "./modules/samples/samples.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { CommunicationsModule } from "./modules/communications/communications.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { HealthController } from "./health.controller";
import { auth } from "./auth";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    CommonModule,
    ZonesModule,
    BrandsModule,
    StoresModule,
    ProductsModule,
    CustomersModule,
    BeautyModule,
    ConsentsModule,
    RecommendationsModule,
    PurchasesModule,
    SamplesModule,
    AppointmentsModule,
    CommunicationsModule,
    AuditModule,
    AnalyticsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
