import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/config/user/userRole';

@Injectable()
export class IsRecruiterOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("user", user);
    console.log("request", request);
    // 1. Basic check if user exists (populated by JWT Strategy)
    if (!user || !user.role) {
      throw new ForbiddenException('Authentication required');
    }

    // 2. Role validation
    // In our inheritance model, 'role' is the discriminator column
    const hasAccess = 
        user.role === UserRole.ADMIN || 
        user.role === UserRole.RECRUITER;

    if (hasAccess) {
      return true;
    }

    throw new ForbiddenException('Only Recruiters or Admins can perform this action');
  }
}