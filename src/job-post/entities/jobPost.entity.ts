import { Timestamp } from "../../config/entities/timestamp.entity";
import { Column, Entity, ObjectIdColumn, ObjectId, OneToMany, ManyToOne } from "typeorm";
import { JobPostCandidate } from "./jobPostCandidate.entity";
import { Recruiter } from "../../user/entities/recruiter.entity";

@Entity()
export class JobPost extends Timestamp {
    @ObjectIdColumn()
    _id: ObjectId;

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

    @Column({ default: null })
    approvalStatus: 'pending' | 'approved' | 'rejected' | null;

    @Column({ nullable: true })
    rejectionReason: string;

    @Column(() => String)
    recruiterId: ObjectId;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobPosts)
  recruiter: Recruiter;

  @OneToMany(() => JobPostCandidate, (jobPostCandidate) => jobPostCandidate.jobPost)
  jobPostCandidates: JobPostCandidate[];
}