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
  companyName: string;

  @OneToOne(() => User, (user) => user.recruiter, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @OneToMany(() => JobPost, (jobPost) => jobPost.recruiter)
  jobPosts: JobPost[];
}
