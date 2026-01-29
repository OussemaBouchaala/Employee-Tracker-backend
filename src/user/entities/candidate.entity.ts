import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { JobPostCandidate } from "../../job-post/entities/jobPostCandidate.entity";
import { User } from "./user.entity";

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cv: string;

  @Column()
  description: string;

  @OneToOne(() => User, (user) => user.candidate, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @OneToMany(
    () => JobPostCandidate,
    (jobPostCandidate) => jobPostCandidate.candidate
  )
  jobPostCandidates: JobPostCandidate[];
}
