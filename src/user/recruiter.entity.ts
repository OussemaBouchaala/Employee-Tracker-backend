import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Recruiter {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.recruiter, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
  @Column()
  companyName: string;
}