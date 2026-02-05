import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Admin } from "./user/entities/admin.entity";
import { Recruiter } from "./user/entities/recruiter.entity";
import { Candidate } from "./user/entities/candidate.entity";
import { JobPost } from "./job-post/entities/jobPost.entity";
import { JobPostCandidate } from "./job-post/entities/jobPostCandidate.entity";
import { UserRole } from './config/user/userRole';
import { dbConfig } from './config/db/database.config';
import { ApprovalStatus } from "./config/user/recruiterStatus";

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

        const adminRepository = AppDataSource.getRepository(Admin);
        const recruiterRepository = AppDataSource.getRepository(Recruiter);
        const candidateRepository = AppDataSource.getRepository(Candidate);
        const jobPostRepository = AppDataSource.getRepository(JobPost);
        const jobPostCandidateRepository = AppDataSource.getRepository(JobPostCandidate);

        // --- Seed Admin ---
        console.log('Seeding Admin...');
        const admin = new Admin();
        admin.name = 'Admin User';
        admin.email = 'admin@example.com';
        admin.password = 'password123';
        admin.role = UserRole.ADMIN;
        admin.phoneNumber = '1234567890';
        admin.profilePictureUrl = 'https://i.pravatar.cc/150?u=admin';
        await adminRepository.save(admin);

        // --- Seed Recruiter 1 ---
        console.log('Seeding Recruiter 1...');
        const recruiter1 = new Recruiter();
        recruiter1.name = 'Recruiter User';
        recruiter1.email = 'recruiter@example.com';
        recruiter1.password = 'password123';
        recruiter1.role = UserRole.RECRUITER;
        recruiter1.phoneNumber = '21454862';
        recruiter1.companyName = 'Tech Corp';
        recruiter1.approvalStatus = ApprovalStatus.APPROVED;
        const savedRecruiter1 = await recruiterRepository.save(recruiter1);

        // --- Seed Recruiter 2 ---
        console.log('Seeding Recruiter 2...');
        const recruiter2 = new Recruiter();
        recruiter2.name = 'Jane Smith';
        recruiter2.email = 'jane.recruiter@example.com';
        recruiter2.password = 'password123';
        recruiter2.role = UserRole.RECRUITER;
        recruiter2.phoneNumber = '55245654';
        recruiter2.companyName = 'Innovation Labs';
        recruiter2.approvalStatus = ApprovalStatus.APPROVED;
        const savedRecruiter2 = await recruiterRepository.save(recruiter2);

        // --- Seed Candidate ---
        console.log('Seeding Candidate...');
        const candidate = new Candidate();
        candidate.name = 'Candidate User';
        candidate.email = 'candidate@example.com';
        candidate.password = 'password123';
        candidate.role = UserRole.CANDIDATE;
        candidate.phoneNumber = '55555555';
        candidate.cv = 'http://example.com/cv.pdf';
        candidate.description = 'Experienced developer looking for a job.';
        const savedCandidate = await candidateRepository.save(candidate);

        // --- Seed Job Posts ---
        console.log('Seeding Job Posts...');
        const jp1 = new JobPost();
        jp1.title = 'Senior Full Stack Developer';
        jp1.employmentType = 'Full-time';
        jp1.requirements = 'React, Node.js, MongoDB expert.';
        jp1.industries = 'Technology';
        jp1.jobFunction = 'Software Engineering';
        jp1.seniorityLevel = 'Senior';
        jp1.recruiter = savedRecruiter1;

        const jp2 = new JobPost();
        jp2.title = 'Frontend Developer';
        jp2.employmentType = 'Full-time';
        jp2.requirements = 'React, TypeScript expert.';
        jp2.industries = 'Technology';
        jp2.jobFunction = 'Frontend Engineering';
        jp2.seniorityLevel = 'Mid-Senior';
        jp2.recruiter = savedRecruiter2;

        const savedJobs = await jobPostRepository.save([jp1, jp2]);

        // --- Seed Job Post Candidates ---
        console.log('Seeding Job Post Candidates...');
        const jpc1 = new JobPostCandidate();
        jpc1.score = 85;
        jpc1.jobPost = savedJobs[0];
        jpc1.candidate = savedCandidate;

        const jpc2 = new JobPostCandidate();
        jpc2.score = 92;
        jpc2.jobPost = savedJobs[1];
        jpc2.candidate = savedCandidate;

        await jobPostCandidateRepository.save([jpc1, jpc2]);

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();
