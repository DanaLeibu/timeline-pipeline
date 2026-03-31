import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionsTimelineDocument = HydratedDocument<SessionTimeline>;
@Schema({ collection: 'timelines', versionKey: false })
export class SessionTimeline {
    @Prop({required: true, unique: true})
    sessionId: string;

    @Prop({type: [Object], default: []})
    events: Record<string, unknown>[];

    @Prop({ required: true, default: () => Date.now() })
    createdAt: number;

} 

export const SessionTimelineSchema = SchemaFactory.createForClass(SessionTimeline);
