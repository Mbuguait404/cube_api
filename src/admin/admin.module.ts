import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { BadgesModule } from '../badges/badges.module';
import { CommunitiesModule } from '../communities/communities.module';
import { AnnouncementsModule } from '../announcements/announcements.module';
import { UniflowModule } from '../integrations/uniflow/uniflow.module';
import { CmsBridgeModule } from '../integrations/cms-bridge/cms-bridge.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    BadgesModule,
    CommunitiesModule,
    AnnouncementsModule,
    UniflowModule,
    CmsBridgeModule,
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
