import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private ingested = 0;
  private duplicates = 0;
  private inconsistent = 0;
  
  // each time event is saved, we increment the counters
  incrementIngested() { this.ingested++; }
  incrementDuplicate() { this.duplicates++; }
  incrementInconsistent() { this.inconsistent++; }

  getMetrics() {
    return {
      ingested: this.ingested,
      duplicates: this.duplicates,
      inconsistent: this.inconsistent,
    };
  }
}
