"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: [
            config.get('FRONTEND_URL') || 'http://localhost:4200',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080'
        ],
        credentials: true,
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    const port = config.get('PORT') || 3000;
    await app.listen(port);
    console.log(`The Cube Hub API running on http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map