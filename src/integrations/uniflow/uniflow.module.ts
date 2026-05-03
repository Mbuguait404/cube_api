import { Module } from '@nestjs/common';
import { UniflowService } from './uniflow.service';

@Module({
  providers: [UniflowService],
  exports: [UniflowService],
})
export class UniflowModule {}
