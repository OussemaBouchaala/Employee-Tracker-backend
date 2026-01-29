import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Timestamp } from "../../config/entities/timestamp.entity";
import { JobPostCandidate } from "./jobPostCandidate.entity";
import { Recruiter } from "../../user/entities/recruiter.entity";

@Entity()
export class JobPost extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employmentType: string;

  @Column()
  requirements: string;

  @Column()
  industries: string;

  @Column()
  title: string;

  @Column()
  jobFunction: string;

  @Column()
  seniorityLevel: string;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobPosts, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  recruiter: Recruiter;

  @OneToMany(
    () => JobPostCandidate,
    (jobPostCandidate) => jobPostCandidate.jobPost
  )
  jobPostCandidates: JobPostCandidate[];
}
