import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionTimeline, SessionsTimelineDocument } from './sessions.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(SessionTimeline.name) private sessionModel: Model<SessionsTimelineDocument>
  ) {}

  async getTimeline(sessionId: string) {
    return this.sessionModel.findOne({ sessionId });
  }
}
