import { Column, Entity, ObjectIdColumn, ObjectId, OneToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { JobPost } from "../../job-post/entities/jobPost.entity";

@Entity()
export class Recruiter {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'string' })
  userId: ObjectId;

  @Column()
  companyName: string;

  @OneToOne(() => User, (user) => user.recruiter)
  user: User;

  @OneToMany(() => JobPost, (jobPost) => jobPost.recruiter)
  jobPosts: JobPost[];
}