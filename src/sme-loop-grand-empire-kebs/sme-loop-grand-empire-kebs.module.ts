import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmeLoopGrandEmpireKebsController } from './sme-loop-grand-empire-kebs.controller';
import { SmeLoopGrandEmpireKebsService } from './sme-loop-grand-empire-kebs.service';
import {
  SmeLoopGrandEmpireKebs,
  SmeLoopGrandEmpireKebsSchema,
} from './schemas/sme-loop-grand-empire-kebs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SmeLoopGrandEmpireKebs.name,
        schema: SmeLoopGrandEmpireKebsSchema,
      },
    ]),
  ],
  controllers: [SmeLoopGrandEmpireKebsController],
  providers: [SmeLoopGrandEmpireKebsService],
  exports: [SmeLoopGrandEmpireKebsService],
})
export class SmeLoopGrandEmpireKebsModule {}
