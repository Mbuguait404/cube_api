import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityHealthFeedbackController } from './community-health-feedback.controller';
import { CommunityHealthFeedbackService } from './community-health-feedback.service';
import { CommunityHealthFeedback, CommunityHealthFeedbackSchema } from './schemas/community-health-feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommunityHealthFeedback.name, schema: CommunityHealthFeedbackSchema },
    ]),
  ],
  controllers: [CommunityHealthFeedbackController],
  providers: [CommunityHealthFeedbackService],
  exports: [CommunityHealthFeedbackService],
})
export class CommunityHealthFeedbackModule {}
