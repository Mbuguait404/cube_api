import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyReport, DailyReportSchema } from './schemas/daily-report.schema';
import { DailyReportsService } from './daily-reports.service';
import {
  AdminDailyReportsController,
  MemberDailyReportsController,
} from './daily-reports.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyReport.name, schema: DailyReportSchema },
    ]),
  ],
  controllers: [AdminDailyReportsController, MemberDailyReportsController],
  providers: [DailyReportsService],
  exports: [DailyReportsService],
})
export class DailyReportsModule {}
