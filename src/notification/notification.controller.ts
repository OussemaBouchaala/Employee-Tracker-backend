import { Body, Controller, Get, Post, Sse, Param, Patch, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationType } from './entities/notification.entity';
import { ObjectId } from 'mongodb';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('stream/:userId')
  stream(@Param('userId') userId: string) {
    return this.notificationService.getStream(userId);
  }

  @Post('emit-event')
  emitEvent(@Body("message") message: string) {
    this.notificationService.emit({ data: message } as MessageEvent);
    return { message: message };
  }

  @Post('contact-candidate')
  async contactCandidate(
    @Body('candidateId') candidateId: string,
    @Body('recruiterId') recruiterId: string,
    @Body('message') message: string,
    @Body('jobPostId') jobPostId?: string
  ) {
    const notification = await this.notificationService.createNotification(
      new ObjectId(candidateId),
      new ObjectId(recruiterId),
      NotificationType.CONTACT_REQUEST,
      'New Contact Request',
      message,
      jobPostId ? new ObjectId(jobPostId) : undefined
    );

    return { success: true, notification };
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    const notifications = await this.notificationService.getUserNotifications(new ObjectId(userId));
    return { notifications };
  }

  @Get('user/:userId/unread-count')
  async getUnreadCount(@Param('userId') userId: string) {
    const count = await this.notificationService.getUnreadCount(new ObjectId(userId));
    return { unreadCount: count };
  }

  @Patch(':notificationId/read')
  async markAsRead(@Param('notificationId') notificationId: string) {
    await this.notificationService.markAsRead(new ObjectId(notificationId));
    return { success: true };
  }

  @Patch('user/:userId/read-all')
  async markAllAsRead(@Param('userId') userId: string) {
    await this.notificationService.markAllAsRead(new ObjectId(userId));
    return { success: true };
  }
}
