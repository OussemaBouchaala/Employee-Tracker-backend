import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { JobPost } from './entities/jobPost.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { Recruiter } from '../user/entities/recruiter.entity';
import { JobPostCandidate } from './entities/jobPostCandidate.entity';
import { Candidate } from '../user/entities/candidate.entity';

import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';
import { API_URL } from '../config/api/api_url';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class JobPostService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(JobPost)
        private jobPostRepository: Repository<JobPost>,
        @InjectRepository(Recruiter)
        private recruiterRepository: Repository<Recruiter>,
        @InjectRepository(JobPostCandidate)
        private jobPostCandidateRepository: Repository<JobPostCandidate>,
        @InjectRepository(Candidate)
        private candidateRepository: Repository<Candidate>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    testing_api(): Observable<JSON> {
        return this.httpService.get(API_URL.testingAPIURL).pipe(map(res => res.data));


    }
    find_candidates(jobPost: CreateJobPostDto, amount: number): Observable<JSON> {
        return this.httpService.post(API_URL.getCandidatesURL, { 'jobpost': jobPost, 'amount': amount }).pipe(map(res => res.data));;
    }

    async findAndCreateCandidateMatches(jobPostId: string, amount: number): Promise<JobPostCandidate[]> {
        console.log('findAndCreateCandidateMatches', jobPostId, amount);
        const jobPost = await this.jobPostRepository.findOne({
            where: { _id: new ObjectId(jobPostId) },
            relations: ['recruiter']
        });
        if (!jobPost) {
            throw new NotFoundException('Job Post not found');
        }
        console.log('jobPost', jobPost);

        const createJobPostDto: CreateJobPostDto = {
            title: jobPost.title,
            employmentType: jobPost.employmentType,
            requirements: jobPost.requirements,
            industries: jobPost.industries,
            jobFunction: jobPost.jobFunction,
            seniorityLevel: jobPost.seniorityLevel,
        };

        const aiResponse: any = await this.httpService.post(
            API_URL.getCandidatesURL,
            { 'jobpost': createJobPostDto, 'amount': amount }
        ).toPromise();

        const candidates = aiResponse.data;
        const createdMatches: JobPostCandidate[] = [];

        for (const candidateData of candidates) {
            console.log('Processing candidateData:', candidateData);

            // AI might return 'candidateId', 'userId', or '_id'. 
            // We need a valid hex string to create an ObjectId.
            const rawId = candidateData.userId || candidateData.candidateId || candidateData._id;

            if (!rawId || typeof rawId !== 'string' || rawId.length !== 24) {
                console.warn('Invalid or missing ID in candidateData:', rawId);
                continue;
            }

            const candidate = await this.candidateRepository.findOne({
                where: { userId: new ObjectId(rawId) }
            });

            if (candidate) {
                const existingMatch = await this.jobPostCandidateRepository.findOne({
                    where: {
                        jobPostId: jobPost._id,
                        candidateId: candidate._id
                    },
                });
                console.log("jobpost", jobPost);
                console.log("candidate", candidate);
                if (!existingMatch) {
                    const jobPostCandidate = this.jobPostCandidateRepository.create({
                        jobPostId: new ObjectId(jobPost._id),
                        candidateId: new ObjectId(candidate._id),
                        score: candidateData.similarity || 0,
                        jobPost,
                        candidate,
                    });
                    const saved = await this.jobPostCandidateRepository.save(jobPostCandidate);
                    createdMatches.push(saved);
                }
            }
        }

        return createdMatches;
    }
    async create(createJobPostDto: CreateJobPostDto, userId: string): Promise<JobPost> {
        const recruiter = await this.recruiterRepository.findOne({ where: { userId: new ObjectId(userId) } });
        if (!recruiter) {
            throw new NotFoundException('Recruiter not found');
        }
        const jobPost = this.jobPostRepository.create({
            ...createJobPostDto,
            recruiterId: recruiter._id,
        });
        return this.jobPostRepository.save(jobPost);
    }

    findAll(): Promise<JobPost[]> {
        return this.jobPostRepository.find({
            relations: ['recruiter', 'recruiter.user', 'jobPostCandidates'],
        });
    }

    async findOne(id: string): Promise<JobPost> {
        const jobPost = await this.jobPostRepository.findOne({
            where: { _id: new ObjectId(id) },
            relations: ['recruiter', 'recruiter.user', 'jobPostCandidates', 'jobPostCandidates.candidate', 'jobPostCandidates.candidate.user'],
        });
        if (!jobPost) {
            throw new NotFoundException('Job Post not found');
        }
        return jobPost;
    }

    async update(id: string, updateJobPostDto: UpdateJobPostDto): Promise<JobPost> {
        const jobPost = await this.findOne(id);
        Object.assign(jobPost, updateJobPostDto);
        return this.jobPostRepository.save(jobPost);
    }

    async remove(id: string): Promise<void> {
        const jobPost = await this.findOne(id);
        await this.jobPostRepository.remove(jobPost);
    }

    async addCandidateToJobPost(jobPostId: string, candidateId: string, score: number): Promise<JobPostCandidate> {
        const jobPost = await this.jobPostRepository.findOne({ where: { _id: new ObjectId(jobPostId) } });
        if (!jobPost) {
            throw new NotFoundException('Job Post not found');
        }

        const candidate = await this.candidateRepository.findOne({ where: { _id: new ObjectId(candidateId) } });
        if (!candidate) {
            throw new NotFoundException('Candidate not found');
        }

        const existingMatch = await this.jobPostCandidateRepository.findOne({
            where: {
                jobPostId: new ObjectId(jobPostId),
                candidateId: new ObjectId(candidateId)
            },
        });

        if (existingMatch) {
            console.log("existingMatch", existingMatch);
            throw new Error('Candidate is already matched to this job post');

        }

        console.log("candidate", candidate);
        const jobPostCandidate = this.jobPostCandidateRepository.create({
            jobPostId: jobPost._id,
            candidateId: candidate._id,
            score,
            jobPost,
            candidate,
        });

        return this.jobPostCandidateRepository.save(jobPostCandidate);
    }

    async getCandidatesForJobPost(jobPostId: string): Promise<JobPostCandidate[]> {
        // 1. Fetch matches for the specific job post
        const matches = await this.jobPostCandidateRepository.find({
            where: { jobPostId: new ObjectId(jobPostId) },
        });

        // 2. Fetch User repository manually since we need to cross-check userId
        const userRepository = this.candidateRepository.manager.getRepository(User);

        // 3. Iterate matches and manually hydrate relationships
        for (const match of matches) {
            // Ensure candidateId is treated as ObjectId
            const candidateId = match.candidateId;

            if (candidateId) {
                // Fetch Candidate
                const candidate = await this.candidateRepository.findOne({
                    where: { _id: new ObjectId(candidateId) }
                });

                if (candidate) {
                    // Fetch associated User profile
                    if (candidate.userId) {
                        const user = await userRepository.findOne({
                            where: { _id: new ObjectId(candidate.userId) }
                        });

                        if (user) {
                            // Assign user to candidate (even if not strictly typed on entity, it helps frontend)
                            // We construct a safe object to avoid circular ref issues if sensitive
                            const { password, ...safeUser } = user;
                            (candidate as any).user = safeUser;
                        }
                    }
                    match.candidate = candidate;
                }
            }
        }

        return matches;
    }

    async getJobPostsForCandidate(candidateId: string): Promise<JobPostCandidate[]> {
        return this.jobPostCandidateRepository.find({
            where: { candidateId: new ObjectId(candidateId) },
            relations: ['jobPost', 'jobPost.recruiter', 'jobPost.recruiter.user'],
        });
    }
}
