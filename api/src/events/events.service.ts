import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRecord, EventDocument } from './events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectModel(EventRecord.name) private eventModel: Model<EventDocument>,
    private metricsService: MetricsService,
  ) {}

  async create(dto: CreateEventDto): Promise<void> {
    const existing = await this.eventModel.findOne({ eventId: dto.eventId });
    if (existing) {
      this.metricsService.incrementDuplicate();
      this.logger.warn(`Duplicate ignored eventId=${dto.eventId}`);
      return;
    }

    const inconsistent = Math.abs(dto.timestamp - dto.clientTimestamp) > 10000;
    if (inconsistent) {
      this.metricsService.incrementInconsistent();
      this.logger.warn(`Inconsistent event eventId=${dto.eventId} sessionId=${dto.sessionId}`);
    }

    await this.eventModel.create({
      ...dto,
      inconsistent,
      processed: false,
    });

    this.metricsService.incrementIngested();
    this.logger.log(`Accepted eventId=${dto.eventId} sessionId=${dto.sessionId}`);
  }
}
