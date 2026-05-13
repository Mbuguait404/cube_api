import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DailyReport,
  DailyReportDocument,
  ReportStatus,
} from './schemas/daily-report.schema';
import { CreateDailyReportDto, UpdateDailyReportDto } from './dto/daily-report.dto';

function normalisedDate(dateStr?: string): Date {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class DailyReportsService {
  constructor(
    @InjectModel(DailyReport.name)
    private reportModel: Model<DailyReportDocument>,
  ) {}

  async create(
    dto: CreateDailyReportDto,
    authorId: string,
  ): Promise<DailyReportDocument> {
    const date = normalisedDate(dto.date);

    const existing = await this.reportModel.findOne({
      author: new Types.ObjectId(authorId),
      project: new Types.ObjectId(dto.projectId),
      date,
    });
    if (existing) {
      throw new ConflictException(
        'You have already submitted a report for this project today. Use PATCH to update it.',
      );
    }

    const data: any = {
      ...dto,
      project: new Types.ObjectId(dto.projectId),
      author: new Types.ObjectId(authorId),
      date,
    };
    if (dto.tasksWorkedOn)
      data.tasksWorkedOn = dto.tasksWorkedOn.map((t) => new Types.ObjectId(t));

    return this.reportModel.create(data);
  }

  async findByAuthor(authorId: string): Promise<DailyReportDocument[]> {
    return this.reportModel
      .find({ author: new Types.ObjectId(authorId) })
      .populate('project', 'title coverColor')
      .populate('tasksWorkedOn', 'title status')
      .sort({ date: -1 })
      .exec();
  }

  /** Admin: all reports, filterable */
  async findAll(filters: {
    projectId?: string;
    authorId?: string;
    status?: string;
    from?: string;
    to?: string;
  } = {}): Promise<DailyReportDocument[]> {
    const query: any = {};
    if (filters.projectId) query.project = new Types.ObjectId(filters.projectId);
    if (filters.authorId) query.author = new Types.ObjectId(filters.authorId);
    if (filters.status) query.status = filters.status;
    if (filters.from || filters.to) {
      query.date = {};
      if (filters.from) query.date.$gte = normalisedDate(filters.from);
      if (filters.to) query.date.$lte = normalisedDate(filters.to);
    }

    return this.reportModel
      .find(query)
      .populate('author', 'firstName lastName email profilePhoto')
      .populate('project', 'title coverColor')
      .populate('tasksWorkedOn', 'title status')
      .sort({ date: -1 })
      .exec();
  }

  async findById(id: string): Promise<DailyReportDocument> {
    const report = await this.reportModel
      .findById(id)
      .populate('author', 'firstName lastName email profilePhoto designation')
      .populate('project', 'title coverColor')
      .populate('tasksWorkedOn', 'title status priority');
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async update(
    id: string,
    dto: UpdateDailyReportDto,
    userId: string,
  ): Promise<DailyReportDocument> {
    const report = await this.reportModel.findById(id);
    if (!report) throw new NotFoundException('Report not found');
    if (report.author.toString() !== userId)
      throw new ForbiddenException('Cannot edit another member\'s report');
    if (report.status === ReportStatus.SUBMITTED)
      throw new ForbiddenException('Submitted reports cannot be edited');

    const updates: any = { ...dto };
    if (dto.tasksWorkedOn)
      updates.tasksWorkedOn = dto.tasksWorkedOn.map((t) => new Types.ObjectId(t));

    const updatedReport = await this.reportModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedReport) throw new NotFoundException('Report not found');
    return updatedReport;
  }

  async delete(id: string): Promise<{ message: string }> {
    const report = await this.reportModel.findByIdAndDelete(id);
    if (!report) throw new NotFoundException('Report not found');
    return { message: 'Report deleted' };
  }
}
