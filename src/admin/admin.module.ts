import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Recruiter } from '../user/entities/recruiter.entity';
import { Candidate } from '../user/entities/candidate.entity';
import { IsAdminGuard } from '../job-post/guards/is-admin/is-admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter, Candidate])],
  controllers: [AdminController],
  providers: [AdminService, IsAdminGuard],
  exports: [AdminService],
})
export class AdminModule {}
