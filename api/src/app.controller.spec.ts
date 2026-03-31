import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { MetricsService } from './metrics/metrics.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [MetricsService],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should return health status ok', () => {
    expect(appController.getHealth()).toEqual({ status: 'ok' });
  });

  it('should return metrics', () => {
    const metrics = appController.getMetrics();
    expect(metrics).toHaveProperty('ingested');
    expect(metrics).toHaveProperty('duplicates');
    expect(metrics).toHaveProperty('inconsistent');
  });
});
