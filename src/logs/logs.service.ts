import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) { }

  async create(logData: Partial<Log>): Promise<Log> {
    const newLog = new this.logModel(logData);
    return newLog.save();
  }

  async findAll(query: any = {}, options: { limit?: number; skip?: number; sort?: any } = {}) {
    const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;

    const filters: any = {};

    if (query.method) filters.method = query.method;
    if (query.statusCode) filters.statusCode = parseInt(query.statusCode);
    if (query.url) filters.url = { $regex: query.url, $options: 'i' };
    if (query.userEmail) filters.userEmail = { $regex: query.userEmail, $options: 'i' };

    if (query.startDate && query.endDate) {
      filters.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    const [items, total] = await Promise.all([
      this.logModel.find(filters).sort(sort).skip(skip).limit(limit).exec(),
      this.logModel.countDocuments(filters).exec(),
    ]);

    return { items, total };
  }

  async findOne(id: string): Promise<Log | null> {
    return this.logModel.findById(id).exec();
  }

  async clearLogs(): Promise<void> {
    await this.logModel.deleteMany({}).exec();
  }
}
