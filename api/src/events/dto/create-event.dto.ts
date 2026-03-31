import {IsString, IsNumber, IsEnum, IsOptional, IsNotEmpty, Min} from 'class-validator'
import {EventType} from '../events.enum'
import {Type} from 'class-transformer'

export class CreateEventDto {

    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsString()
    @IsNotEmpty()
    eventId: string;

    @IsEnum(EventType)
    type: EventType

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    timestamp: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    clientTimestamp: number;

    @IsOptional()
    metadata?: Record<string, any>;

}