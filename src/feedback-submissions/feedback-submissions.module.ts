import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FeedbackSubmission,
  FeedbackSubmissionSchema,
} from './schemas/feedback-submission.schema';
import { FeedbackSubmissionsService } from './feedback-submissions.service';
import { FeedbackSubmissionsController } from './feedback-submissions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeedbackSubmission.name, schema: FeedbackSubmissionSchema },
    ]),
  ],
  controllers: [FeedbackSubmissionsController],
  providers: [FeedbackSubmissionsService],
})
export class FeedbackSubmissionsModule {}
