import { Module } from '@nestjs/common';
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
  ],
})
export class AppModule {}
