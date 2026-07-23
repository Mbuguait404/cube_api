import { Types } from 'mongoose';
import { JudgeService } from './judge.service';

describe('JudgeService score visibility', () => {
  it('returns existing peer scores even before the current judge has submitted their own score', async () => {
    const existingScores = [
      {
        applicantId: 'app-1',
        judgeId: new Types.ObjectId(),
        judgeName: 'Jane Judge',
        totalScore: 84,
        scores: {},
        remarks: 'Strong fit',
      },
    ];

    const scoreModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(existingScores),
        }),
      }),
    } as any;

    const service = new JudgeService(
      scoreModel,
      { find: jest.fn() } as any,
      { find: jest.fn() } as any,
      { find: jest.fn() } as any,
      { find: jest.fn() } as any,
      { findOne: jest.fn(), create: jest.fn() } as any,
      { getInnovationChallenges: jest.fn(), getInnovationChallengeById: jest.fn() } as any,
    );

    const result = await service.getScoresForApplicant('app-1', new Types.ObjectId().toString());

    expect(result.hasSubmitted).toBe(false);
    expect(result.peerScores).toHaveLength(1);
    expect(result.peerScores[0].judgeName).toBe('Jane Judge');
  });

  it('uses the dedicated shortlist collection for finalists judging', async () => {
    const shortlistedEntries = [
      {
        applicantId: 'app-1',
        track: 'EdTech',
        finalistName: 'Ada Lovelace',
        phoneNumber: '0712345678',
        projectTitle: 'StudyFlow',
        organization: 'UoN',
        projectStage: 'Prototype',
        matchedAt: '2026-07-23T00:00:00.000Z',
        shortlisted: true,
        rankOnFinalistList: 1,
        originalRank: 2,
      },
    ];

    const scoreModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    } as any;

    const shortlistModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(shortlistedEntries),
        }),
      }),
    } as any;

    const finalistScoreModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    } as any;

    const phase2ModelForTest2 = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    } as any;

    const service = new JudgeService(
      scoreModel,
      finalistScoreModel,
      shortlistModel,
      phase2ModelForTest2,
      { find: jest.fn() } as any,
      { findOne: jest.fn(), create: jest.fn() } as any,
      { getInnovationChallenges: jest.fn(), getInnovationChallengeById: jest.fn() } as any,
    );

    const result = await service.getFinalistLeaderboard();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].applicantId).toBe('app-1');
    expect(result.data[0].finalistName).toBe('Ada Lovelace');
    expect(result.data[0].phoneNumber).toBe('0712345678');
    expect(result.data[0].shortlisted).toBe(true);
  });

  it('maps finalist scores to the shortlist row even when the score uses a different applicant id', async () => {
    const shortlistedEntries = [
      {
        applicantId: 'shortlist-1',
        track: 'EdTech',
        finalistName: 'Ada Lovelace',
        phoneNumber: '0712345678',
        projectTitle: 'StudyFlow',
        organization: 'UoN',
        projectStage: 'Prototype',
        matchedAt: '2026-07-23T00:00:00.000Z',
        shortlisted: true,
      },
    ];

    const phase2Matches = [
      {
        _id: 'phase2-123',
        phone: '0712345678',
        matchStatus: 'matched',
        applicationId: 'app-1',
      },
    ];

    const scoreModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    } as any;

    const shortlistModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(shortlistedEntries),
        }),
      }),
    } as any;

    const finalistScoreModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([
            {
              applicantId: 'phase2-123',
              judgeName: 'Jane Judge',
              totalScore: 84,
              scores: {},
              remarks: 'Strong fit',
            },
          ]),
        }),
      }),
    } as any;

    const phase2Model = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(phase2Matches),
        }),
      }),
    } as any;

    const cmsBridge = {
      getInnovationChallenges: jest.fn().mockResolvedValue({
        data: [
          {
            _id: 'app-1',
            fullName: 'Ada Lovelace',
            organization: 'UoN',
            challengeTrack: 'EdTech',
            projectTitle: 'StudyFlow',
            projectStage: 'Prototype',
          },
        ],
        meta: { total: 1 },
      }),
      getInnovationChallengeById: jest.fn(),
    } as any;

    const service = new JudgeService(
      scoreModel,
      finalistScoreModel,
      shortlistModel,
      phase2Model,
      { find: jest.fn() } as any,
      { findOne: jest.fn(), create: jest.fn() } as any,
      cmsBridge,
    );

    const result = await service.getFinalistLeaderboard();

    expect(result.data[0].judgeCount).toBe(1);
    expect(result.data[0].averageScore).toBe(84);
    expect(result.data[0].detailedScores[0].judgeName).toBe('Jane Judge');
  });
});
