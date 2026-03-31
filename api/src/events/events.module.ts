import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventRecord, EventSchema } from './events.schema';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: EventRecord.name, schema: EventSchema }]), MetricsModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
