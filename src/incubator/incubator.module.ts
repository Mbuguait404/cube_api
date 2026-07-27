import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncubatorController } from './incubator.controller';
import { AdminIncubatorController } from './admin-incubator.controller';
import { IncubatorService } from './incubator.service';
import {
  IncubatorApplication,
  IncubatorApplicationSchema,
} from './schemas/incubator-application.schema';
import {
  IncubatorCohort,
  IncubatorCohortSchema,
} from './schemas/incubator-cohort.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncubatorApplication.name, schema: IncubatorApplicationSchema },
      { name: IncubatorCohort.name, schema: IncubatorCohortSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [IncubatorController, AdminIncubatorController],
  providers: [IncubatorService],
})
export class IncubatorModule {}
