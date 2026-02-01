import {
  Column,
  ChildEntity, // Changed from Entity
  OneToMany,
} from "typeorm";
import { JobPostCandidate } from "../../job-post/entities/jobPostCandidate.entity";
import { User } from "./user.entity";
import { UserRole } from "../../config/user/userRole";

@ChildEntity(UserRole.CANDIDATE) // This links it to the 'role' column in User
export class Candidate extends User { // Now extends User
  // No @PrimaryGeneratedColumn() here. It shares User's ID.

  @Column()
  cv: string;

  @Column()
  description: string;

  @OneToMany(
    () => JobPostCandidate,
    (jobPostCandidate) => jobPostCandidate.candidate
  )
  jobPostCandidates: JobPostCandidate[];
}