import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { JobPost } from "../../job-post/entities/jobPost.entity";

@Entity()
export class Recruiter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column({ default: 'pending' })
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;

  @Column({ nullable: true })
  rejectionReason: string;

  @OneToOne(() => User, (user) => user.recruiter, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @OneToMany(() => JobPost, (jobPost) => jobPost.recruiter)
  jobPosts: JobPost[];
}
