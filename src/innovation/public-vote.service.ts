import { Injectable, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'crypto';
import { PublicVote, PublicVoteDocument } from './schemas/public-vote.schema';
import { InnovationSettings, InnovationSettingsDocument } from './schemas/innovation-settings.schema';
import { CastPublicVoteDto } from './dto/cast-public-vote.dto';
import { JudgeService } from './judge.service';

@Injectable()
export class PublicVoteService {
  private readonly logger = new Logger(PublicVoteService.name);

  constructor(
    @InjectModel(PublicVote.name)
    private readonly voteModel: Model<PublicVoteDocument>,
    @InjectModel(InnovationSettings.name)
    private readonly settingsModel: Model<InnovationSettingsDocument>,
    private readonly judgeService: JudgeService,
  ) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private hashVoter(fingerprint: string, ip: string): string {
    return createHash('sha256')
      .update(`${fingerprint}::${ip}`)
      .digest('hex');
  }

  private async getSettings(): Promise<InnovationSettings & { isPublicVotingOpen?: boolean }> {
    let settings = await this.settingsModel.findOne().exec();
    if (!settings) {
      settings = await this.settingsModel.create({
        isPublicShortlistVisible: false,
        isPublicVotingOpen: false,
      });
    }
    return settings;
  }

  // ─── Finalists ────────────────────────────────────────────────────────────

  /**
   * Return the publicly-visible shortlisted finalists, grouped by track.
   */
  async getFinalists() {
    const shortlist = await this.judgeService.getPublicShortlist();

    if (!shortlist.isPublicShortlistVisible || !shortlist.data.length) {
      return { data: [], tracks: [] };
    }

    // Group by track
    const trackMap = new Map<string, any[]>();
    for (const item of shortlist.data) {
      const list = trackMap.get(item.track) ?? [];
      list.push(item);
      trackMap.set(item.track, list);
    }

    const tracks = [...trackMap.keys()].sort();
    return { data: shortlist.data, tracks };
  }

  /**
   * Return finalists for a specific track.
   */
  async getFinalistsByTrack(track: string) {
    const { data } = await this.getFinalists();
    const filtered = data.filter(
      (f: any) => f.track.toLowerCase() === track.toLowerCase(),
    );
    return { data: filtered, track };
  }

  // ─── Voting ───────────────────────────────────────────────────────────────

  async castVote(dto: CastPublicVoteDto, ipAddress: string, userAgent: string) {
    // 1. Check voting is open
    const settings = await this.getSettings();
    if (!(settings as any).isPublicVotingOpen) {
      throw new BadRequestException('Voting is currently closed');
    }

    // 2. Verify the applicant is a valid finalist
    const { data: finalists } = await this.getFinalists();
    const finalist = finalists.find(
      (f: any) => f.applicantId === dto.applicantId && f.track.toLowerCase() === dto.track.toLowerCase(),
    );
    if (!finalist) {
      throw new BadRequestException('Invalid finalist or track');
    }

    // 3. Generate voter hash
    const voterHash = this.hashVoter(dto.fingerprint, ipAddress);

    // 4. Attempt to insert (unique index will reject duplicates)
    try {
      await this.voteModel.create({
        applicantId: dto.applicantId,
        track: dto.track,
        voterHash,
        ipAddress,
        userAgent,
        votedAt: new Date(),
      });

      return { success: true, message: 'Vote recorded successfully' };
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key = already voted in this category
        throw new ConflictException('You have already voted in this category');
      }
      this.logger.error(`Failed to cast vote: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if a voter has already voted in specific tracks.
   */
  async getVoterStatus(fingerprint: string, ipAddress: string) {
    const voterHash = this.hashVoter(fingerprint, ipAddress);
    const votes = await this.voteModel
      .find({ voterHash })
      .select('track applicantId votedAt')
      .lean()
      .exec();

    const votedTracks: Record<string, string> = {};
    for (const v of votes) {
      votedTracks[v.track] = v.applicantId;
    }

    return { votedTracks };
  }

  // ─── Results ──────────────────────────────────────────────────────────────

  async getResults() {
    const { data: finalists, tracks } = await this.getFinalists();

    if (!finalists.length) {
      return { tracks: [], overall: [], totalVotes: 0 };
    }

    // Get all vote counts grouped by applicantId
    const voteCounts = await this.voteModel.aggregate([
      { $group: { _id: '$applicantId', count: { $sum: 1 } } },
    ]).exec();

    const countMap = new Map<string, number>(
      voteCounts.map((v: any) => [v._id, v.count]),
    );

    // Build results per finalist
    const results = finalists.map((f: any) => ({
      applicantId: f.applicantId,
      track: f.track,
      projectTitle: f.projectTitle,
      organization: f.organization,
      votes: countMap.get(f.applicantId) ?? 0,
    }));

    // Group by track and rank
    const trackResults: Record<string, any[]> = {};
    for (const track of tracks) {
      const trackFinalists = results
        .filter((r) => r.track === track)
        .sort((a, b) => b.votes - a.votes)
        .map((r, idx) => ({ ...r, rank: idx + 1 }));
      trackResults[track] = trackFinalists;
    }

    // Overall leaders (top across all categories)
    const overall = [...results]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10)
      .map((r, idx) => ({ ...r, rank: idx + 1 }));

    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

    return { tracks: trackResults, overall, totalVotes };
  }

  async getResultsByTrack(track: string) {
    const fullResults = await this.getResults();
    const trackData = Object.entries(fullResults.tracks).find(
      ([key]) => key.toLowerCase() === track.toLowerCase(),
    );

    if (!trackData) {
      return { track, data: [], totalVotes: 0 };
    }

    const trackVotes = trackData[1].reduce((sum: number, r: any) => sum + r.votes, 0);
    return { track: trackData[0], data: trackData[1], totalVotes: trackVotes };
  }

  // ─── Status ───────────────────────────────────────────────────────────────

  async getVotingStatus() {
    const settings = await this.getSettings();
    return {
      isOpen: !!(settings as any).isPublicVotingOpen,
    };
  }
}
