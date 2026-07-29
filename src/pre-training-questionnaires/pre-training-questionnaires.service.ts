import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PreTrainingQuestionnaire,
  PreTrainingQuestionnaireDocument,
} from './schemas/pre-training-questionnaire.schema';
import { CreatePreTrainingQuestionnaireDto } from './dto/create-pre-training-questionnaire.dto';

@Injectable()
export class PreTrainingQuestionnairesService {
  constructor(
    @InjectModel(PreTrainingQuestionnaire.name)
    private model: Model<PreTrainingQuestionnaireDocument>,
  ) {}

  async create(dto: CreatePreTrainingQuestionnaireDto): Promise<PreTrainingQuestionnaireDocument> {
    return this.model.create(dto);
  }

  async findAll(): Promise<PreTrainingQuestionnaireDocument[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async countSubmissions(): Promise<{ total: number }> {
    const total = await this.model.countDocuments().exec();
    return { total };
  }

  async deleteOne(id: string): Promise<{ message: string }> {
    await this.model.findByIdAndDelete(id);
    return { message: 'Deleted successfully' };
  }
}
