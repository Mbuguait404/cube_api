import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsBridgeService } from './cms-bridge.service';
import { CmsBridgeController } from './cms-bridge.controller';
import { User, UserSchema } from '../../users/schemas/user.schema';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [CmsBridgeService],
  controllers: [CmsBridgeController],
  exports: [CmsBridgeService],
})
export class CmsBridgeModule {}
