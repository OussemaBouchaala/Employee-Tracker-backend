import { Timestamp } from "../../config/entities/timestamp.entity";
import { UserRole } from "../../config/user/userRole";
import { Column, Entity, PrimaryGeneratedColumn, ObjectId, OneToOne } from "typeorm";
import { Admin } from "./admin.entity";
import { Recruiter } from "./recruiter.entity";
import { Candidate } from "./candidate.entity";

@Entity()
export class User extends Timestamp {
  @PrimaryGeneratedColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  verifiedAt: Date | null;

  @Column({ nullable: true })
  verificationToken: string | null;

  @Column()
  password: string;

  @Column()
  profilePictureUrl: string;

  @Column()
  phoneNumber: number;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;

  @OneToOne(() => Recruiter, (recruiter) => recruiter.user)
  recruiter: Recruiter;

  @OneToOne(() => Candidate, (candidate) => candidate.user)
  candidate: Candidate;
}