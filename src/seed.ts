
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Admin } from "./user/entities/admin.entity";
import { Recruiter } from "./user/entities/recruiter.entity";
import { Candidate } from "./user/entities/candidate.entity";
import { JobPost } from "./job-post/entities/jobPost.entity";
import { UserRole } from './config/user/userRole';


const AppDataSource = new DataSource({
    type: 'mongodb',
    url: 'mongodb+srv://helmipaty_db_user:GEcR9fLDB40KPY8Z@cluster0.kfxxzgd.mongodb.net/projettp',
    database: 'projettp',
    synchronize: true,
    logging: true,
    entities: [User, Admin, Recruiter, Candidate, JobPost],
});

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const userRepository = AppDataSource.getRepository(User);
        const adminRepository = AppDataSource.getRepository(Admin);
        const recruiterRepository = AppDataSource.getRepository(Recruiter);
        const candidateRepository = AppDataSource.getRepository(Candidate);
        const jobPostRepository = AppDataSource.getRepository(JobPost);

        // --- Seed Admin ---
        console.log('Seeding Admin...');
        const adminUser = new User();
        adminUser.name = 'Admin User';
        adminUser.email = 'admin@example.com';
        adminUser.password = 'password123';
        adminUser.role = UserRole.ADMIN;
        adminUser.phoneNumber = 1234567890;
        adminUser.profilePictureUrl = 'https://i.pravatar.cc/150?u=admin';
        await userRepository.save(adminUser);

        const admin = new Admin();
        admin.userId = adminUser._id;
        await adminRepository.save(admin);
        console.log('Admin seeded.');

        // --- Seed Recruiter 1 ---
        console.log('Seeding Recruiter 1...');
        const recruiterUser = new User();
        recruiterUser.name = 'Recruiter User';
        recruiterUser.email = 'recruiter@example.com';
        recruiterUser.password = 'password123';
        recruiterUser.role = UserRole.RECRUITER;
        recruiterUser.phoneNumber = 9876543210;
        recruiterUser.profilePictureUrl = 'https://i.pravatar.cc/150?u=recruiter';
        await userRepository.save(recruiterUser);

        const recruiter = new Recruiter();
        recruiter.userId = recruiterUser._id;
        recruiter.companyName = 'Tech Corp';
        await recruiterRepository.save(recruiter);
        console.log('Recruiter 1 seeded.');

        // --- Seed Recruiter 2 ---
        console.log('Seeding Recruiter 2...');
        const recruiterUser2 = new User();
        recruiterUser2.name = 'Jane Smith';
        recruiterUser2.email = 'jane.recruiter@example.com';
        recruiterUser2.password = 'password123';
        recruiterUser2.role = UserRole.RECRUITER;
        recruiterUser2.phoneNumber = 5551234567;
        recruiterUser2.profilePictureUrl = 'https://i.pravatar.cc/150?u=recruiter2';
        await userRepository.save(recruiterUser2);

        const recruiter2 = new Recruiter();
        recruiter2.userId = recruiterUser2._id;
        recruiter2.companyName = 'Innovation Labs';
        await recruiterRepository.save(recruiter2);
        console.log('Recruiter 2 seeded.');

        // --- Seed Candidate ---
        console.log('Seeding Candidate...');
        const candidateUser = new User();
        candidateUser.name = 'Candidate User';
        candidateUser.email = 'candidate@example.com';
        candidateUser.password = 'password123';
        candidateUser.role = UserRole.CANDIDATE;
        candidateUser.phoneNumber = 5555555555;
        candidateUser.profilePictureUrl = 'https://i.pravatar.cc/150?u=candidate';
        await userRepository.save(candidateUser);

        const candidate = new Candidate();
        candidate.userId = candidateUser._id;
        candidate.cv = 'http://example.com/cv.pdf';
        candidate.description = 'Experienced developer looking for a job.';
        await candidateRepository.save(candidate);
        console.log('Candidate seeded.');

        // --- Seed Job Posts ---
        console.log('Seeding Job Posts...');

        // Job Post 1 - From Recruiter 1
        const jobPost1 = new JobPost();
        jobPost1.title = 'Senior Full Stack Developer';
        jobPost1.companyName = 'Tech Corp';
        jobPost1.requirements = 'Bachelor\'s degree in Computer Science, 5+ years experience with React, Node.js, and MongoDB. Strong problem-solving skills.';
        jobPost1.industries = 'Technology, Software Development';
        jobPost1.recruiterId = recruiter._id;
        await jobPostRepository.save(jobPost1);

        // Job Post 2 - From Recruiter 1
        const jobPost2 = new JobPost();
        jobPost2.title = 'DevOps Engineer';
        jobPost2.companyName = 'Tech Corp';
        jobPost2.requirements = 'Experience with AWS, Docker, Kubernetes, CI/CD pipelines. 3+ years in DevOps role.';
        jobPost2.industries = 'Technology, Cloud Computing';
        jobPost2.recruiterId = recruiter._id;
        await jobPostRepository.save(jobPost2);

        // Job Post 3 - From Recruiter 2
        const jobPost3 = new JobPost();
        jobPost3.title = 'Frontend Developer';
        jobPost3.companyName = 'Innovation Labs';
        jobPost3.requirements = 'Expert knowledge of React, TypeScript, and modern CSS frameworks. 3+ years experience.';
        jobPost3.industries = 'Technology, UI/UX';
        jobPost3.recruiterId = recruiter2._id;
        await jobPostRepository.save(jobPost3);

        // Job Post 4 - From Recruiter 2
        const jobPost4 = new JobPost();
        jobPost4.title = 'Data Scientist';
        jobPost4.companyName = 'Innovation Labs';
        jobPost4.requirements = 'PhD or Master\'s in Data Science, Machine Learning, or related field. Experience with Python, TensorFlow, and big data technologies.';
        jobPost4.industries = 'Technology, AI/ML, Data Analytics';
        jobPost4.recruiterId = recruiter2._id;
        await jobPostRepository.save(jobPost4);

        // Job Post 5 - From Recruiter 1
        const jobPost5 = new JobPost();
        jobPost5.title = 'Product Manager';
        jobPost5.companyName = 'Tech Corp';
        jobPost5.requirements = 'MBA preferred, 5+ years in product management. Strong leadership and communication skills.';
        jobPost5.industries = 'Technology, Product Management';
        jobPost5.recruiterId = recruiter._id;
        await jobPostRepository.save(jobPost5);

        console.log('Job Posts seeded.');

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();
