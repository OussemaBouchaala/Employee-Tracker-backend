import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('testing-api')
    testing_api() { 
        return this.userService.testing_api();
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
