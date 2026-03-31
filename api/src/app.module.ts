import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {MongooseModule} from "@nestjs/mongoose";
import { EventsModule } from './events/events.module';
import { MetricsModule } from './metrics/metrics.module';
import { SessionsModule } from './sessions/sessions.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/timeline'),
    EventsModule,
    SessionsModule,
    MetricsModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
