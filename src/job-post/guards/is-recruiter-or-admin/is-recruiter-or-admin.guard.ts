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
    console.log(user)
    if (!user) {
      return false;
    }
    console.log(user.role,UserRole.RECRUITER)
    if (user.role === UserRole.ADMIN || user.role === UserRole.RECRUITER) {
      return true;
    }

    throw new ForbiddenException('Only Recruiters or Admins can create job posts');
  }
}
