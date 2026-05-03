import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, CommunityDocument } from './schemas/community.schema';
import { CreateCommunityDto } from './dto/create-community.dto';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>,
  ) {}

  async create(dto: CreateCommunityDto): Promise<CommunityDocument> {
    const existing = await this.communityModel.findOne({ tag: dto.tag });
    if (existing)
      throw new ConflictException(`Community with tag "${dto.tag}" already exists`);

    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');
    return this.communityModel.create({ ...dto, slug });
  }

  async findAll(): Promise<CommunityDocument[]> {
    return this.communityModel.find().sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<CommunityDocument> {
    const community = await this.communityModel.findById(id);
    if (!community) throw new NotFoundException('Community not found');
    return community;
  }

  async findByTag(tag: string): Promise<CommunityDocument | null> {
    return this.communityModel.findOne({ tag: tag.toLowerCase() });
  }

  async update(id: string, dto: Partial<CreateCommunityDto>) {
    const community = await this.communityModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!community) throw new NotFoundException('Community not found');
    return community;
  }

  async delete(id: string) {
    const community = await this.communityModel.findByIdAndDelete(id);
    if (!community) throw new NotFoundException('Community not found');
    return { message: 'Community deleted' };
  }

  async incrementMemberCount(id: string, delta: 1 | -1) {
    return this.communityModel.findByIdAndUpdate(id, {
      $inc: { memberCount: delta },
    });
  }
}
