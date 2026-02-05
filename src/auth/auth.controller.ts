import { 
  Controller, 
  Request, 
  Post, 
  UseGuards, 
  Get, 
  Body, 
  UseInterceptors, 
  UploadedFile, 
  Query, 
  UploadedFiles 
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { PassportLocalGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterRecruiterDto } from './dto/register-recruiter.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) { }

  // @Post('register-candidate')
  // @UseInterceptors(FileInterceptor('cv'))
  // async registerCandidate(
  //   @Body() registerCandidateDto: RegisterCandidateDto,
  //   @UploadedFile() file: Express.Multer.File
  // ) {
  //   return this.authService.registerCandidate(registerCandidateDto, file);
  // }

  @Post('register-candidate')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'cv', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 },
  ]))
  async registerCandidate(
    @Body() registerCandidateDto: RegisterCandidateDto,
    @UploadedFiles() files: { cv: Express.Multer.File[], profilePicture?: Express.Multer.File[] },
  ) {
    const cvFile = files.cv[0];
    const profilePic = files.profilePicture?.[0];
    return this.authService.registerCandidate(registerCandidateDto, cvFile, profilePic);
  }

  // @Post('register-recruiter')
  // async registerRecruiter(@Body() registerRecruiterDto: RegisterRecruiterDto) {
  //   return this.authService.registerRecruiter(registerRecruiterDto);
  // }

  @Post('register-recruiter')
  @UseInterceptors(FileInterceptor('profile')) // Add this to handle the FormData
  async registerRecruiter(
    @Body() registerRecruiterDto: RegisterRecruiterDto,
    @UploadedFile() file?: Express.Multer.File // This will capture the profile picture you're sending
  ) {
    // If you want to save the profile picture, pass 'file' to the service too
    return this.authService.registerRecruiter(registerRecruiterDto, file);
  }

  @UseGuards(PassportLocalGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully. You can now login.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const currentUser = this.userService.findUserById(req.user.userId);
    console.log(currentUser);
    return currentUser;
  }

  
}

