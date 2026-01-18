import { Timestamp } from "../../config/entities/timestamp.entity";
import { Column, Entity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class JobPost extends Timestamp {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    companyName: string;

    @Column()
    requirements: string;

    @Column()
    industries: string;

    @Column()
    title: string;

    @Column(() => String)
    recruiterId: ObjectId;
}