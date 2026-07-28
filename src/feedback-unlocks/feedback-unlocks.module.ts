import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackUnlocksController } from './feedback-unlocks.controller';
import { FeedbackUnlocksService } from './feedback-unlocks.service';
import { FeedbackUnlock, FeedbackUnlockSchema } from './schemas/feedback-unlock.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeedbackUnlock.name, schema: FeedbackUnlockSchema },
    ]),
  ],
  controllers: [FeedbackUnlocksController],
  providers: [FeedbackUnlocksService],
  exports: [FeedbackUnlocksService],
})
export class FeedbackUnlocksModule {}
