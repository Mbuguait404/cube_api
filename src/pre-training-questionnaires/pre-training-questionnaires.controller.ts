import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { PreTrainingQuestionnairesService } from './pre-training-questionnaires.service';
import { CreatePreTrainingQuestionnaireDto } from './dto/create-pre-training-questionnaire.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Pre-Training Questionnaires')
@Controller('pre-training-questionnaires')
export class PreTrainingQuestionnairesController {
  constructor(private readonly service: PreTrainingQuestionnairesService) {}

  /** Public endpoint — no auth required */
  @Post()
  @ApiOperation({ summary: 'Submit a pre-training questionnaire (public)' })
  create(@Body() dto: CreatePreTrainingQuestionnaireDto) {
    return this.service.create(dto);
  }

  /** Admin-only — view all submissions */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all pre-training questionnaire submissions (admin)' })
  findAll() {
    return this.service.findAll();
  }

  /** Admin-only — total count */
  @Get('counts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get total submission count (admin)' })
  countSubmissions() {
    return this.service.countSubmissions();
  }

  /** Admin-only — delete a single submission */
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a pre-training questionnaire submission (admin)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.service.deleteOne(id);
  }
}
