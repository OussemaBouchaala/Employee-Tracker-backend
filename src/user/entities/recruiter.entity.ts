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

  @OneToOne(() => User, (user) => user.recruiter, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @OneToMany(() => JobPost, (jobPost) => jobPost.recruiter)
  jobPosts: JobPost[];
}
