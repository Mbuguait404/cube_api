import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { CommunitiesModule } from './communities/communities.module';
import { BadgesModule } from './badges/badges.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CmsBridgeModule } from './integrations/cms-bridge/cms-bridge.module';
import { UniflowModule } from './integrations/uniflow/uniflow.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ProgramsModule } from './programs/programs.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { DailyReportsModule } from './daily-reports/daily-reports.module';
import { CommentsModule } from './comments/comments.module';
import { LogsModule } from './logs/logs.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    CommunitiesModule,
    BadgesModule,
    AnnouncementsModule,
    CmsBridgeModule,
    UniflowModule,
    WebhooksModule,
    ProgramsModule,
    ProjectsModule,
    TasksModule,
    DailyReportsModule,
    CommentsModule,
    LogsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
