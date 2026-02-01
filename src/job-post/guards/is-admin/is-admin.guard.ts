import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/config/user/userRole';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 1. Check if user exists and has a role
    if (!user || !user.role) {
      throw new ForbiddenException('Authentication required');
    }

    // 2. Strict Admin check
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // 3. Reject everyone else
    throw new ForbiddenException('Access denied: Administrative privileges required');
  }
}