import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InnovationService } from './innovation.service';
import { InnovationController, InnovationChallengeController } from './innovation.controller';
import { InnovationPhase2, InnovationPhase2Schema } from './schemas/innovation-phase2.schema';
import { InnovationChallengeApplication, InnovationChallengeApplicationSchema } from './schemas/innovation-challenge-application.schema';
import { JudgeScore, JudgeScoreSchema } from './schemas/judge-score.schema';
import {
  FinalistJudgeScore,
  FinalistJudgeScoreSchema,
} from './schemas/finalist-judge-score.schema';
import { InnovationSettings, InnovationSettingsSchema } from './schemas/innovation-settings.schema';
import { PublicVote, PublicVoteSchema } from './schemas/public-vote.schema';
import { JudgeService } from './judge.service';
import { JudgeController } from './judge.controller';
import { PublicVoteService } from './public-vote.service';
import { PublicVoteController } from './public-vote.controller';
import { CmsBridgeModule } from '../integrations/cms-bridge/cms-bridge.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InnovationPhase2.name, schema: InnovationPhase2Schema },
      { name: InnovationChallengeApplication.name, schema: InnovationChallengeApplicationSchema },
      { name: JudgeScore.name, schema: JudgeScoreSchema },
      { name: FinalistJudgeScore.name, schema: FinalistJudgeScoreSchema },
      { name: InnovationSettings.name, schema: InnovationSettingsSchema },
      { name: PublicVote.name, schema: PublicVoteSchema },
    ]),
    CmsBridgeModule,
  ],
  controllers: [InnovationController, InnovationChallengeController, JudgeController, PublicVoteController],
  providers: [InnovationService, JudgeService, PublicVoteService],
  exports: [InnovationService, JudgeService, PublicVoteService],
})
export class InnovationModule {}
