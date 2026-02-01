import { Timestamp } from "../../config/entities/timestamp.entity";
import { UserRole } from "../../config/user/userRole";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance, // Added this
} from "typeorm";

@Entity()
// This tells TypeORM that other entities will 'join' this table
// The 'role' column will act as the "discriminator" to know which child type it is
@TableInheritance({ column: { type: "varchar", name: "role" } })
export class User extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null;

  @Column()
  password: string;

  @Column({ nullable: true })
  profilePictureUrl: string;

  // src/user/entities/user.entity.ts
  @Column({ type: 'varchar', nullable: true }) // use varchar in Postgres
  phoneNumber: string;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role: UserRole;

  // Note: We REMOVE the @OneToOne relations to Admin, Recruiter, and Candidate here.
  // In inheritance, a User doesn't "have" a Candidate; a Candidate "is" a User.
}