import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JudgeScore, JudgeScoreDocument } from './schemas/judge-score.schema';
import { InnovationPhase2, InnovationPhase2Document } from './schemas/innovation-phase2.schema';
import { InnovationChallengeApplication, InnovationChallengeApplicationDocument } from './schemas/innovation-challenge-application.schema';
import { CmsBridgeService } from '../integrations/cms-bridge/cms-bridge.service';
import { CreateJudgeScoreDto } from './dto/create-judge-score.dto';

/** Scoring criteria — single source of truth on the server */
export const JUDGE_CRITERIA = [
  { key: 'problemClarity',      label: 'Problem clarity and relevance',  max: 20 },
  { key: 'innovation',          label: 'Innovation and uniqueness',       max: 20 },
  { key: 'solutionFeasibility', label: 'Solution feasibility',            max: 15 },
  { key: 'marketPotential',     label: 'Market potential and impact',     max: 15 },
  { key: 'teamStrength',        label: 'Team strength',                   max: 10 },
  { key: 'traction',            label: 'Traction / stage of development', max: 10 },
  { key: 'pitchQuality',        label: 'Pitch quality (video + deck)',    max: 10 },
];

@Injectable()
export class JudgeService {
  private readonly logger = new Logger(JudgeService.name);

  constructor(
    @InjectModel(JudgeScore.name)
    private readonly scoreModel: Model<JudgeScoreDocument>,
    @InjectModel(InnovationPhase2.name)
    private readonly phase2Model: Model<InnovationPhase2Document>,
    @InjectModel(InnovationChallengeApplication.name)
    private readonly challengeAppModel: Model<InnovationChallengeApplicationDocument>,
    private readonly cmsBridge: CmsBridgeService,
  ) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** Exhaustively fetch all Phase 1 applications from the CMS bridge */
  private async fetchAllPhase1Applications(): Promise<any[]> {
    const pageSize = 100;
    const maxPages = 20;
    let page = 1;
    const all: any[] = [];

    while (page <= maxPages) {
      try {
        const result = await this.cmsBridge.getInnovationChallenges({ page, limit: pageSize });
        all.push(...result.data);
        if (all.length >= result.meta.total || result.data.length === 0) break;
        page += 1;
      } catch (err) {
        this.logger.warn(`Failed to fetch page ${page} of Phase 1 applications: ${(err as Error).message}`);
        break;
      }
    }
    return all;
  }

  // ─── Eligible Applicants ──────────────────────────────────────────────────

  /**
   * Return all Phase 2 submissions where matchStatus = "matched",
   * joined with their corresponding Phase 1 application.
   */
  async getEligibleApplicants() {
    const [matchedPhase2, phase1Apps] = await Promise.all([
      this.phase2Model.find({ matchStatus: 'matched' }).lean().exec(),
      this.fetchAllPhase1Applications(),
    ]);

    const phase1Map = new Map<string, any>(
      phase1Apps.map((a) => [String(a._id || a.id), a]),
    );

    const merged = matchedPhase2
      .map((p2) => {
        const p1 = p2.applicationId ? phase1Map.get(String(p2.applicationId)) : null;
        if (!p1) return null; // skip orphaned matches
        return this.mergeApplicant(p2, p1);
      })
      .filter(Boolean);

    return { data: merged, total: merged.length };
  }

  /** Return a single merged applicant record */
  async getApplicantDetail(applicantId: string) {
    const p2 = await this.phase2Model.findById(applicantId).lean().exec();
    if (!p2 || p2.matchStatus !== 'matched') {
      throw new NotFoundException('Eligible applicant not found');
    }

    const p1 = await this.lookupPhase1Application(p2);
    if (!p1) throw new NotFoundException('Phase 1 application not found for this submission');
    return this.mergeApplicant(p2, p1);
  }

  /**
   * Attempt to resolve the Phase 1 application from multiple sources:
   * 1. CMS by applicationId (direct lookup)
   * 2. CMS by email search (fallback)
   * 3. Local MongoDB collection (last resort)
   */
  private async lookupPhase1Application(p2: any): Promise<any | null> {
    const appId = p2.applicationId as string | undefined;

    // 1. Try direct CMS lookup by applicationId
    if (appId) {
      try {
        const result = await this.cmsBridge.getInnovationChallengeById(appId);
        if (result) return result;
      } catch {
        this.logger.warn(`Direct CMS lookup failed for applicationId: ${appId}`);
      }
    }

    // 2. Fallback — search CMS by email and match by applicationId
    if (p2.email) {
      try {
        const res = await this.cmsBridge.getInnovationChallenges({ page: 1, limit: 50, search: p2.email });
        const found = res.data.find((a: any) =>
          appId ? String(a._id || a.id) === String(appId) : a.email?.toLowerCase() === p2.email.toLowerCase(),
        );
        if (found) return found;
      } catch (err) {
        this.logger.warn(`CMS email-search fallback failed for ${p2.email}: ${(err as Error).message}`);
      }
    }

    // 3. Last resort — check local MongoDB collection
    if (appId) {
      try {
        const local = await this.challengeAppModel.findById(appId).lean().exec();
        if (local) return local;
      } catch {
        // ignore invalid ObjectId format
      }
    }

    return null;
  }

  private mergeApplicant(p2: any, p1: any) {
    return {
      id: String(p2._id),
      // Phase 2 fields
      orgName: p2.orgName,
      uploadedBy: p2.uploadedBy,
      email: p2.email,
      phone: p2.phone,
      youtubeLink: p2.youtubeLink,
      driveLink: p2.driveLink,
      matchedAt: p2.matchedAt,
      createdAt: p2.createdAt,
      // Phase 1 fields
      fullName: p1.fullName,
      organization: p1.organization,
      teamSize: p1.teamSize,
      challengeTrack: p1.challengeTrack,
      projectTitle: p1.projectTitle,
      description: p1.description,
      projectStage: p1.projectStage,
      pitchedBefore: p1.pitchedBefore,
      raisedFunds: p1.raisedFunds,
      commercialized: p1.commercialized,
      earnedRevenue: p1.earnedRevenue,
      projectDuration: p1.projectDuration,
      commercializationStage: p1.commercializationStage,
    };
  }

  // ─── Score Submission ──────────────────────────────────────────────────────

  /**
   * Create or update this judge's score for the given applicant.
   * Uses upsert so a judge can revise their scores until a lock is added.
   */
  async submitScore(dto: CreateJudgeScoreDto, judgeId: string, judgeName: string) {
    const now = new Date();
    const judgeOid = new Types.ObjectId(judgeId);

    const existing = await this.scoreModel.findOne({
      applicantId: dto.applicantId,
      judgeId: judgeOid,
    }).exec();

    if (existing) {
      existing.scores = new Map(Object.entries(dto.scores));
      existing.totalScore = dto.totalScore;
      existing.remarks = dto.remarks ?? existing.remarks;
      existing.lastUpdatedAt = now;
      return existing.save();
    }

    return this.scoreModel.create({
      applicantId: dto.applicantId,
      track: dto.track,
      judgeId: judgeOid,
      judgeName,
      scores: new Map(Object.entries(dto.scores)),
      totalScore: dto.totalScore,
      remarks: dto.remarks ?? '',
      submittedAt: now,
      lastUpdatedAt: now,
    });
  }

  // ─── Score Queries ────────────────────────────────────────────────────────

  /**
   * Scores for a single applicant.
   * Implements blind scoring: peer data is masked until the requesting judge
   * has submitted their own score.
   */
  async getScoresForApplicant(applicantId: string, requestingJudgeId: string) {
    const scores = await this.scoreModel
      .find({ applicantId })
      .lean()
      .exec();

    const myScore = scores.find((s) => String(s.judgeId) === requestingJudgeId);
    const hasSubmitted = Boolean(myScore);

    return {
      hasSubmitted,
      myScore: myScore ?? null,
      // Only reveal peer scores after own submission (blind scoring)
      peerScores: hasSubmitted
        ? scores.filter((s) => String(s.judgeId) !== requestingJudgeId)
        : [],
      totalJudges: scores.length,
      averageScore:
        scores.length > 0
          ? Math.round((scores.reduce((acc, s) => acc + s.totalScore, 0) / scores.length) * 10) / 10
          : null,
    };
  }

  /** All scores submitted by this judge */
  async getMyScores(judgeId: string) {
    return this.scoreModel
      .find({ judgeId: new Types.ObjectId(judgeId) })
      .lean()
      .exec();
  }

  // ─── Leaderboard ──────────────────────────────────────────────────────────

  async getLeaderboard() {
    const { data: applicants } = await this.getEligibleApplicants();
    const allScores = await this.scoreModel.find().lean().exec();

    // Group scores by applicantId
    const scoresByApplicant = new Map<string, any[]>();
    for (const s of allScores) {
      const list = scoresByApplicant.get(s.applicantId) ?? [];
      list.push(s);
      scoresByApplicant.set(s.applicantId, list);
    }

    // Build leaderboard rows
    const rows = applicants.map((a: any) => {
      const scores = scoresByApplicant.get(a.id) ?? [];
      const avg =
        scores.length > 0
          ? Math.round((scores.reduce((acc, s) => acc + s.totalScore, 0) / scores.length) * 10) / 10
          : 0;
      return {
        applicantId: a.id,
        track: a.challengeTrack,
        projectTitle: a.projectTitle,
        organization: a.organization,
        projectStage: a.projectStage,
        averageScore: avg,
        detailedScores: scores.map((s) => ({
          judgeName: s.judgeName || 'Judge',
          totalScore: s.totalScore,
        })),
        judgeCount: scores.length,
        matchedAt: a.matchedAt,
        shortlisted: false,
        rank: 0,
      };
    });

    // Group by track, rank within track
    const byTrack = new Map<string, typeof rows>();
    for (const row of rows) {
      const list = byTrack.get(row.track) ?? [];
      list.push(row);
      byTrack.set(row.track, list);
    }

    const result: typeof rows = [];
    for (const [, trackRows] of byTrack) {
      // Sort by averageScore desc, then matchedAt asc (tie-break)
      trackRows.sort((a, b) => {
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
        return new Date(a.matchedAt).getTime() - new Date(b.matchedAt).getTime();
      });

      trackRows.forEach((row, idx) => {
        row.rank = idx + 1;
        // All shortlisted if ≤ 3 eligible in track, otherwise top 3
        row.shortlisted = trackRows.length <= 3 ? true : idx < 3;
      });

      result.push(...trackRows);
    }

    return { data: result, criteria: JUDGE_CRITERIA };
  }

  /** Summary stats for the portal home page */
  async getStats(judgeId: string) {
    let applicants: any[] = [];

    try {
      const result = await this.getEligibleApplicants();
      applicants = (result as any).data || [];
    } catch (err) {
      this.logger.warn(`Failed to fetch eligible applicants, continuing with empty list: ${(err as Error).message}`);
    }

    const [myScores, allScores] = await Promise.all([
      this.scoreModel.find({ judgeId: new Types.ObjectId(judgeId) }).lean().exec(),
      this.scoreModel.find().lean().exec(),
    ]);

    const applicantIds = new Set(applicants.map((a: any) => a.id));
    const tracks = new Set(applicants.map((a: any) => a.challengeTrack));

    return {
      totalEligible: applicantIds.size,
      totalTracks: tracks.size,
      myScoresSubmitted: myScores.filter((s) => applicantIds.has(s.applicantId)).length,
      tracks: [...tracks],
    };
  }
}
