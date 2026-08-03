import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmeLoopGrandEmpirePreController } from './sme-loop-grand-empire-pre.controller';
import { SmeLoopGrandEmpirePreService } from './sme-loop-grand-empire-pre.service';
import {
  SmeLoopGrandEmpirePre,
  SmeLoopGrandEmpirePreSchema,
} from './schemas/sme-loop-grand-empire-pre.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SmeLoopGrandEmpirePre.name,
        schema: SmeLoopGrandEmpirePreSchema,
      },
    ]),
  ],
  controllers: [SmeLoopGrandEmpirePreController],
  providers: [SmeLoopGrandEmpirePreService],
  exports: [SmeLoopGrandEmpirePreService],
})
export class SmeLoopGrandEmpirePreModule {}
