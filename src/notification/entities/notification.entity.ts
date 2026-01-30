import { Column, Entity, ObjectId, ObjectIdColumn, ManyToOne } from "typeorm";
import { Timestamp } from "../../config/entities/timestamp.entity";
import { Candidate } from "../../user/entities/candidate.entity";
import { Recruiter } from "../../user/entities/recruiter.entity";

export enum NotificationType {
  CONTACT_REQUEST = 'CONTACT_REQUEST',
  MESSAGE = 'MESSAGE',
  APPLICATION_UPDATE = 'APPLICATION_UPDATE'
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ'
}

@Entity()
export class Notification extends Timestamp {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('objectId')
  recipientId: ObjectId;

  @Column('objectId')
  senderId: ObjectId;

  @Column()
  type: NotificationType;

  @Column()
  status: NotificationStatus;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column('objectId')
  jobPostId: ObjectId | null;

  @ManyToOne(() => Candidate, (candidate) => candidate.notifications)
  recipient: Candidate;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.sentNotifications)
  sender: Recruiter;
}
