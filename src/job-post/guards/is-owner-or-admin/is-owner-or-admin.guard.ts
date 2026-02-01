import { CanActivate, ExecutionContext, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JobPostService } from '../../job-post.service';
import { UserRole } from 'src/config/user/userRole';

@Injectable()
export class IsOwnerOrAdminGuard implements CanActivate {
  constructor(
    private readonly jobPostService: JobPostService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Usually populated by your JWT Strategy
    const jobId = request.params.id;

    if (!user) {
      return false;
    }

    // 1. Admins bypass ownership checks
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // 2. Fetch the job post
    const jobPost = await this.jobPostService.findOne(jobId);
    if (!jobPost) {
      throw new NotFoundException('Job Post not found');
    }

    // 3. Ownership check
    // With inheritance, user.id (from JWT) is the same as recruiter.id
    // Note: Use 'user.id' or 'user.userId' depending on your JWT payload structure
    const currentUserId = Number(user.id || user.userId);

    if (jobPost.recruiter && jobPost.recruiter.id === currentUserId) {
      return true;
    }

    throw new ForbiddenException('You can only modify your own job posts');
  }
}