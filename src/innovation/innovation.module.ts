import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InnovationService } from './innovation.service';
import { InnovationController, InnovationChallengeController } from './innovation.controller';
import { InnovationPhase2, InnovationPhase2Schema } from './schemas/innovation-phase2.schema';
import { InnovationChallengeApplication, InnovationChallengeApplicationSchema } from './schemas/innovation-challenge-application.schema';
import { JudgeScore, JudgeScoreSchema } from './schemas/judge-score.schema';
import { JudgeService } from './judge.service';
import { JudgeController } from './judge.controller';
import { CmsBridgeModule } from '../integrations/cms-bridge/cms-bridge.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InnovationPhase2.name, schema: InnovationPhase2Schema },
      { name: InnovationChallengeApplication.name, schema: InnovationChallengeApplicationSchema },
      { name: JudgeScore.name, schema: JudgeScoreSchema },
    ]),
    CmsBridgeModule,
  ],
  controllers: [InnovationController, InnovationChallengeController, JudgeController],
  providers: [InnovationService, JudgeService],
  exports: [InnovationService, JudgeService],
})
export class InnovationModule {}

