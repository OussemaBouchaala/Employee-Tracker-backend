
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Admin } from "./user/entities/admin.entity";
import { Recruiter } from "./user/entities/recruiter.entity";
import { Candidate } from "./user/entities/candidate.entity";
import { JobPost } from "./job-post/entities/jobPost.entity";
import { JobPostCandidate } from "./job-post/entities/jobPostCandidate.entity";
import { Notification } from "./notification/entities/notification.entity";
import { UserRole } from "./config/user/userRole";
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
    type: 'mongodb',
    url: 'mongodb+srv://helmipaty_db_user:GEcR9fLDB40KPY8Z@cluster0.kfxxzgd.mongodb.net/projettp',
    database: 'projettp',
    synchronize: true,
    logging: true,
    entities: [User, Admin, Recruiter, Candidate, JobPost, JobPostCandidate, Notification],
});

async function createAdmin() {
    try {
        console.log('Connecting to database...');
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const userRepository = AppDataSource.getRepository(User);
        const adminRepository = AppDataSource.getRepository(Admin);

        const email = 'dummy_admin@example.com';
        const rawPassword = 'adminPassword123!';

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

        const adminUser = new User();
        adminUser.name = 'Dummy Admin';
        adminUser.email = email;
        adminUser.password = hashedPassword;
        adminUser.role = UserRole.ADMIN;
        adminUser.phoneNumber = 1234567890;
        adminUser.profilePictureUrl = 'https://i.pravatar.cc/150?u=admin_dummy';
        adminUser.verifiedAt = new Date(); // Automatically verify the user
        adminUser.verificationToken = null;

        await userRepository.save(adminUser);

        // Create Admin Entity
        const admin = new Admin();
        admin.userId = adminUser._id;
        admin.user = adminUser;
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
