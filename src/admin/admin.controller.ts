import { Controller, Get, Post, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApproveRecruiterDto } from '../job-post/dto/approve-recruiter.dto';
import { RejectRecruiterDto } from '../job-post/dto/reject-recruiter.dto';
import { IsAdminGuard } from '../job-post/guards/is-admin/is-admin.guard';
import { Recruiter } from '../user/entities/recruiter.entity';

@Controller('admin')
//@UseGuards(IsAdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  // Delete Recruiter
  @Delete(':id')
  async deleteRecruiter(@Param('id') recruiterId: string): Promise<{ message: string }> {
    return this.adminService.deleteRecruiter(recruiterId);
  }

  // Delete Candidate
  @Delete('delete-candidate/:id')
  async deleteCandidate(@Param('id') candidateId: string): Promise<{ message: string }> {
    return this.adminService.deleteCandidate(candidateId);
  }

  // // Recruiter Approval Endpoints
  // @Post('approve-recruiter')
  // async approveRecruiter(@Body() approveRecruiterDto: ApproveRecruiterDto): Promise<Recruiter> {
  //   return this.adminService.approveRecruiter(approveRecruiterDto.recruiterId);
  // }

  // @Post('reject-recruiter')
  // async rejectRecruiter(@Body() rejectRecruiterDto: RejectRecruiterDto): Promise<Recruiter> {
  //   return this.adminService.rejectRecruiter(rejectRecruiterDto.recruiterId, rejectRecruiterDto.reason);
  // }

  // // Get Pending Recruiters
  // @Get('pending-recruiters')
  // async getPendingRecruiters(): Promise<Recruiter[]> {
  //   return this.adminService.getPendingRecruiters();
  // }

  // // Get Approved Recruiters
  // @Get('approved-recruiters')
  // async getApprovedRecruiters(): Promise<Recruiter[]> {
  //   return this.adminService.getApprovedRecruiters();
  // }

  // // Get Rejected Recruiters
  // @Get('rejected-recruiters')
  // async getRejectedRecruiters(): Promise<Recruiter[]> {
  //   return this.adminService.getRejectedRecruiters();
  // }
}