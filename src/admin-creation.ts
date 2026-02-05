
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Admin } from "./user/entities/admin.entity";
import { Recruiter } from "./user/entities/recruiter.entity";
import { Candidate } from "./user/entities/candidate.entity";
import { JobPost } from "./job-post/entities/jobPost.entity";
import { JobPostCandidate } from "./job-post/entities/jobPostCandidate.entity";
//import { Notification } from "./notification/entities/notification.entity";
import { UserRole } from "./config/user/userRole";
import * as bcrypt from 'bcrypt';
import { dbConfig } from "./config/db/database.config";

const AppDataSource = new DataSource({
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: true,
    synchronize: true,
    logging: true,
    entities: [User, Admin, Recruiter, Candidate, JobPost, JobPostCandidate],
});

async function createAdmin() {
    try {
        console.log('Connecting to database...');
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const userRepository = AppDataSource.getRepository(User);
        const adminRepository = AppDataSource.getRepository(Admin);

        const email = 'admin@example.com';
        const rawPassword = 'password123';

        // Check if user exists
        const existingUser = await userRepository.findOne({ where: { email: email } });

        if (existingUser) {
            console.log('--------------------------------------------------');
            console.log('User already exists!');
            console.log(`Email: ${email}`);
            console.log(`Password: (Current password unknown)`);
            console.log('--------------------------------------------------');
            return;
        }

        console.log('Creating Admin User...');

        // Hash the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        const admin = new Admin();
        admin.name = 'Admin';
        admin.email = email;
        admin.password = hashedPassword;
        admin.role = UserRole.ADMIN;
        admin.phoneNumber = '12245678';
        admin.profilePictureUrl = 'https://i.pravatar.cc/150?u=admin_dummy';
        admin.verifiedAt = new Date(); // Automatically verify the user
        admin.verificationToken = null;

        await adminRepository.save(admin);

        console.log('--------------------------------------------------');
        console.log('Admin User Created Successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${rawPassword}`);
        console.log('--------------------------------------------------');

    } catch (err) {
        console.error('Error during admin creation:', err);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

createAdmin();