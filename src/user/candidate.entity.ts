import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { OneToOne } from "typeorm/browser";

@Entity()
export class Candidate  {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    cv:string;
    @Column()
    description:string;
    @OneToOne(() => User, user => user.candidate, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}