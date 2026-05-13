"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const admin_module_1 = require("./admin/admin.module");
const communities_module_1 = require("./communities/communities.module");
const badges_module_1 = require("./badges/badges.module");
const announcements_module_1 = require("./announcements/announcements.module");
const cms_bridge_module_1 = require("./integrations/cms-bridge/cms-bridge.module");
const uniflow_module_1 = require("./integrations/uniflow/uniflow.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const programs_module_1 = require("./programs/programs.module");
const projects_module_1 = require("./projects/projects.module");
const tasks_module_1 = require("./tasks/tasks.module");
const daily_reports_module_1 = require("./daily-reports/daily-reports.module");
const comments_module_1 = require("./comments/comments.module");
const logs_module_1 = require("./logs/logs.module");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('MONGODB_URI'),
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            admin_module_1.AdminModule,
            communities_module_1.CommunitiesModule,
            badges_module_1.BadgesModule,
            announcements_module_1.AnnouncementsModule,
            cms_bridge_module_1.CmsBridgeModule,
            uniflow_module_1.UniflowModule,
            webhooks_module_1.WebhooksModule,
            programs_module_1.ProgramsModule,
            projects_module_1.ProjectsModule,
            tasks_module_1.TasksModule,
            daily_reports_module_1.DailyReportsModule,
            comments_module_1.CommentsModule,
            logs_module_1.LogsModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map