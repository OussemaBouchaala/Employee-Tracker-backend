import { Column, Entity, ObjectIdColumn, ObjectId, OneToMany, OneToOne } from "typeorm";
import { JobPostCandidate } from "../../job-post/entities/jobPostCandidate.entity";
import { User } from "./user.entity";
import { Notification } from "../../notification/entities/notification.entity";

@Entity()
export class Candidate {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'string' })
  userId: ObjectId;

  @Column()
  cv: string;

  @Column()
  description: string;

  @OneToOne(() => User, (user) => user.candidate)
  user: User;

  @OneToMany(() => JobPostCandidate, (jobPostCandidate) => jobPostCandidate.candidate)
  jobPostCandidates: JobPostCandidate[];

  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications: Notification[];
}