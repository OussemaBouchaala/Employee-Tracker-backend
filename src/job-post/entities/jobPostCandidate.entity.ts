import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Timestamp } from "../../config/entities/timestamp.entity";
import { JobPost } from "./jobPost.entity";
import { Candidate } from "../../user/entities/candidate.entity";

@Entity()
export class JobPostCandidate extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.jobPostCandidates, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  jobPost: JobPost;

  @ManyToOne(() => Candidate, (candidate) => candidate.jobPostCandidates, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  candidate: Candidate;
}
