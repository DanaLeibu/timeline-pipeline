import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics/metrics.service';

@Controller()
export class AppController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('health')
  getHealth() {
    return {status: 'ok'};
  }

  @Get('metrics')
  getMetrics() {
    return this.metricsService.getMetrics();
  } 


}