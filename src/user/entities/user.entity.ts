import { Timestamp } from "../../config/entities/timestamp.entity";
import { UserRole } from "../../config/user/userRole";
import { Column, Entity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class User extends Timestamp {
  @ObjectIdColumn()
  _id: ObjectId;

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
}