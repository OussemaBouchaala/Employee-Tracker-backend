import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { IsRecruiterOrAdminGuard } from './guards/is-recruiter-or-admin/is-recruiter-or-admin.guard';
import { IsOwnerOrAdminGuard } from './guards/is-owner-or-admin/is-owner-or-admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('job-posts')
@UseGuards(JwtAuthGuard)
export class JobPostController {
    constructor(private readonly jobPostService: JobPostService) { }

    @Get()
    findAll(@Request() req) {
        console.log("req", req);
        return this.jobPostService.findAll(req.user.userId);
    }


    @Get('testing-api')
    testing_api() {
       
        return this.jobPostService.testing_api();
    }
    @Post('getCandidates')
    getcandidates(@Body('jobpost') jobpost:CreateJobPostDto,@Body('amount') amount:number) {
        return this.jobPostService.find_candidates(jobpost,amount);
    }

    @UseGuards(IsRecruiterOrAdminGuard)
    @Post(':id/find-and-match-candidates')
    async findAndMatchCandidates(
        @Param('id') jobPostId: string,
        @Body('amount') amount: number
    ) {
        return this.jobPostService.findAndCreateCandidateMatches(jobPostId, amount);
    }

    @UseGuards(IsRecruiterOrAdminGuard)
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

    @UseGuards(IsRecruiterOrAdminGuard)
    @Post()
    create(@Body() createJobPostDto: CreateJobPostDto, @Request() req) {
        return this.jobPostService.create(createJobPostDto, req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobPostService.findOne(id);
    }

    @UseGuards(IsOwnerOrAdminGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateJobPostDto: UpdateJobPostDto) {
        return this.jobPostService.update(id, updateJobPostDto);
    }

    @UseGuards(IsOwnerOrAdminGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.jobPostService.remove(id);
    }
}
