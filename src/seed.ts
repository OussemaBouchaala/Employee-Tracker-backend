
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Admin } from "./user/entities/admin.entity";
import { Recruiter } from "./user/entities/recruiter.entity";
import { Candidate } from "./user/entities/candidate.entity";
import { JobPost } from "./job-post/entities/jobPost.entity";
import { JobPostCandidate } from "./job-post/entities/jobPostCandidate.entity";
import { UserRole } from './config/user/userRole';
import { dbConfig } from './config/db/database.config';


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

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const userRepository = AppDataSource.getRepository(User);
        const adminRepository = AppDataSource.getRepository(Admin);
        const recruiterRepository = AppDataSource.getRepository(Recruiter);
        const candidateRepository = AppDataSource.getRepository(Candidate);
        const jobPostRepository = AppDataSource.getRepository(JobPost);
        const jobPostCandidateRepository = AppDataSource.getRepository(JobPostCandidate);

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
        admin.user = adminUser;
        await adminRepository.save(admin);
        console.log('Admin seeded.');

        // --- Seed Recruiter 1 ---
        console.log('Seeding Recruiter 1...');
        const recruiterUser = new User();
        recruiterUser.name = 'Recruiter User';
        recruiterUser.email = 'recruiter@example.com';
        recruiterUser.password = 'password123';
        recruiterUser.role = UserRole.RECRUITER;
        recruiterUser.phoneNumber = 21454862;
        recruiterUser.profilePictureUrl = 'https://i.pravatar.cc/150?u=recruiter';
        await userRepository.save(recruiterUser);

        const recruiter = new Recruiter();
        recruiter.companyName = 'Tech Corp';
        recruiter.user = recruiterUser;
        await recruiterRepository.save(recruiter);
        console.log('Recruiter 1 seeded.');

        // --- Seed Recruiter 2 ---
        console.log('Seeding Recruiter 2...');
        const recruiterUser2 = new User();
        recruiterUser2.name = 'Jane Smith';
        recruiterUser2.email = 'jane.recruiter@example.com';
        recruiterUser2.password = 'password123';
        recruiterUser2.role = UserRole.RECRUITER;
        recruiterUser2.phoneNumber = 55245654;
        recruiterUser2.profilePictureUrl = 'https://i.pravatar.cc/150?u=recruiter2';
        await userRepository.save(recruiterUser2);

        const recruiter2 = new Recruiter();
        recruiter2.companyName = 'Innovation Labs';
        recruiter2.user = recruiterUser2;
        await recruiterRepository.save(recruiter2);
        console.log('Recruiter 2 seeded.');

        // --- Seed Candidate ---
        console.log('Seeding Candidate...');
        const candidateUser = new User();
        candidateUser.name = 'Candidate User';
        candidateUser.email = 'candidate@example.com';
        candidateUser.password = 'password123';
        candidateUser.role = UserRole.CANDIDATE;
        candidateUser.phoneNumber = 55555555;
        candidateUser.profilePictureUrl = 'https://i.pravatar.cc/150?u=candidate';
        await userRepository.save(candidateUser);

        const candidate = new Candidate();
        candidate.cv = 'http://example.com/cv.pdf';
        candidate.description = 'Experienced developer looking for a job.';
        candidate.user = candidateUser;
        await candidateRepository.save(candidate);
        console.log('Candidate seeded.');

        // --- Seed Job Posts ---
        console.log('Seeding Job Posts...');

        // Job Post 1 - From Recruiter 1
        const jobPost1 = new JobPost();
        jobPost1.title = 'Senior Full Stack Developer';
        jobPost1.employmentType = 'Full-time';
        jobPost1.requirements = 'Bachelor\'s degree in Computer Science, 5+ years experience with React, Node.js, and MongoDB. Strong problem-solving skills.';
        jobPost1.industries = 'Technology, Software Development';
        jobPost1.jobFunction = 'Software Engineering';
        jobPost1.seniorityLevel = 'Senior';
        jobPost1.recruiter = recruiter;
        await jobPostRepository.save(jobPost1);

        // Job Post 2 - From Recruiter 1
        const jobPost2 = new JobPost();
        jobPost2.title = 'DevOps Engineer';
        jobPost2.employmentType = 'Full-time';
        jobPost2.requirements = 'Experience with AWS, Docker, Kubernetes, CI/CD pipelines. 3+ years in DevOps role.';
        jobPost2.industries = 'Technology, Cloud Computing';
        jobPost2.jobFunction = 'DevOps';
        jobPost2.seniorityLevel = 'Mid-Senior';
        jobPost2.recruiter = recruiter;
        await jobPostRepository.save(jobPost2);

        // Job Post 3 - From Recruiter 2
        const jobPost3 = new JobPost();
        jobPost3.title = 'Frontend Developer';
        jobPost3.employmentType = 'Full-time';
        jobPost3.requirements = 'Expert knowledge of React, TypeScript, and modern CSS frameworks. 3+ years experience.';
        jobPost3.industries = 'Technology, UI/UX';
        jobPost3.jobFunction = 'Frontend Engineering';
        jobPost3.seniorityLevel = 'Mid-Senior';
        jobPost3.recruiter = recruiter2;
        await jobPostRepository.save(jobPost3);

        // Job Post 4 - From Recruiter 2
        const jobPost4 = new JobPost();
        jobPost4.title = 'Data Scientist';
        jobPost4.employmentType = 'Full-time';
        jobPost4.requirements = 'PhD or Master\'s in Data Science, Machine Learning, or related field. Experience with Python, TensorFlow, and big data technologies.';
        jobPost4.industries = 'Technology, AI/ML, Data Analytics';
        jobPost4.jobFunction = 'Data Science';
        jobPost4.seniorityLevel = 'Senior';
        jobPost4.recruiter = recruiter2;
        await jobPostRepository.save(jobPost4);

        // Job Post 5 - From Recruiter 1
        const jobPost5 = new JobPost();
        jobPost5.title = 'Product Manager';
        jobPost5.employmentType = 'Full-time';
        jobPost5.requirements = 'MBA preferred, 5+ years in product management. Strong leadership and communication skills.';
        jobPost5.industries = 'Technology, Product Management';
        jobPost5.jobFunction = 'Product Management';
        jobPost5.seniorityLevel = 'Senior';
        jobPost5.recruiter = recruiter;
        await jobPostRepository.save(jobPost5);

        console.log('Job Posts seeded.');

        // --- Seed Job Post Candidates (Applications) ---
        console.log('Seeding Job Post Candidates...');

        const jobPostCandidate1 = new JobPostCandidate();
        jobPostCandidate1.score = 85;
        jobPostCandidate1.jobPost = jobPost1;
        jobPostCandidate1.candidate = candidate;
        await jobPostCandidateRepository.save(jobPostCandidate1);

        const jobPostCandidate2 = new JobPostCandidate();
        jobPostCandidate2.score = 92;
        jobPostCandidate2.jobPost = jobPost3;
        jobPostCandidate2.candidate = candidate;
        await jobPostCandidateRepository.save(jobPostCandidate2);

        const jobPostCandidate3 = new JobPostCandidate();
        jobPostCandidate3.score = 78;
        jobPostCandidate3.jobPost = jobPost5;
        jobPostCandidate3.candidate = candidate;
        await jobPostCandidateRepository.save(jobPostCandidate3);

        console.log('Job Post Candidates seeded.');

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();
