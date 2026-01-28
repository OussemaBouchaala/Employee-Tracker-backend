import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/jobPost.entity';
import { JobPostCandidate } from './entities/jobPostCandidate.entity';
import { Recruiter } from 'src/user/entities/recruiter.entity';
import { Candidate } from 'src/user/entities/candidate.entity';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { IsRecruiterOrAdminGuard } from './guards/is-recruiter-or-admin/is-recruiter-or-admin.guard';
import { IsOwnerOrAdminGuard } from './guards/is-owner-or-admin/is-owner-or-admin.guard';
import { IsAdminGuard } from './guards/is-admin/is-admin.guard';
import { HttpModule } from '@nestjs/axios';
@Module({
    imports: [HttpModule,TypeOrmModule.forFeature([JobPost, JobPostCandidate, Recruiter, Candidate])],
    controllers: [JobPostController],
    providers: [JobPostService, IsRecruiterOrAdminGuard, IsOwnerOrAdminGuard, IsAdminGuard],
    exports: [JobPostService],
})
export class JobPostModule { }
