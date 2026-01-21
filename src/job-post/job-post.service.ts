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
    ) { }
 testing_api():Observable<JSON> {
    return this.httpService.get(API_URL.testingAPIURL).pipe(map(res => res.data));
  
    
  }
   find_candidates(jobPost:CreateJobPostDto,amount:number):Observable<JSON> {
    return this.httpService.post(API_URL.getCandidatesURL, {'jobpost': jobPost, 'amount': amount }).pipe(map(res => res.data));;
  }

  async findAndCreateCandidateMatches(jobPostId: string, amount: number): Promise<JobPostCandidate[]> {
    const jobPost = await this.jobPostRepository.findOne({ 
        where: { _id: new ObjectId(jobPostId) } as any,
        relations: ['recruiter']
    });
    if (!jobPost) {
        throw new NotFoundException('Job Post not found');
    }

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
        {'jobpost': createJobPostDto, 'amount': amount }
    ).toPromise();

    const candidates = aiResponse.data;
    const createdMatches: JobPostCandidate[] = [];

    for (const candidateData of candidates) {
        const candidate = await this.candidateRepository.findOne({ 
            where: { _id: new ObjectId(candidateData.candidateId || candidateData._id) } as any 
        });
        
        if (candidate) {
            const existingMatch = await this.jobPostCandidateRepository.findOne({
                where: { 
                    jobPostId: jobPost._id,
                    candidateId: candidate._id
                } as any,
            });

            if (!existingMatch) {
                const jobPostCandidate = this.jobPostCandidateRepository.create({
                    jobPostId: jobPost._id,
                    candidateId: candidate._id,
                    score: candidateData.score || 0,
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
    async create(createJobPostDto: CreateJobPostDto, userId:string): Promise<JobPost> {
        const recruiter = await this.recruiterRepository.findOne({ where: { userId: new ObjectId(userId) } as any });
        if (!recruiter) {
            throw new NotFoundException('Recruiter not found');
        }
        const jobPost = this.jobPostRepository.create({
            ...createJobPostDto,
            recruiterId: recruiter._id,
        });
        return this.jobPostRepository.save(jobPost);
    }

    async findAll(): Promise<JobPost[]> {
        return this.jobPostRepository.find({
            relations: ['recruiter', 'recruiter.user', 'jobPostCandidates'],
        });
    }

    async findOne(id: string): Promise<JobPost> {
        const jobPost = await this.jobPostRepository.findOne({ 
            where: { _id: new ObjectId(id) } as any,
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
        const jobPost = await this.jobPostRepository.findOne({ where: { _id: new ObjectId(jobPostId) } as any });
        if (!jobPost) {
            throw new NotFoundException('Job Post not found');
        }

        const candidate = await this.candidateRepository.findOne({ where: { _id: new ObjectId(candidateId) } as any });
        if (!candidate) {
            throw new NotFoundException('Candidate not found');
        }

        const existingMatch = await this.jobPostCandidateRepository.findOne({
            where: { 
                jobPostId: new ObjectId(jobPostId),
                candidateId: new ObjectId(candidateId)
            } as any,
        });

        if (existingMatch) {
            throw new Error('Candidate is already matched to this job post');
        }

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
        // Use MongoDB native query to get all fields
        const collection = this.jobPostCandidateRepository.manager.connection.getMongoRepository(JobPostCandidate);
        const matches = await collection.find({
            where: { jobPostId: new ObjectId(jobPostId) } as any,
        });

        // Manually load candidate relationships for MongoDB
        const userRepository = this.candidateRepository.manager.getRepository('User');
        
        for (const match of matches) {
            if (match.candidateId) {
                const candidate = await this.candidateRepository.findOne({
                    where: { _id: new ObjectId(match.candidateId) } as any,
                });
                if (candidate) {
                    const user = await userRepository.findOne({
                        where: { _id: new ObjectId(candidate.userId) } as any,
                    });
                    if (user) {
                        (candidate as any).user = user;
                    }
                    match.candidate = candidate;
                }
            }
        }

        return matches;
    }

    async getJobPostsForCandidate(candidateId: string): Promise<JobPostCandidate[]> {
        return this.jobPostCandidateRepository.find({
            where: { candidateId: new ObjectId(candidateId) } as any,
            relations: ['jobPost', 'jobPost.recruiter', 'jobPost.recruiter.user'],
        });
    }
}
