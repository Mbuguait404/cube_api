import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmeLoopGrandEmpireFeedbackController } from './sme-loop-grand-empire-feedback.controller';
import { SmeLoopGrandEmpireFeedbackService } from './sme-loop-grand-empire-feedback.service';
import {
  SmeLoopGrandEmpireFeedback,
  SmeLoopGrandEmpireFeedbackSchema,
} from './schemas/sme-loop-grand-empire-feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SmeLoopGrandEmpireFeedback.name,
        schema: SmeLoopGrandEmpireFeedbackSchema,
      },
    ]),
  ],
  controllers: [SmeLoopGrandEmpireFeedbackController],
  providers: [SmeLoopGrandEmpireFeedbackService],
  exports: [SmeLoopGrandEmpireFeedbackService],
})
export class SmeLoopGrandEmpireFeedbackModule {}
