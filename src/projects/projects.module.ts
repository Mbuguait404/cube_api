import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectsService } from './projects.service';
import {
  AdminProjectsController,
  MemberProjectsController,
} from './projects.controller';
import { TasksModule } from '../tasks/tasks.module';
import { DailyReportsModule } from '../daily-reports/daily-reports.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    TasksModule,
    DailyReportsModule,
  ],
  controllers: [AdminProjectsController, MemberProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
