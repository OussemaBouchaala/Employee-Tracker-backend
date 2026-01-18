import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { IsRecruiterOrAdminGuard } from './guards/is-recruiter-or-admin/is-recruiter-or-admin.guard';
import { IsOwnerOrAdminGuard } from './guards/is-owner-or-admin/is-owner-or-admin.guard';

@Controller('job-posts')
export class JobPostController {
    constructor(private readonly jobPostService: JobPostService) { }

    @UseGuards(IsRecruiterOrAdminGuard)
    @Post()
    create(@Body() createJobPostDto: CreateJobPostDto, @Request() req) {
        return this.jobPostService.create(createJobPostDto, req.user._id);
    }

    @Get()
    findAll() {
        return this.jobPostService.findAll();
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
