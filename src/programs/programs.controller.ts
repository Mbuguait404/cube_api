import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';
import { CreateProgramDto, UpdateProgramDto, EnrollMembersDto } from './dto/program.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Programs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new program (e.g. Remote Attachment)' })
  create(@Body() dto: CreateProgramDto, @CurrentUser() user: any) {
    return this.programsService.create(dto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'List all programs' })
  findAll() {
    return this.programsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a program with its enrolled members' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.programsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a program' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return this.programsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a program' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.programsService.delete(id);
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll members into a program' })
  @ApiParam({ name: 'id' })
  enroll(@Param('id') id: string, @Body() dto: EnrollMembersDto) {
    return this.programsService.enrollMembers(id, dto);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from a program' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'userId' })
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.programsService.removeMember(id, userId);
  }
}
