import { Body, Controller, Get, Post, Sse } from '@nestjs/common';

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
    this.NotificationService.emit({ data: message } as MessageEvent);

    return { message: message };
  }
}
