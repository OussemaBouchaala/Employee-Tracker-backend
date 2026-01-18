import { Column, Entity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Admin {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column(() => String)
  userId: ObjectId;
}