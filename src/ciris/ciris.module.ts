import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CirisService } from './ciris.service';
import { CirisController } from './ciris.controller';
import { CirisApplication, CirisApplicationSchema } from './schemas/ciris-application.schema';
import { CirisAttendee, CirisAttendeeSchema } from './schemas/ciris-attendee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CirisApplication.name, schema: CirisApplicationSchema },
      { name: CirisAttendee.name, schema: CirisAttendeeSchema },
    ]),
  ],
  controllers: [CirisController],
  providers: [CirisService],
  exports: [CirisService],
})
export class CirisModule {}
