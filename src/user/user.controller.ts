import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { IsAdminGuard } from 'src/job-post/guards/is-admin/is-admin.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get('testing-api')
  testing_api() { 
      return this.userService.testing_api();
  }

  @Get("recruiters")
  findAllRecruiters() {
    return this.userService.findAllRecruiters();
  }
  // User CRUD endpoints

  @Get('all')
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findUserById(@Param('id') userId: number) {
    return this.userService.findUserById(userId);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
      { name: 'cv', maxCount: 1 },
      { name: 'profilePicture', maxCount: 1 },
    ]))
  updateUser(
    @Param('id') userId: string, 
    @Body() updateData: UpdateUserDto, 
    @UploadedFiles() files?: {cv: Express.Multer.File[], profilePicture: Express.Multer.File[]}, 
  ){
    const cvFile = files?.cv?.[0];
    const profilePic = files?.profilePicture?.[0];
    console.log("cvFile", cvFile);
    console.log("profilePic", profilePic);
    return this.userService.updateUser(userId, updateData, cvFile, profilePic);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
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
