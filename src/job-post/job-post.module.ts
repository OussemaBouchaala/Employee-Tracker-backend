import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/jobPost.entity';
import { Recruiter } from 'src/user/entities/recruiter.entity';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { IsRecruiterOrAdminGuard } from './guards/is-recruiter-or-admin/is-recruiter-or-admin.guard';
import { IsOwnerOrAdminGuard } from './guards/is-owner-or-admin/is-owner-or-admin.guard';

@Module({
    imports: [TypeOrmModule.forFeature([JobPost, Recruiter])],
    controllers: [JobPostController],
    providers: [JobPostService, IsRecruiterOrAdminGuard, IsOwnerOrAdminGuard],
    exports: [JobPostService],
})
export class JobPostModule { }
