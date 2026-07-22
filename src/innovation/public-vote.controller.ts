import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicVoteService } from './public-vote.service';
import { CastPublicVoteDto } from './dto/cast-public-vote.dto';

@ApiTags("People's Choice — Public Voting")
@Controller('peoples-choice')
export class PublicVoteController {
  constructor(private readonly publicVoteService: PublicVoteService) {}

  // ─── Finalists ────────────────────────────────────────────────────────────

  @Get('finalists')
  @ApiOperation({ summary: 'List all finalists grouped by category (Public)' })
  getFinalists() {
    return this.publicVoteService.getFinalists();
  }

  @Get('finalists/:track')
  @ApiOperation({ summary: 'List finalists in a specific category (Public)' })
  getFinalistsByTrack(@Param('track') track: string) {
    return this.publicVoteService.getFinalistsByTrack(decodeURIComponent(track));
  }

  // ─── Voting ───────────────────────────────────────────────────────────────

  @Post('vote')
  @ApiOperation({ summary: 'Cast a vote for a finalist (Public, one per category)' })
  castVote(
    @Body() dto: CastPublicVoteDto,
    @Req() req: any,
    @Headers('user-agent') userAgent: string,
  ) {
    const ip =
      (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';
    return this.publicVoteService.castVote(dto, ip, userAgent || '');
  }

  @Post('voter-status')
  @ApiOperation({ summary: 'Check which categories the voter has already voted in (Public)' })
  getVoterStatus(
    @Body('fingerprint') fingerprint: string,
    @Req() req: any,
  ) {
    const ip =
      (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';
    return this.publicVoteService.getVoterStatus(fingerprint, ip);
  }

  // ─── Results ──────────────────────────────────────────────────────────────

  @Get('results')
  @ApiOperation({ summary: 'Get real-time voting results — leaders per category & overall (Public)' })
  getResults() {
    return this.publicVoteService.getResults();
  }

  @Get('results/:track')
  @ApiOperation({ summary: 'Get voting results for a specific category (Public)' })
  getResultsByTrack(@Param('track') track: string) {
    return this.publicVoteService.getResultsByTrack(decodeURIComponent(track));
  }

  // ─── Status ───────────────────────────────────────────────────────────────

  @Get('status')
  @ApiOperation({ summary: 'Check if voting is currently open (Public)' })
  getVotingStatus() {
    return this.publicVoteService.getVotingStatus();
  }
}
