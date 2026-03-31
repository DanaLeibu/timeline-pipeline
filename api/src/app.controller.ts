import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics/metrics.service';

@Controller()
export class AppController {
  constructor(private readonly MetricsService: MetricsService) {}

  @Get('health')
  getHealth() {
    return {status: 'ok'};
  }

  @Get('metrics')
  GetMetrics() {
    return this.MetricsService.getMetrics();
  } 


}