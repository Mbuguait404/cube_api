import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { JudgeService, JUDGE_CRITERIA } from './judge.service';
import { CreateJudgeScoreDto } from './dto/create-judge-score.dto';

@ApiTags('Judge Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.JUDGE, UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('judge')
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}

  // ─── Portal Meta ──────────────────────────────────────────────────────────

  @Get('criteria')
  @ApiOperation({ summary: 'Get scoring criteria definition' })
  getCriteria() {
    return { criteria: JUDGE_CRITERIA };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get portal stats for the current judge' })
  getStats(@CurrentUser() user: any) {
    const judgeId = user._id ? user._id.toString() : user.sub;
    return this.judgeService.getStats(judgeId);
  }

  // ─── Applicants ───────────────────────────────────────────────────────────

  @Get('applicants')
  @ApiOperation({ summary: 'List all eligible (matched) applicants' })
  getApplicants() {
    return this.judgeService.getEligibleApplicants();
  }

  @Get('finalists-applicants')
  @ApiOperation({ summary: 'List all finalist applicants from the shortlist collection only' })
  getFinalistsApplicants() {
    return this.judgeService.getFinalistsOnlyApplicants();
  }

  @Get('applicants/:id')
  @ApiOperation({ summary: 'Get a single merged applicant record' })
  getApplicant(@Param('id') id: string) {
    return this.judgeService.getApplicantDetail(id);
  }

  @Get('finalists-applicants/:id')
  @ApiOperation({ summary: 'Get a single finalist applicant from the shortlist collection' })
  getFinalistsApplicantDetail(@Param('id') id: string) {
    return this.judgeService.getFinalistsOnlyApplicantDetail(id);
  }

  // ─── Scores ───────────────────────────────────────────────────────────────

  @Post('scores')
  @ApiOperation({ summary: 'Submit or update own score for an applicant' })
  submitScore(@Body() dto: CreateJudgeScoreDto, @CurrentUser() user: any) {
    const judgeId = user._id ? user._id.toString() : user.sub;
    const judgeName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
    return this.judgeService.submitScore(dto, judgeId, judgeName);
  }

  @Post('scores/finalist')
  @ApiOperation({ summary: 'Submit or update own finalist-round score for an applicant' })
  submitFinalistScore(@Body() dto: CreateJudgeScoreDto, @CurrentUser() user: any) {
    const judgeId = user._id ? user._id.toString() : user.sub;
    const judgeName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
    return this.judgeService.submitFinalistScore(dto, judgeId, judgeName);
  }

  @Get('scores/me')
  @ApiOperation({ summary: "Get current judge's submitted scores" })
  getMyScores(@CurrentUser() user: any) {
    const judgeId = user._id ? user._id.toString() : user.sub;
    return this.judgeService.getMyScores(judgeId);
  }

  @Get('scores/me/finalist')
  @ApiOperation({ summary: "Get current finalist judge's submitted scores" })
  getMyFinalistScores(@CurrentUser() user: any) {
    const judgeId = user._id ? user._id.toString() : user.sub;
    return this.judgeService.getMyFinalistScores(judgeId);
  }

  @Get('scores/:applicantId')
  @ApiOperation({
    summary: 'Get scores for an applicant (peer scores hidden until own submission)',
  })
  getScoresForApplicant(
    @Param('applicantId') applicantId: string,
    @CurrentUser() user: any,
  ) {
    const judgeId = user._id ? user._id.toString() : user.sub;
    return this.judgeService.getScoresForApplicant(applicantId, judgeId);
  }

  @Get('scores/:applicantId/finalist')
  @ApiOperation({
    summary:
      'Get finalist-round scores for an applicant (peer scores hidden until own submission)',
  })
  getFinalistScoresForApplicant(
    @Param('applicantId') applicantId: string,
    @CurrentUser() user: any,
  ) {
    const judgeId = user._id ? user._id.toString() : user.sub;
    return this.judgeService.getFinalistScoresForApplicant(applicantId, judgeId);
  }

  // ─── Leaderboard ──────────────────────────────────────────────────────────

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get ranked leaderboard across all tracks' })
  getLeaderboard() {
    return this.judgeService.getLeaderboard();
  }

  @Get('leaderboard/finalist')
  @ApiOperation({ summary: 'Get finalist ranked leaderboard across all tracks' })
  getFinalistLeaderboard() {
    return this.judgeService.getFinalistLeaderboard();
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  @Get('settings')
  @ApiOperation({ summary: 'Get innovation settings' })
  getSettings() {
    return this.judgeService.getSettings();
  }

  @Patch('settings')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update innovation settings (Admin only)' })
  updateSettings(@Body() body: { isPublicShortlistVisible?: boolean; isPublicVotingOpen?: boolean }) {
    return this.judgeService.updateSettings(body);
  }
}
