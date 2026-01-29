import { Body, Controller, Param, Post, Sse } from '@nestjs/common';

import { NotificationService } from './notification.service';


@Controller('notification')
export class NotificationController {
  constructor(private readonly NotificationService: NotificationService) {}

  @Sse('stream')
  stream() {
    return this.NotificationService.stream();
  }


  @Post('emit-event')
  emitEvent(@Body("message") message: string) {
    this.NotificationService.emit(message);

    return { message: message };
  }
  @Sse('get-stream/:candidateId')
  getStream(@Param('candidateId') candidateId: string) {
    return this.NotificationService.getStream(candidateId);
  }
  @Post('notify-candidate')
  notifyCandidate(@Body("message") message: string,@Body("candidateId") candidateId: string) {
    this.NotificationService.notifyCandidate(candidateId, message);

    return { message: message };
  }
}
