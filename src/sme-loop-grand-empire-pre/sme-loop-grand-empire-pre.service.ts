import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SmeLoopGrandEmpirePre,
  SmeLoopGrandEmpirePreDocument,
} from './schemas/sme-loop-grand-empire-pre.schema';
import { CreateSmeLoopGrandEmpirePreDto } from './dto/create-sme-loop-grand-empire-pre.dto';

@Injectable()
export class SmeLoopGrandEmpirePreService {
  constructor(
    @InjectModel(SmeLoopGrandEmpirePre.name)
    private model: Model<SmeLoopGrandEmpirePreDocument>,
  ) {}

  async create(dto: CreateSmeLoopGrandEmpirePreDto): Promise<SmeLoopGrandEmpirePreDocument> {
    return this.model.create(dto);
  }

  async findAll(): Promise<SmeLoopGrandEmpirePreDocument[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async count(): Promise<{ total: number }> {
    const total = await this.model.countDocuments().exec();
    return { total };
  }

  async deleteOne(id: string): Promise<{ message: string }> {
    await this.model.findByIdAndDelete(id);
    return { message: 'Deleted successfully' };
  }
}
