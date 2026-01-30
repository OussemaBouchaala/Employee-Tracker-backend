import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from 'src/config/user/userRole';

@Injectable()
export class IsRecruiterOrAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('IsRecruiterOrAdminGuard - User:', user ? { id: user._id, role: user.role, email: user.email } : 'Undefined');

    if (!user) {
      console.log('IsRecruiterOrAdminGuard - No user found on request');
      return false;
    }

    const userRole = user.role?.toString().toLowerCase();
    console.log(`IsRecruiterOrAdminGuard - Checking role: '${userRole}' against '${UserRole.ADMIN}' and '${UserRole.RECRUITER}'`);

    if (userRole === UserRole.ADMIN || userRole === UserRole.RECRUITER || userRole === 'recruiter' || userRole === 'admin') {
      return true;
    }

    console.log('IsRecruiterOrAdminGuard - Access denied');
    throw new ForbiddenException('Only Recruiters or Admins can create job posts');
  }
}
