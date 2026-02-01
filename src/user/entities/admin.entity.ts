import { ChildEntity } from "typeorm";
import { User } from "./user.entity";
import { UserRole } from "../../config/user/userRole";

@ChildEntity(UserRole.ADMIN) // Links to the 'ADMIN' value in the User 'role' column
export class Admin extends User {
  // No @PrimaryGeneratedColumn() needed.
  // Admin now possesses all User fields: id, name, email, password, etc.
  
  // You can add Admin-specific columns here in the future, 
  // e.g., @Column({ default: 0 }) permissionsLevel: number;
}