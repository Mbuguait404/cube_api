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
import { SmeLoopGrandEmpireKebsService } from './sme-loop-grand-empire-kebs.service';
import { CreateSmeLoopGrandEmpireKebsDto } from './dto/create-sme-loop-grand-empire-kebs.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('SME Loop Grand Empire KEBS Application')
@Controller('sme-loop-grand-empire-kebs')
export class SmeLoopGrandEmpireKebsController {
  constructor(private readonly service: SmeLoopGrandEmpireKebsService) {}

  /** Public endpoint — no auth required */
  @Post()
  @ApiOperation({
    summary: 'Submit KEBS Support Programme application (public)',
  })
  create(@Body() dto: CreateSmeLoopGrandEmpireKebsDto) {
    return this.service.create(dto);
  }

  /** Admin-only — view all submissions */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all KEBS applications (admin)' })
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
  @ApiOperation({ summary: 'Delete a KEBS application (admin)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.service.deleteOne(id);
  }
}
