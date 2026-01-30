import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Controller, Request, Post, UseGuards, Get, Body, UseInterceptors, UploadedFile, UploadedFiles, Query, UnauthorizedException, Patch } from '@nestjs/common';
import type { Express } from 'express';

import { AuthService } from './auth.service';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterRecruiterDto } from './dto/register-recruiter.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register-candidate')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'cv', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]))
  async registerCandidate(
    @Body() registerCandidateDto: RegisterCandidateDto,
    @UploadedFiles() files: { cv: Express.Multer.File[], image: Express.Multer.File[] }
  ) {
    return this.authService.registerCandidate(registerCandidateDto, files);
  }

  @Post('register-recruiter')
  async registerRecruiter(@Body() registerRecruiterDto: RegisterRecruiterDto) {
    return this.authService.registerRecruiter(registerRecruiterDto);
  }


  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully. You can now login.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: { name?: string; phoneNumber?: number; description?: string; companyName?: string }) {
    return this.authService.updateProfile(req.user._id.toString(), updateData);
  }
}


