import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreTrainingQuestionnairesController } from './pre-training-questionnaires.controller';
import { PreTrainingQuestionnairesService } from './pre-training-questionnaires.service';
import {
  PreTrainingQuestionnaire,
  PreTrainingQuestionnaireSchema,
} from './schemas/pre-training-questionnaire.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PreTrainingQuestionnaire.name,
        schema: PreTrainingQuestionnaireSchema,
      },
    ]),
  ],
  controllers: [PreTrainingQuestionnairesController],
  providers: [PreTrainingQuestionnairesService],
  exports: [PreTrainingQuestionnairesService],
})
export class PreTrainingQuestionnairesModule {}
