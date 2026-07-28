import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthEntrepreneurshipFeedbackController } from './health-entrepreneurship-feedback.controller';
import { HealthEntrepreneurshipFeedbackService } from './health-entrepreneurship-feedback.service';
import {
  HealthEntrepreneurshipFeedback,
  HealthEntrepreneurshipFeedbackSchema,
} from './schemas/health-entrepreneurship-feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HealthEntrepreneurshipFeedback.name,
        schema: HealthEntrepreneurshipFeedbackSchema,
      },
    ]),
  ],
  controllers: [HealthEntrepreneurshipFeedbackController],
  providers: [HealthEntrepreneurshipFeedbackService],
  exports: [HealthEntrepreneurshipFeedbackService],
})
export class HealthEntrepreneurshipFeedbackModule {}
