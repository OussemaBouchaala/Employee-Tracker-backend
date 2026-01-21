import { Column, Entity, ObjectIdColumn, ObjectId, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Admin {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column(() => String)
  userId: ObjectId;

  @OneToOne(() => User, (user) => user.admin)
  user: User;
}