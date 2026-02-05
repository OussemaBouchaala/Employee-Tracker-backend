import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { IsRecruiterOrAdminGuard } from './guards/is-recruiter-or-admin/is-recruiter-or-admin.guard';
import { IsOwnerOrAdminGuard } from './guards/is-owner-or-admin/is-owner-or-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from '../notification/notification.service';
import { ObjectId } from 'mongodb';
import { NotificationType } from '../notification/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../user/entities/candidate.entity';


@Controller('job-posts')
export class JobPostController {
    constructor(
        private readonly jobPostService: JobPostService,
        private readonly notificationService: NotificationService,
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
    ) { }

    @Get()
    findAll() {
        return this.jobPostService.findAll();
    }

    @Get('testing-api')
    testing_api() {

        return this.jobPostService.testing_api();
    }
    @Post('getCandidates')
    getcandidates(@Body('jobpost') jobpost: CreateJobPostDto, @Body('amount') amount: number) {
        return this.jobPostService.find_candidates(jobpost, amount);
    }

    @UseGuards(JwtAuthGuard, IsRecruiterOrAdminGuard)
    @Post(':id/find-and-match-candidates')
    async findAndMatchCandidates(
        @Param('id') jobPostId: string,
        @Body('amount') amount: number
    ) {
        return this.jobPostService.findAndCreateCandidateMatches(jobPostId, amount);
    }

    @UseGuards(JwtAuthGuard, IsRecruiterOrAdminGuard)
    @Post(':id/add-candidate')
    async addCandidateToJobPost(
        @Param('id') jobPostId: string,
        @Body('candidateId') candidateId: string,
        @Body('score') score: number
    ) {
        return this.jobPostService.addCandidateToJobPost(jobPostId, candidateId, score);
    }

    @Get(':id/candidates')
    async getCandidatesForJobPost(@Param('id') jobPostId: string) {
        return this.jobPostService.getCandidatesForJobPost(jobPostId);
    }

    @UseGuards(JwtAuthGuard, IsRecruiterOrAdminGuard)
    @Post()
    create(@Body() createJobPostDto: CreateJobPostDto, @Request() req) {
        return this.jobPostService.create(createJobPostDto, req.user._id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobPostService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateJobPostDto: UpdateJobPostDto) {
        return this.jobPostService.update(id, updateJobPostDto);
    }

    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.jobPostService.remove(id);
    }

    @UseGuards(JwtAuthGuard, IsRecruiterOrAdminGuard)
    @Post(':jobPostId/contact-candidate/:candidateId')
    async contactCandidate(
        @Param('jobPostId') jobPostId: string,
        @Param('candidateId') candidateId: string,
        @Body('message') message: string,
        @Request() req
    ) {
        const senderUserIdRaw = req.user?._id ?? req.user?.id;
        const senderUserId = new ObjectId(senderUserIdRaw?.toString());

        const candidate = await this.candidateRepository.findOne({
            where: { _id: new ObjectId(candidateId) },
        });
        if (!candidate?.userId) {
            return { success: false, message: 'Candidate not found' };
        }
        const recipientUserId = new ObjectId(candidate.userId.toString());
        
        // Create notification for the candidate
        const notification = await this.notificationService.createNotification(
            recipientUserId,
            senderUserId,
            NotificationType.CONTACT_REQUEST,
            'New Contact Request',
            message,
            new ObjectId(jobPostId)
        );

        return { 
            success: true, 
            message: 'Contact request sent successfully',
            notification 
        };
    }

}
