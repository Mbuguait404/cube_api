import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BadgesService } from './badges.service';
import { Badge, BadgeSchema } from './schemas/badge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Badge.name, schema: BadgeSchema }]),
  ],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
