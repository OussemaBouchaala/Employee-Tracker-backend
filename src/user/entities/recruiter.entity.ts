import {
  Column,
  ChildEntity, // Changed from Entity
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { JobPost } from "../../job-post/entities/jobPost.entity";
import { UserRole } from "../../config/user/userRole";
import { ApprovalStatus } from "../../config/user/recruiterStatus";

@ChildEntity(UserRole.RECRUITER) // Links to the 'RECRUITER' value in the User 'role' column
export class Recruiter extends User {
  // Shares id, name, email, and deletedAt from User/Timestamp

  @Column()
  companyName: string;

  @Column({
    type: "enum",
    enum: ApprovalStatus,
    default: ApprovalStatus.APPROVED,
  })
  approvalStatus: ApprovalStatus;

  @Column({ nullable: true })
  rejectionReason: string;

  @OneToMany(() => JobPost, (jobPost) => jobPost.recruiter)
  jobPosts: JobPost[];
}