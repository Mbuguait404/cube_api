import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HackathonFeedbackController } from './hackathon-feedback.controller';
import { HackathonFeedbackService } from './hackathon-feedback.service';
import {
  HackathonFeedback,
  HackathonFeedbackSchema,
} from './schemas/hackathon-feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HackathonFeedback.name, schema: HackathonFeedbackSchema },
    ]),
  ],
  controllers: [HackathonFeedbackController],
  providers: [HackathonFeedbackService],
  exports: [HackathonFeedbackService],
})
export class HackathonFeedbackModule {}
