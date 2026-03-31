import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EventType } from './events.enum';


export type EventDocument = HydratedDocument<EventRecord>;
@Schema({collection: "events", versionKey: false})
export class EventRecord {
    @Prop({required: true})
    sessionId: string;

    @Prop({required: true})
    eventId: string;

    @Prop({enum: EventType ,required: true})
    type: EventType

    @Prop({required: true})
    timestamp: number;

    @Prop({required: true})
    clientTimestamp: number;

    @Prop({ type: Object, default: null })
    metadata?: Record<string, any> | null;

    @Prop({ required: true, default: false })
    inconsistent: boolean;

    @Prop({ required: true, default: false })
    processed: boolean;

    @Prop({ required: true, default: () => Date.now() })
    receivedAt: number; 

}

export const EventSchema = SchemaFactory.createForClass(EventRecord);


