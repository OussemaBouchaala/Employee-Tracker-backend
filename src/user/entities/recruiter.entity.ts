import { Column, Entity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Recruiter {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column(() => String)
  userId: ObjectId;

  @Column()
  companyName: string;
}