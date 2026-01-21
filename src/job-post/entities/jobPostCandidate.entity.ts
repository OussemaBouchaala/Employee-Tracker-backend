import { Column, Entity, ManyToOne, ObjectId, ObjectIdColumn } from "typeorm";
import { Timestamp } from "../../config/entities/timestamp.entity";
import { JobPost } from "./jobPost.entity";
import { Candidate } from "../../user/entities/candidate.entity";

@Entity()
export class JobPostCandidate extends Timestamp {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column(() => String)
  jobPostId: ObjectId;

  @Column(() => String)
  candidateId: ObjectId;

  @Column()
  score: number;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.jobPostCandidates)
  jobPost: JobPost;

  @ManyToOne(() => Candidate, (candidate) => candidate.jobPostCandidates)
  candidate: Candidate;
}
