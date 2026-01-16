import { Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { OneToOne } from "typeorm/browser";

@Entity()
export class Admin  {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => User, user => user.admin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}