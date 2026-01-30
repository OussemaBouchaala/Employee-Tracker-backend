import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../config/user/userRole';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get('testing-api')
  testing_api() {
    return this.userService.testing_api();
  }

  @Get('recruiters')
  getRecruiters() {
    return this.userService.findAllRecruiters();
  }

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



  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOneUser(@Param('id') id: string) {
    return this.userService.findFullProfile(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.userService.updateFullProfile(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

}
