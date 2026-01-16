import { Timestamp } from "src/config/timestamp.entity";
import { UserRole } from "src/config/user/userRole";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OneToOne } from "typeorm/browser";
import { Candidate } from "./candidate.entity";
import { Recruiter } from "./recruiter.entity";
import { Admin } from "./admin.entity";
@Entity()
export abstract class User extends Timestamp {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    profilePictureUrl: string;
    @Column()
    phoneNumber: number;
      @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
@OneToOne(() => Admin, admin => admin.user)
  admin?: Admin;

  @OneToOne(() => Recruiter, recruiter => recruiter.user)
  recruiter?: Recruiter;

  @OneToOne(() => Candidate, candidate => candidate.user)
  candidate?: Candidate;

 
}