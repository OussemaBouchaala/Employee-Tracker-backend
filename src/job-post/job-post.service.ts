import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/jobPost.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { Recruiter } from '../user/entities/recruiter.entity';
import { JobPostCandidate } from './entities/jobPostCandidate.entity';
import { Candidate } from '../user/entities/candidate.entity';
import { HttpService } from '@nestjs/axios';
import { map, Observable, lastValueFrom } from 'rxjs';
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
  ) {}

  // --- API / AI Helpers ---

  testing_api(): Observable<JSON> {
    return this.httpService.get(API_URL.testingAPIURL).pipe(map((res) => res.data)) as Observable<JSON>;
  }

  find_candidates(jobPost: CreateJobPostDto, amount: number): Observable<JSON> {
    return this.httpService
      .post(API_URL.getCandidatesURL, { jobpost: jobPost, amount: amount })
      .pipe(map((res) => res.data)) as Observable<JSON>;
  }

  // --- Matching Logic ---

  async findAndCreateCandidateMatches(jobPostId: string, amount: number): Promise<JobPostCandidate[]> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: Number(jobPostId) },
      relations: ['recruiter'], // recruiter already includes user data via inheritance
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

    // Using lastValueFrom for modern async/await handling of Observables
    const aiResponse = await lastValueFrom(
      this.httpService.post(API_URL.getCandidatesURL, {
        jobpost: createJobPostDto,
        amount: amount,
      }),
    );

    const candidatesData = aiResponse.data;
    const createdMatches: JobPostCandidate[] = [];

    for (const data of candidatesData) {
      const candidateId = Number(data.candidateId || data._id);
      const candidate = await this.candidateRepository.findOneBy({ id: candidateId });

      if (candidate) {
        const existingMatch = await this.jobPostCandidateRepository.findOne({
          where: {
            jobPost: { id: jobPost.id },
            candidate: { id: candidate.id },
          },
        });

        if (!existingMatch) {
          const jobPostCandidate = this.jobPostCandidateRepository.create({
            score: data.score || 0,
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

  // --- CRUD Operations ---

  async create(createJobPostDto: CreateJobPostDto, userId: string): Promise<JobPost> {
    // In Inheritance, the Recruiter's ID is the User's ID
    const recruiter = await this.recruiterRepository.findOneBy({ id: Number(userId) });

    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    const jobPost = this.jobPostRepository.create({
      ...createJobPostDto,
      recruiter,
    });
    return this.jobPostRepository.save(jobPost);
  }

  findAll(userId: string): Promise<JobPost[]> {
    return this.jobPostRepository.find({
      where: { recruiter: { id: Number(userId) } },
      relations: ['recruiter', 'jobPostCandidates'],
    });
  }

  async findOne(id: string): Promise<JobPost> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: Number(id) },
      relations: ['recruiter', 'jobPostCandidates', 'jobPostCandidates.candidate'],
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
    await this.jobPostRepository.softRemove(jobPost);
  }

  // --- Relationship Management ---

  async addCandidateToJobPost(jobPostId: string, candidateId: string, score: number): Promise<JobPostCandidate> {
    const jobPost = await this.jobPostRepository.findOneBy({ id: Number(jobPostId) });
    if (!jobPost) throw new NotFoundException('Job Post not found');

    const candidate = await this.candidateRepository.findOneBy({ id: Number(candidateId) });
    if (!candidate) throw new NotFoundException('Candidate not found');

    const existingMatch = await this.jobPostCandidateRepository.findOneBy({
      jobPost: { id: jobPost.id },
      candidate: { id: candidate.id },
    });

    if (existingMatch) {
      throw new Error('Candidate is already matched to this job post');
    }

    const jobPostCandidate = this.jobPostCandidateRepository.create({
      score,
      jobPost,
      candidate,
    });

    return this.jobPostCandidateRepository.save(jobPostCandidate);
  }

  async getCandidatesForJobPost(jobPostId: string): Promise<JobPostCandidate[]> {
    return this.jobPostCandidateRepository.find({
      where: { jobPost: { id: Number(jobPostId) } },
      relations: ['candidate'], // candidate now naturally contains User fields
    });
  }

  async getJobPostsForCandidate(candidateId: string): Promise<JobPostCandidate[]> {
    return this.jobPostCandidateRepository.find({
      where: { candidate: { id: Number(candidateId) } },
      relations: ['jobPost', 'jobPost.recruiter'],
    });
  }
}