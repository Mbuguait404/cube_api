import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SmeLoopGrandEmpireKebs,
  SmeLoopGrandEmpireKebsDocument,
} from './schemas/sme-loop-grand-empire-kebs.schema';
import { CreateSmeLoopGrandEmpireKebsDto } from './dto/create-sme-loop-grand-empire-kebs.dto';

@Injectable()
export class SmeLoopGrandEmpireKebsService {
  constructor(
    @InjectModel(SmeLoopGrandEmpireKebs.name)
    private kebsModel: Model<SmeLoopGrandEmpireKebsDocument>,
  ) {}

  async create(
    dto: CreateSmeLoopGrandEmpireKebsDto,
  ): Promise<SmeLoopGrandEmpireKebsDocument> {
    return this.kebsModel.create(dto);
  }

  async findAll(): Promise<SmeLoopGrandEmpireKebsDocument[]> {
    return this.kebsModel.find().sort({ createdAt: -1 }).exec();
  }

  async count(): Promise<{ total: number }> {
    const total = await this.kebsModel.countDocuments().exec();
    return { total };
  }

  async deleteOne(id: string): Promise<{ message: string }> {
    await this.kebsModel.findByIdAndDelete(id);
    return { message: 'Deleted successfully' };
  }
}
