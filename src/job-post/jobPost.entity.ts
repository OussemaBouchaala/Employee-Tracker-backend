
import { Timestamp } from "src/config/timestamp.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class jobPost extends Timestamp{
    @Column()
    companyName: string;
    @Column()
    requirements: string;
    @Column()
    industries: string;
    @Column()
    title: string;

}