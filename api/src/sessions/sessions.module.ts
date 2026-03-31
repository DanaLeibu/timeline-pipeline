import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionTimeline, SessionTimelineSchema  } from './sessions.schema';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: SessionTimeline.name, schema: SessionTimelineSchema }])],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
