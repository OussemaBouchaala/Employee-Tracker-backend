import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { JobPostService } from './job-post.service';
import { JobPost } from './entities/jobPost.entity';
import { Recruiter } from '../user/entities/recruiter.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';

describe('JobPostService', () => {
    let service: JobPostService;
    let jobPostRepository: Repository<JobPost>;
    let recruiterRepository: Repository<Recruiter>;

    const mockJobPostRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    const mockRecruiterRepository = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobPostService,
                {
                    provide: getRepositoryToken(JobPost),
                    useValue: mockJobPostRepository,
                },
                {
                    provide: getRepositoryToken(Recruiter),
                    useValue: mockRecruiterRepository,
                },
            ],
        }).compile();

        service = module.get<JobPostService>(JobPostService);
        jobPostRepository = module.get<Repository<JobPost>>(getRepositoryToken(JobPost));
        recruiterRepository = module.get<Repository<Recruiter>>(getRepositoryToken(Recruiter));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new job post successfully', async () => {
            const recruiterId = new ObjectId().toString();
            const recruiterObjectId = new ObjectId();
            const createJobPostDto: CreateJobPostDto = {
                title: 'Senior Developer',
                companyName: 'Tech Corp',
                requirements: 'Experience with Node.js',
                industries: 'Technology',
            };

            const mockRecruiter = {
                _id: recruiterObjectId,
                userId: new ObjectId(),
                companyName: 'Tech Corp',
            };

            const mockJobPost = {
                _id: new ObjectId(),
                ...createJobPostDto,
                recruiterId: recruiterObjectId,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockRecruiterRepository.findOne.mockResolvedValue(mockRecruiter);
            mockJobPostRepository.create.mockReturnValue(mockJobPost);
            mockJobPostRepository.save.mockResolvedValue(mockJobPost);

            const result = await service.create(createJobPostDto, recruiterId);

            expect(recruiterRepository.findOne).toHaveBeenCalledWith({
                where: { userId: expect.any(ObjectId) } as any,
            });
            expect(jobPostRepository.create).toHaveBeenCalledWith({
                ...createJobPostDto,
                recruiterId: recruiterObjectId,
            });
            expect(jobPostRepository.save).toHaveBeenCalledWith(mockJobPost);
            expect(result).toEqual(mockJobPost);
        });

        it('should throw NotFoundException if recruiter not found', async () => {
            const recruiterId = new ObjectId().toString();
            const createJobPostDto: CreateJobPostDto = {
                title: 'Senior Developer',
                companyName: 'Tech Corp',
                requirements: 'Experience with Node.js',
                industries: 'Technology',
            };

            mockRecruiterRepository.findOne.mockResolvedValue(null);

            await expect(service.create(createJobPostDto, recruiterId)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.create(createJobPostDto, recruiterId)).rejects.toThrow(
                'Recruiter not found',
            );
        });
    });

    describe('findAll', () => {
        it('should return an array of job posts', async () => {
            const mockJobPosts = [
                {
                    _id: new ObjectId(),
                    title: 'Job 1',
                    companyName: 'Company 1',
                    requirements: 'Requirements 1',
                    industries: 'Industry 1',
                    recruiterId: new ObjectId(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
                {
                    _id: new ObjectId(),
                    title: 'Job 2',
                    companyName: 'Company 2',
                    requirements: 'Requirements 2',
                    industries: 'Industry 2',
                    recruiterId: new ObjectId(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ];

            mockJobPostRepository.find.mockResolvedValue(mockJobPosts);

            const result = await service.findAll();

            expect(jobPostRepository.find).toHaveBeenCalled();
            expect(result).toEqual(mockJobPosts);
            expect(result).toHaveLength(2);
        });

        it('should return an empty array if no job posts exist', async () => {
            mockJobPostRepository.find.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
    });

    describe('findOne', () => {
        it('should return a job post by id', async () => {
            const jobPostId = new ObjectId().toString();
            const mockJobPost = {
                _id: new ObjectId(jobPostId),
                title: 'Test Job',
                companyName: 'Test Company',
                requirements: 'Test Requirements',
                industries: 'Test Industry',
                recruiterId: new ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockJobPostRepository.findOne.mockResolvedValue(mockJobPost);

            const result = await service.findOne(jobPostId);

            expect(jobPostRepository.findOne).toHaveBeenCalledWith({
                where: { _id: expect.any(ObjectId) } as any,
            });
            expect(result).toEqual(mockJobPost);
        });

        it('should throw NotFoundException if job post not found', async () => {
            const jobPostId = new ObjectId().toString();

            mockJobPostRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(jobPostId)).rejects.toThrow(NotFoundException);
            await expect(service.findOne(jobPostId)).rejects.toThrow('Job Post not found');
        });
    });

    describe('update', () => {
        it('should update a job post successfully', async () => {
            const jobPostId = new ObjectId().toString();
            const updateJobPostDto: UpdateJobPostDto = {
                title: 'Updated Title',
                requirements: 'Updated Requirements',
            };

            const existingJobPost = {
                _id: new ObjectId(jobPostId),
                title: 'Original Title',
                companyName: 'Test Company',
                requirements: 'Original Requirements',
                industries: 'Test Industry',
                recruiterId: new ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            const updatedJobPost = {
                ...existingJobPost,
                ...updateJobPostDto,
                updatedAt: new Date(),
            };

            mockJobPostRepository.findOne.mockResolvedValue(existingJobPost);
            mockJobPostRepository.save.mockResolvedValue(updatedJobPost);

            const result = await service.update(jobPostId, updateJobPostDto);

            expect(jobPostRepository.findOne).toHaveBeenCalled();
            expect(jobPostRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: updateJobPostDto.title,
                    requirements: updateJobPostDto.requirements,
                }),
            );
            expect(result.title).toBe(updateJobPostDto.title);
            expect(result.requirements).toBe(updateJobPostDto.requirements);
        });

        it('should throw NotFoundException if job post to update not found', async () => {
            const jobPostId = new ObjectId().toString();
            const updateJobPostDto: UpdateJobPostDto = {
                title: 'Updated Title',
            };

            mockJobPostRepository.findOne.mockResolvedValue(null);

            await expect(service.update(jobPostId, updateJobPostDto)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('remove', () => {
        it('should remove a job post successfully', async () => {
            const jobPostId = new ObjectId().toString();
            const mockJobPost = {
                _id: new ObjectId(jobPostId),
                title: 'Test Job',
                companyName: 'Test Company',
                requirements: 'Test Requirements',
                industries: 'Test Industry',
                recruiterId: new ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockJobPostRepository.findOne.mockResolvedValue(mockJobPost);
            mockJobPostRepository.remove.mockResolvedValue(mockJobPost);

            await service.remove(jobPostId);

            expect(jobPostRepository.findOne).toHaveBeenCalled();
            expect(jobPostRepository.remove).toHaveBeenCalledWith(mockJobPost);
        });

        it('should throw NotFoundException if job post to remove not found', async () => {
            const jobPostId = new ObjectId().toString();

            mockJobPostRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(jobPostId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('Data Integrity', () => {
        it('should not include recruiter relationship in job post', async () => {
            const mockJobPost = {
                _id: new ObjectId(),
                title: 'Test Job',
                companyName: 'Test Company',
                requirements: 'Test Requirements',
                industries: 'Test Industry',
                recruiterId: new ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockJobPostRepository.find.mockResolvedValue([mockJobPost]);

            const result = await service.findAll();

            expect(result[0]).not.toHaveProperty('recruiter');
            expect(result[0]).toHaveProperty('recruiterId');
        });
    });
});
