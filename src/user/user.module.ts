import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Candidate } from './entities/candidate.entity';
import { Admin } from './entities/admin.entity';
import { Recruiter } from './entities/recruiter.entity';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';

@Module({
    imports: [HttpModule,
        TypeOrmModule.forFeature(
            [User, Candidate, Admin, Recruiter]
        )
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {

}
