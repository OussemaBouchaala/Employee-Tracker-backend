import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_SECRET } from '../authConfig/jwt-secret';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Fetch full user from database including role-specific data (Candidate/Recruiter)
    const user = await this.userService.findFullProfile(payload.id);
    if (!user) {
      return null;
    }
    // findFullProfile already handles password removal and structure
    return user;
  }
}

