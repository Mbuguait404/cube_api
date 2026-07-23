import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmeLoopFeedbackController } from './sme-loop-feedback.controller';
import { SmeLoopFeedbackService } from './sme-loop-feedback.service';
import { SmeLoopFeedback, SmeLoopFeedbackSchema } from './schemas/sme-loop-feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SmeLoopFeedback.name, schema: SmeLoopFeedbackSchema },
    ]),
  ],
  controllers: [SmeLoopFeedbackController],
  providers: [SmeLoopFeedbackService],
  exports: [SmeLoopFeedbackService],
})
export class SmeLoopFeedbackModule {}
