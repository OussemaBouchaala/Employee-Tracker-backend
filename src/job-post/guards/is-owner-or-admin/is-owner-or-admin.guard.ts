import { CanActivate, ExecutionContext, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPostService } from '../../job-post.service';
import { UserRole } from 'src/config/user/userRole';
import { Recruiter } from 'src/user/entities/recruiter.entity';

@Injectable()
export class IsOwnerOrAdminGuard implements CanActivate {
  constructor(
    private readonly jobPostService: JobPostService,
    @InjectRepository(Recruiter)
    private recruiterRepository: Repository<Recruiter>,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const jobId = request.params.id;

    if (!user) {
      return false;
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const jobPost = await this.jobPostService.findOne(jobId);
    if (!jobPost) {
      throw new NotFoundException('Job Post not found');
    }

    // Find the recruiter by user relation
    const recruiter = await this.recruiterRepository.findOne({
      where: { user: { id: Number(user.userId) } },
      relations: ['user'],
    });

    if (recruiter && jobPost.recruiter && jobPost.recruiter.id === recruiter.id) {
      return true;
    }

    throw new ForbiddenException('You can only modify your own job posts');
  }
}
