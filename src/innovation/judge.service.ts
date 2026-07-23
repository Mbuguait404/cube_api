import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  JudgeScore,
  JudgeScoreDocument,
  JudgeScoreRound,
} from './schemas/judge-score.schema';
import {
  FinalistJudgeScore,
  FinalistJudgeScoreDocument,
} from './schemas/finalist-judge-score.schema';
import {
  FinalistShortlist,
  FinalistShortlistDocument,
} from './schemas/finalist-shortlist.schema';
import { InnovationPhase2, InnovationPhase2Document } from './schemas/innovation-phase2.schema';
import { InnovationChallengeApplication, InnovationChallengeApplicationDocument } from './schemas/innovation-challenge-application.schema';
import { InnovationSettings, InnovationSettingsDocument } from './schemas/innovation-settings.schema';
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
    @InjectModel(FinalistJudgeScore.name)
    private readonly finalistScoreModel: Model<FinalistJudgeScoreDocument>,
    @InjectModel(FinalistShortlist.name)
    private readonly finalistShortlistModel: Model<FinalistShortlistDocument>,
    @InjectModel(InnovationPhase2.name)
    private readonly phase2Model: Model<InnovationPhase2Document>,
    @InjectModel(InnovationChallengeApplication.name)
    private readonly challengeAppModel: Model<InnovationChallengeApplicationDocument>,
    @InjectModel(InnovationSettings.name)
    private readonly settingsModel: Model<InnovationSettingsDocument>,
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
  private normalizeText(value?: string | null) {
    return (value || '').trim().toLowerCase();
  }

  private isApplicantMatchingShortlistEntry(applicant: any, entry: any) {
    const candidateId = String(applicant?.id || '');
    const entryId = String(entry?.applicantId || '');
    const linkedId = String(entry?.linkedApplicantId || '');

    if (candidateId && (candidateId === entryId || candidateId === linkedId)) {
      return true;
    }

    const applicantName = this.normalizeText(applicant?.fullName);
    const entryName = this.normalizeText(entry?.finalistName);
    const projectTitle = this.normalizeText(applicant?.projectTitle);
    const entryProjectTitle = this.normalizeText(entry?.projectTitle);
    const organization = this.normalizeText(applicant?.organization);
    const entryOrganization = this.normalizeText(entry?.organization);
    const track = this.normalizeText(applicant?.challengeTrack);
    const entryTrack = this.normalizeText(entry?.track);
    const projectStage = this.normalizeText(applicant?.projectStage);
    const entryStage = this.normalizeText(entry?.projectStage);
    const phone = this.normalizeText(applicant?.phone);
    const entryPhone = this.normalizeText(entry?.phoneNumber);

    const nameMatch = applicantName && entryName && applicantName === entryName;
    const projectMatch = projectTitle && entryProjectTitle && projectTitle === entryProjectTitle;
    const organizationMatch = organization && entryOrganization && organization === entryOrganization;
    const trackMatch = track && entryTrack && track === entryTrack;
    const stageMatch = projectStage && entryStage && projectStage === entryStage;
    const phoneMatch = phone && entryPhone && phone === entryPhone;

    return Boolean(
      nameMatch || projectMatch || phoneMatch ||
      (nameMatch && organizationMatch) ||
      (projectMatch && organizationMatch) ||
      (projectMatch && trackMatch) ||
      (nameMatch && stageMatch) ||
      (organizationMatch && trackMatch),
    );
  }

  async getEligibleApplicants() {
    const [matchedPhase2, phase1Apps, shortlistedEntries] = await Promise.all([
      this.phase2Model.find({ matchStatus: 'matched' }).lean().exec(),
      this.fetchAllPhase1Applications(),
      this.finalistShortlistModel.find().lean().exec(),
    ]);

    const phase1Map = new Map<string, any>(
      phase1Apps.map((a) => [String(a._id || a.id), a]),
    );

    const merged = matchedPhase2
      .map((p2) => {
        const p1 = p2.applicationId ? phase1Map.get(String(p2.applicationId)) : null;
        if (!p1) return null; // skip orphaned matches
        const applicant = this.mergeApplicant(p2, p1);
        const isShortlisted = shortlistedEntries.some((entry) => this.isApplicantMatchingShortlistEntry(applicant, entry));
        return isShortlisted ? applicant : null;
      })
      .filter(Boolean);

    return { data: merged, total: merged.length };
  }

  /** Return a single merged applicant record */
  async getApplicantDetail(applicantId: string) {
    const [matchedPhase2, phase1Apps, shortlistedEntries] = await Promise.all([
      this.phase2Model.find({ matchStatus: 'matched' }).lean().exec(),
      this.fetchAllPhase1Applications(),
      this.finalistShortlistModel.find().lean().exec(),
    ]);

    const phase1Map = new Map<string, any>(
      phase1Apps.map((a) => [String(a._id || a.id), a]),
    );

    const shortlistedEntry = shortlistedEntries.find((entry) =>
      String(entry?.applicantId || '') === applicantId || String(entry?.linkedApplicantId || '') === applicantId,
    );

    const mergedApplicant = matchedPhase2
      .map((p2) => {
        const p1 = p2.applicationId ? phase1Map.get(String(p2.applicationId)) : null;
        if (!p1) return null;
        const applicant = this.mergeApplicant(p2, p1);
        const matchesRequestedId = String(applicant.id) === applicantId;
        const matchesShortlist = Boolean(shortlistedEntry && this.isApplicantMatchingShortlistEntry(applicant, shortlistedEntry));
        return matchesRequestedId || matchesShortlist ? applicant : null;
      })
      .find(Boolean);

    if (!mergedApplicant) {
      throw new NotFoundException('Eligible applicant not found');
    }

    return mergedApplicant;
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

  // ─── Finalists-Only Applicants (from finalistshortlists collection) ─────────

  /**
   * Return all shortlist entries as applicants for the finalists judging view.
   * Does NOT touch Phase 1 (CMS) or Phase 2 collections.
   */
  async getFinalistsOnlyApplicants() {
    const entries = await this.getFinalistShortlistEntries();
    const data = entries.map((entry: any) => this.mapShortlistToApplicant(entry));
    return { data, total: data.length };
  }

  /**
   * Return a single shortlist entry as an applicant for the finalists judging view.
   */
  async getFinalistsOnlyApplicantDetail(applicantId: string) {
    const entry = await this.finalistShortlistModel.findOne({ applicantId }).lean().exec();
    if (!entry) {
      throw new NotFoundException('Finalist not found');
    }
    return this.mapShortlistToApplicant(entry);
  }

  private mapShortlistToApplicant(entry: any) {
    return {
      id: String(entry.applicantId),
      fullName: entry.finalistName ?? '',
      organization: entry.organization ?? '',
      challengeTrack: entry.track ?? '',
      projectTitle: entry.projectTitle ?? '',
      projectStage: entry.projectStage ?? '',
      phone: entry.phoneNumber ?? '',
      email: '',
      teamSize: null,
      description: '',
      orgName: entry.organization ?? '',
      uploadedBy: '',
      youtubeLink: '',
      driveLink: '',
      pitchedBefore: null,
      raisedFunds: null,
      commercialized: null,
      earnedRevenue: null,
      projectDuration: null,
      commercializationStage: null,
      matchedAt: entry.matchedAt ? new Date(entry.matchedAt).toISOString() : null,
      createdAt: null,
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
    const round = dto.round ?? JudgeScoreRound.GENERAL;

    const existing = await this.scoreModel.findOne({
      applicantId: dto.applicantId,
      judgeId: judgeOid,
      round,
    }).exec();

    if (existing) {
      existing.scores = new Map(Object.entries(dto.scores));
      existing.totalScore = dto.totalScore;
      existing.remarks = dto.remarks ?? existing.remarks;
      existing.round = round;
      existing.lastUpdatedAt = now;
      return existing.save();
    }

    return this.scoreModel.create({
      applicantId: dto.applicantId,
      track: dto.track,
      judgeId: judgeOid,
      judgeName,
      round,
      scores: new Map(Object.entries(dto.scores)),
      totalScore: dto.totalScore,
      remarks: dto.remarks ?? '',
      submittedAt: now,
      lastUpdatedAt: now,
    });
  }

  async submitFinalistScore(
    dto: CreateJudgeScoreDto,
    judgeId: string,
    judgeName: string,
  ) {
    const now = new Date();
    const judgeOid = new Types.ObjectId(judgeId);

    const existing = await this.finalistScoreModel.findOne({
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

    return this.finalistScoreModel.create({
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
  async getScoresForApplicant(
    applicantId: string,
    requestingJudgeId: string,
    round: JudgeScoreRound = JudgeScoreRound.GENERAL,
  ) {
    const scores = await this.scoreModel
      .find({ applicantId, round })
      .lean()
      .exec();

    const myScore = scores.find((s) => String(s.judgeId) === requestingJudgeId);
    const hasSubmitted = Boolean(myScore);

    return {
      hasSubmitted,
      myScore: myScore ?? null,
      peerScores: scores.filter((s) => String(s.judgeId) !== requestingJudgeId),
      totalJudges: scores.length,
      averageScore:
        scores.length > 0
          ? Math.round((scores.reduce((acc, s) => acc + s.totalScore, 0) / scores.length) * 10) / 10
          : null,
    };
  }

  async getFinalistScoresForApplicant(
    applicantId: string,
    requestingJudgeId: string,
  ) {
    const scores = await this.finalistScoreModel.find({ applicantId }).lean().exec();

    const myScore = scores.find((s) => String(s.judgeId) === requestingJudgeId);
    const hasSubmitted = Boolean(myScore);

    return {
      hasSubmitted,
      myScore: myScore ?? null,
      peerScores: scores.filter((s) => String(s.judgeId) !== requestingJudgeId),
      totalJudges: scores.length,
      averageScore:
        scores.length > 0
          ? Math.round((scores.reduce((acc, s) => acc + s.totalScore, 0) / scores.length) * 10) / 10
          : null,
    };
  }

  /** All scores submitted by this judge */
  async getMyScores(
    judgeId: string,
    round: JudgeScoreRound = JudgeScoreRound.GENERAL,
  ) {
    return this.scoreModel
      .find({
        judgeId: new Types.ObjectId(judgeId),
        round,
      })
      .lean()
      .exec();
  }

  async getMyFinalistScores(judgeId: string) {
    return this.finalistScoreModel
      .find({ judgeId: new Types.ObjectId(judgeId) })
      .lean()
      .exec();
  }

  // ─── Leaderboard ──────────────────────────────────────────────────────────

  async getLeaderboard(round: JudgeScoreRound = JudgeScoreRound.GENERAL) {
    const { data: applicants } = await this.getEligibleApplicants();
    const allScores = await this.scoreModel
      .find({ round })
      .lean()
      .exec();

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
          scores: s.scores instanceof Map ? Object.fromEntries(s.scores) : s.scores,
          remarks: s.remarks,
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
      const getTimeValue = (value: string | null | undefined) => {
        if (!value) return Number.MAX_SAFE_INTEGER;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? Number.MAX_SAFE_INTEGER : parsed.getTime();
      };

      // Sort by averageScore desc, then matchedAt asc (tie-break)
      trackRows.sort((a, b) => {
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
        return getTimeValue(a.matchedAt) - getTimeValue(b.matchedAt);
      });

      const isHealthTrack = (row: { track?: string }) => {
        const trackName = (row.track || '').trim().toLowerCase();
        return trackName === 'medical & healthtech' || trackName === 'healthtech' || trackName === 'medical-healthtech';
      };

      const isFintechTrack = (row: { track?: string }) => {
        const trackName = (row.track || '').trim().toLowerCase();
        return trackName.includes('fintech') || trackName === 'fintech & digital economy';
      };

      const shortlistLimit = trackRows.length <= 3
        ? trackRows.length
        : isHealthTrack(trackRows[0])
        ? 6
        : isFintechTrack(trackRows[0])
        ? 4
        : 3;

      trackRows.forEach((row, idx) => {
        row.rank = idx + 1;
        row.shortlisted = trackRows.length <= shortlistLimit ? true : idx < shortlistLimit;
      });

      result.push(...trackRows);
    }

    return { data: result, criteria: JUDGE_CRITERIA };
  }

  async getFinalistShortlistEntries() {
    return this.finalistShortlistModel.find().lean().exec();
  }

  async getFinalistLeaderboard() {
    const shortlistedEntries = await this.getFinalistShortlistEntries();
    const allScores = await this.finalistScoreModel.find().lean().exec();

    const scoresByApplicant = new Map<string, any[]>();
    for (const s of allScores) {
      const list = scoresByApplicant.get(s.applicantId) ?? [];
      list.push(s);
      scoresByApplicant.set(s.applicantId, list);
    }

    const resolveScores = (entry: any): any[] => {
      const ids = [
        String(entry.applicantId),
        entry.linkedApplicantId ? String(entry.linkedApplicantId) : null,
      ].filter(Boolean) as string[];
      for (const id of ids) {
        const found = scoresByApplicant.get(id);
        if (found && found.length > 0) return found;
      }
      return [];
    };

    const rows = shortlistedEntries.map((entry: any) => {
      const scores = resolveScores(entry);
      const avg =
        scores.length > 0
          ? Math.round((scores.reduce((acc, s) => acc + s.totalScore, 0) / scores.length) * 10) / 10
          : 0;
      return {
        applicantId: String(entry.applicantId),
        track: entry.track,
        projectTitle: entry.projectTitle,
        organization: entry.organization,
        projectStage: entry.projectStage,
        averageScore: avg,
        detailedScores: scores.map((s) => ({
          judgeName: s.judgeName || 'Judge',
          totalScore: s.totalScore,
          scores: s.scores instanceof Map ? Object.fromEntries(s.scores) : s.scores,
          remarks: s.remarks,
        })),
        judgeCount: scores.length,
        matchedAt: entry.matchedAt ? new Date(entry.matchedAt).toISOString() : null,
        shortlisted: entry.shortlisted ?? true,
        rank: 0,
        finalistName: entry.finalistName,
        phoneNumber: entry.phoneNumber,
        originalRank: entry.originalRank,
        rankOnFinalistList: entry.rankOnFinalistList,
      };
    });

    const byTrack = new Map<string, typeof rows>();
    for (const row of rows) {
      const list = byTrack.get(row.track) ?? [];
      list.push(row);
      byTrack.set(row.track, list);
    }

    const result: typeof rows = [];
    for (const [, trackRows] of byTrack) {
      const getTimeValue = (value: string | null | undefined) => {
        if (!value) return Number.MAX_SAFE_INTEGER;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? Number.MAX_SAFE_INTEGER : parsed.getTime();
      };

      trackRows.sort((a, b) => {
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
        return getTimeValue(a.matchedAt) - getTimeValue(b.matchedAt);
      });

      const isHealthTrack = (row: { track?: string }) => {
        const trackName = (row.track || '').trim().toLowerCase();
        return trackName === 'medical & healthtech' || trackName === 'healthtech' || trackName === 'medical-healthtech';
      };

      const isFintechTrack = (row: { track?: string }) => {
        const trackName = (row.track || '').trim().toLowerCase();
        return trackName.includes('fintech') || trackName === 'fintech & digital economy';
      };

      const shortlistLimit = trackRows.length <= 3
        ? trackRows.length
        : isHealthTrack(trackRows[0])
        ? 6
        : isFintechTrack(trackRows[0])
        ? 4
        : 3;

      trackRows.forEach((row, idx) => {
        row.rank = idx + 1;
        row.shortlisted = trackRows.length <= shortlistLimit ? true : idx < shortlistLimit;
      });

      result.push(...trackRows);
    }

    return { data: result, criteria: JUDGE_CRITERIA };
  }

  /**
   * Public shortlist
   */
  async getPublicShortlist() {
    const settings = await this.getSettings();
    if (!settings.isPublicShortlistVisible) {
      return { data: [], isPublicShortlistVisible: false };
    }

    const leaderboard = await this.getFinalistLeaderboard();
    const shortlisted = leaderboard.data.filter((r) => r.shortlisted);
    
    // Clean data for public view
    const publicData = shortlisted.map((r) => ({
      applicantId: r.applicantId,
      track: r.track,
      projectTitle: r.projectTitle,
      organization: r.organization,
      averageScore: r.averageScore,
      projectStage: r.projectStage,
      finalistName: r.finalistName,
      phoneNumber: r.phoneNumber,
      rankOnFinalistList: r.rankOnFinalistList,
      originalRank: r.originalRank,
    }));

    return { data: publicData, isPublicShortlistVisible: true };
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  async getSettings() {
    let settings = await this.settingsModel.findOne().exec();
    if (!settings) {
      settings = await this.settingsModel.create({ isPublicShortlistVisible: false });
    }
    return settings;
  }

  async updateSettings(updates: { isPublicShortlistVisible?: boolean; isPublicVotingOpen?: boolean }) {
    let settings = await this.settingsModel.findOne().exec();
    if (!settings) {
      settings = new this.settingsModel();
    }
    if (updates.isPublicShortlistVisible !== undefined) {
      settings.isPublicShortlistVisible = updates.isPublicShortlistVisible;
    }
    if (updates.isPublicVotingOpen !== undefined) {
      (settings as any).isPublicVotingOpen = updates.isPublicVotingOpen;
    }
    return settings.save();
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

    const applicantIds = new Set((applicants as any[]).map((a: any) => a.id));
    const tracks = new Set((applicants as any[]).map((a: any) => a.challengeTrack));

    const trackCounts: Record<string, number> = {};
    for (const a of applicants as any[]) {
      const track = a.challengeTrack;
      if (!trackCounts[track]) trackCounts[track] = 0;
      trackCounts[track]++;
    }

    const tracksWithCounts = [...tracks].map(track => ({
      name: track,
      count: trackCounts[track as string] || 0
    }));

    // Count applicants where all judges who scored anyone have also scored this applicant
    const scoreCountByApplicant = new Map<string, number>();
    for (const s of allScores) {
      scoreCountByApplicant.set(s.applicantId, (scoreCountByApplicant.get(s.applicantId) ?? 0) + 1);
    }

    return {
      totalEligible: applicantIds.size,
      totalTracks: tracks.size,
      myScoresSubmitted: myScores.filter((s) => applicantIds.has(s.applicantId)).length,
      tracks: tracksWithCounts,
    };
  }
}
