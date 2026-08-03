import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
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
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InnovationModule } from './innovation/innovation.module';
import { FeedbackSubmissionsModule } from './feedback-submissions/feedback-submissions.module';
import { SmeLoopFeedbackModule } from './sme-loop-feedback/sme-loop-feedback.module';
import { CommunityHealthFeedbackModule } from './community-health-feedback/community-health-feedback.module';
import { HackathonFeedbackModule } from './hackathon-feedback/hackathon-feedback.module';
import { HealthEntrepreneurshipFeedbackModule } from './health-entrepreneurship-feedback/health-entrepreneurship-feedback.module';
import { FeedbackUnlocksModule } from './feedback-unlocks/feedback-unlocks.module';
import { PreTrainingQuestionnairesModule } from './pre-training-questionnaires/pre-training-questionnaires.module';
import { IncubatorModule } from './incubator/incubator.module';
import { CirisModule } from './ciris/ciris.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    EventEmitterModule.forRoot(),
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
    ChatModule,
    NotificationsModule,
    InnovationModule,
    IncubatorModule,
    FeedbackSubmissionsModule,
    SmeLoopFeedbackModule,
    CommunityHealthFeedbackModule,
    HackathonFeedbackModule,
    HealthEntrepreneurshipFeedbackModule,
    FeedbackUnlocksModule,
    PreTrainingQuestionnairesModule,
    CirisModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
