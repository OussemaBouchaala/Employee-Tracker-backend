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
<<<<<<< HEAD
  @PrimaryGeneratedColumn()
  id: number;
=======
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'string' })
  userId: ObjectId;
>>>>>>> b3da62f15fef423774970bb4662712549650f9b1

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
