
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../config/user/userRole';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
