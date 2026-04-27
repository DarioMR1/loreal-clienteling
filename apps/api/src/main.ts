import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth — it handles its own body parsing
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: [
      "http://localhost:3000", // Next.js web
      "http://localhost:8081", // Expo Metro
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("L'Oréal Clienteling API")
    .setDescription("API for L'Oréal beauty advisor clienteling platform")
    .setVersion("1.0")
    .addBearerAuth()
    .addServer("http://localhost:3001", "Development")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
}

bootstrap();
