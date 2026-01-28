import { Controller, Request, Post, UseGuards, Get, Body, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { PassportLocalGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterRecruiterDto } from './dto/register-recruiter.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register-candidate')
  @UseInterceptors(FileInterceptor('cv'))
  async registerCandidate(
    @Body() registerCandidateDto: RegisterCandidateDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.authService.registerCandidate(registerCandidateDto, file);
  }

  @Post('register-recruiter')
  async registerRecruiter(@Body() registerRecruiterDto: RegisterRecruiterDto) {
    return this.authService.registerRecruiter(registerRecruiterDto);
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
    console.log(req.user);
    return req.user;
  }
}

