import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './entities/notification.entity';
import { Event } from 'src/config/interfaces/event';
import { User } from '../user/entities/user.entity';
import { Recruiter } from '../user/entities/recruiter.entity';

@Injectable()
export class NotificationService {
  private events$ = new Subject<MessageEvent>();
  private streams: Map<string, Subject<Event>> = new Map();

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
  ) {}

  private async enrichSender(notification: Notification): Promise<any> {
    const senderId = (notification as any).senderId;
    if (!senderId) return notification;

    const senderUser = await this.userRepository.findOne({
      where: { _id: senderId as any },
    });

    let recruiter: Recruiter | null = null;
    if (senderUser?._id) {
      recruiter = await this.recruiterRepository.findOne({
        where: { userId: senderUser._id as any },
      });
    }

    return {
      ...(notification as any),
      senderName: senderUser?.name,
      senderEmail: senderUser?.email,
      senderCompanyName: recruiter?.companyName,
    };
  }

  async createNotification(
    recipientId: ObjectId,
    senderId: ObjectId,
    type: NotificationType,
    title: string,
    message: string,
    jobPostId?: ObjectId
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      recipientId,
      senderId,
      type,
      title,
      message,
      status: NotificationStatus.UNREAD,
      jobPostId: jobPostId ?? null,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    const enriched = await this.enrichSender(savedNotification);
    this.notifyCandidate(recipientId.toString(), JSON.stringify(enriched));

    return savedNotification;
  }

  async getUserNotifications(userId: ObjectId): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
    });

    const enriched = await Promise.all(notifications.map((n) => this.enrichSender(n)));
    return enriched as unknown as Notification[];
  }

  async markAsRead(notificationId: ObjectId): Promise<void> {
    await this.notificationRepository.update(
      { _id: notificationId },
      { status: NotificationStatus.READ }
    );
  }

  async markAllAsRead(userId: ObjectId): Promise<void> {
    await this.notificationRepository.update(
      { recipientId: userId },
      { status: NotificationStatus.READ }
    );
  }

  async getUnreadCount(userId: ObjectId): Promise<number> {
    return this.notificationRepository.count({
      where: { 
        recipientId: userId,
        status: NotificationStatus.UNREAD 
      }
    });
  }

  emit(data: MessageEvent) {
    this.events$.next(data); 
  }

  stream(): Observable<MessageEvent> {
    return this.events$.asObservable();
  }

  getStream(candidateId: string): Observable<Event> {
    if (!this.streams.has(candidateId)) {
      this.streams.set(candidateId, new Subject<Event>());
    }

    return this.streams.get(candidateId)!.asObservable();
  }

  notifyCandidate(candidateId: string, payload: string) {
    if (!this.streams.has(candidateId)) {
      this.streams.set(candidateId, new Subject<Event>());
    }
    const stream = this.streams.get(candidateId);
    if (stream) {
      stream.next({ data: payload, name: 'notification' });
    }
  }

}
