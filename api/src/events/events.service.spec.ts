import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventRecord } from './events.schema';
import { MetricsService } from '../metrics/metrics.service';

describe('EventsService', () => {
  let service: EventsService;
  let mockEventModel: any;
  let mockMetricsService: any;

  beforeEach(async () => {
    mockEventModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockMetricsService = {
      incrementIngested: jest.fn(),
      incrementDuplicate: jest.fn(),
      incrementInconsistent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getModelToken(EventRecord.name), useValue: mockEventModel },
        { provide: MetricsService, useValue: mockMetricsService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should ignore duplicate eventId', async () => {
    mockEventModel.findOne.mockResolvedValue({ eventId: 'event1' });

    await service.create({
      sessionId: 'session1',
      eventId: 'event1',
      type: 'PLAY' as any,
      timestamp: 1000000,
      clientTimestamp: 1000000,
    });

    expect(mockEventModel.create).not.toHaveBeenCalled();
    expect(mockMetricsService.incrementDuplicate).toHaveBeenCalled();
  });

  it('should flag inconsistent when timestamp diff > 10000', async () => {
    mockEventModel.findOne.mockResolvedValue(null);
    mockEventModel.create.mockResolvedValue({});

    await service.create({
      sessionId: 'session1',
      eventId: 'event2',
      type: 'PLAY' as any,
      timestamp: 1000000,
      clientTimestamp: 1015000,
    });

    expect(mockEventModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ inconsistent: true })
    );
    expect(mockMetricsService.incrementInconsistent).toHaveBeenCalled();
  });

  it('should save a valid event', async () => {
    mockEventModel.findOne.mockResolvedValue(null);
    mockEventModel.create.mockResolvedValue({});

    await service.create({
      sessionId: 'session1',
      eventId: 'event3',
      type: 'PAUSE' as any,
      timestamp: 1000000,
      clientTimestamp: 1000000,
    });

    expect(mockEventModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ inconsistent: false, processed: false })
    );
    expect(mockMetricsService.incrementIngested).toHaveBeenCalled();
  });
});
