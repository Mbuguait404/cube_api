import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SmeLoopGrandEmpirePreService } from './sme-loop-grand-empire-pre.service';
import { CreateSmeLoopGrandEmpirePreDto } from './dto/create-sme-loop-grand-empire-pre.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('SME Loop Grand Empire Pre-Training')
@Controller('sme-loop-grand-empire-pre')
export class SmeLoopGrandEmpirePreController {
  constructor(private readonly service: SmeLoopGrandEmpirePreService) {}

  /** Public endpoint — no auth required */
  @Post()
  @ApiOperation({ summary: 'Submit pre-training questionnaire (public)' })
  create(@Body() dto: CreateSmeLoopGrandEmpirePreDto) {
    return this.service.create(dto);
  }

  /** Admin-only — view all submissions */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all pre-training questionnaires (admin)' })
  findAll() {
    return this.service.findAll();
  }

  /** Admin-only — total count */
  @Get('counts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get total count (admin)' })
  count() {
    return this.service.count();
  }

  /** Admin-only — delete a single submission */
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a pre-training questionnaire (admin)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.service.deleteOne(id);
  }
}
