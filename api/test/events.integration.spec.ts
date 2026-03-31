import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('POST /events (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should accept a valid event', async () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        sessionId: 'test-session',
        eventId: 'test-event-1',
        type: 'PLAY',
        timestamp: 1000000,
        clientTimestamp: 1000000,
      })
      .expect(202);
  });

  it('should reject invalid event type', async () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        sessionId: 'test-session',
        eventId: 'test-event-2',
        type: 'INVALID',
        timestamp: 1000000,
        clientTimestamp: 1000000,
      })
      .expect(400);
  });
});
