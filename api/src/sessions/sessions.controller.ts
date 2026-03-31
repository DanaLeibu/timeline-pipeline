import { Controller, Get, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':id/timeline')
  async getTimeline(@Param('id') id: string) {
    return this.sessionsService.getTimeline(id);
  }
}
