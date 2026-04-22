import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { DatabaseModule } from "./config/database.module";
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
  ],
  controllers: [HealthController],
})
export class AppModule {}
