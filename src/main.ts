import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      config.get('FRONTEND_URL') || 'http://localhost:4200',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080'
    ],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('The Cube Hub API')
    .setDescription('Backend API for The Cube community platform — member dashboard, admin tools, CMS bridge, and notification integrations.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & onboarding')
    .addTag('Users', 'Member profile & dashboard')
    .addTag('Admin', 'Admin management tools')
    .addTag('Communities', 'Community groups & sub-communities')
    .addTag('Badges', 'Badge management & assignment')
    .addTag('Announcements', 'Targeted announcements')
    .addTag('CMS Bridge', 'CMC content sync')
    .addTag('Uniflow', 'Email communications')
    .addTag('Webhooks', 'External integration hooks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.get('PORT') || 3000;
  await app.listen(port);
  console.log(`The Cube Hub API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
