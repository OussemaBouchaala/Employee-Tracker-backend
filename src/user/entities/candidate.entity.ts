import { Column, Entity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Candidate {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column(() => String)
  userId: ObjectId;

  @Column()
  cv: string;

  @Column()
  description: string;
}