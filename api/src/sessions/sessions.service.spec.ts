import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SessionsService } from './sessions.service';
import { SessionTimeline } from './sessions.schema';

describe('SessionsService', () => {
  let service: SessionsService;
  let mockSessionModel: any;

  beforeEach(async () => {
    mockSessionModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: getModelToken(SessionTimeline.name), useValue: mockSessionModel },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should return timeline for a session', async () => {
    const mockTimeline = { sessionId: 'session1', events: [] };
    mockSessionModel.findOne.mockResolvedValue(mockTimeline);

    const result = await service.getTimeline('session1');

    expect(result).toEqual(mockTimeline);
    expect(mockSessionModel.findOne).toHaveBeenCalledWith({ sessionId: 'session1' });
  });

  it('should return null when session not found', async () => {
    mockSessionModel.findOne.mockResolvedValue(null);

    const result = await service.getTimeline('nonexistent');

    expect(result).toBeNull();
  });
});
