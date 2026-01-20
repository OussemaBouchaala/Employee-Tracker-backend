import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { JobPost } from './entities/jobPost.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { Recruiter } from '../user/entities/recruiter.entity';

import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';
import { FindCandidateDto } from './dto/find-candidate.dto';
import { API_URL } from '../config/api/api_url';
@Injectable()
export class JobPostService {
     
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(JobPost)
        private jobPostRepository: Repository<JobPost>,
        @InjectRepository(Recruiter)
        private recruiterRepository: Repository<Recruiter>,
    ) { }
 testing_api():Observable<JSON> {
    return this.httpService.get(API_URL.testingAPIURL).pipe(map(res => res.data));;
  
    
  }
   find_candidates(jobPost:FindCandidateDto,amount:number):Observable<JSON> {
    return this.httpService.post(API_URL.getCandidatesURL, {'jobpost': jobPost, 'amount': amount }).pipe(map(res => res.data));;
  
    
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
        return this.jobPostRepository.find();
    }

    async findOne(id: string): Promise<JobPost> {
        const jobPost = await this.jobPostRepository.findOne({ where: { _id: new ObjectId(id) } as any });
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
}
