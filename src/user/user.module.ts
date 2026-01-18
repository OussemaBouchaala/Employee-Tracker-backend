import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Candidate } from './entities/candidate.entity';
import { Admin } from './entities/admin.entity';
import { Recruiter } from './entities/recruiter.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [User, Candidate, Admin, Recruiter]
        )
    ],
})
export class UserModule {

}
