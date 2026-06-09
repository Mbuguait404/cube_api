import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InnovationService } from './innovation.service';
import { InnovationController, InnovationChallengeController } from './innovation.controller';
import { InnovationPhase2, InnovationPhase2Schema } from './schemas/innovation-phase2.schema';
import { InnovationChallengeApplication, InnovationChallengeApplicationSchema } from './schemas/innovation-challenge-application.schema';
import { CmsBridgeModule } from '../integrations/cms-bridge/cms-bridge.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InnovationPhase2.name, schema: InnovationPhase2Schema },
      { name: InnovationChallengeApplication.name, schema: InnovationChallengeApplicationSchema },
    ]),
    CmsBridgeModule,
  ],
  controllers: [InnovationController, InnovationChallengeController],
  providers: [InnovationService],
  exports: [InnovationService],
})
export class InnovationModule {}
