import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsAdminGuard } from 'src/job-post/guards/is-admin/is-admin.guard';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get('testing-api')
  testing_api() { 
      return this.userService.testing_api();
  }

  //@UseGuards(IsAdminGuard)
  @Get('recruiters')
  getRecruiters() {
    return this.userService.findAllRecruiters();
  }

  //@UseGuards(IsAdminGuard)
  @Get('candidates')
  getCandidates() {
    return this.userService.findAllCandidates();
  }

  @Post('embed-cv')
  @UseInterceptors(FileInterceptor('cv'))
  embed_CV(
    @UploadedFile() cv: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    return this.userService.embed_CV(cv, userId);
  }



 
}
